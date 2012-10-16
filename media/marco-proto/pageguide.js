
var guide = {
  id: 'jQuery.PageGuide',
  title: 'Take a quick tour of all the possibilities',
  steps: [
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
    },
    {
      target: '.olControlZoom',
      content: $('#help-text-olControlZoom').html(),
      direction: 'right',
      arrow: {offsetX: 0, offsetY: 0}
    },
    {
      target: '#basemaps',
      content: $('#help-text-basemaps').html(),
      direction: 'left',
      arrow: {offsetX: -80, offsetY: 30}
    }
  ]
}
var guideOverrides = {
  events: {
    open: function () {
      //alert("The guide has begun!");
      
    },
    close: function () {
      //alert("The guide has ended!");
      
    }
  },
  step: {
    events: {
      select: function() {
        
        //alert("Step " + ($(this).data('idx') + 1) + " has been selected.");
      }
    }
  }
}

$(function() {
  // Load the default guide!  
  $.pageguide(guide, guideOverrides);
  
  $('#help-tab').on('click', function() {
    if ( $.pageguide('isOpen') ) {
      $.pageguide('close');
    } else {
      $.pageguide('open');
    }
  });
  
});

