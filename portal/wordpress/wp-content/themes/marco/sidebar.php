<div class="sidebar span2" role="complementary">
	<div  id="sidebar-nav">
		<?php if ($post->post_name == 'learn') { ?>
			<h3 class="active"><a href="<?php echo get_bloginfo('wpurl'); ?>/learn">Learn</a></h3>
		<? }  else { ?>
		<h3><a href="<?php echo get_bloginfo('wpurl'); ?>/learn">Learn</a></h3>
		<? } ?>
		<ul class="unstyled">
			<li><a href="/learn/administrative">Administrative</a></li>
        	<li><a href="/learn/fishing">Fishing</a></li>
        	<li><a href="/learn/conservation">Marine Life</a></li>
        	<li><a href="/learn/maritime-industries">Maritime</a></li>
        	<li><a href="/learn/recreation">Recreation</a></li>
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
		<h3><a href="<?php echo get_bloginfo('wpurl'); ?>/visualize">Visualize</a></h3>
		<? } ?>		
		<ul class="unstyled">
			<ul>
                <li><a href="/visualize" target="_blank">Marine Planner</a></li>
                <li><a href="<?php echo get_bloginfo('wpurl'); ?>/visualize#cartography">Cartography</a></li>
                <li><a href="<?php echo get_bloginfo('wpurl'); ?>/visualize#collaboration">Collaboration</a></li>
                <li><a href="<?php echo get_bloginfo('wpurl'); ?>/visualize#interactivity">Interactivity</a></li>
            </ul>
		</ul>
        <div class="row-fluid feature-story">
            <div class="span12"></div>
        </div>
        <?php if ($post->post_name == 'about') { ?>
            <div class="row-fluid">
                <div class="span12 factsheet">
                    <a href="/media/marco/factsheets/MARCO_factsheet_portal_F.pdf">
                        <img src="/media/marco/img/themes/sheets/MARCO_factsheet_portal_F.png">
                    </a>
                    <p class="pull-right">
                        <a href="/media/marco/factsheets/MARCO_factsheet_portal_F.pdf"></a>
                        <a href="/media/marco/factsheets/MARCO_factsheet_portal_F.pdf">download pdf...</a>
                    </p>
                </div>
            </div>
        <? } ?>
        
	</div>
    
</div>