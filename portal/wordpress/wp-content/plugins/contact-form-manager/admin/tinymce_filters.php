<?php

if(!function_exists('xyz_tinymce_config'))
{

function xyz_tinymce_config( $init )
{
	$init['apply_source_formatting'] = true;

	// Pass $init back to WordPress
	return $init;
}
add_filter('tiny_mce_before_init', 'xyz_tinymce_config');

}


if(!function_exists('xyz_tinymce_htmledit'))
{

function xyz_tinymce_htmledit($c)
{
	$c = str_replace( array('&amp;', '&lt;', '&gt;'), array('&', '<', '>'), $c );
	$c = wpautop($c);
	$c = htmlspecialchars($c, ENT_NOQUOTES);
	return $c;
}
add_filter('htmledit_pre', 'xyz_tinymce_htmledit', 999);
}


if(!function_exists('xyz_tinymce_replace'))
{

function xyz_tinymce_replace()
{
	?>
<script type="text/javascript">
if ( typeof(jQuery) != 'undefined' ) {
jQuery('body').bind('afterPreWpautop', function(e, o){
o.data = o.unfiltered
.replace(/caption\]\[caption/g, 'caption] [caption')
.replace(/<object[\s\S]+?<\/object>/g, function(a) {
return a.replace(/[\r\n]+/g, ' ');
});
}).bind('afterWpautop', function(e, o){
o.data = o.unfiltered;
});
}
</script>
<?php
}
add_action( 'after_wp_tiny_mce', 'xyz_tinymce_replace' );
}
?>