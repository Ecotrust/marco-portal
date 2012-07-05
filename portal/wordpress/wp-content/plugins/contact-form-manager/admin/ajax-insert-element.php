<?php
require( dirname( __FILE__ ) . '../../../../../wp-load.php' );
if(!current_user_can('manage_options')){
	exit;
}
global $wpdb;

if($_POST){
	$_POST = stripslashes_deep($_POST);
	$_POST = xyz_trim_deep($_POST);


	$id=$_POST['id'];
	if($id == 1){

		$required = $_POST['required'];

		$elementName = str_replace(' ','',$_POST['elementName']);
		$elementNameTest = str_replace('_','',$elementName);

		if(ctype_alnum($elementNameTest) && ctype_alpha($elementNameTest[0])){

			$className = str_replace(' ','',$_POST['className']);
			$maxlength = abs(intval($_POST['maxlength']));
			if($maxlength == 0){
				$maxlength = '';
			}
			$defaultValue = $_POST['defaultValue'];
			$formId = $_POST['formId'];
			$elementType = 1;


			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_name="'.$elementName.'" AND form_id="'.$formId.'"  LIMIT 0,1' ) ;
			if($element_count == 0){

				$wpdb->insert('xyz_cfm_form_elements', array('form_id' =>$formId,'element_name'=>$elementName,
						'element_type'=>$elementType,'element_required'=>$required,'css_class'=>$className,'max_length'=>$maxlength,'default_value'=>$defaultValue),
						array('%d','%s','%d','%d','%s','%s','%s'));
				$lastElementId = $wpdb->insert_id;
				echo "Copy this code and paste it into the form left.<br/>Code is <b>[text-".$lastElementId."]</b>";
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
			$maxlength = abs(intval($_POST['maxlength']));
			if($maxlength == 0){
				$maxlength = '';
			}
			$defaultValue = $_POST['defaultValue'];
			$formId = $_POST['formId'];
			$elementType = 2;

			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_name="'.$elementName.'" AND form_id="'.$formId.'" LIMIT 0,1' ) ;
			if($element_count == 0){

				$wpdb->insert('xyz_cfm_form_elements', array('form_id' =>$formId,'element_name'=>$elementName,
						'element_type'=>$elementType,'element_required'=>$required,'css_class'=>$className,'max_length'=>$maxlength,'default_value'=>$defaultValue),
						array('%d','%s','%d','%d','%s','%s','%s'));
				$lastElementId = $wpdb->insert_id;
				echo "Copy this code and paste it into the form left.<br/>Code is <b>[email-".$lastElementId."]</b>";
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
			$collength = abs(intval($_POST['collength']));
			if($collength == 0){
				$collength = '';
			}
			$rowlength = abs(intval($_POST['rowlength']));
			if($rowlength == 0){
				$rowlength = '';
			}
			$defaultValue = $_POST['defaultValue'];
			$formId = $_POST['formId'];
			$elementType = 3;

			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_name="'.$elementName.'" AND form_id="'.$formId.'" LIMIT 0,1' ) ;
			if($element_count == 0){


				$wpdb->insert('xyz_cfm_form_elements', array('form_id' =>$formId,'element_name'=>$elementName,
						'element_type'=>$elementType,'element_required'=>$required,'css_class'=>$className,'cols'=>$collength,'rows'=>$rowlength,'default_value'=>$defaultValue),
						array('%d','%s','%d','%d','%s','%s','%s','%s'));
				$lastElementId = $wpdb->insert_id;
				echo "Copy this code and paste it into the form left.<br/>Code is <b>[textarea-".$lastElementId."]</b>";
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
			$formId = $_POST['formId'];
			$elementType = 4;

				
			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_name="'.$elementName.'" AND form_id="'.$formId.'" LIMIT 0,1' ) ;
			if($element_count == 0){

				$wpdb->insert('xyz_cfm_form_elements', array('form_id' =>$formId,'element_name'=>$elementName,
						'element_type'=>$elementType,'element_required'=>$required,'css_class'=>$className,'options'=>$options),
						array('%d','%s','%d','%d','%s','%s'));
				$lastElementId = $wpdb->insert_id;
				echo "Copy this code and paste it into the form left.<br/>Code is <b>[dropdown-".$lastElementId."]</b>";
			}else{
				echo "<font color=red>Element name already exists.</font> ";
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
			$formId = $_POST['formId'];
			$elementType = 5;


			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_name="'.$elementName.'" AND form_id="'.$formId.'" LIMIT 0,1' ) ;
			if($element_count == 0){

				$wpdb->insert('xyz_cfm_form_elements', array('form_id' =>$formId,'element_name'=>$elementName,
						'element_type'=>$elementType,'element_required'=>$required,'css_class'=>$className),
						array('%d','%s','%d','%d','%s'));
				$lastElementId = $wpdb->insert_id;
				echo "Copy this code and paste it into the form left.<br/>Code is <b>[date-".$lastElementId."]</b>";
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
			$formId = $_POST['formId'];
			$elementType = 6;


			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_name="'.$elementName.'" AND form_id="'.$formId.'" LIMIT 0,1' ) ;
			if($element_count == 0){

				$wpdb->insert('xyz_cfm_form_elements', array('form_id' =>$formId,'element_name'=>$elementName,
						'element_type'=>$elementType,'element_required'=>$required,'css_class'=>$className,'options'=>$options),
						array('%d','%s','%d','%d','%s','%s'));
				$lastElementId = $wpdb->insert_id;
				echo "Copy this code and paste it into the form left.<br/>Code is <b>[checkbox-".$lastElementId."]</b>";
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
			$formId = $_POST['formId'];
			$elementType = 7;


			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_name="'.$elementName.'" AND form_id="'.$formId.'" LIMIT 0,1' ) ;
			if($element_count == 0){

				$wpdb->insert('xyz_cfm_form_elements', array('form_id' =>$formId,'element_name'=>$elementName,
						'element_type'=>$elementType,'element_required'=>$required,'css_class'=>$className,'options'=>$options),
						array('%d','%s','%d','%d','%s','%s'));
				$lastElementId = $wpdb->insert_id;
				echo "Copy this code and paste it into the form left.<br/>Code is <b>[radiobutton-".$lastElementId."]</b>";
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
			$fileSize = abs(intval($_POST['fileSize']));
			if($fileSize == 0 ) {
				$fileSize = '';
			}
			$fileType = $_POST['fileType'];
			$formId = $_POST['formId'];
			$elementType = 8;


			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_name="'.$elementName.'" AND form_id="'.$formId.'" LIMIT 0,1' ) ;
			if($element_count == 0){

				$wpdb->insert('xyz_cfm_form_elements', array('form_id' =>$formId,'element_name'=>$elementName,
						'element_type'=>$elementType,'element_required'=>$required,'css_class'=>$className,'file_size'=>$fileSize,'file_type'=>$fileType),
						array('%d','%s','%d','%d','%s','%s','%s'));
				$lastElementId = $wpdb->insert_id;
				echo "Copy this code and paste it into the form left.<br/>Code is <b>[file-".$lastElementId."]</b>";
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
			$formId = $_POST['formId'];
			$elementType = 9;


			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_type="9" AND form_id="'.$formId.'" LIMIT 0,1' ) ;
			if($element_count == 0){

				$wpdb->insert('xyz_cfm_form_elements', array('form_id' =>$formId,'element_diplay_name'=>$displayName,'element_name'=>$elementName,
						'element_type'=>$elementType,'css_class'=>$className),
						array('%d','%s','%s','%d','%s'));
				$lastElementId = $wpdb->insert_id;
				echo "Copy this code and paste it into the form left.<br/>Code is <b>[submit-".$lastElementId."]</b>";
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
			$formId = $_POST['formId'];
			$elementType = 10;
			$reCaptcha  = $_POST['reCaptcha'];

			$element_count = $wpdb->query( 'SELECT * FROM xyz_cfm_form_elements WHERE element_type="10" AND form_id="'.$formId.'" LIMIT 0,1' ) ;
			if($element_count == 0){
					
				$wpdb->insert('xyz_cfm_form_elements', array('form_id' =>$formId,'element_required'=>$required,'element_name'=>$elementName,
						'element_type'=>$elementType,'css_class'=>$className,'re_captcha'=>$reCaptcha),
						array('%d','%d','%s','%d','%s','%d'));
					
					
				$lastElementId = $wpdb->insert_id;
				echo "Copy this code and paste it into the form left.<br/>Code is <b>[captcha-".$lastElementId."]</b>";
			}else{
				echo "<font color=red>Element already exists.</font>";
			}

		}else{
			echo "<font color=red>Form element name must start with alphabet and must be alphanumeric .</font>";
		}
	}

}