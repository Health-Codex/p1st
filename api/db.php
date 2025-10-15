<?php
$config = require __DIR__ . '/config.php';

$dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
  $config['db_host'],
  $config['db_port'],
  $config['db_name']
);

try {
  $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
} catch (Throwable $e) {
  http_response_code(500);
  header('Content-Type: application/json');
  echo json_encode(['ok'=>false,'error'=>'DB connection failed: '.$e->getMessage()]);
  exit;
}

function json_out($data, $code = 200) {
  http_response_code($code);
  header('Content-Type: application/json');
  echo json_encode($data);
  exit;
}

function require_auth_if_set() {
  $cfg = require __DIR__ . '/config.php';
  if (!$cfg['bearer_token']) return;
  $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
  if (!preg_match('/Bearer\s+(.+)/i', $hdr, $m) || trim($m[1]) !== $cfg['bearer_token']) {
    json_out(['ok'=>false,'error'=>'Unauthorized'], 401);
  }
}

