<?php 
if(get_option('xyz_cfm_tinymce_filter')=="1"){
	require( dirname( __FILE__ ) . '/tinymce_filters.php' );
}
global $wpdb;
global $current_user;
get_currentuserinfo();


$_POST = stripslashes_deep($_POST);
$_GET = stripslashes_deep($_GET);

$_POST = xyz_trim_deep($_POST);

$xyz_cfm_formId = $_GET['formId'];

$xyz_cfm_code = '';
if(isset($_POST) && isset($_POST['addSubmit'])){

// 		echo '<pre>';
// 		print_r($_POST);
// 		die("JJJ");

	$xyz_cfm_formName = $_POST['formName'];
	$xyz_cfm_generatedCode = $_POST['generatedCode'];
	$xyz_cfm_to = $_POST['to'];
	
	$xyz_cfm_from_email_id = $_POST['xyz_cfm_senderEmailId'];//from email id

	$xyz_cfm_from_email = $_POST['from'];//from email address
	
	$xyz_cfm_subject = $_POST['subject'];
	
	$xyz_cfm_formId = $_POST['formId'];
	//$xyz_cfm_submitMode = $_POST['submitMode'];
	$xyz_cfm_submitMode = 2;
	$xyz_cfm_cc = $_POST['cc'];
	$xyz_cfm_mailType = $_POST['mailType'];
	if($xyz_cfm_mailType == 1){
		
		$xyz_cfm_mailBody = $_POST['mailBodyEditor'];
		
	}elseif($xyz_cfm_mailType == 2){
		
		$xyz_cfm_mailBody = $_POST['mailBodyPlainText'];
		
	}
	
	$xyz_cfm_subjectReplay = $_POST['subjectReplay'];
		
	$xyz_cfm_mailTypeReplay = $_POST['mailTypeReplay'];
	
	
	if($xyz_cfm_mailTypeReplay == 1){
		
		$xyz_cfm_mailBodyReplay = $_POST['mailBodyReplayEditor'];
		
	}elseif($xyz_cfm_mailTypeReplay == 2){
		
		$xyz_cfm_mailBodyReplay = $_POST['mailBodyReplayPlainText'];
		
	}

	$xyz_cfm_senderName = $_POST['senderName'];
	$xyz_cfm_replaySenderName = $_POST['replaySenderName'];
	
	$xyz_cfm_replaySenderEmailId = $_POST['xyz_cfm_replaySenderEmailId'];//reply email id
	
	$xyz_cfm_replaySenderEmail = $_POST['replaySenderEmail'];//freply email address
	
	$xyz_cfm_enableReply = $_POST['enableReply'];
	
	$xyz_cfm_toEmailReply = $_POST['toEmailReply'];
	
	$xyz_cfm_redirectionLink = $_POST['redirectionLink'];
	

	if($xyz_cfm_toEmailReply != "" && $xyz_cfm_formName != "" && 
			$xyz_cfm_generatedCode != "" && $xyz_cfm_to != "" && ($xyz_cfm_from_email != "" || $xyz_cfm_from_email_id != "") &&
			 $xyz_cfm_subject != "" && $xyz_cfm_mailBody != "" && $xyz_cfm_subjectReplay != "" && $xyz_cfm_mailBodyReplay != ""){
		
		$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form WHERE id!="'.$xyz_cfm_formId.'" AND name="'.$xyz_cfm_formName.'" LIMIT 0,1' ) ;
		if($element_count == 0){
			
			if(get_option('xyz_cfm_sendViaSmtp') == 1){
			
				$wpdb->update('xyz_cfm_form',
				array('name'=>$xyz_cfm_formName,'status'=>'1','form_content'=>$xyz_cfm_generatedCode,'submit_mode'=>$xyz_cfm_submitMode,
				'to_email'=>$xyz_cfm_to,'from_email_id'=>$xyz_cfm_from_email_id,'sender_name'=>$xyz_cfm_senderName,'reply_sender_name'=>$xyz_cfm_replaySenderName,'reply_sender_email_id'=>$xyz_cfm_replaySenderEmailId,'cc_email'=>$xyz_cfm_cc,
				'mail_type'=>$xyz_cfm_mailType,'mail_subject'=>$xyz_cfm_subject,'mail_body'=>$xyz_cfm_mailBody,'to_email_reply'=>$xyz_cfm_toEmailReply,'reply_subject'=>$xyz_cfm_subjectReplay,
				'reply_body'=>$xyz_cfm_mailBodyReplay,'reply_mail_type'=>$xyz_cfm_mailTypeReplay,'enable_reply'=>$xyz_cfm_enableReply,'redirection_link'=>$xyz_cfm_redirectionLink),array('id'=>$xyz_cfm_formId));
				
			}else{
				$wpdb->update('xyz_cfm_form',array('name'=>$xyz_cfm_formName,'status'=>'1','form_content'=>$xyz_cfm_generatedCode,
				'submit_mode'=>$xyz_cfm_submitMode,'to_email'=>$xyz_cfm_to,'from_email'=>$xyz_cfm_from_email,'sender_name'=>$xyz_cfm_senderName,
				'reply_sender_name'=>$xyz_cfm_replaySenderName,'reply_sender_email'=>$xyz_cfm_replaySenderEmail,'cc_email'=>$xyz_cfm_cc,
				'mail_type'=>$xyz_cfm_mailType,'mail_subject'=>$xyz_cfm_subject,'mail_body'=>$xyz_cfm_mailBody,'to_email_reply'=>$xyz_cfm_toEmailReply,
				'reply_subject'=>$xyz_cfm_subjectReplay,'reply_body'=>$xyz_cfm_mailBodyReplay,'reply_mail_type'=>$xyz_cfm_mailTypeReplay,
				'enable_reply'=>$xyz_cfm_enableReply,'redirection_link'=>$xyz_cfm_redirectionLink),array('id'=>$xyz_cfm_formId));
			}
				
			?>
			<div class="system_notice_area_style1" id="system_notice_area">
			Contact form successfully updated. &nbsp;&nbsp;&nbsp;<span id="system_notice_area_dismiss">Dismiss</span>
			</div>
			<?php
	
		}else{
			$currentCode = $wpdb->get_results( 'SELECT * FROM xyz_cfm_form WHERE element_diplay_name="'.$xyz_cfm_formName.'" LIMIT 0,1' ) ;
			$currentCode = $currentCode[0];
			
			?>
			<div class="system_notice_area_style0" id="system_notice_area">
			Contact form already exists. &nbsp;&nbsp;&nbsp;<span id="system_notice_area_dismiss">Dismiss</span>
			</div>
			<?php	
	
		}
	
	}else{
?>		
		<div class="system_notice_area_style0" id="system_notice_area">
			Fill all mandatory fields. &nbsp;&nbsp;&nbsp;<span id="system_notice_area_dismiss">Dismiss</span>
		</div>
<?php 
	}

}

?>
<script>



