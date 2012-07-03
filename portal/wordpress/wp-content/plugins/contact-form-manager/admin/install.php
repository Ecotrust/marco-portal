<?php

function cfm_install(){
	
	global $wpdb;
	global $current_user; get_currentuserinfo();
	
	add_option("xyz_cfm_paging_limit",20);
	add_option("xyz_cfm_tinymce_filter",1);
	add_option("xyz_cfm_mandatory_sign",1);
// 	add_option("xyz_cfm_credit_link",0);
	
	if(get_option('xyz_credit_link') == ""){
		if(get_option('xyz_cfm_credit_link') == 1){
			add_option("xyz_credit_link",'cfm');
		}else{
			add_option("xyz_credit_link",0);
		}
	}
	
	add_option('xyz_cfm_sendViaSmtp',0);
	add_option('xyz_cfm_SmtpDebug',0);
	
	$queryForm = "CREATE TABLE IF NOT EXISTS `xyz_cfm_form` (
	  `id` int NOT NULL AUTO_INCREMENT,
	  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
	  `status` int NOT NULL,
	  `form_content` longtext COLLATE utf8_unicode_ci NOT NULL,
	  `submit_mode` int NOT NULL,
	  `to_email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
	  `from_email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
	  `sender_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
	  `reply_sender_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
	  `reply_sender_email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
	  `cc_email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
	  `mail_type` int NOT NULL,
	  `mail_subject` text COLLATE utf8_unicode_ci NOT NULL,
	  `mail_body` longtext COLLATE utf8_unicode_ci NOT NULL,
	  `to_email_reply` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
	  `reply_subject` text COLLATE utf8_unicode_ci NOT NULL,
	  `reply_body` longtext COLLATE utf8_unicode_ci NOT NULL,
	  `reply_mail_type` int NOT NULL,
	  `enable_reply` int NOT NULL,
	  `redirection_link` text COLLATE utf8_unicode_ci NOT NULL,
	  PRIMARY KEY (`id`)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ";
	$wpdb->query($queryForm);
	
	$group_flag=0;
	$tblcolums = mysql_query("SHOW COLUMNS FROM `xyz_cfm_form`");
	while ($row = mysql_fetch_array($tblcolums))
	{
		if( $row['Field']=="from_email_id")
		{
			$group_flag=1;
		}
	
	}
	
	
	if($group_flag==0)
	{
		mysql_query("ALTER TABLE `xyz_cfm_form` ADD (`from_email_id` int not null default '0' ,`reply_sender_email_id` int not null default '0');");
		echo mysql_error();
	}
	
	
	
	
	$queryFormElements = "CREATE TABLE IF NOT EXISTS `xyz_cfm_form_elements` (
	  `id` int NOT NULL AUTO_INCREMENT,
	  `form_id` int NOT NULL,
	  `element_diplay_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
	  `element_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
	  `element_type` int NOT NULL,
	  `element_required` int NOT NULL,
	  `css_class` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
	  `max_length` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
	  `default_value` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
	  `cols` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
	  `rows` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
	  `options` longtext COLLATE utf8_unicode_ci NOT NULL,
	  `file_size` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
	  `file_type` text COLLATE utf8_unicode_ci NOT NULL,
	  `re_captcha` int NOT NULL,
	  PRIMARY KEY (`id`)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 " ;
	$wpdb->query($queryFormElements);
	
	$querySenderEmailAddress = "CREATE TABLE IF NOT EXISTS `xyz_cfm_sender_email_address` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`authentication` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
	`host` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
	`user` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
	`password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
	`port` int(11) NOT NULL,
	`security` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
	`set_default` int(1) NOT NULL,
	`status` int(1) NOT NULL,
	PRIMARY KEY (`id`)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1";
	$wpdb->query($querySenderEmailAddress);
	
	
	$form_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form') ;
	if($form_count == 0){
		
		$xyz_cfm_to_email =  $current_user->user_email;
		
		
		$last_id= $wpdb->get_var("select max(id) from xyz_cfm_form");
		$last_id=($last_id=='')?1:$last_id+1;
		
		$wpdb->insert('xyz_cfm_form', array('name' => 'form'.$last_id),array('%s'));
		$lastid = $wpdb->insert_id;
		
		$wpdb->insert('xyz_cfm_form_elements', array('form_id' =>$lastid,'element_name'=>'yourName',
				'element_type'=>'1','element_required'=>'1'),
				array('%d','%s','%s','%d','%d'));
		$yourNameId = $wpdb->insert_id;
		$nameCode = "[text-".$yourNameId."]";
		
		$wpdb->insert('xyz_cfm_form_elements', array('form_id' =>$lastid,'element_name'=>'yourEmail',
				'element_type'=>'2','element_required'=>'1'),
				array('%d','%s','%s','%d','%d'));
		$yourEmailId = $wpdb->insert_id;
		$emailCode = "[email-".$yourEmailId."]";
		
		$wpdb->insert('xyz_cfm_form_elements', array('form_id' =>$lastid,'element_name'=>'subject',
				'element_type'=>'1','element_required'=>'1'),
				array('%d','%s','%s','%d','%d'));
		$xyz_cfm_subjectId = $wpdb->insert_id;
		$xyz_cfm_subjectCode = "[text-".$xyz_cfm_subjectId."]";
		
		
		$wpdb->insert('xyz_cfm_form_elements', array('form_id' =>$lastid,'element_name'=>'message',
				'element_type'=>'3','element_required'=>'1','cols'=>45,'rows'=>6),
				array('%d','%s','%s','%d','%d'));
		$messageId = $wpdb->insert_id;
		$messageCode = "[textarea-".$messageId."]";
		
		$wpdb->insert('xyz_cfm_form_elements', array('form_id' =>$lastid,'element_diplay_name'=>'Send','element_name'=>'submit',
				'element_type'=>'9'),
				array('%d','%s','%s','%d'));
		$submitId = $wpdb->insert_id;
		$submitCode = "[submit-".$submitId."]";
		
		$xyz_cfm_pageCodeDefault ='<table width="100%">
			<tr>
				<td>Your Name</td><td>&nbsp;:&nbsp;</td><td>'.$nameCode.'</td>
			</tr>
			<tr>
			<td>Your Email</td><td>&nbsp;:&nbsp;</td><td>'.$emailCode.'</td>
			</tr>
			<tr>
			<td>Subject</td><td>&nbsp;:&nbsp;</td><td>'.$xyz_cfm_subjectCode.'</td>
			</tr>
			<tr>
			<td>Message Body</td><td>&nbsp;:&nbsp;</td><td>'.$messageCode.'</td>
			</tr>
			<tr>
			<td colspan="2"></td>
			<td >'.$submitCode.'</td>
			</tr>
		</table>';
		
		
		$xyz_cfm_mailBody='Hi,<p>You have a new contact request</p><p>From : '.$emailCode.'<br />Subject : '.$xyz_cfm_subjectCode.'<br />Message Body : '.$messageCode.'</p>Regards<br>'.get_bloginfo('name');
		
		
		$xyz_cfm_mailBodyReplay='<p>Hi '.$nameCode.',</p><p>Thank you for contacting us. Your mail has been received and shall be processed shortly.</p>Regards<br>'.get_bloginfo('name');
		
		$wpdb->update('xyz_cfm_form',
				array('form_content'=>$xyz_cfm_pageCodeDefault,
						'submit_mode'=>2,
						'to_email'=>$xyz_cfm_to_email,
						'from_email'=>$emailCode,
						'mail_type'=>1, //html
						'mail_subject'=>$xyz_cfm_subjectCode,
						'mail_body'=>$xyz_cfm_mailBody,
						'to_email_reply'=>$emailCode,
						'reply_subject'=>'Re:'.$xyz_cfm_subjectCode,
						'reply_body'=>$xyz_cfm_mailBodyReplay,
						'reply_mail_type'=>1,
						'enable_reply'=>1, //disable
						'status'=>1
				),
				array('id'=>$lastid));
		
	}
	
	
	
}