// save the initial load hash so we can use it if set
app.hash = window.location.hash;
app.loginHash = app.hash === '#login';
if (app.loginHash) console.log('document ready with #login hash');

app.onResize = function(percent) {

  var height = $(window).height() * (percent || 0.825);
  // when fullscreen be odd?
  if (height) {
    $("#map").height(height);
    $("#map-wrapper").height(height);
    $(".tabs").height(height);
    $("#legend-wrapper").height(height - 20);
    $("#data-accordion").height(height - 92);
    app.map.render('map');
  }
};

$(window).on('resize', function() {
    app.onResize();
});

// add indexof for typeahead
if (!Array.prototype.indexOf) {


    Array.prototype.indexOf = function(obj, start) {
         for (var i = (start || 0), j = this.length; i < j; i++) {
             if (this[i] === obj) { return i; }
         }
         return -1;
    }
 }


// state of the app
app.state = {
  //list of active layer ids in order they appear on the map
  activeLayers: [],
  location: {}
};

// property to store the state of the map for restoring
app.restoreState = {};

ko.applyBindings(app.viewModel);
app.viewModel.loadLayersFromServer().done(function() {
  $('#fullscreen').show
  ();
  $('#loading').hide();
  // app.map.updateSize();
  app.onResize();
  // if we have the hash state go ahead and load it now
  if (app.hash && !app.loginHash) {
    console.log('app.viewModel.locaLayersFromServer without #login hash');
    app.loadStateFromHash(app.hash);
  }
  // autocomplete for filter
  $('.search-box').typeahead({
    source: app.typeAheadSource
  });
});

// initialize the map
app.init();
// Google.v3 uses EPSG:900913 as projection, so we have to
// transform our coordinates
app.map.setCenter(new OpenLayers.LonLat(-73.24, 38.93).transform(
new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")), 7);




$(document).ready(function() {
  app.onResize();
  $(window).resize(app.onResize);

  // if we have the hash state go ahead and load it now
  if (app.hash && !app.loginHash) {
    console.log('document ready without #login hash');
    app.loadStateFromHash(app.hash);
  } 
  // handle coordinate indicator on pointer
  $('#map').bind('mouseleave mouseenter', function(e) {
    $('#pos').toggle();
  });
  $('#map').bind('mousemove', function(e) {
    $('#pos').css({
      left: e.pageX + 20,
      top: e.pageY + 20
    });
  });

  $('.icon-remove-sign').on('click', function(event) {
    $(event.target).prev('input').val('').focus();
  });

  // fullscreen stuff
  // for security reasons, this event listener must be bound directly
  if ( document.getElementById('btn-fullscreen').addEventListener ) {
      document.getElementById('btn-fullscreen').addEventListener('click', function() {
        if ( BigScreen.enabled ) {
          BigScreen.toggle(document.getElementById('fullscreen'));
          // You could also use .toggle(element)
        } else {
          // fallback for browsers that don't support full screen
          $('#fullscreen-error-overlay').show();
        }
      }, false);
  } else {    
      $('#btn-fullscreen').on('click', function() {
        // fallback for browsers that don't support addEventListener
        $('#fullscreen-error-overlay').show();
      });
  }

  BigScreen.onenter = function() {
    // called when entering full screen
    app.viewModel.isFullScreen(true);
    // make map fullscreen
    app.onResize(.99);
    //app.map.updateSize();
    //app.map.render('map');
  };

  BigScreen.onexit = function() {
    // called when exiting full screen
    app.viewModel.isFullScreen(false);
    // return to normal size
    // Not exactly comfortable with the following 2 calls to resize, 
    // but ff kept having problems when other strategies were tried...
    //for firefox
    setTimeout( app.onResize(), 300);
    //app.onResize();
    //for chrome
    setTimeout( app.onResize, 300);
    //app.onResize();
  };
  
  // Basemaps button and drop-down behavior
  //hide basemaps drop-down on mouseout
  $('#basemaps').mouseleave( function(e) {
    if ( $(e.toElement).hasClass('basey') ) { //handler for chrome and ie
        $('#basemaps').addClass('open');
    } else if ( $(e.relatedTarget).hasClass('basey') ) { //handler for ff
        $('#basemaps').addClass('open');
    } else {
        $('#SimpleLayerSwitcher_30').hide();
    }
  });
  
  //hide basemaps drop-down on mouseout
  $('#SimpleLayerSwitcher_30').mouseleave( function() {
    $('#SimpleLayerSwitcher_30').hide();
    $('#basemaps').removeClass('open');
  });
  
  //hide basemaps drop-down on mouseout
  $('#SimpleLayerSwitcher_30').mousedown( function() {
    $('#basemaps').removeClass('open');
  });
  
  //hide basemaps drop-down on mouseout
  $('#SimpleLayerSwitcher_30').mouseenter( function() {
    $('#basemaps').addClass('open');
  });
  
  /* testing mouseenter mouseleave
  $('div.sidebar-nav').mouseenter( function(e) {
    console.log('entering sidebar button');
  }).mouseleave( function(e) {
    console.log('exiting sidebar button');
  });
  */
  /*
  //Opacity popover behavior
  //hide opacity popover when mouse leaves popover or opacity button
  $('.opacity-button.active').mouseout( function() {
    console.log('exiting opacity button');
  });
  */
  $('#opacity-popover').mouseleave( function() {
    app.viewModel.hideOpacity();
  });  
  
  if (app.loginHash) {
    $('#sign-in-button').click();
    app.loginHash = false;
    console.log('activating sign in button');
  }
  
});

$('#bookmark-form').on('submit', function(event) {
  var inputs = {},
    $form = $(this);
  event.preventDefault();
  $(this).find('input, textarea').each(function(i, input) {
    var $input = $(input);
    inputs[$input.attr('name')] = $input.val();
  });
  $.post('/feedback/bookmark', inputs, function() {
    $form.closest('.modal').modal('hide');
  });
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
      $form.closest('.modal').modal('hide');
      //$('#thankyou-modal').modal('show');
   });
   $form.closest('.modal').modal('hide');
});

$(document).mousedown(function(e) {
  //removing bookmark popover from view
  if (e.target.id === "bookmarks-button") {} else if (!$(e.target).closest("#bookmark-popover").length) {
    $('#bookmark-popover').hide();
  }

  //removing layer tooltip popover from view
  var layer_pvr_event = $(e.target).closest(".layer-popover").length;
  if (!layer_pvr_event) {
    $("#layer-popover").hide();
  }

  //removing opacity popover from view
  var op_pvr_event = $(e.target).closest("#opacity-popover").length;
  var op_btn_event = $(e.target).closest(".opacity-button").length;
  if (!op_pvr_event && !op_btn_event) {
    //$('#opacity-popover').hide();
    app.viewModel.hideOpacity();
  }
});