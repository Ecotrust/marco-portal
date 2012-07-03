	jQuery(document).ready(function() {
		jQuery('#system_notice_area').animate({
			opacity : 'show',
			height : 'show'
		}, 500);

		jQuery('#system_notice_area_dismiss').click(function() {
			jQuery('#system_notice_area').animate({
				opacity : 'hide',
				height : 'hide'
			}, 500);

		});

	});
