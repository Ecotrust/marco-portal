
var guide = {
  id: 'jQuery.PageGuide',
  title: 'Take a quick tour of all the possibilities',
  steps: [
    {
      target: '.navbar img',
      content: $('#help-text-navbar-img').html(),
      direction: 'right',
      arrow: {offsetX: -70, offsetY: 0}
    },
    {
      target: '#dataTab',
      content: $('#help-text-dataTab').html(),
      direction: 'top',
      arrow: {offsetX: 10, offsetY: 20}
    },
    {
      target: '#activeTab',
      content: $('#help-text-activeTab').html(),
      direction: 'top',
      arrow: {offsetX: 10, offsetY: 20}
    },
    {
      target: '.form-search',
      content: $('#help-text-form-search').html(),
      direction: 'right',
      arrow: {offsetX: -50, offsetY: 0}
    }
  ]
}
$(function() {
  // Load the default guide!  
  $.pageguide(guide);
  
  $('#help-tab').on('click', function() {
    if ( $.pageguide('isOpen') ) {
      $.pageguide('close');
    } else {
      $.pageguide('open');
    }
  });
  
});

