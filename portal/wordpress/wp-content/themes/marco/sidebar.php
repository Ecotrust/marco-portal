<div class="sidebar span2" role="complementary">
	<div  id="sidebar-nav">
		<?php if ($post->post_name == 'learn') { ?>
			<h3 class="active"><a href="<?php echo get_bloginfo('wpurl'); ?>/learn">Learn</a></h3>
		<? }  else { ?>
		<h3><a href="<?php echo get_bloginfo('wpurl'); ?>/learn">Learn</a></h3>
		<? } ?>
		<ul class="unstyled">
        	<li><a href="/learn/fishing">Fishing</a></li>
        	<li><a href="/learn/maritime-industries">Maritime</a></li>
        	<li><a href="/learn/energy">Renewable Energy</a></li>
        	<li><a href="/learn/security">Security</a></li>
		</ul>
		<?php if ($post->post_name == 'explore') { ?>
			<h3 class="active"><a href="<?php echo get_bloginfo('wpurl'); ?>/explore">Explore</a></h3>
		<? }  else { ?>
		<h3><a href="<?php echo get_bloginfo('wpurl'); ?>/explore">Explore</a></h3>
		<? } ?>
		<ul class="unstyled">
			<li><a href="/explore/catalog">Data Catalog</a></li>
			<li><a href="/explore/needs">Data Priorities</a></li>
		</ul>
		<?php if ($post->post_name == 'visualize') { ?>
			<h3 class="active"><a href="<?php echo get_bloginfo('wpurl'); ?>/explore">Visualize</a></h3>
		<? }  else { ?>
		<h3><a href="<?php echo get_bloginfo('wpurl'); ?>/explore">Visualize</a></h3>
		<? } ?>		
		<ul class="unstyled">
			<ul>
                <li><a href="<?php echo get_bloginfo('wpurl'); ?>/visualize" target="_blank">Marine Planner</a></li>
                <li><a href="<?php echo get_bloginfo('wpurl'); ?>/visualize#cartography">Cartography</a></li>
                <li><a href="<?php echo get_bloginfo('wpurl'); ?>/visualize#collaboration">Collaboration</a></li>
                <li><a href="<?php echo get_bloginfo('wpurl'); ?>/visualize#interactivity">Interactivity</a></li>
            </ul>
		</ul>
	</div>
</div>