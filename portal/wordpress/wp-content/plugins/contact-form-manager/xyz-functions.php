<?php


if(!function_exists('xyz_trim_deep'))
{

function xyz_trim_deep($value) {
	if ( is_array($value) ) {
		$value = array_map('xyz_trim_deep', $value);
	} elseif ( is_object($value) ) {
		$vars = get_object_vars( $value );
		foreach ($vars as $key=>$data) {
			$value->{$key} = xyz_trim_deep( $data );
		}
	} else {
		$value = trim($value);
	}

	return $value;
}

}


if(!function_exists('xyz_plugin_get_version'))
{
	function xyz_plugin_get_version() 
	{
		if ( ! function_exists( 'get_plugins' ) )
			require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		$plugin_folder = get_plugins( '/' . plugin_basename( dirname( XYZ_CFM_PLUGIN_FILE ) ) );
		// 		print_r($plugin_folder);
		return $plugin_folder['contact-form-manager.php']['Version'];
	}
}



if(!function_exists('xyz_cfm_links')){
function xyz_cfm_links($links, $file) {
	$base = plugin_basename(XYZ_CFM_PLUGIN_FILE);
	if ($file == $base) {

		$links[] = '<a href="http://xyzscripts.com/support/" class="xyz_support" title="Support"></a>';
		$links[] = '<a href="http://twitter.com/xyzscripts" class="xyz_twitt" title="Follow us on twitter"></a>';
		$links[] = '<a href="https://www.facebook.com/xyzscripts" class="xyz_fbook" title="Facebook"></a>';
		$links[] = '<a href="https://plus.google.com/101215320403235276710/" class="xyz_gplus" title="+1"></a>';
	}
	return $links;
}
}
add_filter( 'plugin_row_meta','xyz_cfm_links',10,2);

?>