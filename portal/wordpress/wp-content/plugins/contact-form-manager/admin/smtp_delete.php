<?php
global $wpdb;
$_POST = stripslashes_deep($_POST);
$_GET = stripslashes_deep($_GET);
$xyz_cfm_SmtpId = intval($_GET['id']);
$xyz_cfm_pageno = intval($_GET['pageno']);

if($xyz_cfm_SmtpId=="" || !is_numeric($xyz_cfm_SmtpId)){
	header("Location:".admin_url('admin.php?page=contact-form-manager-manage-smtp'));
	exit();

}
$emailCount = $wpdb->query( 'SELECT * FROM xyz_cfm_sender_email_address WHERE id="'.$xyz_cfm_SmtpId.'" LIMIT 0,1' ) ;

if($emailCount==0){
	header("Location:".admin_url('admin.php?page=contact-form-manager-manage-smtp&smtpmsg=3'));
	exit();
}else{
	
	
	$xyz_cfm_default = $wpdb->get_results('SELECT * FROM xyz_cfm_sender_email_address WHERE id="'.$xyz_cfm_SmtpId.'"' ) ;
	$xyz_cfm_default = $xyz_cfm_default[0];
	
	if($xyz_cfm_default->set_default != 1){
	
		$wpdb->query( 'DELETE FROM  xyz_cfm_sender_email_address  WHERE id="'.$xyz_cfm_SmtpId.'" ' ) ;
		
		header("Location:".admin_url('admin.php?page=contact-form-manager-manage-smtp&smtpmsg=5&pagenum='.$xyz_cfm_pageno));
		exit();
	}else{
		header("Location:".admin_url('admin.php?page=contact-form-manager-manage-smtp&smtpmsg=6&pagenum='.$xyz_cfm_pageno));
		exit();
	}
}
?>