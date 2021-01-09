<?php
date_default_timezone_set('UTC');
$config['base_url'] = '';
$config['site_title'] = '';
$config['site_title_sep'] = ' • ';
$config['site_author'] = '';
$config['site_email'] = '';
$config['site_description'] = '';
$config['logo_og'] = '';
$config['env'] = 'ok';
$config['bust'] = 0;
$config['content_dir'] = 'content/';
$config['theme'] = 'db-5';

$config['twig_config'] = [
    'cache' => 'dist/templates/cache',
    'autoescape' => false,
    'debug' => false
];

$config['pages_order_by'] = 'date';	    	// alpha | date
$config['date_format'] = 'Y-m-d';
$config['pages_order'] = 'desc';

return $config;