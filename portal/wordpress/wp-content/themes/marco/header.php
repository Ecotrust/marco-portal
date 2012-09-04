<!doctype html>  

<!--[if IEMobile 7 ]> <html <?php language_attributes(); ?>class="no-js iem7"> <![endif]-->
<!--[if lt IE 7 ]> <html <?php language_attributes(); ?> class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html <?php language_attributes(); ?> class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html <?php language_attributes(); ?> class="no-js ie8"> <![endif]-->
<!--[if (gte IE 9)|(gt IEMobile 7)|!(IEMobile)|!(IE)]><!--><html <?php language_attributes(); ?> class="no-js"><!--<![endif]-->
	
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		
		<title><?php echo wp_title('', true, 'right'); ?></title>
				
		<meta name="viewport" content="width=device-width; initial-scale=1.0">
		
		<!-- icons & favicons -->
		<!-- For iPhone 4 -->
		<link rel="apple-touch-icon-precomposed" sizes="114x114" href="<?php echo get_template_directory_uri(); ?>/library/images/icons/h/apple-touch-icon.png">
		<!-- For iPad 1-->
		<link rel="apple-touch-icon-precomposed" sizes="72x72" href="<?php echo get_template_directory_uri(); ?>/library/images/icons/m/apple-touch-icon.png">
		<!-- For iPhone 3G, iPod Touch and Android -->
		<link rel="apple-touch-icon-precomposed" href="<?php echo get_template_directory_uri(); ?>/library/images/icons/l/apple-touch-icon-precomposed.png">
		<!-- For Nokia -->
		<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/library/images/icons/l/apple-touch-icon.png">
		<!-- For everything else -->
		<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/favicon.ico">
		<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/themes/base/jquery-ui.css" type="text/css" media="all" />
		
		
		<!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if necessary -->
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
		<script>window.jQuery || document.write(unescape('%3Cscript src="<?php echo get_template_directory_uri(); ?>/library/js/libs/jquery-1.7.1.min.js"%3E%3C/script%3E'))</script>
		
		<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js" type="text/javascript"></script>

		<script src="<?php echo get_template_directory_uri(); ?>/library/js/modernizr.full.min.js"></script>
		
		<!-- media-queries.js (fallback) -->
		<!--[if lt IE 9]>
			<script src="http://css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script>
		<![endif]-->

		<!-- html5.js -->
		<!--[if lt IE 9]>
			<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
		
  		<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">
		
		<!-- wordpress head functions -->
		<?php wp_head(); ?>
		<!-- end of wordpress head -->
		
		<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/bootstrap.css">
		<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/bootstrap-responsive.css">

		<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/style.css">
		
		<!-- marco stylesheet -->
		<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/css/marco_style.css">

		
		<?php 

			// check wp user level
			get_currentuserinfo(); 
			// store to use later
			global $user_level; 
		
		?>
				
	</head>
	
	<body <?php body_class(); ?>>

		<header role="banner">
			<div class="navbar navbar-fixed-top">
			  <div class="navbar-inner">
			    <div class="container">
			        <a href="<?php echo get_bloginfo('wpurl'); ?>">
			        	<img src="<?php echo get_template_directory_uri(); ?>/img/marco-logo.gif"/>
			        </a>
			       <!-- .btn-navbar is used as the toggle for collapsed navbar content -->
			      <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
			     	 <span class="icon-bar"></span>
			      	 <span class="icon-bar"></span>
			      	 <span class="icon-bar"></span>
			      </a>
			       
			      <div class="pull-right nav-collapse">
			        <ul class="nav">
			          <li class="<?php echo $pagename == 'news' ? 'active' : null ?>"><a a href="<?php echo get_bloginfo('wpurl'); ?>/news">News</a></li>
			          <li class="<?php echo $pagename == 'about' ? 'active' : null ?>"><a href="<?php echo get_bloginfo('wpurl'); ?>/about">About the&nbsp;Portal</a></li>
			          <li><a href="http://www.midatlanticocean.org/" target="_blank">Visit MARCO</a></li>
			        </ul>
			        <form class="form-search pull-right" action="<?php echo home_url( '/' ); ?>" method="get">
			          <input type="text" class="input-medium search-box" name="s" id="search" value="<?php the_search_query(); ?>">
			          <i class="icon-remove-sign icon-large"></i>	
			          <button type="submit" class="btn">Search</button>
			        </form>
			      </div><!--/.nav-collapse -->
			    </div>
			  </div>
			</div>
		</header> <!-- end header -->
	<div id="feedback-tab" data-toggle="modal" data-target="#feedback-modal">
	    feedback
	</div>
	<div id="feedback-modal" class="modal hide fade">
	    <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
	        <h3>Feedback</h3>
	    </div>
	    <form class="form-horizontal" id="feedback-form">
	    <div class="modal-body">        
	        <div class="control-group">
	          <label class="control-label" for="name">Full Name</label>
	          <div class="controls">
	            <input class="input-xlarge" type="text" name="name" placeholder="Full Name" required>
	          </div>
	        </div>
	        <div class="control-group">
	          <label class="control-label" for="email">Email Address</label>
	          <div class="controls">
	            <input class="input-xlarge" type="email" name="email" placeholder="Email Address" required>
	          </div>
	        </div>
	        <div class="control-group">
	          <label class="control-label" for="comment">Comment</label>
	          <div class="controls">
	              <textarea class="input-xlarge" rows="3" name="comment" required></textarea>
	          </div>
	        </div>
	       <!-- <div class="control-group">
	          <div class="controls">
	            <label class="checkbox">
	              <input type="checkbox" name='listAdd'> Add me to the mailing list...
	            </label>
	          </div>
	        </div>-->
	    </div>
	    <div class="modal-footer">
	        <a href="#" class="btn" data-dismiss="modal">Close</a>
	        <button type="submit" class="btn btn-primary">Send Feedback</a>
	    </div>
	  </form>
	</div>


		<div class="container">
