<?php
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$action = $_GET['action'] ?? $_POST['action'] ?? '';
$input = getJsonInput();

switch ($action) {
    case 'send':
        $roomId = strtoupper(trim($input['roomId'] ?? ''));
        $msg = $input['message'] ?? [];

        $msgUid = trim($msg['id'] ?? ('msg_' . time() . '_' . bin2hex(random_bytes(3))));
        $senderId = trim($msg['senderId'] ?? '');
        $senderName = trim($msg['senderName'] ?? 'ক্যাম্পাস আড্ডাবাজ');
        $senderDept = trim($msg['senderDept'] ?? 'CSE');
        $characterId = trim($msg['characterId'] ?? '');
        $text = trim($msg['text'] ?? '');
        $isSystem = !empty($msg['isSystem']) ? 1 : 0;

        if (!$roomId || !$senderId || !$text) {
            jsonResponse(['error' => 'মেসেজ বা প্রেরকের তথ্য খালি'], 400);
        }

        // Verify room exists (with auto-recovery so valid chat is never dropped)
        $stmt = $pdo->prepare("SELECT id FROM rooms WHERE id = :id");
        $stmt->execute([':id' => $roomId]);
        if (!$stmt->fetch()) {
            $nowUtc = gmdate('Y-m-d H:i:s');
            $expiresUtc = gmdate('Y-m-d H:i:s', time() + 7200);
            $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
            $sql = ($driver === 'sqlite')
                ? "INSERT OR IGNORE INTO rooms (id, name, host_id, host_name, created_at, expires_at) VALUES (:id, :name, :host_id, :host_name, :created_at, :expires_at)"
                : "INSERT IGNORE INTO rooms (id, name, host_id, host_name, created_at, expires_at) VALUES (:id, :name, :host_id, :host_name, :created_at, :expires_at)";
            $healStmt = $pdo->prepare($sql);
            $healStmt->execute([
                ':id' => $roomId,
                ':name' => 'সাউথইস্ট আড্ডা রুম',
                ':host_id' => $senderId,
                ':host_name' => $senderName,
                ':created_at' => $nowUtc,
                ':expires_at' => $expiresUtc
            ]);
        }

        $ins = $pdo->prepare("
            INSERT INTO messages (msg_uid, room_id, sender_id, sender_name, sender_dept, character_id, text, is_system)
            VALUES (:uid, :room_id, :sender_id, :sender_name, :sender_dept, :character_id, :text, :is_sys)
        ");
        $ins->execute([
            ':uid' => $msgUid,
            ':room_id' => $roomId,
            ':sender_id' => $senderId,
            ':sender_name' => $senderName,
            ':sender_dept' => $senderDept,
            ':character_id' => $characterId,
            ':text' => $text,
            ':is_sys' => $isSystem
        ]);

        $dbId = (int)$pdo->lastInsertId();

        jsonResponse([
            'success' => true,
            'dbId' => $dbId,
            'msgUid' => $msgUid
        ]);
        break;

    case 'poll':
        $roomId = strtoupper(trim($_GET['room_id'] ?? ''));
        $afterId = (int)($_GET['after_id'] ?? 0);

        if (!$roomId) {
            jsonResponse(['error' => 'রুম আইডি দেওয়া হয়নি'], 400);
        }

        $stmt = $pdo->prepare("
            SELECT id, msg_uid, sender_id, sender_name, sender_dept, character_id, text, is_system, created_at
            FROM messages
            WHERE room_id = :room_id AND id > :after_id
            ORDER BY id ASC
            LIMIT 50
        ");
        $stmt->execute([
            ':room_id' => $roomId,
            ':after_id' => $afterId
        ]);

        $rows = $stmt->fetchAll();
        $messages = array_map(function ($m) {
            return [
                'id' => $m['msg_uid'] ?: 'msg_' . $m['id'],
                'dbId' => (int)$m['id'],
                'senderId' => $m['sender_id'],
                'senderName' => $m['sender_name'],
                'senderDept' => $m['sender_dept'],
                'characterId' => $m['character_id'],
                'text' => $m['text'],
                'timestamp' => date('h:i A', strtotime($m['created_at'])),
                'isSystem' => (bool)$m['is_system']
            ];
        }, $rows);

        jsonResponse([
            'messages' => $messages,
            'count' => count($messages)
        ]);
        break;

    default:
        jsonResponse(['error' => 'অজ্ঞাত অ্যাকশন'], 400);
}

