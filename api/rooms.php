<?php
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$action = $_GET['action'] ?? $_POST['action'] ?? '';
$input = getJsonInput();

switch ($action) {
    case 'test':
        jsonResponse(['status' => 'ok', 'php' => true]);
        break;

    case 'create':
        $roomId = strtoupper(trim($input['id'] ?? ''));
        $name = trim($input['name'] ?? 'সাউথইস্ট আড্ডা রুম');
        $hostId = trim($input['hostId'] ?? '');
        $hostName = trim($input['hostName'] ?? 'ক্যাম্পাস হোস্ট');
        $hostDept = trim($input['hostDept'] ?? 'CSE');
        $gender = ($input['gender'] ?? 'male') === 'female' ? 'female' : 'male';
        $characterId = trim($input['characterId'] ?? 'guitarist');

        if (!$roomId || !$hostId) {
            jsonResponse(['error' => 'রুম আইডি বা হোস্টের তথ্য দেওয়া হয়নি'], 400);
        }

        // Calculate 2-hour expiration in explicit UTC
        $nowUtc = time();
        $createdUtc = gmdate('Y-m-d H:i:s', $nowUtc);
        $expiresUtc = gmdate('Y-m-d H:i:s', $nowUtc + 2 * 3600);

        $stmt = $pdo->prepare("
            INSERT INTO rooms (id, name, host_id, host_name, created_at, expires_at)
            VALUES (:id, :name, :host_id, :host_name, :created_at, :expires_at)
        ");

        try {
            $stmt->execute([
                ':id' => $roomId,
                ':name' => $name,
                ':host_id' => $hostId,
                ':host_name' => $hostName,
                ':created_at' => $createdUtc,
                ':expires_at' => $expiresUtc
            ]);
        } catch (PDOException $e) {
            jsonResponse(['error' => 'এই রুম আইডি ইতিমধ্যে বিদ্যমান বা ত্রুটি হয়েছে'], 409);
        }

        // Add Host as first participant
        $pStmt = $pdo->prepare("
            INSERT INTO participants (id, room_id, name, dept, gender, character_id, joined_at, last_seen)
            VALUES (:id, :room_id, :name, :dept, :gender, :character_id, :joined_at, :last_seen)
        ");
        $pStmt->execute([
            ':id' => $hostId,
            ':room_id' => $roomId,
            ':name' => $hostName,
            ':dept' => $hostDept,
            ':gender' => $gender,
            ':character_id' => $characterId,
            ':joined_at' => $createdUtc,
            ':last_seen' => $createdUtc
        ]);

        // Insert initial welcome message
        $mStmt = $pdo->prepare("
            INSERT INTO messages (msg_uid, room_id, sender_id, sender_name, sender_dept, character_id, text, is_system)
            VALUES (:uid, :room_id, 'system', 'SEU Adda সিস্টেম', :dept, :character_id, :text, 1)
        ");
        $welcomeText = "সাউথইস্ট আড্ডা রুমে স্বাগতম! 🎉 {$hostName} হিসেবে আড্ডা শুরু করেছেন। ২ ঘণ্টা আড্ডা দিন! ☕🎶";
        $mStmt->execute([
            ':uid' => 'sys_' . time(),
            ':room_id' => $roomId,
            ':dept' => $hostDept,
            ':character_id' => $characterId,
            ':text' => $welcomeText
        ]);

        jsonResponse([
            'success' => true,
            'roomId' => $roomId,
            'name' => $name,
            'expiresAt' => (time() + 2 * 3600) * 1000
        ]);
        break;

    case 'get':
        $roomId = strtoupper(trim($_GET['room_id'] ?? $input['roomId'] ?? ''));
        if (!$roomId) {
            jsonResponse(['error' => 'রুম আইডি প্রদান করা হয়নি'], 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM rooms WHERE id = :id");
        $stmt->execute([':id' => $roomId]);
        $room = $stmt->fetch();

        if (!$room) {
            jsonResponse(['error' => 'রুমটি পাওয়া যায়নি বা ২ ঘণ্টার মেয়াদ শেষ হয়ে গেছে'], 404);
        }

        $now = time();
        $createdTimestamp = strtotime($room['created_at'] . ' UTC');
        $expiresTimestamp = strtotime($room['expires_at'] . ' UTC');
        if (!$expiresTimestamp || $expiresTimestamp <= $createdTimestamp) {
            $expiresTimestamp = ($createdTimestamp ?: $now) + 7200;
        }
        $remainingMs = max(0, ($expiresTimestamp - $now) * 1000);

        // Only delete room if genuinely past the 2-hour expiration (with a 60-second grace buffer)
        if ($remainingMs <= 0 && ($now - $expiresTimestamp) > 60) {
            $pdo->prepare("DELETE FROM rooms WHERE id = :id")->execute([':id' => $roomId]);
            jsonResponse(['error' => 'রুমটির মেয়াদ শেষ হয়েছে'], 410);
        }

        // Fetch participants
        $pStmt = $pdo->prepare("SELECT * FROM participants WHERE room_id = :id ORDER BY joined_at ASC");
        $pStmt->execute([':id' => $roomId]);
        $rawParticipants = $pStmt->fetchAll();

        $participants = array_map(function ($p) {
            return [
                'id' => $p['id'],
                'name' => $p['name'],
                'dept' => $p['dept'],
                'gender' => $p['gender'],
                'characterId' => $p['character_id'],
                'joinedAt' => strtotime($p['joined_at']) * 1000,
                'lastSeen' => strtotime($p['last_seen']) * 1000
            ];
        }, $rawParticipants);

        // Fetch messages
        $mStmt = $pdo->prepare("SELECT * FROM messages WHERE room_id = :id ORDER BY id ASC LIMIT 100");
        $mStmt->execute([':id' => $roomId]);
        $rawMessages = $mStmt->fetchAll();

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
        }, $rawMessages);

        $currentSong = null;
        if (!empty($room['current_song_title'])) {
            $currentSong = [
                'title' => $room['current_song_title'],
                'author' => $room['current_song_author'],
                'source' => $room['current_song_source'],
                'playedBy' => $room['current_song_played_by']
            ];
        }

        jsonResponse([
            'id' => $room['id'],
            'name' => $room['name'],
            'hostId' => $room['host_id'],
            'hostName' => $room['host_name'],
            'createdAt' => strtotime($room['created_at']) * 1000,
            'expiresAt' => $expiresTimestamp * 1000,
            'remainingMs' => $remainingMs,
            'currentSong' => $currentSong,
            'participants' => $participants,
            'messages' => $messages
        ]);
        break;

    case 'join':
        $roomId = strtoupper(trim($input['roomId'] ?? ''));
        $p = $input['participant'] ?? [];
        $userId = trim($p['id'] ?? '');
        $name = trim($p['name'] ?? 'আড্ডাবাজ বন্ধু');
        $dept = trim($p['dept'] ?? 'CSE');
        $gender = ($p['gender'] ?? 'male') === 'female' ? 'female' : 'male';
        $characterId = trim($p['characterId'] ?? 'guitarist');

        if (!$roomId || !$userId) {
            jsonResponse(['error' => 'রুম আইডি বা ইউজারের তথ্য অসম্পূর্ণ'], 400);
        }

        // Verify room
        $stmt = $pdo->prepare("SELECT * FROM rooms WHERE id = :id");
        $stmt->execute([':id' => $roomId]);
        $room = $stmt->fetch();
        if (!$room) {
            jsonResponse(['error' => 'রুম পাওয়া যায়নি বা মেয়াদোত্তীর্ণ'], 404);
        }

        // 35 Campus Characters categorized by gender for 1-to-1 unique assignment
        $maleChars = [
            'guitarist', 'standing_boy_1', 'front_blue_guy', 'white_panjabi_guy',
            'plaid_shirt_guy', 'red_shirt_guy', 'blue_shirt_friend',
            'mid_stairs_right_1', 'mid_stairs_right_2', 'mid_stairs_right_3',
            'mid_stairs_right_4', 'mid_stairs_right_5', 'brick_door_student',
            'security_guard_1', 'security_guard_2'
        ];
        $femaleChars = [
            'green_saree_girl', 'standing_girl_1', 'standing_girl_2', 'pink_salwar_girl',
            'cyan_salwar_girl', 'cream_dress_girl', 'mid_stairs_girl_1',
            'mid_stairs_girl_2', 'mid_stairs_girl_3', 'stairs_girl_magenta',
            'stairs_girl_black'
        ];
        $allChars = array_merge($maleChars, $femaleChars, ['security_gate_1', 'security_gate_2', 'security_gate_3']);

        // Fetch all currently occupied characters in this room (excluding me)
        $takenStmt = $pdo->prepare("SELECT character_id FROM participants WHERE room_id = :room_id AND id != :my_id");
        $takenStmt->execute([':room_id' => $roomId, ':my_id' => $userId]);
        $takenChars = $takenStmt->fetchAll(PDO::FETCH_COLUMN) ?: [];

        $wasReassigned = false;
        if (!$characterId || in_array($characterId, $takenChars, true)) {
            // Requested character is taken: strictly find the first available free character
            $preferredPool = ($gender === 'female') ? $femaleChars : $maleChars;
            $freeChar = null;
            foreach ($preferredPool as $cId) {
                if (!in_array($cId, $takenChars, true)) {
                    $freeChar = $cId;
                    break;
                }
            }
            if (!$freeChar) {
                // If all preferred gender characters are claimed, pick any free character
                foreach ($allChars as $cId) {
                    if (!in_array($cId, $takenChars, true)) {
                        $freeChar = $cId;
                        break;
                    }
                }
            }
            if ($freeChar) {
                $characterId = $freeChar;
                $wasReassigned = true;
            }
        }

        // Upsert participant with explicit UTC time
        $nowUtc = gmdate('Y-m-d H:i:s');
        $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
        if ($driver === 'sqlite') {
            $uStmt = $pdo->prepare("
                INSERT INTO participants (id, room_id, name, dept, gender, character_id, joined_at, last_seen)
                VALUES (:id, :room_id, :name, :dept, :gender, :character_id, :joined_at, :last_seen)
                ON CONFLICT(id, room_id) DO UPDATE SET
                    name = excluded.name,
                    dept = excluded.dept,
                    gender = excluded.gender,
                    character_id = excluded.character_id,
                    last_seen = excluded.last_seen
            ");
        } else {
            $uStmt = $pdo->prepare("
                INSERT INTO participants (id, room_id, name, dept, gender, character_id, joined_at, last_seen)
                VALUES (:id, :room_id, :name, :dept, :gender, :character_id, :joined_at, :last_seen)
                ON DUPLICATE KEY UPDATE
                    name = VALUES(name),
                    dept = VALUES(dept),
                    gender = VALUES(gender),
                    character_id = VALUES(character_id),
                    last_seen = VALUES(last_seen)
            ");
        }
        $uStmt->execute([
            ':id' => $userId,
            ':room_id' => $roomId,
            ':name' => $name,
            ':dept' => $dept,
            ':gender' => $gender,
            ':character_id' => $characterId,
            ':joined_at' => $nowUtc,
            ':last_seen' => $nowUtc
        ]);

        // Add system message if newly joined
        $joinMsg = "☕ {$name} ({$dept}) আড্ডায় যোগ দিয়েছেন!";
        $mStmt = $pdo->prepare("
            INSERT INTO messages (msg_uid, room_id, sender_id, sender_name, sender_dept, character_id, text, is_system)
            VALUES (:uid, :room_id, 'system', 'SEU Adda সিস্টেম', :dept, :character_id, :text, 1)
        ");
        $mStmt->execute([
            ':uid' => 'sys_join_' . time() . '_' . $userId,
            ':room_id' => $roomId,
            ':dept' => $dept,
            ':character_id' => $characterId,
            ':text' => $joinMsg
        ]);

        jsonResponse([
            'success' => true,
            'characterId' => $characterId,
            'wasReassigned' => $wasReassigned
        ]);
        break;

    case 'transfer':
        $roomId = strtoupper(trim($input['roomId'] ?? ''));
        $userId = trim($input['participantId'] ?? '');
        $newCharId = trim($input['newCharacterId'] ?? '');

        if (!$roomId || !$userId || !$newCharId) {
            jsonResponse(['error' => 'তথ্য অসম্পূর্ণ'], 400);
        }

        // Exclusive lock check
        $cStmt = $pdo->prepare("SELECT name FROM participants WHERE room_id = :room_id AND character_id = :char_id AND id != :my_id");
        $cStmt->execute([':room_id' => $roomId, ':char_id' => $newCharId, ':my_id' => $userId]);
        $occupied = $cStmt->fetch();

        if ($occupied) {
            jsonResponse([
                'error' => "এই ক্যারেক্টারটি ইতিমধ্যে {$occupied['name']} দখল করে রেখেছেন!",
                'isTaken' => true
            ], 409);
        }

        $stmt = $pdo->prepare("UPDATE participants SET character_id = :char_id WHERE room_id = :room_id AND id = :id");
        $stmt->execute([':char_id' => $newCharId, ':room_id' => $roomId, ':id' => $userId]);

        jsonResponse(['success' => true]);
        break;

    case 'leave':
        $roomId = strtoupper(trim($input['roomId'] ?? ''));
        $userId = trim($input['participantId'] ?? '');
        $userName = trim($input['name'] ?? 'একজন বন্ধু');

        if (!$roomId || !$userId) {
            jsonResponse(['error' => 'তথ্য অসম্পূর্ণ'], 400);
        }

        $stmt = $pdo->prepare("DELETE FROM participants WHERE room_id = :room_id AND id = :id");
        $stmt->execute([':room_id' => $roomId, ':id' => $userId]);

        // Add leave system message (room stays active for its 2-hour TTL so users can rejoin)
        $mStmt = $pdo->prepare("
            INSERT INTO messages (msg_uid, room_id, sender_id, sender_name, sender_dept, character_id, text, is_system)
            VALUES (:uid, :room_id, 'system', 'SEU Adda সিস্টেম', '', '', :text, 1)
        ");
        $mStmt->execute([
            ':uid' => 'sys_leave_' . time() . '_' . $userId,
            ':room_id' => $roomId,
            ':text' => "👋 {$userName} রুম ত্যাগ করেছেন।"
        ]);

        jsonResponse(['success' => true]);
        break;

    case 'song':
        $roomId = strtoupper(trim($input['roomId'] ?? ''));
        $song = $input['song'] ?? [];
        $title = trim($song['title'] ?? '');
        $author = trim($song['author'] ?? '');
        $source = trim($song['source'] ?? '');
        $playedBy = trim($song['playedBy'] ?? 'বন্ধু');

        if (!$roomId || !$source) {
            jsonResponse(['error' => 'গানের তথ্য দেওয়া হয়নি'], 400);
        }

        $stmt = $pdo->prepare("
            UPDATE rooms SET 
                current_song_title = :title,
                current_song_author = :author,
                current_song_source = :source,
                current_song_played_by = :played_by
            WHERE id = :id
        ");
        $stmt->execute([
            ':title' => $title,
            ':author' => $author,
            ':source' => $source,
            ':played_by' => $playedBy,
            ':id' => $roomId
        ]);

        // Broadcast system message
        $mStmt = $pdo->prepare("
            INSERT INTO messages (msg_uid, room_id, sender_id, sender_name, sender_dept, character_id, text, is_system)
            VALUES (:uid, :room_id, 'system', 'SEU Adda রেডিও', '', '', :text, 1)
        ");
        $mStmt->execute([
            ':uid' => 'song_' . time(),
            ':room_id' => $roomId,
            ':text' => "🎶 {$playedBy} নতুন গান চালু করেছেন: \"{$title}\""
        ]);

        jsonResponse(['success' => true]);
        break;

    case 'heartbeat':
        $roomId = strtoupper(trim($input['roomId'] ?? ''));
        $userId = trim($input['participantId'] ?? '');

        if ($roomId && $userId) {
            $nowUtc = gmdate('Y-m-d H:i:s');
            $stmt = $pdo->prepare("UPDATE participants SET last_seen = :now WHERE room_id = :room_id AND id = :id");
            $stmt->execute([':now' => $nowUtc, ':room_id' => $roomId, ':id' => $userId]);
        }

        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'অজ্ঞাত অ্যাকশন বা রিকোয়েস্ট'], 400);
}
