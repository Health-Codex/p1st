<?php
require __DIR__ . '/db.php';
ignore_user_abort(true);
set_time_limit(0);

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('X-Accel-Buffering: no'); // hint for some proxies

echo "event: ping\n";
echo "data: \"connected\"\n\n";
@ob_flush(); @flush();

$last = null;
$maxIterations = 180; // ~6 minutes at 2s
for ($i=0; $i<$maxIterations; $i++) {
  $row = $pdo->query("SELECT v FROM system_meta WHERE k='staff_last_updated'")->fetch();
  $v = $row['v'] ?? null;
  if ($v && $v !== $last) {
    $last = $v;
    $count = (int)$pdo->query('SELECT COUNT(*) AS c FROM staff')->fetch()['c'];
    echo "event: staff-updated\n";
    echo 'data: '.json_encode(['count'=>$count,'ts'=>$v])."\n\n";
    @ob_flush(); @flush();
  }
  sleep(2);
}

