<?php
require_once ABSPATH . WPINC . '/class-phpmailer.php';
require_once ABSPATH . WPINC . '/class-smtp.php';

include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
if(!is_plugin_active('wp-recaptcha/wp-recaptcha.php')){
	require_once dirname(XYZ_CFM_PLUGIN_FILE)."/recaptcha/recaptchalib.php";
}


function display_form($id){
	global $wpdb;
	
	$folderName = md5(uniqid(microtime()) . $_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT']);

	$msg_after_submit='';
	$elementType = '';
	$messageBody = '';
	$script = '';
	$scriptStart = '';
	$scriptClose = '';
	$scriptDate = '';
	$styleDate = '';
	$scriptInclude = '';
	$dateFlag = 0;
	$captchaFlag = 0;
	$errorFlagMandatory = 0;
	$errorFlagEmail = 0;
	$formFlagCount = 0;
	$captchaFlagError = 0;
	$captchaErrorElementName = '';
	$emailErrorElementIdArray = array();
	$uploadFileNameArray = array();
	$fileOptionsArray = array();
	$fileTypeErrorFlag = 0;
	$acceptablefileTypes = '';
	$targetfolder = '';
	$xyz_cfm_senderEmail = '';
	$xyz_cfm_mailSentFlag = 0;
	
	$xyz_cfm_reCaptchaId = '';
	$xyz_cfm_mandatoryError = '';
	$xyz_cfm_fileError = '';
	
	$individualFormSubmitFlag = 0;
	
	$clearForm = '';
	if(is_array($id)){
		$formId = $id['id'];

		$formButton = $wpdb->get_results('SELECT * FROM xyz_cfm_form_elements WHERE form_id="'.$formId.'" AND element_type="9"' );
		$formButton = $formButton[0];
		if(count($formButton)>0){
			$formFlagCount = 1;
		}
		$formAllData = $wpdb->get_results('SELECT * FROM xyz_cfm_form WHERE id="'.$formId.'"' );
		$formAllData = $formAllData[0];
		
		if($_POST && isset($_POST['xyz_cfm_frmName']) && $_POST['xyz_cfm_frmName'] == $formAllData->name) {	
			$_POST = stripslashes_deep($_POST);
			$_POST = xyz_trim_deep($_POST);
		}	

		$messageBody = $formAllData->form_content;

		$xyz_cfm_senderEmail = $formAllData->from_email;
		if(get_option('xyz_cfm_sendViaSmtp') == 1){
			if(absint($xyz_cfm_senderEmail) != 0){
				$smtpDetails = $wpdb->get_results('SELECT * FROM xyz_cfm_sender_email_address WHERE id="'.$xyz_cfm_senderEmail.'"' );
				$smtpDetails = $smtpDetails[0];
				$xyz_cfm_senderEmail = $smtpDetails->user;
			}
		}
		$xyz_cfm_senderName = $formAllData->sender_name;

		$mailBody = $formAllData->mail_body;
		$mailReplayBody = $formAllData->reply_body;
		$mailSubject = $formAllData->mail_subject;
		$mailReplaySubject = $formAllData->reply_subject;
		$mailReplayToEmail = $formAllData->to_email_reply;

			
		$res = preg_match_all("/\[(email|text|date|submit|textarea|dropdown|checkbox|radiobutton|file|captcha)[-][0-9]{1,11}\]/",$formAllData->form_content,$match);
		if($res){
				if($_POST && isset($_POST['xyz_cfm_frmName']) && $_POST['xyz_cfm_frmName'] == $formAllData->name) {
					$individualFormSubmitFlag = 1;
			foreach ($match[0] as $key => $value){

				$elementId =  strstr($value, '-');
				$elementId = substr($elementId,1,-1);

				$elementName = $wpdb->get_results('SELECT * FROM xyz_cfm_form_elements WHERE id="'.$elementId.'"' );
				$elementName = $elementName[0];
				if(isset($_POST[$elementName->element_name])){
				$xyz_cfm_altVariable = $_POST[$elementName->element_name];
				}else{
					$xyz_cfm_altVariable = '';
				}
				
					if($elementName->element_type == 6){
						$elementType = "checkbox";
						$checkArrayElement='';
						$checkArray = array();
						$checkArray = $_POST[$elementName->element_name];
						if($checkArray){
							$checkArrayElement = implode(",", $checkArray);
						}
						$mailBody = str_replace("[".$elementType."-".$elementId."]",$checkArrayElement,$mailBody);
						$mailReplayBody = str_replace("[".$elementType."-".$elementId."]",$checkArrayElement,$mailReplayBody);
					}elseif($elementName->element_type == 8){
						
					}elseif($elementName->element_type == 9){
						
					}elseif($elementName->element_type == 10){
						
					}else{
						$mailBody = str_replace($value,$xyz_cfm_altVariable,$mailBody);
						$mailReplayBody = str_replace($value,$xyz_cfm_altVariable,$mailReplayBody);
					
						$mailSubject = str_replace($value,$xyz_cfm_altVariable,$mailSubject);
						$mailReplaySubject = str_replace($value,$xyz_cfm_altVariable,$mailReplaySubject);
						$mailReplayToEmail = str_replace($value,$xyz_cfm_altVariable,$mailReplayToEmail);
						$xyz_cfm_senderName = str_replace($value,$xyz_cfm_altVariable,$xyz_cfm_senderName);
						$xyz_cfm_senderEmail = str_replace($value,$xyz_cfm_altVariable,$xyz_cfm_senderEmail);
					}			


					if($elementName->element_type == 10){
					if($_POST['xyz_cfm_hiddenReCaptcha'] ==1){
						$privatekey = get_option('xyz_cfm_recaptcha_private_key');
						$resp = recaptcha_check_answer ($privatekey,
								$_SERVER["REMOTE_ADDR"],
								$_POST["recaptcha_challenge_field"],
								$_POST["recaptcha_response_field"]);
						$xyz_cfm_reCaptchaId = $elementName->id;
						if (!$resp->is_valid) {
							
							// What happens when the CAPTCHA was entered incorrectly
							$captchaFlagError = 1;
						}
					}else{
							if(isset($_COOKIE['image_random_value'])){
	
								$captchaStringEncr = $_COOKIE['image_random_value'];
	
								if($captchaStringEncr != md5(strtoupper($xyz_cfm_altVariable)) ){
									//$captchaFlagError = 1;
									$captchaErrorElementName = $elementName->element_name.'_'.$elementName->id;
								}
	
							}
						}
					}
				
					
				if(isset($_POST[$formButton->element_name])){
					if($elementName->element_type == 8){
						
						if($elementName->element_required == 1){
							if($_FILES[$elementName->element_name]['name'] == ""){
								$errorFlagMandatory = 1;
							}
						}
						
						if($_FILES[$elementName->element_name]['name'] != ""){

						$extension = strtolower(pathinfo($_FILES[$elementName->element_name]['name'], PATHINFO_EXTENSION));
						//pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
							
						$acceptablefileTypes = strtolower($elementName->file_type);


						$fileOptionsArray = xyz_trim_deep(explode(",", $acceptablefileTypes));
							

						if(((count($fileOptionsArray) > 0) && (in_array($extension, $fileOptionsArray))) || ($acceptablefileTypes == "") ){


							
							if($_FILES[$elementName->element_name]['name'] != ""){
							
								$uploadFileNameArray[] = $_FILES[$elementName->element_name]['name'];
								
							}

							$targetfolder = realpath(dirname(__FILE__) . '/../../')."/uploads";
							if (!is_file($targetfolder) && !is_dir($targetfolder)) {

								mkdir($targetfolder) or die("Could not create directory " . $targetfolder);
								chmod($targetfolder, 0777); //make it writable
							}
							$targetfolder = realpath(dirname(__FILE__) . '/../../')."/uploads/xyz_cfm_attachment_".$folderName."_".$formId;
							if (!is_file($targetfolder) && !is_dir($targetfolder)) {

								mkdir($targetfolder) or die("Could not create directory " . $targetfolder);
								chmod($targetfolder, 0777); //make it writable
							}

							move_uploaded_file($_FILES[$elementName->element_name]["tmp_name"],$targetfolder."/".$_FILES[$elementName->element_name]['name']);
						}else{
							if($elementName->element_required == 1){
								$fileTypeErrorFlag = 1;
							}
						}
					}
					}
				}

					
				if($elementName->element_type != 8 ){
					if($elementName->re_captcha != 1){
						if($elementName->element_required == 1){
							if($elementName->element_name !=""){
								if($_POST && $_POST[$elementName->element_name] == ""){
									$errorFlagMandatory = 1;
								}
							}
						}
					}
				}
				if($elementName->element_type == 2){
					$xyz_cfm_email = $_POST[$elementName->element_name];
					
					if($xyz_cfm_email != ""){
					$regex = '/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i';
						if (!preg_match($regex, $xyz_cfm_email)) {
								
							if(isset($_POST[$formButton->element_name])){
								$errorFlagEmail = 1;
								$emailErrorElementIdArray[] = $elementName->element_name.'_'.$elementName->id;
								
							}
							
						}
					}
				}
			}
		}
		}
		// 		if($_POST && count($uploadFileNameArray)>0){
// 		echo '<pre>';
// 		//print_r($uploadFileNameArray);
// 		print_r($_POST);
// 		die;
				//}
// echo "filetypeerrflag:".$fileTypeErrorFlag."<br/>";
// echo "manderr:".$errorFlagMandatory."<br/>";
// echo "emilflagerr:".$errorFlagEmail."<br/>";
// echo "form flag count:".$formFlagCount."<br/>";
// echo "capthaFlagettr:".$captchaFlagError."<br/>";
		if(isset($_POST['xyz_cfm_frmName']) && $_POST['xyz_cfm_frmName'] == $formAllData->name && isset($_POST[$formButton->element_name])
				&& ($fileTypeErrorFlag != 1) && ($errorFlagMandatory != 1) && ($errorFlagEmail != 1) && ($formFlagCount == 1)
				 && ($captchaFlagError != 1)){   


				
			$phpmailer = new PHPMailer();
			$phpmailer->CharSet=get_option('blog_charset');
			
			if(get_option('xyz_cfm_sendViaSmtp') == 1){

				if($formAllData->from_email_id == 0){
					$xyz_cfm_SmtpDetails = $wpdb->get_results( 'SELECT * FROM xyz_cfm_sender_email_address WHERE set_default ="1"') ;
				}else{
					$xyz_cfm_SmtpDetails = $wpdb->get_results( 'SELECT * FROM xyz_cfm_sender_email_address WHERE id="'.$formAllData->from_email_id.'"' ) ;
				}
				$xyz_cfm_SmtpDetails = $xyz_cfm_SmtpDetails[0];
				
				$phpmailer->IsSMTP();
				$phpmailer->Host = $xyz_cfm_SmtpDetails->host;
				$phpmailer->SMTPDebug = get_option('xyz_cfm_SmtpDebug');
				if($xyz_cfm_SmtpDetails->authentication=='true')
					$phpmailer->SMTPAuth = $xyz_cfm_SmtpDetails->authentication;
				$phpmailer->SMTPSecure = $xyz_cfm_SmtpDetails->security;
				$phpmailer->Port = $xyz_cfm_SmtpDetails->port;
				$phpmailer->Username = $xyz_cfm_SmtpDetails->user;
				$phpmailer->Password = $xyz_cfm_SmtpDetails->password;
				
				$phpmailer->From     = $xyz_cfm_SmtpDetails->user;
				$phpmailer->FromName = $formAllData->sender_name;
				//$phpmailerReply->SetFrom($formAllData->reply_sender_email,$formAllData->reply_sender_name);
				$phpmailer->AddReplyTo($xyz_cfm_SmtpDetails->user,$formAllData->sender_name);
				
			}else{
				
				$phpmailer->IsMail();
				
// 				$xyz_cfm_senderEmail = $formAllData->from_email;
				
				$phpmailer->From     = $xyz_cfm_senderEmail;
				$phpmailer->FromName = $xyz_cfm_senderName;
				//$phpmailer->SetFrom($xyz_cfm_senderEmail,$xyz_cfm_senderName); /* code changed */
				
				$phpmailer->AddReplyTo($xyz_cfm_senderEmail,$xyz_cfm_senderName);
				
			}
			$xyz_cfm_targetfolder = realpath(dirname(__FILE__) . '/../../')."/uploads/xyz_cfm_attachment_".$folderName."_".$formId."/";
			foreach ($uploadFileNameArray as $id => $idValue){

				$phpmailer->AddAttachment($xyz_cfm_targetfolder.$idValue);
					
			}
				

			$phpmailer->Subject = $mailSubject;

			if($formAllData->mail_type == 1){

				$phpmailer->MsgHTML($mailBody);

			}
			if($formAllData->mail_type == 2){

				$phpmailer->Body = $mailBody;

			}
			if($formAllData->cc_email != ""){
				$phpmailer->AddCC($formAllData->cc_email);
			}

			//echo "1st To:".$formAllData->to_email."<br/>";
			
			$phpmailer->AddAddress($formAllData->to_email);
			
			
				$sent = $phpmailer->Send();
			//$sent = TRUE;
			if($sent == TRUE){
				$xyz_cfm_mailSentFlag = 1;
				
				$msg_after_submit='<div	style="background: #C8FCBB; border: 1px solid green; text-align: center; -moz-border-radius: 15px; border-radius: 15px; margin-bottom: 20px;">
	Mail successfully sent.</div>';

			}else{
				
				$msg_after_submit='<div style="background: #FC8B91; border: 1px solid red; text-align: center; -moz-border-radius: 15px; border-radius: 15px; margin-bottom: 20px;">
Mail not sent, try again.</div>';
			}
				
			if($sent == FALSE) {
				//echo  "Mailer Error Mail: " .$phpmailer->ErrorInfo;

			} elseif(($sent == TRUE) && ($formAllData->enable_reply == 2) ) {
				$phpmailerReply = new PHPMailer();
				$phpmailerReply->CharSet=get_option('blog_charset');
				
				if(get_option('xyz_cfm_sendViaSmtp') == 1){
					
					
					
					if($formAllData->reply_sender_email_id == 0){
						$xyz_cfm_SmtpDetails = $wpdb->get_results( 'SELECT * FROM xyz_cfm_sender_email_address WHERE set_default ="1"') ;
					}else{
						$xyz_cfm_SmtpDetails = $wpdb->get_results( 'SELECT * FROM xyz_cfm_sender_email_address WHERE id="'.$formAllData->reply_sender_email_id.'"' ) ;
					}
					$xyz_cfm_SmtpDetails = $xyz_cfm_SmtpDetails[0];
					
					$phpmailerReply->IsSMTP();
					$phpmailerReply->Host = $xyz_cfm_SmtpDetails->host;
					$phpmailerReply->SMTPDebug = get_option('xyz_cfm_SmtpDebug');
					if($xyz_cfm_SmtpDetails->authentication=='true')
						$phpmailerReply->SMTPAuth = $xyz_cfm_SmtpDetails->authentication;
					$phpmailerReply->SMTPSecure = $xyz_cfm_SmtpDetails->security;
					$phpmailerReply->Port = $xyz_cfm_SmtpDetails->port;
					$phpmailerReply->Username = $xyz_cfm_SmtpDetails->user;
					$phpmailerReply->Password = $xyz_cfm_SmtpDetails->password;
					
					$phpmailerReply->From     = $xyz_cfm_SmtpDetails->user;
					$phpmailerReply->FromName = $formAllData->reply_sender_name;
					//$phpmailerReply->SetFrom($formAllData->reply_sender_email,$formAllData->reply_sender_name);
					$phpmailerReply->AddReplyTo($xyz_cfm_SmtpDetails->user,$formAllData->reply_sender_name);
					
					
				}else{
				
					$phpmailerReply->IsMail();
					
					if($formAllData->reply_sender_email != ""){
					
						$phpmailerReply->From     = $formAllData->reply_sender_email;
						$phpmailerReply->FromName = $formAllData->reply_sender_name;
						//$phpmailerReply->SetFrom($formAllData->reply_sender_email,$formAllData->reply_sender_name);
						$phpmailerReply->AddReplyTo($formAllData->reply_sender_email,$formAllData->reply_sender_name);
					
					}else{
					
						$phpmailerReply->From     = $formAllData->to_email;
						$phpmailerReply->FromName = $formAllData->reply_sender_name;
						//$phpmailerReply->SetFrom($formAllData->to_email,$formAllData->reply_sender_name);
						$phpmailerReply->AddReplyTo($formAllData->to_email,$formAllData->reply_sender_name);
					}
					
				}
					//echo $mailReplayToEmail;die;
							
						$phpmailerReply->Subject = $mailReplaySubject;
							
						if($formAllData->mail_type == 1){
								
							$phpmailerReply->MsgHTML($mailReplayBody);
								
						}
						if($formAllData->mail_type == 2){
								
							$phpmailerReply->Body = $mailReplayBody;
								
						}
						
						//echo "2nd To:".$mailReplayToEmail;die;
							
						$phpmailerReply->AddAddress($mailReplayToEmail);
						$sentReply = $phpmailerReply->Send();
						if($sentReply == FALSE) {
							//echo  "Mailer Error Reply: " .$phpmailer->ErrorInfo;
								
						}
				}
				
					
				if(count($uploadFileNameArray)>0 && $_POST){
						
					$xyz_cfm_dir = "uploads/xyz_cfm_attachment_".$folderName."_".$formId."/";
						
					$xyz_cfm_targetfolder = realpath(dirname(__FILE__) . '/../../')."/".$xyz_cfm_dir;
						
					foreach ($uploadFileNameArray as $id => $idValue){
						unlink($xyz_cfm_targetfolder.$idValue);
					}
					rmdir($xyz_cfm_targetfolder);
				}
				
				if($sent == TRUE){
					if($formAllData->redirection_link != ""){
						header("Location:".$formAllData->redirection_link);
						die;
					}
				}

			}

			if($errorFlagEmail == 1){
				foreach ($emailErrorElementIdArray as $key=>$value){
					?>
<script type="text/javascript">
				jQuery(document).ready(function() {
					jQuery("#<?php echo $value;?>").after('<span style="color:red;margin-left:5px;"><?php _e("Enter a valid email address", "contact-form-manager");?></span>');
				});
				</script>
<?php
				}
			}

			if($captchaFlagError == 1){
				if($captchaErrorElementName != ""){
				?>
<script type="text/javascript">
			jQuery(document).ready(function() {
				jQuery("#<?php echo $captchaErrorElementName;?>").after('<span style="color:red;margin-left:5px;"><?php _e("Image content not matched", "contact-form-manager");?></span>');
			});
			</script>
<?php 
				}else{
?>
					<script type="text/javascript">
			jQuery(document).ready(function() {
				jQuery("#xyz_cfm_reCaptcha_"<?php echo $xyz_cfm_reCaptchaId;?>).after('<span style="color:red;margin-left:5px;"><?php _e("Image content not matched", "contact-form-manager");?></span>');
			});
			</script>
					<?php 
				}
			}
			if($errorFlagMandatory == 1 && $_POST){
				$xyz_cfm_mandatoryError =  "<font color='red'>".__("Please fill all mandatory fields", "contact-form-manager")."</font><br/>";
			}
			if($fileTypeErrorFlag == 1 && $_POST){
				$xyz_cfm_fileError = "<font color='red'>".__("File format not accepted, please enter this format files : ".$acceptablefileTypes, "contact-form-manager")."</font><br/>";
			}
			

// 			$formDetails = $wpdb->get_results('SELECT * FROM xyz_cfm_form WHERE id="'.$formId.'"' );
// 			$formDetails = $formDetails[0];

			// 		echo '<pre>';
			// 		print_r($formDetails);
			// 		die;

		if($xyz_cfm_mailSentFlag == 0){	
			
			
			
			$messageBody = $formAllData->form_content;

			$scriptStart = '<script type="text/javascript">
			function xyz_cfm_'.$formId.'_check(){';
			$scriptClose = '}</script>';
			$res = preg_match_all("/\[(email|text|date|submit|textarea|dropdown|checkbox|radiobutton|file|captcha)[-][0-9]{1,11}\]/",$formAllData->form_content,$matches);
			if($res){
				foreach ($matches[0] as $key => $value){
						
					$elementId =  strstr($value, '-');
					$elementId = substr($elementId,1,-1);

					//echo  'SELECT * FROM xyz_cfm_form_elements WHERE form_id="'.$formId.'" AND id="'.$elementId.'"';die;


					$formElementDetails = $wpdb->get_results( 'SELECT * FROM xyz_cfm_form_elements WHERE form_id="'.$formId.'" AND id="'.$elementId.'"' );
					$formElementDetail = $formElementDetails[0];
						
					$xyz_cfm_name = esc_html($formElementDetail->element_name);
					$xyz_cfm_elementId = esc_html($formElementDetail->id);


					//echo $formElementDetail->element_type;die;


						
					if($formElementDetail->css_class != ""){
						$cssClass = esc_html($formElementDetail->css_class);
					}else{
						$cssClass = "";
					}
						
					if($formElementDetail->max_length != "0" || $formElementDetail->max_length != ""){
						$maxlength = abs(intval($formElementDetail->max_length));
						if($maxlength == "0"){
							$maxlength = '';
						}
					}else{
						$maxlength = "";
					}
						
					if($formElementDetail->default_value != ""){
						$defaultValue = esc_html($formElementDetail->default_value);
					}else{
						$defaultValue = "";
					}
						
					if($formElementDetail->cols != "0"){
						$cols = abs(intval($formElementDetail->cols));
					}else{
						$cols = "";
					}
						
					if($formElementDetail->rows != "0" || $formElementDetail->rows != ""){
						$rows = abs(intval($formElementDetail->rows));
					}else{
						$rows = "";
					}
						
					if($formElementDetail->options != ""){
						$options = esc_html($formElementDetail->options);

						$optionsList = explode(",",$options);

						if(substr($options,-1) == ","){
							array_pop($optionsList);
						}


					}else{
						$optionsList = "";
					}
						
					if($formElementDetail->file_size != "0" || $formElementDetail->file_size != ""){
						$fileSize = abs(intval($formElementDetail->file_size));
					}else{
						$fileSize = "";
					}
						
					if($formElementDetail->file_type != ""){
						$fileType = esc_html($formElementDetail->file_type);

						// 				if(substr($fileType,-1) == ","){
						// 					array_pop($fileTypeList);
						// 				}
					}else{
						$fileType = "";
					}
						
					if($formElementDetail->element_type == 1){
						$elementType = "text";
						$replace = '';
						//echo $formElementDetail->element_required;
						
						if($formElementDetail->element_required == 1){
							$script .= 'var xyz_cfm_name_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.' = document.getElementById("'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'").value;	
							if(xyz_cfm_name_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'.trim() == ""){
							alert("'.__("Fill text field", "contact-form-manager").'");
							return false;
						}';
						}
						
							
						if(isset($_POST[$xyz_cfm_name]) && $_POST[$xyz_cfm_name] != "" && $individualFormSubmitFlag==1){
								
							$replace = $replace.'<input class="'.$cssClass.'"  type="text" id="'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'" name="'.$xyz_cfm_name.'"  value="'.esc_html($_POST[$xyz_cfm_name]).'" maxlength="'.$maxlength.'">';

						}else{

							$replace = $replace.'<input class="'.$cssClass.'"  type="text" id="'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'" name="'.$xyz_cfm_name.'"  value="'.$defaultValue.'" maxlength="'.$maxlength.'">';

						}
						if((get_option('xyz_cfm_mandatory_sign')=="1") && ($formElementDetail->element_required == 1)){
							$replace = $replace.'<font color="red">*</font>';
						}
						$messageBody = str_replace("[".$elementType."-".$elementId."]",$replace,$messageBody);
					}
						
					if($formElementDetail->element_type == 2){
						$elementType = "email";
						$replace = '';
						$script .='var xyz_cfm_email_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.' = document.getElementById("'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'").value;
						if(xyz_cfm_email_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.' != ""){
						var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
						   if(reg.test(xyz_cfm_email_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.') == false) {
						      alert("'. __("Please provide a valid email address", "contact-form-manager").'");
						      return false;
						   }
						}';
						if($formElementDetail->element_required == 1){
							$script .='if(xyz_cfm_email_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'.trim() == ""){
							alert("'. __("Fill email field", "contact-form-manager").'");
							return false;
						}';
						}
						if(isset($_POST[$xyz_cfm_name]) && $_POST[$xyz_cfm_name] != "" && $individualFormSubmitFlag==1){
							$replace = $replace.'<input class="'.$cssClass.'"  type="text" id="'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'" name="'.$xyz_cfm_name.'"  value="'.esc_html($_POST[$xyz_cfm_name]).'" maxlength="'.$maxlength.'" >';
						}else{
							$replace = $replace.'<input class="'.$cssClass.'"  type="text" id="'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'" name="'.$xyz_cfm_name.'"  value="'.$defaultValue.'" maxlength="'.$maxlength.'" >';
						}
						if((get_option('xyz_cfm_mandatory_sign')=="1") && ($formElementDetail->element_required == 1)){
							$replace = $replace.'<font color="red">*</font>';
						}
						$messageBody = str_replace("[".$elementType."-".$elementId."]",$replace,$messageBody);
					}
						
					// 			echo '<pre>';
					// 			print_r($formElementDetail);
						
						
					if($formElementDetail->element_type == 3){
						$elementType = "textarea";
						$replace = '';
						if($formElementDetail->element_required == 1){
							$script .='var xyz_cfm_textArea_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.' = document.getElementById("'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'").value;
							if(xyz_cfm_textArea_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'.trim() == ""){
							alert("'.__("Fill textarea field", "contact-form-manager").'");
							return false;
						}';
						}
						if(isset($_POST[$xyz_cfm_name]) && $_POST[$xyz_cfm_name] != "" && $individualFormSubmitFlag==1){
							$replace = $replace.'<textarea class="'.$cssClass.'"  id="'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'" name="'.$xyz_cfm_name.'"   rows="'.$rows.'" cols="'.$cols.'">'.esc_textarea($_POST[$xyz_cfm_name]).'</textarea>';
						}else{
							$replace = $replace.'<textarea class="'.$cssClass.'"  id="'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'" name="'.$xyz_cfm_name.'"   rows="'.$rows.'" cols="'.$cols.'"></textarea>';
						}
						if((get_option('xyz_cfm_mandatory_sign')=="1") && ($formElementDetail->element_required == 1)){
							$replace = $replace.'<font color="red">*</font>';
						}
						$messageBody = str_replace("[".$elementType."-".$elementId."]",$replace,$messageBody);

					}
					if($formElementDetail->element_type == 4){
						$elementType = "dropdown";
						$replace = '';
						if($formElementDetail->element_required == 1){
							$script .= 'var name_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.' = document.getElementById("'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'").value;
							if(name_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.' == ""){
							alert("'.__("Select dropdown field", "contact-form-manager").'");
							return false;
						}';
						}

						$replace = $replace.'<select id="'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'" name="'.$xyz_cfm_name.'" class="'.$cssClass.'" >
						<option value="">Select</option>';

						foreach ($optionsList as $key=>$value){

							if(isset($_POST[$xyz_cfm_name]) && $_POST[$xyz_cfm_name] != "" && $individualFormSubmitFlag==1){
								if($_POST[$xyz_cfm_name] == $value){

									$replace = $replace.'<option selected="selected" value="'.$value.'">'.$value.'</option>';
								}else{
									$replace = $replace.'<option value="'.$value.'">'.$value.'</option>';
								}

							}else{
								$replace = $replace.'<option value="'.$value.'">'.$value.'</option>';
							}
						}

						$replace = $replace.'</select>';
						if((get_option('xyz_cfm_mandatory_sign')=="1") && ($formElementDetail->element_required == 1)){
							$replace = $replace.'<font color="red">*</font>';
						}
						$messageBody = str_replace("[".$elementType."-".$elementId."]",$replace,$messageBody);
					}
					if($formElementDetail->element_type == 5){
						
						
						
						
						
						$elementType = "date";
						$replace = '';
						if($formElementDetail->element_required == 1){
					
							$script .='var xyz_cfm_date_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.' = document.getElementById("'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'").value;
							if(xyz_cfm_date_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'.trim() == ""){
							alert("'. __("Fill date field", "contact-form-manager").'");
							return false;
						}';
						}
						$dateFlag = 1;
						$scriptInclude = '<script type="text/javascript" src="'.plugins_url("contact-form-manager/js/epoch_classes.js") .'"></script>';
					
						$scriptDate .= '<script type="text/javascript">
						var dp_cal;
						jQuery(document).ready(function() {
						jQuery("#'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'").click(function() {
						if(!window.dp_cal_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'){
						dp_cal_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'  = new Epoch("epoch_popup","popup",document.getElementById("'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'"));
					}
					dp_cal_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'.show();
					});
					});
					</script>';
					
					
						$styleDate = '<style>
						table.calendar {
						font-family: Helvetica, Arial, sans-serif;
						font-size: 0.8em;
						border-collapse: collapse;
						background-color: white;
						border: solid #999999 1px;
						background-color: white;
						width: 205px;
						text-align: center;
						-moz-user-select: none;
					}
					table.calendar input,table.calendar select {
					font-size: 10px;
					}
					table.calendar td {
					border: 0;
					font-size: 10px;
					text-align: center;
					}
					div.mainheading {
					margin: 2px;
					}
					table.caldayheading {
					border-collapse: collapse;
					cursor: pointer;
					empty-cells: show;
					margin: 0 6px 0 6px;
					}
					table.caldayheading td {
					border: solid #CCCCCC 1px;
					text-align: left;
					color: #0054E3;
					font-weight: bold;
					width: 22px;
					}
					table.caldayheading td.wkhead {
					border-right: double #CCCCCC 3px;
					}
					table.calcells {
					border-collapse: collapse;
					cursor: pointer;
					margin: 0 6px 0 6px;
					}
					table.calcells td {
					border: solid #CCCCCC 1px;
					vertical-align: top;
					text-align: left;
					font-weight: bold;
					width: 22px;
					height: 20px;
					}
					table.calcells td div {
					padding: 1px;
					margin: 0;
					}
					table.calcells td.wkhead {
					background-color: white;
					text-align: center;
					border-right: double #CCCCCC 3px;
					color: #0054E3;
					}
					table.calcells td.wkday {
					background-color: #7E7777;
					}
					table.calcells td.wkend {
					background-color: #7E7777;
					}
					table.calcells td.curdate {
					}
					table.calcells td.cell_selected {
					background-color: #99CCFF;
					color: black;
					}
					table.calcells td.notmnth {
					background-color: #FFFFFF;
					color: #CCCCCC;
					}
					table.calcells td.notallowed {
					background-color: white;
					color: #EEEEEE;
					font-style: italic;
					}
					table.calcells td.hover {
					background-color: #999999;
					}
					</style>';
					
						if(isset($_POST[$xyz_cfm_name]) && $_POST[$xyz_cfm_name] != "" && $individualFormSubmitFlag==1){
					
							$replace = $replace.'<input class="'.$cssClass.'"  type="text" id="'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'" name="'.$xyz_cfm_name.'"  value="'.esc_html($_POST[$xyz_cfm_name]).'" maxlength="'.$maxlength.'">';
					
						}else{
							$replace = $replace.'<input class="'.$cssClass.'"  type="text" id="'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'" name="'.$xyz_cfm_name.'"  value="'.$defaultValue.'" maxlength="'.$maxlength.'">';
						}
						if((get_option('xyz_cfm_mandatory_sign')=="1") && ($formElementDetail->element_required == 1)){
							$replace = $replace.'<font color="red">*</font>';
						}
						$messageBody = str_replace("[".$elementType."-".$elementId."]",$replace,$messageBody);
					}
					
					if($formElementDetail->element_type == 6){
						$elementType = "checkbox";
						$replace = '';
						if($formElementDetail->element_required == 1){
							$script .= '	//var form_'.$formId.' = document.getElementById("form_'.$formId.'").value;
							//if(!document.forms[form_'.$formId.'])
							//return;
							var objCheckBoxes = document.forms["form_'.$formId.'"].elements["'.$xyz_cfm_name.'"];
							if(objCheckBoxes==null)
							objCheckBoxes = document.forms["form_'.$formId.'"].elements["'.$xyz_cfm_name.'[]"];
							var countCheckBoxes = objCheckBoxes.length;
							//alert(countCheckBoxes);
							var total = 0;
							if(countCheckBoxes){
							for(var i = 0; i < countCheckBoxes; i++)
							if(objCheckBoxes[i].checked == true){
							total = total+1;
						}
						}else{
						if(objCheckBoxes.checked == true){
						total = total+1;
						}
						}
						if(total == 0){
						alert("'. __("Select atleast one checkbox", "contact-form-manager").'");
						return false;
						}';
						}
							
						foreach ($optionsList as $key=>$value){
							if(count($_POST[$xyz_cfm_name]) > 0){
								if (in_array($value, $_POST[$xyz_cfm_name])) {
									$replace = $replace.'<input checked="checked" type="checkbox" id="'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'" name="'.$xyz_cfm_name.'[]" value="'.$value.'" />'.$value;
								}else{
									$replace = $replace.'<input type="checkbox" id="'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'" name="'.$xyz_cfm_name.'[]" value="'.$value.'" />'.$value;
								}
							}else{
								$replace = $replace.'<input type="checkbox" id="'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'" name="'.$xyz_cfm_name.'[]" value="'.$value.'" />'.$value;
							}
						}
						if((get_option('xyz_cfm_mandatory_sign')=="1") && ($formElementDetail->element_required == 1)){
							$replace = $replace.'<font color="red">*</font>';
						}
						$messageBody = str_replace("[".$elementType."-".$elementId."]",$replace,$messageBody);
					}
					if($formElementDetail->element_type == 7){
						$elementType = "radiobutton";

						$replace = '';
						if($formElementDetail->element_required == 1){
							$script .= '	//var form_'.$formId.' = document.getElementById("form_'.$formId.'").value;
							//if(!document.forms[form_'.$formId.'])
							//return;
							var objRadio = document.forms["form_'.$formId.'"].elements["'.$xyz_cfm_name.'"];
							if(objRadio==null)
							objRadio = document.forms["form_'.$formId.'"].elements["'.$xyz_cfm_name.'[]"];
							var countRadio = objRadio.length;
							//alert(countRadio);
							var total = 0;
							if(countRadio){
							for(var i = 0; i < countRadio; i++)
							if(objRadio[i].checked == true){
							total = total+1;
						}
						}else{
						if(objCheckBoxes.checked == true){
						total = total+1;
						}
						}
						if(total == 0){
						alert("'. __("Select atleast one radio button", "contact-form-manager").'");
						return false;
						}';

						}

						foreach ($optionsList as $key=>$value){
							if(isset($_POST[$xyz_cfm_name]) && $_POST[$xyz_cfm_name] != "" && $individualFormSubmitFlag==1){
								if($_POST[$xyz_cfm_name] == $value){

									$replace = $replace.'<input checked="checked" type="radio" name="'.$xyz_cfm_name.'"  value="'.$value.'" />'. $value;
								}else{
									$replace = $replace.'<input type="radio" name="'.$xyz_cfm_name.'"  value="'.$value.'" />'. $value;
								}
							}else{
								$replace = $replace.'<input type="radio" name="'.$xyz_cfm_name.'"  value="'.$value.'" />'. $value;
							}
						}
						if((get_option('xyz_cfm_mandatory_sign')=="1") && ($formElementDetail->element_required == 1)){
							$replace = $replace.'<font color="red">*</font>';
						}
						$messageBody = str_replace("[".$elementType."-".$elementId."]",$replace,$messageBody);

					}
					if($formElementDetail->element_type == 8){
						$elementType = "file";
						$replace = '';
						if($formElementDetail->element_required == 1){
							$script .= 'var xyz_cfm_file_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.' = document.getElementById("'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'").value;
							if(xyz_cfm_file_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'.trim() == ""){
							alert("'. __("Upload a file", "contact-form-manager").'");
							return false;
						}';
						}

						$replace = $replace.'<input type="file" name="'.$xyz_cfm_name.'" id="'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'" accept="'.$fileType.'"  >';
						if((get_option('xyz_cfm_mandatory_sign')=="1") && ($formElementDetail->element_required == 1)){
							$replace = $replace.'<font color="red">*</font>';
						}
						$messageBody = str_replace("[".$elementType."-".$elementId."]",$replace,$messageBody);
					}
					if($formElementDetail->element_type == 9){
						$elementType = "submit";
						$replace = '';

						$replace = $replace.'<input  type="submit" name="'.$xyz_cfm_name.'" id="'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'" value="'.esc_html($formElementDetail->element_diplay_name).'"  >';
						$messageBody = str_replace("[".$elementType."-".$elementId."]",$replace,$messageBody);
					}
					if($formElementDetail->element_type == 10){
						$captchaFlag = 1;
						$elementType = "captcha";
						$replace = '';
						
						if($formElementDetail->re_captcha == 1){
							
 							$publickey = get_option('xyz_cfm_recaptcha_public_key');
 							//$replace = $replace.recaptcha_get_html($publickey); for php
							$replace = $replace.'<div id="reCaptchaDiv"></div>';
 							if(get_option('xyz_cfm_mandatory_sign')=="1")
								$replace .= '<font color="red">*</font>';
							$replace .= '<script type="text/javascript" src="http://www.google.com/recaptcha/api/js/recaptcha_ajax.js"></script>
							<script type="text/javascript"> 
								Recaptcha.create("'.$publickey.'","reCaptchaDiv", {theme: "'.$cssClass.'"});
							</script><input type="hidden" name="xyz_cfm_hiddenReCaptcha" value="1" id="xyz_cfm_reCaptcha_'.$xyz_cfm_elementId.'">';
							
							$messageBody = str_replace("[".$elementType."-".$elementId."]",$replace,$messageBody);
							
						}else{
						
						
						if($formElementDetail->element_required == 1){
							$script .= 'var xyz_cfm_captcha_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.' = document.getElementById("'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'").value;
							if(xyz_cfm_captcha_'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'.trim() == ""){
							alert("'. __("Fill captcha field", "contact-form-manager").'");
							return false;
						}';
							$scriptCaptcha = '<script type="text/javascript">
							function showcaptcha()
							{
							document.getElementById("captcha_div").innerHTML="<iframe style= margin-bottom:-17px;  src='.plugins_url("contact-form-manager/captcha/random.php").' marginheight=0 width=155 marginwidth=0 height=40 align=middle frameborder=0 scrolling=no  ></iframe>";
						}
						</script>';
						}
						$replace = $replace.'<input  class="'.$cssClass.'"  type="text" id="'.$xyz_cfm_name.'_'.$xyz_cfm_elementId.'" name="'.$xyz_cfm_name.'" >';
 							if(get_option('xyz_cfm_mandatory_sign')=="1")
								$replace .='<font color="red">*</font>';
						$replace .='<span id="captcha_div">
						<iframe style=" margin-bottom:-17px;" frameborder="0" align="middle" width="150" height="40" scrolling="no" marginwidth="0" marginheight="0" src="'.plugins_url("contact-form-manager/captcha/random.php").'" ></iframe>
						</span>
						<a href="javascript:void(0);" onClick="showcaptcha();" >
						<img  src="'.plugins_url("contact-form-manager/images/arrow-refresh.png").'"  align="middle" height="20px" style="margin-left: -25px;">
						</a>';

						$messageBody = str_replace("[".$elementType."-".$elementId."]",$replace,$messageBody);
						
						}
					}


				}
					
					

				if($captchaFlag ==1){
					$scriptStart = $scriptCaptcha.$scriptStart;
				}

				if($dateFlagFlag = 1){
					$scriptStart = $scriptInclude.$scriptDate.$styleDate.$scriptStart;
				}

						
				return $msg_after_submit.$scriptStart.$script.$scriptClose.$xyz_cfm_fileError.$xyz_cfm_mandatoryError.'<form name="form_'.$formId.'" method="POST" id="form_'.$formId.'" enctype="multipart/form-data" onSubmit="return xyz_cfm_'.$formId.'_check();">'.$messageBody.'<input type ="hidden" name="xyz_cfm_frmName" id="xyz_cfm_frmName" value="'.$formAllData->name.'" ></form>';
					
				
			}
		}
		else
			return $msg_after_submit;
	}
}



