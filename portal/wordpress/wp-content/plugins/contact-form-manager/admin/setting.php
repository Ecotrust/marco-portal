<?php
global $wpdb;

if($_POST){
	
$_POST = stripslashes_deep($_POST);
$_POST = xyz_trim_deep($_POST);

$xyz_cfm_SmtpFlag = 0;

if ($_POST['xyz_cfm_pagelimit']!= ""){
	
	$xyz_cfm_sendViaSmtp = $_POST['xyz_cfm_sendViaSmtp'];
	
	if($xyz_cfm_sendViaSmtp == 1){
		
		$checkSMTP = $wpdb->get_results("SELECT * FROM xyz_cfm_sender_email_address WHERE set_default='1'");
		if(count($checkSMTP) == 0){
			$xyz_cfm_SmtpFlag = 1;
		}
		
	}
	if($xyz_cfm_SmtpFlag != 1){

	$xyz_cfm_pagelimit = absint($_POST['xyz_cfm_pagelimit']);
	
	if ($xyz_cfm_pagelimit > 0 ){

			
			$xyz_cfm_filter = $_POST['xyz_cfm_filter'];
			$xyz_cfm_mandatory = $_POST['xyz_cfm_mandatory'];
			$xyz_cfm_credit = $_POST['xyz_cfm_credit'];
			
			$xyz_cfm_recaptchaPrivateKey = $_POST['xyz_cfm_recaptchaPrivateKey'];
			$xyz_cfm_recaptchaPublicKey = $_POST['xyz_cfm_recaptchaPublicKey'];
			
			$xyz_cfm_sendViaSmtp = $_POST['xyz_cfm_sendViaSmtp'];
			$xyz_cfm_SmtpDebug = $_POST['xyz_cfm_SmtpDebug'];

			update_option('xyz_cfm_paging_limit',$xyz_cfm_pagelimit);
			update_option('xyz_cfm_tinymce_filter',$xyz_cfm_filter);
			update_option('xyz_cfm_mandatory_sign',$xyz_cfm_mandatory);
			update_option('xyz_credit_link',$xyz_cfm_credit);
			
			update_option('xyz_cfm_recaptcha_private_key',$xyz_cfm_recaptchaPrivateKey);
			update_option('xyz_cfm_recaptcha_public_key',$xyz_cfm_recaptchaPublicKey);
			
			update_option('xyz_cfm_sendViaSmtp',$xyz_cfm_sendViaSmtp);
			update_option('xyz_cfm_SmtpDebug',$xyz_cfm_SmtpDebug);
?>


<div class="system_notice_area_style1" id="system_notice_area">
	Settings updated successfully. &nbsp;&nbsp;&nbsp;<span id="system_notice_area_dismiss">Dismiss</span>
</div>


<?php
	}else{
?>

	<div class="system_notice_area_style0" id="system_notice_area">
	Pagination limit must be a positive number. &nbsp;&nbsp;&nbsp;<span id="system_notice_area_dismiss">Dismiss</span>
</div>

<?php 
			}
	}else{
		?>
		<div class="system_notice_area_style0" id="system_notice_area">
		Please set a default SMTP account. &nbsp;&nbsp;&nbsp;<span id="system_notice_area_dismiss">Dismiss</span>
		</div>
		<?php
	}

	}else{
?>
<div class="system_notice_area_style0" id="system_notice_area">
	Please fill all mandatory fields. &nbsp;&nbsp;&nbsp;<span id="system_notice_area_dismiss">Dismiss</span>
</div>
<?php 
}
}
?>
<script type="text/javascript">

jQuery(document).ready(function() {

	jQuery('#xyz_cfm_settings').submit(function() {
		var pagingLimit = jQuery.trim(jQuery("#xyz_cfm_pagelimit").val());
		if(pagingLimit == "") {
        	alert("Please fill pagination limit field.");
            return false;
        }
	});
});


