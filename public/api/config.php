<?php
/**
 * SEU Adda — InfinityFree Database Configuration
 * InfinityFree Control Panel (vPanel) থেকে প্রাপ্ত MySQL তথ্য এখানে বসান:
 */

// InfinityFree MySQL Credentials
define('DB_HOST', getenv('DB_HOST') ?: 'sql104.infinityfree.com'); // আপনার InfinityFree MySQL Hostname
define('DB_NAME', getenv('DB_NAME') ?: 'if0_43397321_seu_adda');    // আপনার Database Name
define('DB_USER', getenv('DB_USER') ?: 'if0_43397321');             // আপনার Database Username
define('DB_PASS', getenv('DB_PASS') ?: 'shahir7860');         // আপনার InfinityFree Password
define('DB_PORT', getenv('DB_PORT') ?: '3306');

// CORS Headers for API accessibility
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit;
}
