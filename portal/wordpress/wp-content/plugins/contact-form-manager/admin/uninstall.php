<?php 

function cfm_uninstall(){

global $wpdb;

/* table delete*/


$wpdb->query("DROP TABLE xyz_cfm_form");

$wpdb->query("DROP TABLE xyz_cfm_form_elements");

$wpdb->query("DROP TABLE xyz_cfm_sender_email_address");


/* delete options*/

delete_option("xyz_cfm_paging_limit");
delete_option("xyz_cfm_tinymce_filter");
delete_option("xyz_cfm_mandatory_sign");
if(get_option('xyz_credit_link') == "cfm"){
	update_option('xyz_credit_link', 0);
}
delete_option('xyz_cfm_recaptcha_private_key');
delete_option('xyz_cfm_recaptcha_public_key');

delete_option('xyz_cfm_sendViaSmtp');
delete_option('xyz_cfm_SmtpDebug');

}
?>