</script>
<div>

	<h2>Settings</h2>
	<form method="post" name="xyz_cfm_settings" id="xyz_cfm_settings">
	<div style="width: 100%">
	<fieldset style=" width:99%; border:1px solid #F7F7F7; padding:10px 0px;">
	<legend >General</legend>
	<table class="widefat"  style="width:99%;margin: 0 auto">
			<tr valign="top">
				<td scope="row" ><label for="xyz_cfm_filter">Tiny MCE filters to prevent auto removal of  &lt;br&gt; and &lt;p&gt; tags </label>
				</td>
				<td><select name="xyz_cfm_filter" id="xyz_cfm_filter">
						<option value="1"
						<?php if(isset($_POST['xyz_cfm_filter']) && $_POST['xyz_cfm_filter']=='1') { echo 'selected';}elseif(get_option('xyz_cfm_tinymce_filter')=="1"){echo 'selected';} ?>>Enable</option>
						<option value="0"
						<?php if(isset($_POST['xyz_cfm_filter']) && $_POST['xyz_cfm_filter']=='0') { echo 'selected';}elseif(get_option('xyz_cfm_tinymce_filter')=="0"){echo 'selected';} ?>>Disable</option>

				</select>
				</td>
			</tr>
			<tr valign="top">
				<td scope="row" ><label for="xyz_cfm_mandatory">Enable <font color="red">*</font>&nbsp;symbol for mandatory form fields</label>
				</td>
				<td><select name="xyz_cfm_mandatory" id="xyz_cfm_mandatory">
						<option value="1"
						<?php if(isset($_POST['xyz_cfm_mandatory']) && $_POST['xyz_cfm_mandatory']=='1') { echo 'selected';}elseif(get_option('xyz_cfm_mandatory_sign')=="1"){echo 'selected';} ?>>Enable</option>
						<option value="0"
						<?php if(isset($_POST['xyz_cfm_mandatory']) && $_POST['xyz_cfm_mandatory']=='0') { echo 'selected';}elseif(get_option('xyz_cfm_mandatory_sign')=="0"){echo 'selected';} ?>>Disable</option>

				</select>
				</td>
			</tr>
			<tr valign="top">
				<td scope="row" ><label for="xyz_cfm_credit">Credit link to author</label>
				</td>
				<td><select name="xyz_cfm_credit" id="xyz_cfm_credit">
						<option value="cfm"
						<?php if(isset($_POST['xyz_cfm_credit']) && $_POST['xyz_cfm_credit']=='cfm') { echo 'selected';}elseif(get_option('xyz_cfm_credit_link')=="cfm"){echo 'selected';} ?>>Enable</option>
						<option value="0"
						<?php if(isset($_POST['xyz_cfm_credit']) && $_POST['xyz_cfm_credit']!='cfm') { echo 'selected';}elseif(get_option('xyz_cfm_credit_link')!="cfm"){echo 'selected';} ?>>Disable</option>

				</select>
				</td>
			</tr>
			<tr valign="top">
				<td scope="row" ><label for="xyz_cfm_sendViaSmtp">Send via SMTP</label>
				</td>
				<td><select name="xyz_cfm_sendViaSmtp" id="xyz_cfm_sendViaSmtp">
						<option value="1"
						<?php if(isset($_POST['xyz_cfm_sendViaSmtp']) && $_POST['xyz_cfm_sendViaSmtp']=='1') { echo 'selected';}elseif(get_option('xyz_cfm_sendViaSmtp')=="1"){echo 'selected';} ?>>True</option>
						<option value="0"
						<?php if(isset($_POST['xyz_cfm_sendViaSmtp']) && $_POST['xyz_cfm_sendViaSmtp']=='0') { echo 'selected';}elseif(get_option('xyz_cfm_sendViaSmtp')=="0"){echo 'selected';} ?>>False</option>

				</select>
				</td>
			</tr>
			<tr valign="top">
				<td scope="row" ><label for="xyz_cfm_SmtpDebug">SMTP Debug</label>
				</td>
				<td><select name="xyz_cfm_SmtpDebug" id="xyz_cfm_SmtpDebug">
						<option value="1"
						<?php if(isset($_POST['xyz_cfm_SmtpDebug']) && $_POST['xyz_cfm_SmtpDebug']=='1') { echo 'selected';}elseif(get_option('xyz_cfm_SmtpDebug')=="1"){echo 'selected';} ?>>True</option>
						<option value="0"
						<?php if(isset($_POST['xyz_cfm_SmtpDebug']) && $_POST['xyz_cfm_SmtpDebug']=='0') { echo 'selected';}elseif(get_option('xyz_cfm_SmtpDebug')=="0"){echo 'selected';} ?>>False</option>

				</select>
				</td>
			</tr>
			<tr valign="top">
				<td scope="row" class=" settingInput" ><label for="xyz_cfm_pagelimit">Pagination limit</label>
				</td>
				<td ><input  name="xyz_cfm_pagelimit" type="text"
					id="xyz_cfm_pagelimit" value="<?php if(isset($_POST['xyz_cfm_pagelimit']) && $_POST['xyz_cfm_pagelimit'] != ""){echo $_POST['xyz_cfm_pagelimit'];}else{print(get_option('xyz_cfm_paging_limit'));} ?>" />
				</td>
			</tr>
			<tr valign="top">
				<td scope="row" class=" settingInput" ><label for="xyz_cfm_recaptchaPrivateKey">ReCaptcha Private Key</label>
				</td>
				<td ><input  name="xyz_cfm_recaptchaPrivateKey" type="text"
					id="xyz_cfm_recaptchaPrivateKey" value="<?php if(isset($_POST['xyz_cfm_recaptchaPrivateKey']) && $_POST['xyz_cfm_recaptchaPrivateKey'] != ""){echo $_POST['xyz_cfm_recaptchaPrivateKey'];}else{print(get_option('xyz_cfm_recaptcha_private_key'));} ?>" />
					&nbsp;&nbsp;&nbsp;<a target="_blank" href="https://www.google.com/recaptcha/admin">Get Private Key</a>
				</td>
			</tr>
			<tr valign="top">
				<td scope="row" class=" settingInput" ><label for="xyz_cfm_recaptchaPublicKey">ReCaptcha Public Key</label>
				</td>
				<td ><input  name="xyz_cfm_recaptchaPublicKey" type="text"
					id="xyz_cfm_recaptchaPublicKey" value="<?php if(isset($_POST['xyz_cfm_recaptchaPublicKey']) && $_POST['xyz_cfm_recaptchaPublicKey'] != ""){echo $_POST['xyz_cfm_recaptchaPublicKey'];}else{print(get_option('xyz_cfm_recaptcha_public_key'));} ?>" />
					&nbsp;&nbsp;&nbsp;<a target="_blank" href="https://www.google.com/recaptcha/admin" >Get Public Key</a>
				</td>
			</tr>
			<tr>
				<td colspan=2  style="text-align: center;" id="bottomBorderNone">
				<div style="height:50px;" id="bottomBorderNone"><input style="margin-left:-170px; margin-top:10px;"  class="button-primary" name="btnSubmit" type="submit" value=" Update Settings " /></div>
				
				</td>
			</tr>
			
	</table>
	</fieldset>
	</form>

</div>
