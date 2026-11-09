<?php
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$action = $_GET['action'] ?? $_POST['action'] ?? 'get';
$input = getJsonInput();

// Ensure row 1 exists
try {
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    if ($driver === 'sqlite') {
        $pdo->exec("INSERT OR IGNORE INTO campus_stats (id, cheers_count, mood_general, mood_heartbreak, mood_exams, mood_canteen) VALUES (1, 420, 50, 15, 30, 65)");
    } else {
        $pdo->exec("INSERT IGNORE INTO campus_stats (id, cheers_count, mood_general, mood_heartbreak, mood_exams, mood_canteen) VALUES (1, 420, 50, 15, 30, 65)");
    }
} catch (Exception $e) {}

switch ($action) {
    case 'get':
        $stmt = $pdo->query("SELECT * FROM campus_stats WHERE id = 1");
        $stats = $stmt->fetch();
        if (!$stats) {
            $stats = [
                'cheers_count' => 420,
                'mood_general' => 50,
                'mood_heartbreak' => 15,
                'mood_exams' => 30,
                'mood_canteen' => 65
            ];
        }

        // Get total confessions count
        try {
            $cStmt = $pdo->query("SELECT COUNT(*) FROM confessions");
            $totalConfessions = (int)$cStmt->fetchColumn();
        } catch (Exception $e) {
            $totalConfessions = 4;
        }

        jsonResponse([
            'cheers_count' => (int)$stats['cheers_count'],
            'total_confessions' => $totalConfessions,
            'moods' => [
                'general' => (int)$stats['mood_general'],
                'heartbreak' => (int)$stats['mood_heartbreak'],
                'exams' => (int)$stats['mood_exams'],
                'canteen' => (int)$stats['mood_canteen']
            ]
        ]);
        break;

    case 'cheers':
        // Increment cheers_count atomically
        $pdo->exec("UPDATE campus_stats SET cheers_count = cheers_count + 1 WHERE id = 1");
        $stmt = $pdo->query("SELECT cheers_count FROM campus_stats WHERE id = 1");
        $newCount = (int)$stmt->fetchColumn();

        jsonResponse([
            'success' => true,
            'cheers_count' => $newCount
        ]);
        break;

    case 'mood':
        $mood = trim($input['mood'] ?? $_GET['mood'] ?? 'general');
        $validMoods = ['general', 'heartbreak', 'exams', 'canteen'];
        if (in_array($mood, $validMoods, true)) {
            $col = 'mood_' . $mood;
            $pdo->exec("UPDATE campus_stats SET $col = $col + 1 WHERE id = 1");
        }

        $stmt = $pdo->query("SELECT mood_general, mood_heartbreak, mood_exams, mood_canteen FROM campus_stats WHERE id = 1");
        $m = $stmt->fetch();

        jsonResponse([
            'success' => true,
            'moods' => [
                'general' => (int)($m['mood_general'] ?? 50),
                'heartbreak' => (int)($m['mood_heartbreak'] ?? 15),
                'exams' => (int)($m['mood_exams'] ?? 30),
                'canteen' => (int)($m['mood_canteen'] ?? 65)
            ]
        ]);
        break;

    default:
        jsonResponse(['error' => 'অজ্ঞাত অ্যাকশন'], 400);
}
