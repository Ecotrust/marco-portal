					<hr>

			<footer>
			  <div class="row">
			    <div class="span9 social">
			      <h5>Contact Us</h5>
			      	<a href="" data-toggle="modal" data-target="#feedback-modal">info@midatlanticocean.org</a><br/>
			      	732-263-5392
			      </p>
			    </div>
			    <div class="span3 social">
			    	<div class="pull-right">
				        <h5>connect with us</h5>              
				        <p class="pull-right">
					        <a href="<?php echo bloginfo('rss2_url'); ?>"><i class="icon-rss icon-large"></i></a>
					        <a href="https://twitter.com/PortalMARCO"><i class="icon-twitter icon-large"></i></a>
					    </p>
				     <!--    <a href=""><i class="icon-linkedin icon-large"></i></a>
				        <a href=""><i class="icon-google-plus icon-large"></i></a> -->

				    </div>

			    </div>
			  </div>
			</footer>

		
		</div> <!-- end #container -->
		
		<!-- scripts are now optimized via Modernizr.load -->	
		<script src="<?php echo get_template_directory_uri(); ?>/assets/js/bootstrap.min.js"></script>
		<script src="<?php echo get_template_directory_uri(); ?>/assets/js/jquery-ui.js"></script>

		<script>
		$(document).ready(function () {
			$('#marco-carousel').carousel({
			  interval: 4500
			});
			$('#marco-carousel').carousel(<?php echo rand(1, 6); ?>);
			$('#visualize-carousel').carousel({
			  interval: 4500
			});

			$('.attrib').hover(
				function (event) {
					var $target = $(event.target), 
						$text = $target.find('.text');
					$text.show().position({
						of: $target,
						my: "right top",
						at: "left bottom",
						offset: "2px"
					});
						
				},
				function (event) {
					$(event.target).find('.text').hide();
				}
			);

			$('.icon-remove-sign').on('click', function (event) {
				$(event.target).prev('input').val('').focus();
			});

			$('#feedback-form').on('submit', function (event) {
			  var feedback = {}, $form = $(this);
			  event.preventDefault();
			   $(this).find('input, textarea').each(function (i, input) {
			      var $input = $(input);
			      feedback[$input.attr('name')] = $input.val();
			   });
	           feedback.url = window.location.href;
			   $.post('/feedback/send', feedback, function () {
			      $form.closest('.modal').modal('hide')
			   });
			   $form.closest('.modal').modal('hide')
			});
			    

		});
		</script>
		<!--[if lt IE 7 ]>
  			<script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js"></script>
  			<script>window.attachEvent('onload',function(){CFInstall.check({mode:'overlay'})})</script>
		<![endif]-->
		
		<?php wp_footer(); // js scripts are inserted using this function ?>

	</body>

</html>