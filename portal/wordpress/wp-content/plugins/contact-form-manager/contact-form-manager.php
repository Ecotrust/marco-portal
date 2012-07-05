<?php 
/*
Plugin Name: Contact Form Manager
Plugin URI: http://xyzscripts.com/wordpress-plugins/contact-form-manager/
Description: Create  and manage multiple contact forms for your website. The plugin supports a wide range of form elements such as text field, email field, textarea, dropdown list, radio button, checkbox, date picker, captcha, file uploader etc. Shortcodes are generated such that, you can modify form element properties without having to replace the shortcode everytime.          
Version: 1.1
Author: xyzscripts.com
Author URI: http://xyzscripts.com/
Text Domain: contact-form-manager
License: GPLv2 or later
*/

/*
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

// if ( !function_exists( 'add_action' ) ) {
// 	echo "Hi there!  I'm just a plugin, not much I can do when called directly.";
// 	exit;
// }

ob_start();
// error_reporting(E_ALL);
define('XYZ_CFM_PLUGIN_FILE',__FILE__);
require( dirname( __FILE__ ) . '/xyz-functions.php' );

require( dirname( __FILE__ ) . '/admin/install.php' );
register_activation_hook(__FILE__,'cfm_install');

require( dirname( __FILE__ ) . '/admin/menu.php' );

require( dirname( __FILE__ ) . '/create-contact-form.php' );

require( dirname( __FILE__ ) . '/shortcode-handler.php' );

require( dirname( __FILE__ ) . '/admin/uninstall.php' );
register_uninstall_hook(__FILE__,'cfm_uninstall');

function xyz_cfm_manager() {
	load_plugin_textdomain( 'contact-form-manager', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}
add_action('init', 'xyz_cfm_manager');

if(get_option('xyz_credit_link')=="cfm"){

	add_action('wp_footer', 'xyz_cfm_credit');

}
function xyz_cfm_credit() {	
	$content = '<div style="width:100%;text-align:center; font-size:11px; ">Contact Form Powered By : <a target="_blank" title="PHP Scripts & Programs" href="http://www.xyzscripts.com" >XYZScripts.com</a></div>';
	echo $content;
}


?>