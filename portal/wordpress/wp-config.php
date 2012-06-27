<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'wpuser');

/** MySQL database password */
define('DB_PASSWORD', 'password');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '-8Qs,uGv&sMsgu{,zh!+2|$a{1sw_;Zh}0/?pLPhpFX7jEJEWzw8xGV X>^-C-jv');
define('SECURE_AUTH_KEY',  '+;ld>^u-)DMS5gkYV<xgwkqRRW++Dtg4yg~Y%l,WmPyMUwW{++&~:x7q#9J_,=BP');
define('LOGGED_IN_KEY',    'eT*RiuWfv;!YT}lmsLQ*$dYGzifNs>*e9$|M9Bs0|9?spKU`glYr[q4b>B1K/:co');
define('NONCE_KEY',        'vq_L+&aVZG,mFv?}si5izf*1.N|nzJRcmHK-Q7:--FFep;XTN7$YqLLbnq/+uJ-e');
define('AUTH_SALT',        'T{4@?V:-o3Un4a|uljUn(l*v!M-c4t9b]Bo;2;>>#8tMR)NtTP6+_G&d`PZt{-jU');
define('SECURE_AUTH_SALT', '^y*79v`+2Dg$e>i-j1!JU-}!9YNMpl,y+OZd~|$&FlVVJRhGv(F-BB%muwPhYB {');
define('LOGGED_IN_SALT',   '_PHauN&%.W~/r?+JpKZKGS=Qa#+wb73U)*x=s#SKi.$zwOKD?I<O(Qi|OI#XnSPZ');
define('NONCE_SALT',       'AEdkL`[%%DUsL|3w+&*}adfM,_>w%&q]-TZ.} z&R?V(>(y.68b9I/YUiHt+,zQL');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');

