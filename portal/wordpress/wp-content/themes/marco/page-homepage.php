<?php
/*
Template Name: Homepage
*/
?>

<?php get_header(); ?>
	<div id="content" class="row">
		<div id="main" class="span12" role="main">
			<div class="row">
			  <div class="span12">
			  	<div id="marco-carousel" class="carousel slide carousel-fade">
			  		<div class="showcase">
				  	  <div class="carousel-inner">
				  	    <div class="item active">

				  	    	<img class="span12" src="<?php echo get_template_directory_uri(); ?>/img/map-depth.jpg"/>
				  	    	<div class="caption">
				  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning</strong></h2>
				  	    	  <p class="pull-right"><a href="/planner">Launch Marine Planner &gt;</a></p>
				  	    	</div>
				  	    	<div class="attrib">
				  	    		<i class="icon-map-marker icon-white"></i>
				  	    		<p class="text">Here is some attribution text for a picture</p>
				  	    	</div>
				  	    </div>
				  	    <div class="item">
				  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/dock.jpg"/>
				  	    	<div class="caption">
				  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning</strong></h2>
				  	    	  <p class="pull-right"><a href="/planner">Launch Marine Planner &gt;</a></p>
				  	    	</div>
				  	    	<div class="attrib">
				  	    		<i class="icon-map-marker icon-white"></i>
				  	    		<p class="text">Here is some attribution text for a picture</p>
				  	    	</div>
				  	    </div>
				  	    <div class="item">
				  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/wave.jpg"/>
				  	    	<div class="caption">
				  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning</strong></h2>
				  	    	  <p class="pull-right"><a href="/planner">Launch Marine Planner &gt;</a></p>
				  	    	</div>
				  	    	<div class="attrib">
				  	    		<i class="icon-map-marker icon-white"></i>
				  	    		<p class="text">Here is some attribution text for a picture</p>
				  	    	</div>
				  	    </div>
				  	    <div class="item">
				  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/barge.jpg"/>
				  	    	<div class="caption">
				  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning</strong></h2>
				  	    	  <p class="pull-right"><a href="/planner">Launch Marine Planner &gt;</a></p>
				  	    	</div>
				  	    	<div class="attrib">
				  	    		<i class="icon-map-marker icon-white"></i>
				  	    		<p class="text">Here is some attribution text for a picture</p>
				  	    	</div>
				  	    </div>
				  	    <div class="item">
				  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/loaders.jpg"/>
				  	    	<div class="caption">
				  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning</strong></h2>
				  	    	  <p class="pull-right"><a href="/planner">Launch Marine Planner &gt;</a></p>
				  	    	</div>
				  	    	<div class="attrib">
				  	    		<i class="icon-map-marker icon-white"></i>
				  	    		<p class="text">Here is some attribution text for a picture</p>
				  	    	</div>
				  	    </div>
				  	    <div class="item">
				  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/crab.jpg"/>
				  	    	<div class="caption">
				  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning</strong></h2>
				  	    	  <p class="pull-right"><a href="/planner">Launch Marine Planner &gt;</a></p>
				  	    	</div>
				  	    	<div class="attrib">
				  	    		<i class="icon-map-marker icon-white"></i>
				  	    		<p class="text">Here is some attribution text for a picture</p>
				  	    	</div>
				  	    </div>
				  	  </div>
				  	</div>
			  	</div>
			  </div>
			</div>

			<!-- Example mrow of columns -->
			<div class="row bugs">
			  <div class="span4">
				<a href="<?php echo get_bloginfo('wpurl'); ?>/learn">
					<div class="wrapper">
					      <div class="icon" id="learn-img"></div>
					      <h3>Learn</h3>
					      <p>Understand the range of regional ocean planning needs.</p>
					</div>
				</a>
			  </div>
			  <div class="span4">
			  	<a href="<?php echo get_bloginfo('wpurl'); ?>/explore">
				    <div class="wrapper">
						<div class="icon" id="explore-img"></div>				      
				      	<h3>Explore</h3>
				       	<p>Access our current data and see future information needs.</p>
				     </div>
				 </a>
			 </div>
			  <div class="span4">
			  	<a href="<?php echo get_bloginfo('wpurl'); ?>/visualize">			  	
				    <div class="wrapper">
				    	<div class="icon" id="visualize-img"></div>
				     	<h3>Visualize</h3>
						<p>Launch our Marine Planner mapping application along with other maps and tools</p>
				    </div>
				</a>
			  </div>
			</div>

		</div> <!-- end #main -->

	</div> <!-- end #content -->

<?php get_footer(); ?>