jQuery(document).ready(function() {
	jQuery("#progressSelectImage").hide();
	jQuery("#progressEditImage").hide();

	jQuery('.xyz_cfm_NoEnterSubmit').keypress(function(e){
		
		if ( e.which == 13 ) return false;
	});
	jQuery("#reCaptchaStyle").hide();
	jQuery("#reCaptcha").bind('change', function () {
		 if (jQuery(this).is(':checked')){
			jQuery("#elementName10").val("");
			jQuery("#reCaptchaStyle").show();
			jQuery("#captchaStyle").hide();
			
		 }else{
			jQuery("#reCaptchaStyle").hide();
			jQuery("#captchaStyle").show();
			jQuery("#className10").val("");
		 }

	});

	addNewElementFlag = 0;
	

	var formId = jQuery("#formId").val();
	var dataString = '&formId='+<?php echo $xyz_cfm_formId;?>;
	//alert(dataString);
	jQuery.ajax
	({
	type: "POST",
	url: "<?php echo plugins_url('contact-form-manager/admin/ajax-load-elements.php') ?>",
	data: dataString,
	cache: false,
	success: function(html)
	{	
		jQuery("#progressEditImage").hide();
		jQuery("#elementSettingResult").html(html);
	}
	});
	
	

	jQuery('#element').val(0);	
	
	jQuery("#textField").hide();
	jQuery("#emailField").hide();
	jQuery("#textArea").hide();
	jQuery("#dropDownMenu").hide();
	jQuery("#dateField").hide();
	jQuery("#checkBoxes").hide();
	jQuery("#radioButtons").hide();
	jQuery("#fileUpload").hide();
	jQuery("#submitButton").hide();
	jQuery("#captcha").hide();




	jQuery('#frmmainForm').submit(function() {
		var formName = jQuery.trim(jQuery("#formName").val());
		var generatedCode = jQuery("#generatedCode").val();
		var to = jQuery.trim(jQuery("#to").val());

		var from = jQuery.trim(jQuery("#from").val());
		if(from == ''){

			from = jQuery("#xyz_cfm_senderEmailId").val();
			
		}
		
		
		var subject = jQuery.trim(jQuery("#subject").val());
		var mailType = jQuery("#mailType").val();
		if(mailType == 1){

			var mailBody = jQuery.trim(jQuery("#mailBodyEditor").val());
			
		}else if(mailType == 2){

			var mailBody = jQuery.trim(jQuery("#mailBodyPlainText").val());
			
		}
		

		var subjectReplay = jQuery.trim(jQuery("#subjectReplay").val());
		var mailTypeReplay = jQuery("#mailTypeReplay").val();

		if(mailTypeReplay == 1){

			var mailBodyReplay = jQuery.trim(jQuery("#mailBodyReplayEditor").val());
			
		}
		if(mailTypeReplay == 2){
			
			var mailBodyReplay = jQuery.trim(jQuery("#mailBodyReplayPlainText").val());
			
		}
		
		
		var formId = jQuery("#formId").val();
		var submitMode = jQuery("#submitMode").val();
		var cc = jQuery("#cc").val();

		var senderName = jQuery("#senderName").val();
		var replaySenderName = jQuery("#replaySenderName").val();

		var replaySenderEmail = '';
		
		if(jQuery("#xyz_cfm_replaySenderEmailId").val() == ''){
		
			replaySenderEmail = jQuery("#replaySenderEmail").val();
			if(replaySenderEmail != ""){

	        	if(!emailReg.test(replaySenderEmail)) {
		        	alert('Enter a valid  email address.');
		            return false;
		        }

	        }
			
		}else{
			replaySenderEmail = jQuery("#xyz_cfm_replaySenderEmailId").val();
		}

		var toEmailReply = jQuery("#toEmailReply").val();

		
		if(toEmailReply != "" && formName != "" && generatedCode != "" && to != "" && from != "" && subject != "" && 
				mailBody != "" && subjectReplay != "" && mailBodyReplay != ""){

			var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
			 
	        if(!emailReg.test(to)) {
	        	alert('Enter a valid "To" email address.');
	            return false;
	        }else{

		        if(cc != ""){

		        	if(!emailReg.test(cc)) {
		        		alert('Enter a valid "CC"  email address.');
			            return false;
			        }

		        }

		        
		        
	        }
			
		}else{
			alert("Please fill all mandatory fields.");
			return false;
		}
		
	});


	

	jQuery('#close1').click(function() {
		jQuery("#textField").hide();
		jQuery('#element').val(0);
	});
	jQuery('#close2').click(function() {
		jQuery("#emailField").hide();
		jQuery('#element').val(0);
	});
	jQuery('#close3').click(function() {
		jQuery("#textArea").hide();
		jQuery('#element').val(0);
	});
	jQuery('#close4').click(function() {
		jQuery("#dropDownMenu").hide();
		jQuery('#element').val(0);
	});
	jQuery('#close5').click(function() {
		jQuery("#dateField").hide();
		jQuery('#element').val(0);
	});
	jQuery('#close6').click(function() {
		jQuery("#checkBoxes").hide();
		jQuery('#element').val(0);
	});
	jQuery('#close7').click(function() {
		jQuery("#radioButtons").hide();
		jQuery('#element').val(0);
	});
	jQuery('#close8').click(function() {
		jQuery("#fileUpload").hide();
		jQuery('#element').val(0);
	});
	jQuery('#close9').click(function() {
		jQuery("#submitButton").hide();
		jQuery('#element').val(0);	
	});			
	jQuery('#close10').click(function() {
		jQuery("#captcha").hide();
		jQuery('#element').val(0);	
	});	
	
	

	jQuery('#element').change(function() {


		jQuery("#selectElementContainer").find(':input').each(function() {
	        switch(this.type) {
	            case 'text':
	            case 'textarea':
	                jQuery(this).attr('value', '');
	                
	                break;
	            case 'checkbox':
	                this.checked = false;
	        }
	    });
		
		jQuery("#textFieldResult").empty();
		jQuery("#emailFieldResult").empty();
		jQuery("#textAreaResult").empty();
		jQuery("#dropDownMenuResult").empty();
		jQuery("#dateFieldResult").empty();
		jQuery("#checkBoxesResult").empty();
		jQuery("#radioButtonsResult").empty();
		jQuery("#fileUploadResult").empty();
		jQuery("#submitButtonResult").empty();
		jQuery("#captchaResult").empty();
		
			


		
		var selectId = jQuery(this).val();
		
		if(selectId == 1){
			jQuery("#textField").show();
		}else{
			jQuery("#textField").hide();
		}
		if(selectId == 2){
			jQuery("#emailField").show();
		}else{
			jQuery("#emailField").hide();
		}
		if(selectId == 3){
			jQuery("#textArea").show();
		}else{
			jQuery("#textArea").hide();
		}
		if(selectId == 4){
			jQuery("#dropDownMenu").show();
		}else{
			jQuery("#dropDownMenu").hide();
		}
		if(selectId == 5){
			jQuery("#dateField").show();
		}else{
			jQuery("#dateField").hide();
		}
		if(selectId == 6){
			jQuery("#checkBoxes").show();
		}else{
			jQuery("#checkBoxes").hide();
		}
		if(selectId == 7){
			jQuery("#radioButtons").show();
		}else{
			jQuery("#radioButtons").hide();
		}
		if(selectId == 8){
			jQuery("#fileUpload").show();
		}else{
			jQuery("#fileUpload").hide();
		}
		if(selectId == 9){
			jQuery("#submitButton").show();
		}else{
			jQuery("#submitButton").hide();
		}
		if(selectId == 10){
			jQuery("#captcha").show();
		}else{
			jQuery("#captcha").hide();
		}
		
	});

	
	jQuery('#textFieldButton1').click(function() {

		var selectId = 1;
		var dataString = 'id='+ selectId;
		var required ='';
		
		if(jQuery('#required1').attr('checked')){
			required = 1;
		}else{
			required = 0;
		}

		var elementName = jQuery.trim(jQuery("#elementName1").val());
		var className = jQuery("#className1").val();
		var maxlength = jQuery("#maxlength1").val();
		var defaultValue = jQuery("#defaultValue1").val();
		var formId = jQuery("#formId").val();
		
		if(elementName != ""){
			jQuery("#progressSelectImage").show();
		
		dataString = dataString + '&required='+ required+'&elementName='+elementName+'&className='+className+'&maxlength='+maxlength+'&defaultValue='+defaultValue+'&formId='+formId;

		jQuery.ajax
		({
		type: "POST",
		url: "<?php echo plugins_url('contact-form-manager/admin/ajax-insert-element.php') ?>",
		data: dataString,
		cache: false,
		success: function(html)
		{	
			jQuery("#progressSelectImage").hide();
			jQuery("#textFieldResult").html(html);
			addNewElementFlag = 1;
		}
		});
		
		}else{
			alert("Please fill all mandatory fields.");
			return false;
		}
		
	});



	jQuery('#textFieldButton2').click(function() {

		var selectId = 2;
		var dataString = 'id='+ selectId;
		var required ='';
		
		if(jQuery('#required2').attr('checked')){
			required = 1;
		}else{
			required = 0;
		}

		var elementName = jQuery.trim(jQuery("#elementName2").val());
		var className = jQuery("#className2").val();
		var maxlength = jQuery("#maxlength2").val();
		var defaultValue = jQuery("#defaultValue2").val();
		var formId = jQuery("#formId").val();

		if(elementName != ""){
			jQuery("#progressSelectImage").show();
		dataString = dataString + '&required='+ required+'&elementName='+elementName+'&className='+className+'&maxlength='+maxlength+'&defaultValue='+defaultValue+'&formId='+formId;


		//alert(dataString);
		jQuery.ajax
		({
		type: "POST",
		url: "<?php echo plugins_url('contact-form-manager/admin/ajax-insert-element.php') ?>",
		data: dataString,
		cache: false,
		success: function(html)
		{	
			jQuery("#progressSelectImage").hide();
			jQuery("#emailFieldResult").html(html);
			addNewElementFlag = 1;
		}
		});

		
		}else{
			alert("Please fill all mandatory fields.");
			return false;
		}
		
	});


	jQuery('#textFieldButton3').click(function() {

		var selectId = 3;
		var dataString = 'id='+ selectId;
		var required ='';
		
		if(jQuery('#required3').attr('checked')){
			required = 1;
		}else{
			required = 0;
		}

		var elementName = jQuery.trim(jQuery("#elementName3").val());
		var className = jQuery("#className3").val();
		var collength = jQuery("#colLength3").val();
		var rowlength = jQuery("#rowLength3").val();
		var defaultValue = jQuery("#defaultValue3").val();
		var formId = jQuery("#formId").val();

		if(elementName != ""){
			jQuery("#progressSelectImage").show();
		dataString = dataString + '&required='+ required+'&elementName='+elementName+'&className='+className+'&collength='+collength+'&rowlength='+rowlength+'&defaultValue='+defaultValue+'&formId='+formId;


		//alert(dataString);
		jQuery.ajax
		({
		type: "POST",
		url: "<?php echo plugins_url('contact-form-manager/admin/ajax-insert-element.php') ?>",
		data: dataString,
		cache: false,
		success: function(html)
		{	
			jQuery("#progressSelectImage").hide();
			jQuery("#textAreaResult").html(html);
			addNewElementFlag = 1;
		}
		});

		
		}else{
			alert("Please fill all mandatory fields.");
			return false;
		}
		
	});

	jQuery('#textFieldButton4').click(function() {

		var selectId = 4;
		var dataString = 'id='+ selectId;
		var required ='';
		
		if(jQuery('#required4').attr('checked')){
			required = 1;
		}else{
			required = 0;
		}

		var elementName = jQuery.trim(jQuery("#elementName4").val());
		var className = jQuery("#className4").val();
		var options = jQuery.trim(jQuery("#dropDownOptions4").val());
		var formId = jQuery("#formId").val();

		if(elementName != "" && options != ""){
			jQuery("#progressSelectImage").show();
		dataString = dataString + '&required='+ required+'&elementName='+elementName+'&className='+className+'&options='+options+'&formId='+formId;


		//alert(dataString);
		jQuery.ajax
		({
		type: "POST",
		url: "<?php echo plugins_url('contact-form-manager/admin/ajax-insert-element.php') ?>",
		data: dataString,
		cache: false,
		success: function(html)
		{	
			jQuery("#progressSelectImage").hide();
			jQuery("#dropDownMenuResult").html(html);
			addNewElementFlag = 1;
		}
		});

		
		}else{
			alert("Please fill all mandatory fields.");
			return false;
		}
		
	});

	jQuery('#textFieldButton5').click(function() {

		var selectId = 5;
		var dataString = 'id='+ selectId;
		var required ='';
		
		if(jQuery('#required5').attr('checked')){
			required = 1;
		}else{
			required = 0;
		}

		var elementName = jQuery.trim(jQuery("#elementName5").val());
		var className = jQuery("#className5").val();
		var formId = jQuery("#formId").val();

		if(elementName != "" ){
			jQuery("#progressSelectImage").show();
		dataString = dataString + '&required='+ required+'&elementName='+elementName+'&className='+className+'&formId='+formId;


		//alert(dataString);
		jQuery.ajax
		({
		type: "POST",
		url: "<?php echo plugins_url('contact-form-manager/admin/ajax-insert-element.php') ?>",
		data: dataString,
		cache: false,
		success: function(html)
		{	
			jQuery("#progressSelectImage").hide();
			jQuery("#dateFieldResult").html(html);
			addNewElementFlag = 1;
		}
		});

		
		}else{
			alert("Please fill all mandatory fields.");
			return false;
		}
		
	});
	
	
	jQuery('#textFieldButton6').click(function() {

		var selectId = 6;
		var dataString = 'id='+ selectId;
		var required ='';
		
		if(jQuery('#required6').attr('checked')){
			required = 1;
		}else{
			required = 0;
		}

		var elementName = jQuery.trim(jQuery("#elementName6").val());
		var className = jQuery("#className6").val();
		var options = jQuery.trim(jQuery("#checkBoxOptions6").val());
		var formId = jQuery("#formId").val();

		if(elementName != "" && options != ""){
			jQuery("#progressSelectImage").show();
		dataString = dataString + '&required='+ required+'&elementName='+elementName+'&className='+className+'&options='+options+'&formId='+formId;


		//alert(dataString);
		jQuery.ajax
		({
		type: "POST",
		url: "<?php echo plugins_url('contact-form-manager/admin/ajax-insert-element.php') ?>",
		data: dataString,
		cache: false,
		success: function(html)
		{	
			jQuery("#progressSelectImage").hide();
			jQuery("#checkBoxesResult").html(html);
			addNewElementFlag = 1;
		}
		});

		
		}else{
			alert("Please fill all mandatory fields.");
			return false;
		}
		
	});	

	jQuery('#textFieldButton7').click(function() {

		var selectId = 7;
		var dataString = 'id='+ selectId;
		var required ='';
		
		if(jQuery('#required7').attr('checked')){
			required = 1;
		}else{
			required = 0;
		}

		var elementName = jQuery.trim(jQuery("#elementName7").val());
		var className = jQuery("#className7").val();
		var options = jQuery.trim(jQuery("#radioOptions7").val());
		var formId = jQuery("#formId").val();

		if(elementName != "" && options != ""){
			jQuery("#progressSelectImage").show();
		dataString = dataString + '&required='+ required+'&elementName='+elementName+'&className='+className+'&options='+options+'&formId='+formId;


		//alert(dataString);
		jQuery.ajax
		({
		type: "POST",
		url: "<?php echo plugins_url('contact-form-manager/admin/ajax-insert-element.php') ?>",
		data: dataString,
		cache: false,
		success: function(html)
		{	
			jQuery("#progressSelectImage").hide();
			jQuery("#radioButtonsResult").html(html);
			addNewElementFlag = 1;
		}
		});

		
		}else{
			alert("Please fill all mandatory fields.");
			return false;
		}
		
	});

	jQuery('#textFieldButton8').click(function() {

		var selectId = 8;
		var dataString = 'id='+ selectId;
		var required ='';
		
		if(jQuery('#required8').attr('checked')){
			required = 1;
		}else{
			required = 0;
		}

		var elementName = jQuery.trim(jQuery("#elementName8").val());
		var className = jQuery("#className8").val();
		var fileSize = jQuery("#fileSize8").val();
		var fileType = jQuery("#fileType8").val();
		var formId = jQuery("#formId").val();

		if(elementName != ""){
			jQuery("#progressSelectImage").show();
		dataString = dataString + '&required='+ required+'&elementName='+elementName+'&className='+className+'&fileSize='+fileSize+'&fileType='+fileType+'&formId='+formId;


		//alert(dataString);
		jQuery.ajax
		({
		type: "POST",
		url: "<?php echo plugins_url('contact-form-manager/admin/ajax-insert-element.php') ?>",
		data: dataString,
		cache: false,
		success: function(html)
		{	
			jQuery("#progressSelectImage").hide();
			jQuery("#fileUploadResult").html(html);
			addNewElementFlag = 1;
		}
		});

		
		}else{
			alert("Please fill all mandatory fields.");
			return false;
		}
		
	});

	jQuery('#textFieldButton9').click(function() {

		var selectId = 9;
		var dataString = 'id='+ selectId;

		var displayName = jQuery.trim(jQuery("#displayName9").val());
		var elementName = jQuery.trim(jQuery("#elementName9").val());
		var className = jQuery("#className9").val();
		var formId = jQuery("#formId").val();

		if(displayName != "" && elementName != ""){
			jQuery("#progressSelectImage").show();
		dataString = dataString +'&displayName='+displayName+'&elementName='+elementName+'&className='+className+'&formId='+formId;


		//alert(dataString);
		jQuery.ajax
		({
		type: "POST",
		url: "<?php echo plugins_url('contact-form-manager/admin/ajax-insert-element.php') ?>",
		data: dataString,
		cache: false,
		success: function(html)
		{	
			jQuery("#progressSelectImage").hide();
			jQuery("#submitButtonResult").html(html);
			addNewElementFlag = 1;
		}
		});

		
		}else{
			alert("Please fill all mandatory fields.");
			return false;
		}
		
	});				

	jQuery('#textFieldButton10').click(function() {
		var selectId = 10;
		var dataString = 'id='+ selectId;
		

		var elementName = jQuery.trim(jQuery("#elementName10").val());
		
		var formId = jQuery("#formId").val();

		var reCaptcha = jQuery("#reCaptcha").val();

		if(jQuery('#reCaptcha').attr('checked')){
			if(elementName != ""){
				jQuery("#progressSelectImage").show();

				var className = jQuery("#reCaptchaStyleOption").val();
				
				dataString = dataString +'&elementName='+elementName+'&className='+className+'&formId='+formId+'&reCaptcha='+1;
				
				jQuery.ajax
				({
				type: "POST",
				url: "<?php echo plugins_url('contact-form-manager/admin/ajax-insert-element.php') ?>",
				data: dataString,
				cache: false,
				success: function(html)
				{	
					jQuery("#progressSelectImage").hide();
					jQuery("#captchaResult").html(html);
					addNewElementFlag = 1;
				}
				});
			}else{
				alert("Please fill all mandatory fields.");
				return false;
			}

		}else{

			if(elementName != ""){
				jQuery("#progressSelectImage").show();

				var className = jQuery("#className10").val();
				
				dataString = dataString +'&elementName='+elementName+'&className='+className+'&formId='+formId+'&reCaptcha='+0;
		
				//alert(dataString);
				jQuery.ajax
				({
				type: "POST",
				url: "<?php echo plugins_url('contact-form-manager/admin/ajax-insert-element.php') ?>",
				data: dataString,
				cache: false,
				success: function(html)
				{	
					jQuery("#progressSelectImage").hide();
					jQuery("#captchaResult").html(html);
					addNewElementFlag = 1;
				}
				});
		
				
			}else{
				alert("Please fill all mandatory fields.");
				return false;
			}
		}
		
	});				


	jQuery("#editDiv").hide();
	jQuery("#selectDiv").show();
	jQuery("#selectElement").css("font-weight","bold");
	jQuery("#selectDiv").css("border-bottom","1px solid #FFFFFF");
	jQuery("#selectDiv").css("background-color","#FFFFFF");
	jQuery("#selectElement").css("background-color","#FFFFFF");
	jQuery("#editElement").css("border-bottom","1px solid #F1F1F1");
	jQuery("#selectElement").css("border-bottom","1px solid #FFFFFF");


	jQuery("#selectElement").click(function(){

		jQuery("#selectElement").css("font-weight","bold");
		jQuery("#editElement").css("font-weight","normal");
		jQuery("#editElement").css("background-color","#F9F9F9");
		jQuery("#selectElement").css("background-color","#FFFFFF");
		jQuery("#selectElement").css("border-bottom","1px solid #FFFFFF");
		jQuery("#editElement").css("border-bottom","1px solid #F1F1F1");
		
		jQuery("#editDiv").hide();
		jQuery("#selectDiv").show();
		jQuery('#xyz_cfm_elementSetting').val(0);
		jQuery("#textFieldUpdate").hide();
		jQuery("#emailFieldUpdate").hide();
		jQuery("#textAreaUpdate").hide();
		jQuery("#dropDownMenuUpdate").hide();
		jQuery("#dateFieldUpdate").hide();
		jQuery("#checkBoxesUpdate").hide();
		jQuery("#radioButtonsUpdate").hide();
		jQuery("#fileUploadUpdate").hide();
		jQuery("#submitButtonUpdate").hide();
		jQuery("#captchaUpdate").hide();
	});
	jQuery("#editElement").click(function(){
		
			
		if(addNewElementFlag == 1){
			addNewElementFlag = 0;
		jQuery("#progressEditImage").show();
			
		
			var formId = jQuery("#formId").val();
	
			var dataStringElement = '&formId='+formId;
			jQuery.ajax
			({
			type: "POST",
			url: "<?php echo plugins_url('contact-form-manager/admin/ajax-load-elements.php') ?>",
			data: dataStringElement,
			cache: false,
			success: function(html)
			{	
				jQuery("#progressEditImage").hide();
				jQuery("#elementSettingResult").html(html);
			}
			});
			
		}
		
		jQuery("#selectElement").css("font-weight","normal");
		jQuery("#editElement").css("font-weight","bold");
		jQuery("#editElement").css("background-color","#FFFFFF");
		jQuery("#editDiv").css("background-color","#FFFFFF");
		jQuery("#selectElement").css("background-color","#F9F9F9");
		jQuery("#editElement").css("border-bottom","1px solid #FFFFFF");
		jQuery("#selectElement").css("border-bottom","1px solid #F1F1F1");
		
		jQuery("#editDiv").show();
		jQuery("#selectDiv").hide();
		jQuery('#element').val(0);
		jQuery("#textField").hide();
		jQuery("#emailField").hide();
		jQuery("#textArea").hide();
		jQuery("#dropDownMenu").hide();
		jQuery("#dateField").hide();
		jQuery("#checkBoxes").hide();
		jQuery("#radioButtons").hide();
		jQuery("#fileUpload").hide();
		jQuery("#submitButton").hide();
		jQuery("#captcha").hide();
		
	});

	jQuery("#mailType").change(function(){
		editor_change_mail();
	});
	
	editor_change_mail();

	jQuery("#mailTypeReplay").change(function(){
		editor_change_reply();
	});
	
	editor_change_reply();

});

