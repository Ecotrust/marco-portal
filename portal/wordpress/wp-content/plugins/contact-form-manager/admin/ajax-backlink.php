<?php
require( dirname( __FILE__ ) . '../../../../../wp-load.php' );
if(!current_user_can('manage_options')){
	exit;
}
global $wpdb;

if($_POST){
	
// 	$xyz_cfm_credit=absint($_POST['enable']);
	update_option('xyz_credit_link','cfm');
}


?>