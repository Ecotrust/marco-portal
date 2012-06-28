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
			    <div class="showcase">
			      <img class="span12" src="<?php echo get_template_directory_uri(); ?>/img/map-depth.png"/>
			      <div class="caption">
			        <h2>Resources for Mid-Atlantic <strong>ocean planning.</strong></h2>
			        <p class="pull-right"><a>Launch Marine Planner Now &gt;</a></p>
			      </div>
			    </div>
			  </div>
			</div>

			<!-- Example row of columns -->
			<div class="row bugs">
			  <div class="span4">
			    <div class="wrapper">
			      <img src="<?php echo get_template_directory_uri(); ?>/img/learn.png"/>
			      <h3>Learn</h3>
			      <p>Read the latest news and updates on Mid-Atlantic planning.</p>
			    </div>
			  </div>
			  <div class="span4">
			    <div class="wrapper">
			      <img src="<?php echo get_template_directory_uri(); ?>/img/explore.png"/>

			      <h3>Explore</h3>
			       <p>Access our data catalog and links to other data and services</p>
			     </div>
			 </div>
			  <div class="span4">
			    <div class="wrapper">
			      <img src="<?php echo get_template_directory_uri(); ?>/img/visualize.png"/>
			      <h3>Visualize</h3>
			      <p>Launch our Marine Planner mapping application along with other maps and tools</p>
			    </div>
			  </div>
			</div>

		</div> <!-- end #main -->

	</div> <!-- end #content -->

<?php get_footer(); ?>