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

			  	<div id="marco-carousel" class="showcase carousel slide carousel-fade">
			  	  <!-- Carousel items -->
			  	  <div class="carousel-inner">
			  	    <div class="item active">
			  	    	<img class="span12" src="<?php echo get_template_directory_uri(); ?>/img/map-depth.jpg"/>
			  	    	<div class="caption">
			  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning.</strong></h2>
			  	    	  <p class="pull-right"><a href="/planner">Launch Marine Planner Now &gt;</a></p>
			  	    	</div>
			  	    </div>
			  	    <div class="item">
			  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/dock.jpg"/>
			  	    	<div class="caption">
			  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning.</strong></h2>
			  	    	  <p class="pull-right"><a href="/planner">Launch Marine Planner Now &gt;</a></p>
			  	    	</div>
			  	    </div>
			  	    <div class="item">
			  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/wave.jpg"/>
			  	    	<div class="caption">
			  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning.</strong></h2>
			  	    	  <p class="pull-right"><a href="/planner">Launch Marine Planner Now &gt;</a></p>
			  	    	</div>
			  	    </div>
			  	    <div class="item">
			  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/barge.jpg"/>
			  	    	<div class="caption">
			  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning.</strong></h2>
			  	    	  <p class="pull-right"><a href="/planner">Launch Marine Planner Now &gt;</a></p>
			  	    	</div>
			  	    </div>
			  	    <div class="item">
			  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/loaders.jpg"/>
			  	    	<div class="caption">
			  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning.</strong></h2>
			  	    	  <p class="pull-right"><a href="/planner">Launch Marine Planner Now &gt;</a></p>
			  	    	</div>
			  	    </div>
			  	    <div class="item">
			  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/crab.jpg"/>
			  	    	<div class="caption">
			  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning.</strong></h2>
			  	    	  <p class="pull-right"><a href="/planner">Launch Marine Planner Now &gt;</a></p>
			  	    	</div>
			  	    </div>
			  	  </div>
			  	  <!-- Carousel nav -->
			  	<!--   <a class="carousel-control left" href="#myCarousel" data-slide="prev">&lsaquo;</a>
		  	  <a class="carousel-control right" href="#myCarousel" data-slide="next">&rsaquo;</a> -->
			  	</div>
			  </div>
			</div>

			<!-- Example row of columns -->
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