<?php
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$action = $_GET['action'] ?? $_POST['action'] ?? 'list';
$input = getJsonInput();

switch ($action) {
    case 'list':
        $stmt = $pdo->query("SELECT * FROM confessions ORDER BY id DESC LIMIT 50");
        $rows = $stmt->fetchAll();
        $confessions = array_map(function ($c) {
            return [
                'id' => (string)$c['id'],
                'author' => $c['author'],
                'dept' => $c['dept'],
                'batch' => $c['batch'],
                'text' => $c['text'],
                'likes' => (int)$c['likes'],
                'timestamp' => date('d M, h:i A', strtotime($c['created_at']))
            ];
        }, $rows);

        jsonResponse($confessions);
        break;

    case 'create':
        $author = trim($input['author'] ?? 'নাম প্রকাশে অনিচ্ছুক');
        $dept = trim($input['dept'] ?? 'CSE');
        $batch = trim($input['batch'] ?? 'Campus Adda');
        $text = trim($input['text'] ?? '');

        if (!$text) {
            jsonResponse(['error' => 'কনফেশনের লেখা খালি রাখা যাবে না'], 400);
        }

        $stmt = $pdo->prepare("
            INSERT INTO confessions (author, dept, batch, text, likes)
            VALUES (:author, :dept, :batch, :text, 0)
        ");
        $stmt->execute([
            ':author' => $author,
            ':dept' => $dept,
            ':batch' => $batch,
            ':text' => $text
        ]);

        $newId = (string)$pdo->lastInsertId();

        jsonResponse([
            'id' => $newId,
            'author' => $author,
            'dept' => $dept,
            'batch' => $batch,
            'text' => $text,
            'likes' => 0,
            'timestamp' => 'এইমাত্র'
        ]);
        break;

    case 'like':
        $id = (int)($input['id'] ?? $_GET['id'] ?? 0);
        if ($id <= 0) {
            jsonResponse(['error' => 'আইডি সঠিক নয়'], 400);
        }

        $stmt = $pdo->prepare("UPDATE confessions SET likes = likes + 1 WHERE id = :id");
        $stmt->execute([':id' => $id]);

        $gStmt = $pdo->prepare("SELECT likes FROM confessions WHERE id = :id");
        $gStmt->execute([':id' => $id]);
        $likes = (int)$gStmt->fetchColumn();

        jsonResponse(['success' => true, 'likes' => $likes]);
        break;

    default:
        jsonResponse(['error' => 'অজ্ঞাত অ্যাকশন'], 400);
}
