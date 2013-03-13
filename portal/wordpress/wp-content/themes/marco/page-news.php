<?php
/*
Template Name: News
*/
?>

<?php get_header(); ?>	
			<div id="content" class="row-fluid">
				<div id="main" class="span10 news" role="main">
						<div class="theme image">
								<img src="<?php echo  get_bloginfo('wpurl'); ?>/assets/img/carousel/dock.jpg"/>
							<div class="caption">
								News and Updates
							</div>
						</div>
						<div class="row-fluid">
							<div class="span12">
							</div>
						</div>
						<div class="row-fluid bugs">

							  <div class="span4">
							  <?php
							  $args = sprintf('category_name=%s&numberposts=1', "Data");
							  $lastposts = get_posts($args);
							  foreach($lastposts as $post) : setup_postdata($post); ?>
							  	<div class="wrapper">
							  		<a href="/portal/category/data/">
								  		<div class="image">
											<img src="/portal/assets/ais2.jpg" class="attachment-medium wp-post-image" alt="ais" title="ais">
								  			<h2>Data</h2>
								  		</div>
							  		</a>
							  		<h4><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>	
							  		<?php the_excerpt(); ?>
							 	</div>
							  </div>	
							  <?php endforeach; ?>
							    <div class="span4">
							    <?php
							    $args = sprintf('category_name=%s&numberposts=1', "Events");
							    $lastposts = get_posts($args);
							    foreach($lastposts as $post) : setup_postdata($post); ?>
							    	<div class="wrapper">
							    		<a href="/portal/category/events/">
							  	  		<div class="image">
							  				<img src="/portal/assets/energy1.jpg" class="attachment-medium wp-post-image" alt="energy" title="energy">
							  	  			<h2>Events</h2>
							  	  		</div>
							    		</a>
							    		<h4><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>	
							    		<?php the_excerpt(); ?>
							   	</div>
							    </div>	
							    <?php endforeach; ?>
							      <div class="span4">
							      <?php
							      $args = sprintf('category_name=%s&numberposts=1', "Updates");
							      $lastposts = get_posts($args);
							      foreach($lastposts as $post) : setup_postdata($post); ?>
							      	<div class="wrapper">
							      		<a href="/portal/category/updates/">
							    	  		<div class="image">
							    				<img src="/portal/assets/planner.jpg" class="attachment-medium wp-post-image" alt="planner" title="planner">
							    	  			<h2>Updates</h2>
							    	  		</div>
							      		</a>
							      		<h4><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>	
							      		<?php the_excerpt(); ?>
							     	</div>
							      </div>	
							      <?php endforeach; ?>
						
					</div>
				</div> <!-- end #main -->
			    <?php get_sidebar(); // sidebar 1 ?>

			</div> <!-- end #content -->
<?php get_footer(); ?>