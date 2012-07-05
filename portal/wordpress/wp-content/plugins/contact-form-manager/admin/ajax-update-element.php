<?php
require( dirname( __FILE__ ) . '../../../../../wp-load.php' );
if(!current_user_can('manage_options')){
	exit;
}
global $wpdb;


if($_POST['id']){
	$_POST = stripslashes_deep($_POST);

	$id=$_POST['id'];
	$elementId = $_POST['elementId'];
	$formId = $_POST['formId'];

	if($id == 1){

		$required = $_POST['required'];

		$elementName = str_replace(' ','',$_POST['elementName']);
		$elementNameTest = str_replace('_','',$elementName);

		if(ctype_alnum($elementNameTest) && ctype_alpha($elementNameTest[0])){
			$className = str_replace(' ','',$_POST['className']);
			$maxlength = intval($_POST['maxlength']);
			if($maxlength == 0){
				$maxlength = '';
			}
			$defaultValue = $_POST['defaultValue'];


			$elementType = 1;
			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_name="'.$elementName.'" AND form_id="'.$formId.'" AND id!="'.$elementId.'"  LIMIT 0,1' ) ;
			if($element_count == 0){
				$wpdb->update('xyz_cfm_form_elements', array('element_required'=>$required,'element_name'=>$elementName,'css_class'=>$className,'max_length'=>$maxlength,'default_value'=>$defaultValue), array('id'=>$elementId));
				echo "Element successfully updated.";
			}else{
					
				echo "<font color=red>Element name already exists.</font>";
			}
		}else{
			echo "<font color=red>Form element name must start with alphabet and must be alphanumeric .</font>";
		}

	}

	if($id == 2){

		$required = $_POST['required'];

		$elementName = str_replace(' ','',$_POST['elementName']);
		$elementNameTest = str_replace('_','',$elementName);

		if(ctype_alnum($elementNameTest) && ctype_alpha($elementNameTest[0])){
			$className = str_replace(' ','',$_POST['className']);
			$maxlength = intval($_POST['maxlength']);
			if($maxlength == 0){
				$maxlength = '';
			}
			$defaultValue = $_POST['defaultValue'];
			$elementType = 2;

			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_name="'.$elementName.'" AND form_id="'.$formId.'" AND id!="'.$elementId.'" LIMIT 0,1' ) ;
			if($element_count == 0){
				$wpdb->update('xyz_cfm_form_elements', array('element_required'=>$required,'element_name'=>$elementName,'css_class'=>$className,'max_length'=>$maxlength,'default_value'=>$defaultValue), array('id'=>$elementId));
				echo "Element successfully updated.";
			}else{
				echo "<font color=red>Element name already exists.</font>";
			}
		}else{
			echo "<font color=red>Form element name must start with alphabet and must be alphanumeric .</font>";
		}

	}

	if($id == 3){

		$required = $_POST['required'];

		$elementName = str_replace(' ','',$_POST['elementName']);
		$elementNameTest = str_replace('_','',$elementName);

		if(ctype_alnum($elementNameTest) && ctype_alpha($elementNameTest[0])){
			$className = str_replace(' ','',$_POST['className']);
			$collength = intval($_POST['collength']);
			if($collength == 0){
				$collength = '';
			}
			$rowlength = intval($_POST['rowlength']);
			if($rowlength == 0){
				$rowlength = '';
			}
			$defaultValue = $_POST['defaultValue'];
			$elementType = 3;

			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_name="'.$elementName.'" AND form_id="'.$formId.'" AND id!="'.$elementId.'" LIMIT 0,1' ) ;
			if($element_count == 0){
				$wpdb->update('xyz_cfm_form_elements', array('element_required'=>$required,'element_name'=>$elementName,'css_class'=>$className,'cols'=>$collength,'rows'=>$rowlength,'default_value'=>$defaultValue), array('id'=>$elementId));
				echo "Element successfully updated.";
			}else{
				echo "<font color=red>Element name already exists.</font>";
			}
		}else{
			echo "<font color=red>Form element name must start with alphabet and must be alphanumeric .</font>";
		}

	}

	if($id == 4){

		$required = $_POST['required'];

		$elementName = str_replace(' ','',$_POST['elementName']);
		$elementNameTest = str_replace('_','',$elementName);

		if(ctype_alnum($elementNameTest) && ctype_alpha($elementNameTest[0])){
			$className = str_replace(' ','',$_POST['className']);
			$options = $_POST['options'];
			$elementType = 4;

				
			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_name="'.$elementName.'" AND form_id="'.$formId.'" AND id!="'.$elementId.'" LIMIT 0,1' ) ;
			if($element_count == 0){
				$wpdb->update('xyz_cfm_form_elements', array('element_required'=>$required,'element_name'=>$elementName,'css_class'=>$className,'options'=>$options), array('id'=>$elementId));
				echo "Element successfully updated.";
			}else{
				echo "<font color=red>Element name already exists.</font>";
			}
		}else{
			echo "<font color=red>Form element name must start with alphabet and must be alphanumeric .</font>";
		}
	}

	if($id == 5){

		$required = $_POST['required'];

		$elementName = str_replace(' ','',$_POST['elementName']);
		$elementNameTest = str_replace('_','',$elementName);

		if(ctype_alnum($elementNameTest) && ctype_alpha($elementNameTest[0])){
			$className = str_replace(' ','',$_POST['className']);
			$elementType = 5;


			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_name="'.$elementName.'" AND form_id="'.$formId.'" AND id!="'.$elementId.'" LIMIT 0,1' ) ;
			if($element_count == 0){
				$wpdb->update('xyz_cfm_form_elements', array('element_required'=>$required,'element_name'=>$elementName,'css_class'=>$className), array('id'=>$elementId));
				echo "Element successfully updated.";
			}else{
				echo "<font color=red>Element name already exists.</font>";
			}
		}else{
			echo "<font color=red>Form element name must start with alphabet and must be alphanumeric .</font>";
		}
	}

	if($id == 6){

		$required = $_POST['required'];

		$elementName = str_replace(' ','',$_POST['elementName']);
		$elementNameTest = str_replace('_','',$elementName);

		if(ctype_alnum($elementNameTest) && ctype_alpha($elementNameTest[0])){
			$className = str_replace(' ','',$_POST['className']);
			$options = $_POST['options'];
			$elementType = 6;


			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_name="'.$elementName.'" AND form_id="'.$formId.'" AND id!="'.$elementId.'" LIMIT 0,1' ) ;
			if($element_count == 0){
				$wpdb->update('xyz_cfm_form_elements', array('element_required'=>$required,'element_name'=>$elementName,'css_class'=>$className,'options'=>$options), array('id'=>$elementId));
				echo "Element successfully updated.";
			}else{
				echo "<font color=red>Element name already exists.</font>";
			}
		}else{
			echo "<font color=red>Form element name must start with alphabet and must be alphanumeric .</font>";
		}
	}

	if($id == 7){

		$required = $_POST['required'];

		$elementName = str_replace(' ','',$_POST['elementName']);
		$elementNameTest = str_replace('_','',$elementName);

		if(ctype_alnum($elementNameTest) && ctype_alpha($elementNameTest[0])){
			$className = str_replace(' ','',$_POST['className']);
			$options = $_POST['options'];
			$elementType = 7;


			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_name="'.$elementName.'" AND form_id="'.$formId.'" AND id!="'.$elementId.'" LIMIT 0,1' ) ;
			if($element_count == 0){
				$wpdb->update('xyz_cfm_form_elements', array('element_required'=>$required,'element_name'=>$elementName,'css_class'=>$className,'options'=>$options), array('id'=>$elementId));
					
				echo "Element successfully updated.";
			}else{
				echo "<font color=red>Element name already exists.</font>";
			}
		}else{
			echo "<font color=red>Form element name must start with alphabet and must be alphanumeric .</font>";
		}
	}

	if($id == 8){

		$required = $_POST['required'];

		$elementName = str_replace(' ','',$_POST['elementName']);
		$elementNameTest = str_replace('_','',$elementName);

		if(ctype_alnum($elementNameTest) && ctype_alpha($elementNameTest[0])){
			$className = str_replace(' ','',$_POST['className']);
			$fileSize = intval($_POST['fileSize']);
			if($fileSize == 0){
				$fileSize = '';
			}
			$fileType = $_POST['fileType'];

			$elementType = 8;


			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_name="'.$elementName.'" AND form_id="'.$formId.'" AND id!="'.$elementId.'" LIMIT 0,1' ) ;
			if($element_count == 0){
					
				$wpdb->update('xyz_cfm_form_elements', array('element_required'=>$required, 'element_name'=>$elementName,'css_class'=>$className,'file_size'=>$fileSize,'file_type'=>$fileType), array('id'=>$elementId));
					
				echo "Element successfully updated.";
			}else{
				echo "<font color=red>Element name already exists.</font>";
			}
		}else{
			echo "<font color=red>Form element name must start with alphabet and must be alphanumeric .</font>";
		}
	}

	if($id == 9){

		$displayName = $_POST['displayName'];
		$elementName = str_replace(' ','',$_POST['elementName']);
		$elementNameTest = str_replace('_','',$elementName);

		if(ctype_alnum($elementNameTest) && ctype_alpha($elementNameTest[0])){
			$className = str_replace(' ','',$_POST['className']);
			$elementType = 9;


			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_type="9" AND form_id="'.$formId.'" AND id!="'.$elementId.'" LIMIT 0,1' ) ;
			if($element_count == 0){
					
				$wpdb->update('xyz_cfm_form_elements', array('element_diplay_name'=>$displayName, 'element_name'=>$elementName,'css_class'=>$className), array('id'=>$elementId));
					
				echo "Element successfully updated.";
			}else{
				echo "<font color=red>Element already exists.</font>";
			}
		}else{
			echo "<font color=red>Form element name must start with alphabet and must be alphanumeric .</font>";
		}
	}

	if($id == 10){

		$required = 1;
		$elementName = str_replace(' ','',$_POST['elementName']);
		$elementNameTest = str_replace('_','',$elementName);

		if(ctype_alnum($elementNameTest) && ctype_alpha($elementNameTest[0])){
			$className = str_replace(' ','',$_POST['className']);
			$elementType = 10;
			$reCaptcha  = $_POST['reCaptcha'];


			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_type="10" AND form_id="'.$formId.'" AND id!="'.$elementId.'" LIMIT 0,1' ) ;
			if($element_count == 0){
					
				$wpdb->update('xyz_cfm_form_elements', array('element_required'=>$required,'element_name'=>$elementName,'element_type'=>$elementType,'css_class'=>$className,'re_captcha'=>$reCaptcha), array('id'=>$elementId));
					
				echo "Element successfully updated.";
			}else{
				echo "<font color=red>Element name already exists.</font>";
			}
		}else{
			echo "<font color=red>Form element name must start with alphabet and must be alphanumeric .</font>";
		}
	}
}
