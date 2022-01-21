<?php
date_default_timezone_set('UTC');

define('ROOT_DIR', realpath(dirname(__FILE__)) . '/');
define('CONTENT_DIR', ROOT_DIR . 'content/');
define('CONTENT_EXT', '.md');
define('LIB_DIR', ROOT_DIR . 'lib/');
define('PLUGINS_DIR', ROOT_DIR . 'plugins/');
define('THEMES_DIR', ROOT_DIR . 'dist/');

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', ROOT_DIR . 'storage/logs/error.log');

require_once(ROOT_DIR . 'vendor/autoload.php');
require_once(LIB_DIR . 'pico.php');
$pico = new Pico();
