<?php 
global $wpdb;


$last_id= $wpdb->get_var("select max(id) from xyz_cfm_form");
$last_id=($last_id=='')?1:$last_id+1;

$wpdb->insert('xyz_cfm_form', array('name' => 'form'.$last_id,'status'=>2),array('%s'));
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
				'from_email'=>$emailCode,
				'mail_type'=>1, //html
				'mail_subject'=>$xyz_cfm_subjectCode,
				'mail_body'=>$xyz_cfm_mailBody,
				'to_email_reply'=>$emailCode,
				'reply_subject'=>'Re:'.$xyz_cfm_subjectCode,
				'reply_body'=>$xyz_cfm_mailBodyReplay,
				'reply_mail_type'=>1,
				'enable_reply'=>1 //disable
		),
		array('id'=>$lastid));


						header("Location:".admin_url('admin.php?page=contact-form-manager-managecontactforms&action=form-edit&formId='.$lastid));
						


?>