function editor_change_mail()
{
    if (jQuery("#mailType").val() == 2) {
        jQuery("#plainTextMail").show();
        jQuery("#htmlMail").hide();
   }
   if (jQuery("#mailType").val() == 1) {
        jQuery("#plainTextMail").hide();
        jQuery("#htmlMail").show();
  }

}

function editor_change_reply()
{
    if (jQuery("#mailTypeReplay").val() == 2) {
        jQuery("#plainTextReply").show();
        jQuery("#htmlReply").hide();
   }
   if (jQuery("#mailTypeReplay").val() == 1) {
        jQuery("#plainTextReply").hide();
        jQuery("#htmlReply").show();
  }

}


</script>

<?php 

global $wpdb;


$formDetails = $wpdb->get_results( 'SELECT * FROM xyz_cfm_form WHERE id="'.$xyz_cfm_formId.'" LIMIT 0,1' ) ;
$formDetails = $formDetails[0];

?>
<style>
<!--
td {
	border: none;
	padding: 9px 0 5px 9px;
}

.tableStyle {
	border: 1px solid #E4E4E4;
	border-width: 1px;
	width: 100%;
	margin-top: 20px;
	margin-left: 5px;
	margin-bottom: 5px;
	/*padding-right: 15px;*/
	border-radius: 40px 10px;
	background-color: #F9F9F9;
	
}

