<?php
require_once __DIR__ . '/config.php';

function getDbConnection(): PDO {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    try {
        // 1. Try connecting to MySQL (InfinityFree or Local MySQL)
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            DB_HOST,
            DB_PORT,
            DB_NAME
        );
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        // Force UTC timezone in MySQL session to match PHP date_default_timezone_set('UTC')
        $pdo->exec("SET time_zone = '+00:00'");
    } catch (PDOException $e) {
        // 2. Seamless local fallback: If remote/local MySQL is unavailable during local testing,
        // use local SQLite file so local preview works out-of-the-box!
        $sqliteFile = __DIR__ . '/seu_adda_local.db';
        $pdo = new PDO('sqlite:' . $sqliteFile);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->exec('PRAGMA foreign_keys = ON;');
        initSqliteTables($pdo);
    }

    // Run automated 2-hour room expiration cleanup on connection
    purgeExpiredRooms($pdo);

    return $pdo;
}

/**
 * ২ ঘণ্টার স্বয়ংক্রিয় ক্লিনআপ (Auto Delete System):
 * মেয়াদোত্তীর্ণ সব রুম এবং ক্যাসকেড ডিলিটের মাধ্যমে তাদের মেসেজ ও মেম্বার মুছে ফেলে।
 */
function purgeExpiredRooms(PDO $pdo): void {
    try {
        $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
        if ($driver === 'sqlite') {
            $pdo->query("DELETE FROM rooms WHERE datetime(expires_at) <= datetime('now')");
            // Clean participants inactive for > 5 minutes (prevents false kickouts during phone lock / tab switches)
            $pdo->query("DELETE FROM participants WHERE datetime(last_seen) <= datetime('now', '-300 seconds')");
        } else {
            $pdo->query("DELETE FROM rooms WHERE expires_at <= NOW()");
            // Clean participants inactive for > 5 minutes
            $pdo->query("DELETE FROM participants WHERE last_seen <= DATE_SUB(NOW(), INTERVAL 300 SECOND)");
        }
    } catch (Exception $e) {
        // Silent catch for resilience
    }
}

function initSqliteTables(PDO $pdo): void {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS rooms (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            host_id TEXT NOT NULL,
            host_name TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            expires_at TEXT NOT NULL,
            current_song_title TEXT,
            current_song_author TEXT,
            current_song_source TEXT,
            current_song_played_by TEXT
        );

        CREATE TABLE IF NOT EXISTS participants (
            id TEXT NOT NULL,
            room_id TEXT NOT NULL,
            name TEXT NOT NULL,
            dept TEXT DEFAULT 'CSE',
            gender TEXT DEFAULT 'male',
            character_id TEXT NOT NULL,
            joined_at TEXT DEFAULT (datetime('now')),
            last_seen TEXT DEFAULT (datetime('now')),
            PRIMARY KEY (id, room_id),
            FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            msg_uid TEXT NOT NULL,
            room_id TEXT NOT NULL,
            sender_id TEXT NOT NULL,
            sender_name TEXT NOT NULL,
            sender_dept TEXT,
            character_id TEXT NOT NULL,
            text TEXT NOT NULL,
            is_system INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS confessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author TEXT NOT NULL,
            dept TEXT NOT NULL,
            batch TEXT NOT NULL,
            text TEXT NOT NULL,
            likes INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS campus_stats (
            id INTEGER PRIMARY KEY DEFAULT 1,
            cheers_count INTEGER DEFAULT 420,
            mood_general INTEGER DEFAULT 50,
            mood_heartbreak INTEGER DEFAULT 15,
            mood_exams INTEGER DEFAULT 30,
            mood_canteen INTEGER DEFAULT 65,
            updated_at TEXT DEFAULT (datetime('now'))
        );
        INSERT OR IGNORE INTO campus_stats (id, cheers_count, mood_general, mood_heartbreak, mood_exams, mood_canteen)
        VALUES (1, 420, 50, 15, 30, 65);
    ");
}

function jsonResponse(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getJsonInput(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

