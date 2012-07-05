<?php

global $wpdb;
if($_POST){

$_POST=xyz_trim_deep($_POST);
$_POST = stripslashes_deep($_POST);

if (($_POST['xyz_cfm_SmtpHostName']!= "") && ($_POST['xyz_cfm_SmtpEmailAddress'] != "") && ($_POST['xyz_cfm_SmtpPassword'] != "") && 
		($_POST['xyz_cfm_SmtpPortNumber']!= "") && ($_POST['xyz_cfm_SmtpSecuirity']!= "")){
			
	
	
		if(is_email($_POST['xyz_cfm_SmtpEmailAddress'])){
			
			$xyz_cfm_SmtpAuthentication = $_POST['xyz_cfm_SmtpAuthentication'];
			$xyz_cfm_SmtpHostName = $_POST['xyz_cfm_SmtpHostName'];
			$xyz_cfm_SmtpEmailAddress = $_POST['xyz_cfm_SmtpEmailAddress'];
			$xyz_cfm_SmtpPassword = $_POST['xyz_cfm_SmtpPassword'];
			$xyz_cfm_SmtpPortNumber = $_POST['xyz_cfm_SmtpPortNumber'];
			$xyz_cfm_SmtpSecuirity = $_POST['xyz_cfm_SmtpSecuirity'];
			
			if($_POST['xyz_cfm_SmtpSetDefault'] == "on"){
				$xyz_cfm_SmtpSetDefault = 1;
				$wpdb->query('UPDATE xyz_cfm_sender_email_address SET set_default="0"');
			}else{
				$xyz_cfm_SmtpSetDefault = 0;
			}
			
			$xyz_cfm_smtpAccountCount = $wpdb->query( 'SELECT * FROM xyz_cfm_sender_email_address WHERE user="'.$xyz_cfm_SmtpEmailAddress.'"  LIMIT 0,1' ) ;
			if($xyz_cfm_smtpAccountCount == 0){
			
			$wpdb->insert('xyz_cfm_sender_email_address', 
			array('authentication'=>$xyz_cfm_SmtpAuthentication,'host'=>$xyz_cfm_SmtpHostName,'user'=>$xyz_cfm_SmtpEmailAddress,
			'password'=>$xyz_cfm_SmtpPassword,'port'=>$xyz_cfm_SmtpPortNumber,'security'=>$xyz_cfm_SmtpSecuirity,'set_default'=>$xyz_cfm_SmtpSetDefault,
			'status'=>1),array('%s','%s','%s','%s','%s','%s','%d','%d'));
			


?>


<div class="system_notice_area_style1" id="system_notice_area">
	SMTP account successfully added. &nbsp;&nbsp;&nbsp;<span id="system_notice_area_dismiss">Dismiss</span>
</div>


<?php

			}else{
				?>
				<div class="system_notice_area_style0" id="system_notice_area">
				Email address already exist. &nbsp;&nbsp;&nbsp;<span id="system_notice_area_dismiss">Dismiss</span>
				</div>
				<?php
			}
			
		}else{
?>
<div class="system_notice_area_style0" id="system_notice_area">
	Please enter a valid email. &nbsp;&nbsp;&nbsp;<span id="system_notice_area_dismiss">Dismiss</span>
</div>
<?php		
		}

}else{
?>
<div class="system_notice_area_style0" id="system_notice_area">
	Please fill all fields. &nbsp;&nbsp;&nbsp;<span id="system_notice_area_dismiss">Dismiss</span>
</div>
<?php 
}
}
?>



