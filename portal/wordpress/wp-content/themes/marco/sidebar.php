				<div id="sidebar1" class="fluid-sidebar sidebar span4" role="complementary">
					<h3><a href="<?php echo get_bloginfo('wpurl'); ?>/learn">Learn</a></h3>
					<ul class="unstyled">
						<li><a href="<?php echo get_bloginfo('wpurl'); ?>/learn/administrative">Administrative</a></li>
						<li><a href="<?php echo get_bloginfo('wpurl'); ?>/learn/conservation">Conservation</a></li>
						<li><a href="<?php echo get_bloginfo('wpurl'); ?>/learn/energy">Energy</a></li>
						<li><a href="<?php echo get_bloginfo('wpurl'); ?>/learn/fishing">Fishing</a></li>
						<li><a href="<?php echo get_bloginfo('wpurl'); ?>/learn/military">Military</a></li>
						<li><a href="<?php echo get_bloginfo('wpurl'); ?>/learn/recreation">Recreation</a></li>
						<li><a href="<?php echo get_bloginfo('wpurl'); ?>/learn/maritime-industries">Maritime Industries</a></li>
					</ul>
					<h3><a href="<?php echo get_bloginfo('wpurl'); ?>/explore">Explore</a></h3>
					<ul class="unstyled">
						<li><a href="<?php echo get_bloginfo('wpurl'); ?>">Data Catalog</a></li>
						<li><a href="<?php echo get_bloginfo('wpurl'); ?>">Data Priorities</a></li>
					</ul>
					<h3><a href="<?php echo get_bloginfo('wpurl'); ?>/visualize">Visualize</a></h3>
					<ul class="unstyled">
						<li><a href="http://dev.marco.marineplanning.org">Planning Tool</a></li>
						<li><a href="<?php echo get_bloginfo('wpurl'); ?>">Feature</a></li>
						<li><a href="<?php echo get_bloginfo('wpurl'); ?>">Feature</a></li>
						<li><a href="<?php echo get_bloginfo('wpurl'); ?>">Feature</a></li>
						<li><a href="<?php echo get_bloginfo('wpurl'); ?>">Feature</a></li>
					</ul>
					 <?php
					// Set up the objects needed
					$my_wp_query = new WP_Query();
					$all_wp_pages = $my_wp_query->query(array('post_type' => 'page'));

					// Get the page as an Object
					$portfolio =  get_page_by_title('Learn');

					// Filter through all pages and find Learn's children
					$portfolio_children = get_page_children($portfolio->ID, $all_wp_pages);

					
					?>
				</div>