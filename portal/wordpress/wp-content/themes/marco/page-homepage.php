<?php
/*
Template Name: Homepage
*/
?>

<?php get_header(); ?>
	<div id="content" class="row">
		<div id="main" class="span12 home" role="main">
			<div class="row">
			  <div class="span12">
			  	<div id="marco-carousel" class="carousel slide carousel-fade">
			  		<div class="showcase">
				  	  <div class="carousel-inner">
				  	    <div class="item active">
				  	    	<img class="span12" src="<?php echo get_template_directory_uri(); ?>/img/map-depth.jpg"/>
				  	    	<div class="caption">
				  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning</strong></h2>
				  	    	  <p class="pull-right"><a target="_blank" href="/planner">Launch Marine Planner &gt;</a></p>
				  	    	</div>
				  	    	
				  	    </div>
				  	    <div class="item">
				  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/dock.jpg"/>
				  	    	<div class="caption">
				  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning</strong></h2>
				  	    	  <p class="pull-right"><a target="_blank" href="/planner">Launch Marine Planner &gt;</a></p>
				  	    	</div>
				  	    	
				  	    </div>
  	    		  	    <div class="item">
  	    		  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/artificial_reef.jpg"/>
  	    		  	    	<div class="attrib">
  	      	    			     <i class="icon-map-marker icon-white"></i><p></p>
  	    		  	    		<p class="text" style="display: none; top: 32px; left: -193px;">Photo © Nick Caloyianis Productions</p>
  	    		  	    	</div>
  	    		  	    	<div class="caption">
  	    		  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning</strong></h2>
  	    		  	    	  <p class="pull-right"><a target="_blank" href="/planner">Launch Marine Planner &gt;</a></p>
  	    		  	    	</div>
  	    		  	    	
  	    		  	    </div>
				  	    <div class="item">
				  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/wave.jpg"/>
				  	    	<div class="caption">
				  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning</strong></h2>
				  	    	  <p class="pull-right"><a target="_blank" href="/planner">Launch Marine Planner &gt;</a></p>
				  	    	</div>
				  	    	
				  	    </div>
				  	    <div class="item">
				  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/bottom.jpg"/>
				  	    	<div class="attrib">
		  	    			     <i class="icon-map-marker icon-white"></i><p></p>
				  	    		<p class="text" style="display: none; top: 32px; left: -193px;">Photo © Nick Caloyianis Productions</p>
				  	    	</div>
				  	    	<div class="caption">
				  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning</strong></h2>
				  	    	  <p class="pull-right"><a target="_blank" href="/planner">Launch Marine Planner &gt;</a></p>
				  	    	</div>
				  	    	
				  	    </div>
				  	    <div class="item">
				  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/barge.jpg"/>
				  	    	<div class="caption">
				  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning</strong></h2>
				  	    	  <p class="pull-right"><a target="_blank" href="/planner">Launch Marine Planner &gt;</a></p>
				  	    	</div>  	
				  	    </div>
				  	    <div class="item">
				  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/loaders.jpg"/>
				  	    	<div class="caption">
				  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning</strong></h2>
				  	    	  <p class="pull-right"><a target="_blank" href="/planner">Launch Marine Planner &gt;</a></p>
				  	    	</div>
				  	    	
				  	    </div>
				  	    <div class="item">
				  	    	<img class="span12" src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/crab.jpg"/>
				  	    	<div class="caption">
				  	    	  <h2>Resources for Mid-Atlantic <strong>ocean planning</strong></h2>
				  	    	  <p class="pull-right"><a target="_blank" href="/planner">Launch Marine Planner &gt;</a></p>
				  	    	</div>
				  	    	
				  	    </div>
				  	  </div>
				  	</div>
			  	</div>
			  </div>
			</div>

			<!-- Example mrow of columns -->
			<div class="row">
				<div class="span8 bugs">
					<a href="<?php echo get_bloginfo('wpurl'); ?>/visualize">
						<div class="wrapper row">
							<div>
								<div class="icon" id="visualize-img"></div>
								<h3>Visualize</h3>
								<p>Launch our Marine Planner mapping application along with other maps and tools</p>										
							</div>

						</div>
					</a>
				</div>
				<div class="span4 news">
					<div class="bugs">
					 <?php
					 $args = sprintf('category_name=%s&numberposts=1', "Featured");
					 $lastposts = get_posts($args); 
					 foreach($lastposts as $post) : setup_postdata($post); ?>
					  	<div class="wrapper">
					  		<div class="image">
								<?php if ( has_post_thumbnail() ) {
									the_post_thumbnail();
								} ?>
					  			<h2>Featured</h2>
					  		</div>
					  		<h4><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h4>	
					  		<?php the_excerpt(); ?>
						</div>
					  <?php endforeach; ?>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="span4 bugs">
				<a href="<?php echo get_bloginfo('wpurl'); ?>/learn">
					<div class="wrapper">
					      <div class="icon" id="learn-img"></div>
					      <h3>Learn</h3>
					      <p>Understand the range of regional ocean planning needs.</p>
					</div>
				</a>
			  </div>
				<div class="span4 bugs">
			  	<a href="<?php echo get_bloginfo('wpurl'); ?>/explore">
				    <div class="wrapper">
						<div class="icon" id="explore-img"></div>				      
				      	<h3>Explore</h3>
				       	<p>Access our current data and see future information needs.</p>
				     </div>
				 </a>
			 </div>
			  <div class="span4">
					<div class="home-news-block">
						<h3>News &amp; Events</h3>
						<?php
						$args = sprintf('category_name=%s&numberposts=1', "News");
						$lastposts = get_posts($args); 
						foreach($lastposts as $post) : setup_postdata($post); ?>
							<div class="news-item">
								<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
								<?php the_excerpt(); ?>
							</div>
						<?php endforeach;
						$args = sprintf('category_name=%s&numberposts=1', "Events");
						$lastposts = get_posts($args); 
						foreach($lastposts as $post) : setup_postdata($post); ?>
							<div class="news-item">
								<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
								<?php the_excerpt(); ?>
							</div>
						<?php endforeach; ?>
				    </div>
			  </div>
			</div>
		</div> <!-- end #main -->

	</div> <!-- end #content -->

<?php get_footer(); ?>