<div>
<h2>SMTP</h2>
	<form method="post">
	<div style="float: left;width: 99%">
	<fieldset style=" width:98%; border:1px solid #F7F7F7; padding:10px 0px 15px 10px;">
	<legend >Add Account</legend>
	<table class="widefat"  style="width:99%;">
			<tr valign="top">
				<td scope="row" class=" settingInput" ><label for="xyz_cfm_SmtpAuthentication">Authentication<font color="red">*</font> </label>
				</td>
				<td><select name="xyz_cfm_SmtpAuthentication" id="xyz_cfm_SmtpAuthentication">
						<option value="true"
						<?php if(isset($_POST['xyz_cfm_SmtpAuthentication']) && $_POST['xyz_cfm_SmtpAuthentication']=='true') { echo 'selected';}elseif(get_option('xyz_cfm_SmtpAuthentication')=="true"){echo 'selected';} ?>>True</option>
						<option value="false"
						<?php if(isset($_POST['xyz_cfm_SmtpAuthentication']) && $_POST['xyz_cfm_SmtpAuthentication']=='false') { echo 'selected';}elseif(get_option('xyz_cfm_SmtpAuthentication')=="false"){echo 'selected';} ?>>False</option>

				</select>
				</td>
			</tr>
			
			<tr valign="top">
				<td scope="row" class=" settingInput" ><label for="xyz_cfm_SmtpHostName">Host Name<font color="red">*</font> </label>
				</td>
				<td ><input  name="xyz_cfm_SmtpHostName" type="text"
					id="xyz_cfm_SmtpHostName" value="<?php if(isset($_POST['xyz_cfm_SmtpHostName']) ){echo esc_html($_POST['xyz_cfm_SmtpHostName']);}else{echo "localhost";} ?>" />
				</td>
			</tr>
			<tr valign="top">
				<td scope="row" class=" settingInput" ><label for="xyz_cfm_SmtpEmailAddress">Email Address<font color="red">*</font> </label>
				</td>
				<td ><input  name="xyz_cfm_SmtpEmailAddress" type="text"
					id="xyz_cfm_limit" value="<?php if(isset($_POST['xyz_cfm_SmtpEmailAddress']) ){echo esc_html($_POST['xyz_cfm_SmtpEmailAddress']);}?>" />
				</td>
			</tr>
			<tr valign="top">
				<td scope="row" class=" settingInput" ><label for="xyz_cfm_SmtpPassword">Password<font color="red">*</font> </label>
				</td>
				<td ><input  name="xyz_cfm_SmtpPassword" type="password"
					id="xyz_cfm_SmtpPassword" value="<?php if(isset($_POST['xyz_cfm_SmtpPassword']) ){echo esc_html($_POST['xyz_cfm_SmtpPassword']);}?>" />
				</td>
			</tr>
			<tr valign="top">
				<td scope="row" class=" settingInput" ><label for="xyz_cfm_SmtpPortNumber">Port Number<font color="red">*</font> </label>
				</td>
				<td ><input  name="xyz_cfm_SmtpPortNumber" type="text"
					id="xyz_cfm_SmtpPortNumber" value="<?php if(isset($_POST['xyz_cfm_SmtpPortNumber']) ){echo esc_html($_POST['xyz_cfm_SmtpPortNumber']);}?>" />
				</td>
			</tr>
			<tr valign="top">
				<td scope="row" class=" settingInput" ><label for="xyz_cfm_SmtpSecuirity">Security<font color="red">*</font> </label>
				</td>
				<td ><input  name="xyz_cfm_SmtpSecuirity" type="text"
					id="xyz_cfm_SmtpSecuirity" value="<?php if(isset($_POST['xyz_cfm_SmtpSecuirity']) ){echo esc_html($_POST['xyz_cfm_SmtpSecuirity']);}?>" />
				</td>
			</tr>
			<tr valign="top">
				<td scope="row" class=" settingInput" ><label for="xyz_cfm_SmtpSetDefault">Set as Default</label>
				</td>
				<td ><input  name="xyz_cfm_SmtpSetDefault" type="checkbox"
					id="xyz_cfm_SmtpSetDefault" <?php if(isset($_POST['xyz_cfm_SmtpSetDefault']) && $_POST['xyz_cfm_SmtpSetDefault']== "on" ){?>checked="checked"<?php }?>/>
				</td>
			</tr>
			<tr>
				<td scope="row" class=" settingInput" id="bottomBorderNone"></td>
				<td colspan=2 id="bottomBorderNone" >
				<div style="height:50px;"><input style="margin:10px 0 20px 0;" id="submit" class="button-primary bottonWidth" type="submit" value="Create" /></div>
				
				</td>
			</tr>
			
	</table>
	</fieldset>
</div>
</form>
</div>