.tableStyle td {
	border-top-width: 0px;
}
-->
</style>

<div >
	<fieldset
		style="width: 99%; border: 1px solid #F7F7F7; padding: 10px 0px;">
		<legend>
			<b>Edit Contact Form</b>
		</legend>
		<form name="frmmainForm" id="frmmainForm" method="post">
			<input type="hidden" id="formId" name="formId"
				value="<?php if(isset($_POST['formId'])){ echo esc_html($_POST['formId']);}else{ echo esc_html($formDetails->id); }?>">
			<div>
				<table
					style="width: 99%; background-color: #F9F9F9; border: 1px solid #E4E4E4; border-width: 1px;margin: 0 auto">
					<tr valign="top">
						<td style="border-bottom: none;"><div
								style="width: 200px; float: left;"><font color="red">*</font>Form Name</div> <input
							type="text" name="formName" id="formName"
							value="<?php if(isset($_POST['formName'])){ echo esc_html($_POST['formName']);}else{ echo esc_html($formDetails->name); }?>"></td>

						<!--<td style="border-bottom: none;">
							 <div
							style="width: 200px; float: left;">Page submit mode</div> 
							<select name="submitMode" id="submitMode">
							<option value="1">Ajax</option>
							<option value="2">Normal</option>
							</select> 

						</td>-->
						

						<td style="border-bottom: 1px solid #F9F9F9;" colspan="2">
							<div id="newFormResult">
								<?php 

								if($formDetails->status ==1){
									$xyz_cfm_code = "Copy this code and paste it into your post or page . <br/>    Code is <b>[xyz-cfm-form id=".$xyz_cfm_formId."]</b>";
									echo $xyz_cfm_code;
								}

								?>

							</div>
						</td>

					</tr>
				</table>
			</div>
			<div style="height: 20px;">&nbsp;</div>
			<div >
			<table style="width:99%;margin: 0 auto">
			<tr>
			<td style="width:50%;padding: 0">
				
					<table style="width: 99%;   background-color: #F9F9F9; border: 1px solid #E4E4E4; border-width: 1px;float: left;" >
						<tr>
							<td><font size="5">Form</font>
							</td>
						</tr>
						<tr valign="top">
							<td style=" border-bottom: none; height:500px; ">
							
									<?php 
									if(isset($_POST['generatedCode'])){
										$xyz_cfm_pageCode = $_POST['generatedCode'];
										the_editor($xyz_cfm_pageCode,'generatedCode');
									}else{
										$xyz_cfm_pageCode =$formDetails->form_content;
										the_editor($xyz_cfm_pageCode,'generatedCode');
									}
									?>						
					
							
							</td>
						</tr>
					</table>
				
				</td>
				<td style="width:50%;vertical-align: text-top;padding: 0">
				

					<table class="widefat"
						style="width: 99%; float: right;height: 380px; ">
						<tr>
							<td style="padding-bottom:15px;height: 55px" id="bottomBorderNone"><font size="5">Form Elements</font>
						</tr>
						<tr>
						<td  style="width:100%; padding:0px;height: 25px;vertical-align: middle;" id="bottomBorderNone">
						
				<div id="editElement" style="  text-align:center; width:50%;float:right; background-color: #F9F9F9; cursor:pointer; border-top:  1px solid #E4E4E4;border-left:  1px solid #E4E4E4;height: 100% ">Edit Element</div>
				<div id="selectElement"style=" text-align:center; width:50%; background-color: #F9F9F9; cursor:pointer;border-top:  1px solid #E4E4E4;border-right:  1px solid #E4E4E4;height: 100%">Add Element</div>
				
						</td>
						</tr>
						<tr>
							<td style="padding-bottom:0px;background-color: #FFFFFF" id="bottomBorderNone" >
								<div id="editDiv"  style="margin:0">
								<table  style="width: 99%; border:none;">
									<tr>
										<td id="bottomBorderNone">Edit Element</td>
										
										<td id="bottomBorderNone"><div id="elementSettingResult"></div></td>
									</tr>
									<tr>
										<td colspan="2" id="bottomBorderNone"><div id="elementEdit" style="width: 99%;"></div>
										</td>
									</tr>
								</table>
								</div>

								<div style="padding-right:11px;  width: 98%;display: none;margin-top:-11px; margin-left:-10px; padding-left:11px;padding-top:10px;padding-bottom:10px;" id="selectDiv" >
									&nbsp;&nbsp;&nbsp;Select Element <select name="element"
										id="element" style="cursor: pointer; margin-left: 117px;">
										<option value="0" selected="selected">Select Tag</option>
										<option value="1">Text Field</option>
										<option value="2">Email Field</option>
										<option value="3">Text Area</option>
										<option value="4">Drop-down menu</option>
										<option value="5">Date</option>
										<option value="6">Checkboxes</option>
										<option value="7">Radio buttons</option>
										<option value="8">File upload</option>
										<option value="9">Submit button</option>
										<option value="10">Captcha</option>
									</select><img id="progressSelectImage" style="display: none; width:20px;height: 20px;margin-bottom:-6px;" src="<?php echo plugins_url('contact-form-manager/images/progressSelect.gif')?>"/>
									<div id="selectElementContainer">
									<div id="textField" style="display: none;">

										<div style="float: right;">
											<span id="close1"
												style="margin-right: 20px; cursor: pointer;" title="close">X</span>
										</div>

										<!-- <input type="hidden" id="formId" name="formId"
										value="<?php //echo $lastid;?>"> -->

										<table class="tableStyle">
											<tr>
												<td  colspan="2" style="border: none;">
													<div style="margin-left:10px;" id="textFieldResult"></div>
												</td>

											</tr>

											<tr>
												<td colspan="2"><input type="checkbox" id="required1"
													name="required1">&nbsp;Required field?</td>
											</tr>
											<tr>

												<td >Form Element Name</td><td> <input type="text" class="xyz_cfm_NoEnterSubmit"
													name="elementName1" id="elementName1" ><font color="red">*</font>
												</td>

											</tr>

											<tr>

												<td >Style Class Name (optional)</td><td> <input type="text" class="xyz_cfm_NoEnterSubmit"
													name="className1" id="className1" >
												</td>
											</tr>
											<tr>	
												<td >maxlength(optional)</td><td> <input type="text" class="xyz_cfm_NoEnterSubmit"
													name="maxlength1" id="maxlength1" >
												</td>
											</tr>


											<tr>
												<td >Default value (optional)</td><td> <input class="xyz_cfm_NoEnterSubmit"
													type="text" name="defaultValue1" id="defaultValue1" >
												</td>

											</tr>
											<tr>
												<td  id="bottomBorderNone"><input class="button-primary cfm_bottonWidth" id="textFieldButton1"
													style="cursor: pointer;" type="button"
													name="textFieldButton1" value="Get Code">
												</td>

											</tr>
											

										</table>

									</div>

									<div id="emailField" style="display: none;">

										<div style="float: right;">
											<span id="close2"
												style="margin-right: 20px; cursor: pointer;" title="close">X</span>
										</div>
										<table class="tableStyle">
											<tr>
												<td style="border:none; padding-left:15px;" colspan="2">
													<divstyle="margin-left:10px;"  id="emailFieldResult"></div>
												</td>

											</tr>

											<tr>
												<td colspan="2"><input type="checkbox" name="required2"
													id="required2">&nbsp;Required field?</td>
											</tr>
											<tr>
 
												<td>Form Element Name</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="elementName2" id="elementName2" ><font color="red">*</font>
												</td>

											</tr>

											<tr>

												<td>Style Class Name (optional)</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="className2" id="className2" >
												</td>
											</tr>
											<tr>
												<td >maxlength(optional)</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="maxlength2" id="maxlength2" >
												</td>
											</tr>


											<tr>
												<td >Default value (optional)</td><td><input class="xyz_cfm_NoEnterSubmit"
													type="text" name="defaultValue2" id="defaultValue2" >
												</td>

											</tr>
											<tr>
												<td id="bottomBorderNone"><input class="button-primary cfm_bottonWidth" id="textFieldButton2"
													style="cursor: pointer;" type="button"
													name="textFieldButton2" value="Get Code">
												</td>
											</tr>
											
										</table>

									</div>
									<div id="textArea" style="display: none;">

										<div style="float: right;">
											<span id="close3"
												style="margin-right: 20px; cursor: pointer;" title="close">X</span>
										</div>
										<table class="tableStyle">
											<tr>
												<td style="border:none; padding-left:15px;" colspan="2">
													<div style="margin-left:10px;" id="textAreaResult"></div>
												</td>

											</tr>

											<tr>
												<td colspan="2"><input type="checkbox" name="required3"
													id="required3">&nbsp;Required field?</td>
											</tr>
											<tr>

												<td>Form Element Name</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="elementName3" id="elementName3" ><font color="red">*</font>
												</td>

											</tr>

											<tr>


												<td>Style Class Name (optional)</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="className3" id="className3" >
												</td>
												</tr>

											<tr>
												<td >Default value (optional)</td><td><input class="xyz_cfm_NoEnterSubmit"
													type="text" name="defaultValue3" id="defaultValue3" >
												</td>
											</tr>

											<tr>
												<td>Cols(optional)</td><td><input type="text" name="colLength3" class="xyz_cfm_NoEnterSubmit"
													id="colLength3" >
												</td>
												</tr>

											<tr>
												<td>Rows(optional)</td><td><input type="text" name="rowLength3" class="xyz_cfm_NoEnterSubmit"
													id="rowLength3" >
												</td>
											</tr>

											<tr>
												<td id="bottomBorderNone"><input class="button-primary cfm_bottonWidth" id="textFieldButton3"
													style="cursor: pointer;" type="button"
													name="textFieldButton3" value="Get Code">
												</td>
											</tr>
											
										</table>

									</div>
									<div id="dropDownMenu" style="display: none;">

										<div style="float: right;">
											<span id="close4"
												style="margin-right: 20px; cursor: pointer;" title="close">X</span>
										</div>
										<table class="tableStyle">
											<tr>
												<td style="border:none; padding-left:15px;" colspan="2">
													<div style="margin-left:10px;" id="dropDownMenuResult"></div>
												</td>

											</tr>

											<tr>
												<td colspan="2"><input type="checkbox" name="required4"
													id="required4">&nbsp;Required field?</td>
											</tr>
											<tr>

												<td>Form Element Name</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="elementName4" id="elementName4" ><font color="red">*</font>
												</td>
											</tr>
											<tr>
											
											<td>Options</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="dropDownOptions4" id="dropDownOptions4" ><font color="red">*</font>
													<br /> Please use comma(,) to separate option values.
											</td>
											</tr>
											<tr>
											<td>Style Class Name (optional)</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="className4" id="className4" >
												</td>
											</tr>
											<tr>
												<td id="bottomBorderNone"><input class="button-primary cfm_bottonWidth" id="textFieldButton4"
													style="cursor: pointer;" type="button"
													name="textFieldButton4" value="Get Code">
												</td>
											</tr>
											
										</table>

									</div>
									<div id="dateField" style="display: none;">

										<div style="float: right;">
											<span id="close5"
												style="margin-right: 20px; cursor: pointer;" title="close">X</span>
										</div>
										<table class="tableStyle">
											<tr>
												<td style="border:none; padding-left:15px;" colspan="2">
													<div style="margin-left:10px;" id="dateFieldResult"></div>
												</td>

											</tr>

											<tr>
												<td colspan="2"><input type="checkbox" name="required5"
													id="required5">&nbsp;Required field?</td>
											</tr>
											<tr>

												<td>Form Element Name</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="elementName5" id="elementName5" ><font color="red">*</font>
												</td>
												</tr>
											<tr>
												<td >Style Class Name (optional)</td><td><input class="xyz_cfm_NoEnterSubmit"
													type="text" name="className5" id="className5" >
												</td>
											</tr>
											<tr>
												<td id="bottomBorderNone"><input class="button-primary cfm_bottonWidth"
													id="textFieldButton5" style="cursor: pointer;"
													type="button" name="textFieldButton5" value="Get Code">
												</td>
											</tr>
											
										</table>

									</div>
									<div id="checkBoxes" style="display: none;">

										<div style="float: right;">
											<span id="close6"
												style="margin-right: 20px; cursor: pointer;" title="close">X</span>
										</div>
										<table class="tableStyle">
											<tr>
												<td style="border:none; padding-left:15px;" colspan="2">
													<div style="margin-left:10px;" id="checkBoxesResult"></div>
												</td>

											</tr>

											<tr>
												<td colspan="2"><input type="checkbox" name="required6"
													id="required6">&nbsp;Required field?</td>
											</tr>
											<tr>

												<td>Form Element Name</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="elementName6" id="elementName6" ><font color="red">*</font>
												</td>
											</tr>


											<tr>
											
											<td>Options</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="checkBoxOptions6" id="checkBoxOptions6" ><font color="red">*</font>
													<br /> Please use comma(,) to separate option values.
												</td>
												</tr>
											<tr>
												<td>Style Class Name (optional)</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="className6" id="className6" >
												</td>
											</tr>
											<tr>
												<td id="bottomBorderNone"><input class="button-primary cfm_bottonWidth" id="textFieldButton6"
													style="cursor: pointer;" type="button"
													name="textFieldButton6" value="Get Code">
												</td>
											</tr>
											
										</table>

									</div>
									<div id="radioButtons" style="display: none;">

										<div style="float: right;">
											<span id="close7"
												style="margin-right: 20px; cursor: pointer;" title="close">X</span>
										</div>
										<table class="tableStyle">
											<tr>
												<td style="border:none; padding-left:15px;" colspan="2">
													<div style="margin-left:10px;" id="radioButtonsResult"></div>
												</td>

											</tr>

											<tr>
												<td colspan="2"><input type="checkbox" name="required7"
													id="required7">&nbsp;Required field?</td>
											</tr>
											<tr>

												<td>Form Element Name</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="elementName7" id="elementName7" ><font color="red">*</font>
												</td>

											</tr>


											<tr>
											<td>Options</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="radioOptions7" id="radioOptions7" ><font color="red">*</font>
													<br /> Please use comma(,) to separate option values.
												</td>
											</tr>
											<tr>	
												<td>Style Class Name (optional)</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="className7" id="className7" >
												</td>
											</tr>
											<tr>
												<td id="bottomBorderNone"><input class="button-primary cfm_bottonWidth" id="textFieldButton7"
													style="cursor: pointer;" type="button"
													name="textFieldButton7" value="Get Code">
												</td>
											</tr>
											
										</table>

									</div>
									<div id="fileUpload" style="display: none;">

										<div style="float: right;">
											<span id="close8"
												style="margin-right: 20px; cursor: pointer;" title="close">X</span>
										</div>
										<table class="tableStyle">
											<tr>
												<td style="border:none; padding-left:15px;" colspan="2">
													<div style="margin-left:10px;" id="fileUploadResult"></div>
												</td>

											</tr>
											<tr>
												<td colspan="2"><input type="checkbox" name="required8"
													id="required8">&nbsp;Required field?</td>
											</tr>
											<tr>

												<td>Form Element Name</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="elementName8" id="elementName8" ><font color="red">*</font>
												</td>
											</tr>

											<tr>
												<td>File size limit (bytes) (optional)</td><td><input class="xyz_cfm_NoEnterSubmit"
													type="text" name="fileSize8" id="fileSize8" >
													
												</td>
												</tr>
											<tr>
												<td >Style Class Name (optional)</td><td><input class="xyz_cfm_NoEnterSubmit"
													type="text" name="className8" id="className8" >
												</td>
												

											</tr>
											<tr>
													<td>Acceptable file types (optional)</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="fileType8" id="fileType8" >
													<br /> Please use comma(,) to separate file types. Do not use .(dot) in file types.
													<br /> Example : jpeg,jpg,png
												</td>
												
											</tr>

											<tr>
												<td id="bottomBorderNone"><input class="button-primary cfm_bottonWidth" id="textFieldButton8"
													style="cursor: pointer;" type="button"
													name="textFieldButton8" value="Get Code">
												</td>
											</tr>
											
										</table>

									</div>
									<div id="submitButton" style="display: none;">

										<div style="float: right;">
											<span id="close9"
												style="margin-right: 20px; cursor: pointer;" title="close">X</span>
										</div>
										<table class="tableStyle">
											<tr>
												<td colspan="2" style="border:none; padding-left:15px;">
													<div style="margin-left:10px;" id="submitButtonResult"></div>
												</td>

											</tr>
											<tr>
												<td>Form Element Name</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="elementName9" id="elementName9" ><font color="red">*</font>
												</td>
												</tr>
											<tr>
												<td>Display Name</td><td><input type="text" name="displayName9" class="xyz_cfm_NoEnterSubmit"
													id="displayName9" ><font color="red">*</font>
												</td>
											</tr>

											<tr>


												<td >Style Class Name (optional)</td><td><input class="xyz_cfm_NoEnterSubmit"
													type="text" name="className9" id="className9" >
												</td>
											</tr>
											<tr>
												<td id="bottomBorderNone"><input class="button-primary cfm_bottonWidth" id="textFieldButton9"
													style="cursor: pointer;" type="button" name="values"
													value="Get Code">
												</td>
											</tr>
											
										</table>
									</div>
									<div id="captcha" style="display: none;">

										<div style="float: right;">
											<span id="close10"
												style="margin-right: 20px;  cursor: pointer;"
												title="close">X</span>
										</div>
										<table class="tableStyle">
											<tr>
												<td colspan="2" style="border:none; padding-left:15px;">
													<div style="margin-left:10px;" id="captchaResult"></div>
												</td>

											</tr>
												<tr>
												<td colspan="2"><input type="checkbox" name="reCaptcha"
													id="reCaptcha">&nbsp;ReCapatcha ?</td>
											</tr>
											<tr>
												<td>Form Element Name</td><td><input type="text" class="xyz_cfm_NoEnterSubmit"
													name="elementName10" id="elementName10" ><font color="red">*</font>
												</td>
												</tr>
											<tr>
												<td>Style Class Name (optional)</td>
												<td><div id="captchaStyle"><input class="xyz_cfm_NoEnterSubmit"
													type="text" name="className10" id="className10" >
													</div>
													<div id="reCaptchaStyle">
													<select name="reCaptchaStyleOption" id="reCaptchaStyleOption" class="xyz_cfm_NoEnterSubmit">
													<option value="red">Red</option>
													<option value="white">White</option>
													<option value="blackglass">Blackglass</option>
													<option value="clean">Clean</option>
													</select>
													</div>
												</td>
											</tr>
											<tr>
												<td id="bottomBorderNone"><input class="button-primary cfm_bottonWidth" id="textFieldButton10"
													style="cursor: pointer;" type="button" name="values"
													value="Get Code">
												</td>
											</tr>
											
										</table>
										</div>
										</div>
										</div>
									
								</td>
						</tr>

					</table>
					
											<table class="widefat" style="width: 99%; float: right;height: 130px;margin-top: 30px ">
						<tr><td style="border-bottom: none;"><br>
							<div style=" width:100%;">Redirection link after form submit (optional) :
							<br><br>
								<input style="width: 350px;" type="text" name="redirectionLink" id="redirectionLink" 
								value="<?php if(isset($_POST['redirectionLink'])){ echo esc_html($_POST['redirectionLink']);}else{ echo esc_html($formDetails->redirection_link); }?>">
							</div>
							</td></tr>
						</table>
					
				
				</td>
				</tr>
				</table>
			</div>
			<div style="hieght: 20px;">
				<br />
			</div>
			<div>
				<table style="width: 99%; margin: 0 auto">
				<tr>
				<td style="width:50%; padding: 0;">

				<table
					style=" width: 99%; background-color: #F9F9F9; border: 1px solid #E4E4E4; border-width: 1px;float: left;">
						<tr>
							<td style="border-bottom: 1px solid #F9F9F9;"><font size="5">Mail to site admin</font>
							</td>
						</tr>

						<tr>
							<td><font color="red">*</font>To Email&nbsp;:&nbsp;<br> <input style="width: 350px;" type="text"
								name="to" id="to" value="<?php if(isset($_POST['to'])){ echo esc_html($_POST['to']);}elseif($formDetails->to_email!=''){ echo esc_html($formDetails->to_email); }else echo $current_user->user_email;?>">
							</td>
						</tr>
						<tr>
							<td>CC&nbsp;:&nbsp;<br> <input style="width: 350px;" type="text"
								name="cc" id="cc" value="<?php if(isset($_POST['cc'])){ echo esc_html($_POST['cc']);}else{ echo esc_html($formDetails->cc_email); }?>" >
							</td>
						</tr>
						<tr>
							<td><font color="red">*</font>From Email&nbsp;:&nbsp;<br>
							<?php 
							
							if(get_option('xyz_cfm_sendViaSmtp') == 1){
								$xyz_cfm_getSenderdetails = $wpdb->get_results("SELECT * FROM xyz_cfm_sender_email_address");
								?>
								<select name="xyz_cfm_senderEmailId" id="xyz_cfm_senderEmailId">
								<?php
								foreach ($xyz_cfm_getSenderdetails as $xyz_cfm_getSender){
								?>
								<option value="<?php echo $xyz_cfm_getSender->id;?>" <?php if(isset($_POST['xyz_cfm_senderEmailId']) && $_POST['xyz_cfm_senderEmailId']==$xyz_cfm_getSender->id){?>selected="selected"<?php } elseif($formDetails->from_email_id == $xyz_cfm_getSender->id){?>selected="selected"<?php }?>><?php echo $xyz_cfm_getSender->user;?></option>
								<?php
								}
								?>
								</select>
							<input type = "hidden" name="from" value="<?php echo $formDetails->from_email ;?>">
								<?php 
							
							}else{
							
							?>
							

							<input type = "hidden" name="xyz_cfm_senderEmailId" value="<?php echo $formDetails->from_email_id ;?>">
							 <input style="width: 350px;"
								type="text" name="from" id="from"
								value="<?php if(isset($_POST['from'])){ echo esc_html($_POST['from']);}else{ echo esc_html($formDetails->from_email); }?>">
							<?php 
							
							}
							
							?>	
								
							</td>
						</tr>
						<tr>
							<td>Sender Name&nbsp;:&nbsp;<br> <input style="width: 350px;"
								type="text" name="senderName" id="senderName"
								value="<?php if(isset($_POST['senderName'])){ echo esc_html($_POST['senderName']);}else{ echo esc_html($formDetails->sender_name); }?>">
							</td>
						</tr>
						<tr>
							<td><font color="red">*</font>Subject&nbsp;:&nbsp;<br> <input style="width: 350px;"
								type="text" name="subject" id="subject"
								value="<?php if(isset($_POST['subject'])){ echo esc_html($_POST['subject']);}else{ echo esc_html($formDetails->mail_subject); }?>">
							</td>
						</tr>
						<?php //echo "PPP:".$formDetails->mail_type; die;?>
						<tr>
							<td style="border-bottom: none;"><div
									style="width: 200px; float: left;">Mail content type</div> <select
								name="mailType" id="mailType">
									<option value="1" <?php if(isset($_POST['mailType']) && $_POST['mailType']==1){ echo "selected"; } elseif($formDetails->mail_type==1){ echo "selected"; } ?>>HTML</option>
									<option value="2" <?php if(isset($_POST['mailType']) && $_POST['mailType']==2){ echo "selected"; } elseif($formDetails->mail_type==2) { echo "selected"; }  ?>>Plain Text</option>
							</select>
							</td>
						</tr>
						<tr valign="top">
							<td style="width: 45%; border-bottom: none;"><font color="red">*</font>Mail
								Body&nbsp;:&nbsp;<br>
								<div id="htmlMail">
								
									<?php 
									if(isset($_POST['mailBodyEditor'])){
										$xyz_cfm_mailBody = $_POST['mailBodyEditor'];
										the_editor($xyz_cfm_mailBody,'mailBodyEditor');
									}else{
										$xyz_cfm_mailBody = $formDetails->mail_body;
										the_editor($xyz_cfm_mailBody,'mailBodyEditor');
									}
									?>
								</div>
								<div id="plainTextMail">
									<textarea style="width: 99%; height:400px;" name="mailBodyPlainText" id="mailBodyPlainText"><?php if(isset($_POST['mailBodyPlainText'])){ echo esc_textarea($_POST['mailBodyPlainText']);}else{ echo esc_textarea($formDetails->mail_body); }?></textarea>
								</div>
							</td>
						</tr>
						
					</table>
				</td>	

				<td style="width: 50%; vertical-align: text-top; padding: 0">
				<table
					style=" width: 99%; background-color: #F9F9F9; border: 1px solid #E4E4E4; border-width: 1px; float: right;">
						<tr>
							<td style="border-bottom: 1px solid #F9F9F9;"><font size="5">Auto-reply to sender</font>
							</td>
						</tr>
						<tr>
							<td style="border-bottom: none;"><div
									style="width: 200px; float: left;">Enable Reply</div> <select
								name="enableReply" id="enableReply">
									<option value="1" <?php if(isset($_POST['enableReply']) && $_POST['enableReply']==1){ echo "selected"; } elseif($formDetails->enable_reply==1) { echo "selected"; }  ?>>Disable</option>
									<option value="2" <?php if(isset($_POST['enableReply']) && $_POST['enableReply']==2){ echo "selected"; } elseif($formDetails->enable_reply==2) { echo "selected"; } ?>>Enable</option>
							</select>
							</td>
						</tr>
						<tr><td></td></tr>
						<tr>
							<td>Sender Email&nbsp;:&nbsp;<br>
							
							<?php 
							
							if(get_option('xyz_cfm_sendViaSmtp') == 1){
								$xyz_cfm_getSenderdetails = $wpdb->get_results("SELECT * FROM xyz_cfm_sender_email_address");
								?>
								<select name="xyz_cfm_replaySenderEmailId" id="xyz_cfm_replaySenderEmailId">
								<option value="0">Select</option>
								<?php
								foreach ($xyz_cfm_getSenderdetails as $xyz_cfm_getSender){
								?>
								<option value="<?php echo $xyz_cfm_getSender->id;?>" <?php if(isset($_POST['xyz_cfm_replaySenderEmailId']) && $_POST['xyz_cfm_replaySenderEmailId']==$xyz_cfm_getSender->id){?>selected="selected"<?php } elseif($formDetails->reply_sender_email_id == $xyz_cfm_getSender->id){?>selected="selected"<?php }?>><?php echo $xyz_cfm_getSender->user;?></option>
								<?php
								}
								?>
								</select>
							<input type = "hidden" name="replaySenderEmail" value="<?php echo $formDetails->reply_sender_email ;?>">
								<?php 
							
							}else{
							
							?>
							<input type = "hidden" name="xyz_cfm_replaySenderEmailId" value="<?php echo $formDetails->reply_sender_email_id ;?>">
							<input style="width: 350px;"
								type="text" name="replaySenderEmail" id="replaySenderEmail" value="<?php if(isset($_POST['replaySenderEmail'])){ echo esc_html($_POST['replaySenderEmail']);}else{ echo esc_html($formDetails->reply_sender_email); }?>">
								
							<?php 
							
							}
							
							?>
							</td>
						</tr>
						<tr>
							<td>Reply Sender Name&nbsp;:&nbsp;<br> <input
								style="width: 350px;" type="text" name="replaySenderName"
								id="replaySenderName" value="<?php if(isset($_POST['replaySenderName'])){ echo esc_html($_POST['replaySenderName']);}else{ echo esc_html($formDetails->reply_sender_name); }?>">
							</td>
						</tr>
					
					<tr>
						<td><font color="red">*</font>To Email&nbsp;:&nbsp;<br> <input
							style="width: 350px;" type="text" name="toEmailReply"
							id="toEmailReply" value="<?php if(isset($_POST['toEmailReply'])){ echo esc_html($_POST['toEmailReply']);}else{ echo esc_html($formDetails->to_email_reply); }?>">
						</td>
					</tr>
						<tr>
							<td><font color="red">*</font>Subject&nbsp;:&nbsp;<br> <input style="width: 350px;"
								type="text" name="subjectReplay" id="subjectReplay"
								value="<?php if(isset($_POST['subjectReplay'])){ echo esc_html($_POST['subjectReplay']);}else{ echo esc_html($formDetails->reply_subject); }?>">
							</td>
						</tr>
						
						<tr>
							<td style="border-bottom: none;"><div
									style="width: 200px; float: left;">Mail content type</div> <select
								name="mailTypeReplay" id="mailTypeReplay">
									<option value="1" <?php if(isset($_POST['mailTypeReplay']) && $_POST['mailTypeReplay']==1){ echo "selected"; } elseif($formDetails->reply_mail_type==1) { echo "selected"; }  ?>>HTML</option>
									<option value="2" <?php if(isset($_POST['mailTypeReplay']) && $_POST['mailTypeReplay']==2){ echo "selected"; } elseif($formDetails->reply_mail_type==2) { echo "selected"; } ?>>Plain Text</option>
							</select>
							</td>
						</tr>
						
						<tr valign="top">
							<td style="width: 45%; border-bottom: none;"><font color="red">*</font>Mail
								Body&nbsp;:&nbsp;<br>
								<div id="htmlReply" style="display: none;">
									<?php 
									if(isset($_POST['mailBodyReplayEditor'])){
										$xyz_cfm_mailBodyReplay = $_POST['mailBodyReplayEditor'];
										the_editor($xyz_cfm_mailBodyReplay,'mailBodyReplayEditor');
									}else{
										$xyz_cfm_mailBodyReplay = $formDetails->reply_body;
										the_editor($xyz_cfm_mailBodyReplay,'mailBodyReplayEditor');
									}
									?>

								</div>
								<div id="plainTextReply" style="display: none;">
									<textarea style="width: 99%; height:400px;" name="mailBodyReplayPlainText" id="mailBodyReplayPlainText"><?php if(isset($_POST['mailBodyReplayPlainText'])){ echo esc_textarea($_POST['mailBodyReplayPlainText']);}else{ echo esc_textarea($formDetails->reply_body); }?></textarea>
							</div>
							</td>
						</tr>

						
				</table>
				</td>
				</tr>
				<tr>
					<td colspan="2"><div style="text-align: center; width:100%;"><input class="button-primary cfm_bottonWidth" style="cursor: pointer;"
							type="submit" name="addSubmit" value="Update"></div></td>
				</tr>
				
				</table>
			</div>

		</form>
	</fieldset>

</div>
