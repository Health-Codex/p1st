<?php
$config = require __DIR__ . '/config.php';
$dir = rtrim($config['uploads_dir'], '/');
if (!is_dir($dir)) { @mkdir($dir, 0775, true); }

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST' || empty($_FILES['image'])) {
  http_response_code(400);
  header('Content-Type: application/json');
  echo json_encode(['ok'=>false,'error'=>'No file']);
  exit;
}

// Get provider info for better naming
$providerName = $_POST['providerName'] ?? '';
$providerId = $_POST['providerId'] ?? '';

$name = $_FILES['image']['name'] ?? 'upload.jpg';
$ext = strtolower(pathinfo($name, PATHINFO_EXTENSION) ?: 'jpg');

// Create a clean filename based on provider info
if ($providerName) {
  // Clean provider name for filename
  $cleanName = preg_replace('/[^a-z0-9]/i', '-', $providerName);
  $cleanName = preg_replace('/-+/', '-', $cleanName);
  $cleanName = trim($cleanName, '-');
  $fname = 'staff-' . $cleanName . '-' . time() . '.' . $ext;
} elseif ($providerId) {
  $fname = 'staff-' . $providerId . '-' . time() . '.' . $ext;
} else {
  // Fallback to original naming
  $base = preg_replace('/[^a-z0-9-_]/i','_', pathinfo($name, PATHINFO_FILENAME)) ?: 'upload';
  $fname = 'staff-'.time().'-'.$base.'.'.$ext;
}

$dest = $dir.'/'.$fname;

if (!move_uploaded_file($_FILES['image']['tmp_name'], $dest)) {
  http_response_code(500);
  header('Content-Type: application/json');
  echo json_encode(['ok'=>false,'error'=>'Move failed']);
  exit;
}

header('Content-Type: application/json');
echo json_encode(['ok'=>true,'path'=>rtrim($config['uploads_url_prefix'],'/').'/'.$fname]);

