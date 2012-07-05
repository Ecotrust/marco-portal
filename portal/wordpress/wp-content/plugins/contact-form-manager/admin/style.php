<?php require_once( dirname( __FILE__ ) .'/../../../../wp-load.php'); ?>
<style type="text/css">

#system_notice_area {
	position: fixed;
	margin-bottom:40px;
	left:25%;
	width:50%;
	height:20px;
	border-radius:5px;
	-moz-border-radius:5px;
	-webkit-border-radius:5px;
	font-weight:bold;
	display:none;
	padding:5px;
	color: #000000;
	text-align: center;
	<?php
	if(is_admin_bar_showing()){
	?>
	top	:28px;
	<?php
	}else{
	?>
	top: 0px;
	<?php
	}
	?>


	}


	
.xyz_fbook{
	
	background-image: url('<?php echo plugins_url("images/facebook.png",__FILE__) ?>');
	height:16px;
	background-repeat: no-repeat;
	background-position: left center;
	padding-left: 15px;
	text-decoration: none;
	
	
	
}
.xyz_support{
	
	background-image: url('<?php echo plugins_url("images/support.png",__FILE__) ?>');
	height:16px;
	background-repeat: no-repeat;
	background-position: left center;
	padding-left: 15px;
	
	
	
	
}
.xyz_twitt{
	
	background-image: url('<?php echo plugins_url("images/twitter.png",__FILE__) ?>');
	height:16px;
	background-repeat: no-repeat;
	background-position: left center;
	padding-left: 15px;
	text-decoration: none;
	
	
	
}
.xyz_gplus{
	
	background-image: url('<?php echo plugins_url("images/gplus.png",__FILE__) ?>');
	height:16px;
	background-repeat: no-repeat;
	background-position: left center;
	padding-left: 15px;
	text-decoration: none;
	
	
}


#contact-form-manager .xyz_gplus{
margin-left: 3px;
}

#contact-form-manager .plugin-version-author-uri {
	
	background-color: #F4F4F4;
	min-height:16px;
	border-radius:5px;
	margin-bottom: 10px;
	font-weight:bold;
	padding: 5px;
	color: #111111;

-webkit-box-shadow: 0 8px 6px -6px black;
	   -moz-box-shadow: 0 8px 6px -6px black;
	        box-shadow: 0 8px 6px -6px black;
	        
}
#contact-form-manager{
background: #a9e8f5; /* Old browsers */

background: -moz-linear-gradient(top,  #ffffff 0%, #a9e8f5 100%); /* FF3.6+ */
background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ffffff), color-stop(100%,#a9e8f5)); /* Chrome,Safari4+ */
background: -webkit-linear-gradient(top,  #ffffff 0%,#a9e8f5 100%); /* Chrome10+,Safari5.1+ */
background: -o-linear-gradient(top,  #ffffff 0%,#a9e8f5 100%); /* Opera 11.10+ */
background: -ms-linear-gradient(top,  #ffffff 0%,#a9e8f5 100%); /* IE10+ */
background: linear-gradient(top,  #ffffff 0%,#a9e8f5 100%); /* W3C */


}
#contact-form-manager .plugin-version-author-uri a,
#contact-form-manager .plugin-version-author-uri a:link,
#contact-form-manager .plugin-version-author-uri a:hover,
#contact-form-manager .plugin-version-author-uri a:active,
#contact-form-manager .plugin-version-author-uri a:visited{
	
	
	color: #111111;
	text-decoration: none;
	
}
#contact-form-manager .plugin-version-author-uri a:hover{

color:#cc811a;
}
#contact-form-manager .plugin-title{

background-image: url('<?php echo plugins_url("images/xyz_logo.png",__FILE__) ?>');
background-repeat: no-repeat;
background-position: left  bottom;

}

</style>