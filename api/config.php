<?php
return [
  // Database connection
  'db_host' => 'localhost',
  'db_port' => 3306,
  'db_name' => 'providers',
  'db_user' => 'ashin97',
  'db_pass' => 'Chester3428!',

  // Uploads configuration. This project lives under /p1st on the server,
  // and we want uploaded images saved into /p1st/assets/images.
  // The "uploads_dir" is a filesystem path relative to this file.
  'uploads_dir' => __DIR__ . '/../assets/images',
  // The value returned to the browser in JSON; should match how images are referenced in HTML.
  'uploads_url_prefix' => 'assets/images',

  // Optional: set a token if you want to restrict POST access.
  // Keep null to disable auth for testing.
  'bearer_token' => null,
];

