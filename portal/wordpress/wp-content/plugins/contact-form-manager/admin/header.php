<style>
	a.xyz_cfm_link:hover{text-decoration:underline;} 
	.xyz_cfm_link{text-decoration:none;} 
</style>

<?php 

if(get_option('xyz_credit_link')=="0"){
	?>
<div style="float:left;background-color: #FFECB3;border-radius:5px;padding: 0px 5px;margin-top: 10px;border: 1px solid #E0AB1B" id="xyz_backlink_div">
	
	Please do a favour by enabling backlink to our site. <a id="xyz_cfm_backlink" style="cursor: pointer;" >Okay, Enable</a>.
<script type="text/javascript">
jQuery(document).ready(function() {

	jQuery('#xyz_cfm_backlink').click(function() {
	
jQuery.ajax
	({
	type: "POST",
	url: "<?php echo plugins_url('contact-form-manager/admin/ajax-backlink.php') ?>",
	data: 'enable=1',
	cache: false,
	success: function(html)
	{	
		jQuery("#xyz_backlink_div").html('Thank you for enabling backlink !');
		jQuery("#xyz_backlink_div").css('background-color', '#D8E8DA');
		jQuery("#xyz_backlink_div").css('border', '1px solid #0F801C');
	}
	});
	

});
});
</script>
</div>
	<?php 
}
?>

<style>
#text {margin:50px auto; width:500px}
.hotspot {color:#900; padding-bottom:1px; border-bottom:1px dotted #900; cursor:pointer}

#tt {position:absolute; display:block; }
#tttop {display:block; height:5px; margin-left:5px;}
#ttcont {display:block; padding:2px 10px 3px 7px;  margin-left:-400px; background:#666; color:#FFF}
#ttbot {display:block; height:5px; margin-left:5px; }
</style>





<div style="margin-top: 10px">
<table style="float:right; ">
<tr>
<td  style="float:right;" >
	<a onmouseover="tooltip.show('Please help us to keep this plugin free forever by donating a dollar');" onmouseout="tooltip.hide();" class="xyz_cfm_link" style="margin-left:8px;margin-right:12px;"   target="_blank" href="http://xyzscripts.com/donate/1">Donate</a>
</td>
<td style="float:right;">
	<a class="xyz_cfm_link" style="margin-left:8px;" target="_blank" href="http://kb.xyzscripts.com/category/contact-form-manager">FAQ</a>
</td>
<td style="float:right;">
	<a class="xyz_cfm_link" style="margin-left:8px;" target="_blank" href="http://docs.xyzscripts.com/category/contact-form-manager">Docs</a>
</td>
<td style="float:right;">
	<a class="xyz_cfm_link" style="margin-left:8px;" target="_blank" href="http://xyzscripts.com/wordpress-plugins/contact-form-manager/details">About</a>
</td>
<td style="float:right;">
	<a class="xyz_cfm_link" target="_blank" href="http://xyzscripts.com">Home</a>
</td>

</tr>
</table>
</div>

<div style="clear: both"></div>