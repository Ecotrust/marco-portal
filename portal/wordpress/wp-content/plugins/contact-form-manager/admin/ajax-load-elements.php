<?php
require( dirname( __FILE__ ) . '../../../../../wp-load.php' );
if(!current_user_can('manage_options')){
	exit;
}
global $wpdb;
$_POST = stripslashes_deep($_POST);
$formId = $_POST['formId'];

$element_result = $wpdb->get_results('SELECT * FROM xyz_cfm_form_elements WHERE form_id="'.$formId.'"') ;
//$element_result = $element_result[0];
// echo '<pre>';
// print_r($element_result);
// die;

?>
<script>
jQuery(document).ready(function() {
	

	jQuery("#progressSelectImage").hide();
	jQuery("#progressEditImage").hide();


jQuery('#xyz_cfm_elementSetting').change(function() {
	jQuery("#progressEditImage").show();
	var elementId = jQuery('#xyz_cfm_elementSetting').val();

	var formId = <?php echo $formId;?>;
	var dataString = 'elementId='+elementId;
	jQuery.ajax
	({
	type: "POST",
	url: "<?php echo plugins_url('contact-form-manager/admin/ajax-load-element-details.php') ?>",
	data: dataString,
	cache: false,
	success: function(html)
	{	
		jQuery("#progressEditImage").hide();
		jQuery("#elementEdit").html(html);
	}
	});

	
	});
});

</script>

<select name="xyz_cfm_elementSetting" id="xyz_cfm_elementSetting">
<option value="0">Select Element Name</option>
<?php 
foreach ($element_result as $elementDetail){
?>
<option value="<?php echo $elementDetail->id;?>"><?php echo $elementDetail->element_name;?></option>
<?php 
}
?>
</select><img style=" width:20px;height: 20px;margin-bottom:-6px;" id="progressEditImage"  src="<?php echo plugins_url('contact-form-manager/images/progressEdit.gif')?>"/>
