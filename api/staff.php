<?php
require __DIR__ . '/db.php';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
  $rows = $pdo->query('SELECT * FROM staff ORDER BY date_added DESC')->fetchAll();
  $staff = array_map(function($r){
    return [
      'id' => $r['id'],
      'name' => $r['name'],
      'title' => $r['title'],
      'type' => $r['type'],
      'specialty' => $r['specialty'],
      'credentials' => $r['credentials'],
      'bio' => $r['bio'],
      'image' => $r['image'],
      'yearsExperience' => $r['years_experience'],
      'email' => $r['email'],
      'phone' => $r['phone'],
      'linkedinUrl' => $r['linkedin_url'],
      'education' => $r['education'],
      'locations' => $r['locations'],
      'languages' => $r['languages'],
      'dateAdded' => date(DATE_ISO8601, strtotime($r['date_added'])),
      'updatedAt' => date(DATE_ISO8601, strtotime($r['updated_at'])),
    ];
  }, $rows);
  json_out([
    'metadata' => [
      'version' => '1.0',
      'lastUpdated' => date(DATE_ISO8601),
      'totalStaff' => count($staff),
    ],
    'staff' => $staff,
  ]);
}

if ($method === 'POST') {
  require_auth_if_set();
  $input = json_decode(file_get_contents('php://input'), true) ?: ['staff'=>[]];
  $ids = [];

  $pdo->beginTransaction();
  try {
    $up = $pdo->prepare('INSERT INTO staff (id,name,title,type,specialty,credentials,bio,image,years_experience,email,phone,linkedin_url,education,locations,languages,date_added,updated_at) VALUES (:id,:name,:title,:type,:specialty,:credentials,:bio,:image,:years_experience,:email,:phone,:linkedin_url,:education,:locations,:languages,:date_added,NOW()) ON DUPLICATE KEY UPDATE name=VALUES(name), title=VALUES(title), type=VALUES(type), specialty=VALUES(specialty), credentials=VALUES(credentials), bio=VALUES(bio), image=VALUES(image), years_experience=VALUES(years_experience), email=VALUES(email), phone=VALUES(phone), linkedin_url=VALUES(linkedin_url), education=VALUES(education), locations=VALUES(locations), languages=VALUES(languages), updated_at=NOW()');

    foreach (($input['staff'] ?? []) as $s) {
      $ids[] = $s['id'];
      $up->execute([
        ':id' => $s['id'],
        ':name' => $s['name'] ?? '',
        ':title' => $s['title'] ?? '',
        ':type' => in_array(($s['type'] ?? 'medical'), ['medical','support']) ? $s['type'] : 'medical',
        ':specialty' => $s['specialty'] ?? '',
        ':credentials' => $s['credentials'] ?? '',
        ':bio' => $s['bio'] ?? '',
        ':image' => !empty($s['image']) ? $s['image'] : 'assets/images/healthcare-team-professional.jpg',
        ':years_experience' => isset($s['yearsExperience']) && is_numeric($s['yearsExperience']) ? (int)$s['yearsExperience'] : null,
        ':email' => $s['email'] ?? null,
        ':phone' => $s['phone'] ?? null,
        ':linkedin_url' => $s['linkedinUrl'] ?? null,
        ':education' => $s['education'] ?? null,
        ':locations' => $s['locations'] ?? null,
        ':languages' => $s['languages'] ?? null,
        ':date_added' => isset($s['dateAdded']) ? date('Y-m-d H:i:s', strtotime($s['dateAdded'])) : date('Y-m-d H:i:s'),
      ]);
    }

    if (!empty($ids)) {
      $in = implode(',', array_fill(0, count($ids), '?'));
      $pdo->prepare("DELETE FROM staff WHERE id NOT IN ($in)")->execute($ids);
    } else {
      // If empty dataset posted, clear the table (mirror semantics)
      $pdo->exec('DELETE FROM staff');
    }

    $pdo->exec("INSERT INTO system_meta (k,v) VALUES ('staff_last_updated', NOW()) ON DUPLICATE KEY UPDATE v=NOW()");
    $pdo->commit();
    json_out(['ok'=>true]);
  } catch (Throwable $e) {
    $pdo->rollBack();
    json_out(['ok'=>false,'error'=>$e->getMessage()], 500);
  }
}

json_out(['ok'=>false,'error'=>'Method not allowed'], 405);

