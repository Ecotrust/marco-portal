
app.pageguide = {};

/* THE DEFAULT PAGE GUIDE */

var defaultGuide = {
  id: 'default-guide',
  title: 'Default Guide',
  steps: [
    {
      target: '#dataTab',
      content: $('#help-text-dataTab').html(),
      direction: 'top',
      arrow: {offsetX: 45, offsetY: 10}
    },
    {
      target: '#activeTab',
      content: $('#help-text-activeTab').html(),
      direction: 'top',
      arrow: {offsetX: 65, offsetY: 10}
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
      arrow: {offsetX: -95, offsetY: 10}
    }
  ]
}

var defaultGuideOverrides = {
  events: {
    open: function () {
      //alert("The guide has begun!");
      //open the basemaps buttons and keep them open
      $('#basemaps').addClass('open');
      app.pageguide.preventBasemapsClose = true;
      //increase the z-value of SimpleLayerSwitcher so it falls on top of the pageguide icon
      $('#SimpleLayerSwitcher_30').css('z-index', 1100);
      //adjust the pageguide icon so it is left of the open basemaps buttons 
      for (var i=0; i < defaultGuide.steps.length; i++) {
        if ( defaultGuide.steps[i].target === '#basemaps' ) {
            defaultGuide.steps[i].arrow.offsetX = 0;
        }
      }      
      $('#dataTab').tab('show');
    },
    close: function () {
      //alert("The guide has ended!");
      //return the zindex of the SimpleLayerSwitcher to its original value
      $('#SimpleLayerSwitcher_30').css('z-index', 1005);
      //deactivate the prevention of the basemaps buttons closing
      app.pageguide.preventBasemapsClose = true;
      //close the basemaps buttons
      $('#basemaps').removeClass('open');
      //return the offset of the pageguide icon so it doesn't move out of place as the guide closes
      for (var i=0; i < defaultGuide.steps.length; i++) {
        if ( defaultGuide.steps[i].target === '#basemaps' ) {
            defaultGuide.steps[i].arrow.offsetX = -95;
        }
      }
      //return the map state to what it was before the pageguide began
      app.loadState(app.pageguide.state);
      app.saveStateMode = true;
    }
  },
  step: {
    events: {
      select: function() {
        if ($(this).data('idx') === 0) {
            app.viewModel.showLayers(true);
            $('#dataTab').tab('show');
        } else if ($(this).data('idx') === 1) {
            app.viewModel.showLayers(true);
            $('#activeTab').tab('show');
        } else {
            //app.viewModel.showLayers(true);
            //$('#dataTab').tab('show');
            //$('#basemaps').addClass('open');
        }
        //alert("Step " + ($(this).data('idx') + 1) + " has been selected.");
      }
    }
  }
}

/* THE DATA PANEL PAGE GUIDE */

var dataGuide = {
  id: 'data-guide',
  title: 'Data Guide',
  steps: [
    {
      target: '#dataTab',
      content: $('#help-text-data-tour-dataTab').html(),
      direction: 'top',
      arrow: {offsetX: 10, offsetY: 20}
    },
    {
      target: '.form-search',
      content: $('#help-text-data-tour-form-search').html(),
      direction: 'top',
      arrow: {offsetX: 180, offsetY: 0}
    },
    {
      target: '.accordion-heading',
      content: $('#help-text-data-tour-theme').html(),
      direction: 'right',
      arrow: {offsetX: -10, offsetY: 10}
    },
    {
      target: 'div[name*="Regional Ocean Partnerships"]',
      content: $('#help-text-data-tour-layer').html(),
      direction: 'right',
      arrow: {offsetX: -10, offsetY: 10}
    }
  ]
}

var dataGuideOverrides = {
  events: {
    open: function () {
      //alert("The guide has begun!");    
      //show the data tab, close any open themes, deactivate all layers, and open the first theme
      //NOTE:  the following will need to be executed BEFORE this event handler (before 'open' is called)
      $('#dataTab').tab('show');
      app.viewModel.closeAllThemes();
      app.viewModel.deactivateAllLayers();
      app.viewModel.themes()[0].setOpenTheme();
      app.setMapPosition(-73, 38.5, 7);
    },
    close: function () { // activated regardless of whether the 'tour' was clicked  or the 'close' was clicked?
      //alert("The guide has ended!");
      //NOTE: for some reason it seems that the following 4 lines are needed both here and in the 'tour' click event handler
      app.viewModel.deactivateAllLayers();
      app.viewModel.closeAllThemes();
      app.loadState(app.pageguide.state);
      app.saveStateMode = true;
      $.pageguide(defaultGuide, defaultGuideOverrides);
    }
  },
  step: {
    events: {
      select: function() {
        if ($(this).data('idx') === 0) {
            app.viewModel.deactivateAllLayers();
        } else if ($(this).data('idx') === 1) {
            app.viewModel.deactivateAllLayers();
        } else if ($(this).data('idx') === 2) {
            //alert("Step 2");
            app.viewModel.deactivateAllLayers();
            app.viewModel.closeAllThemes();
            app.viewModel.themes()[0].setOpenTheme();
        } else if ($(this).data('idx') === 3) {
            //alert("Step 3");
            app.viewModel.closeAllThemes();
            app.viewModel.themes()[0].setOpenTheme();
            for (var i=0; i < app.viewModel.themes()[0].layers().length; i++) {
                if ( app.viewModel.themes()[0].layers()[i].name === 'Regional Ocean Partnerships' ) {
                    app.viewModel.themes()[0].layers()[i].activateLayer();
                }
            }
            for (var i=0; i < app.viewModel.themes()[0].layers().length; i++) {
                if ( app.viewModel.themes()[0].layers()[i].name === 'Marine Jurisdictions' ) {
                    $.each(app.viewModel.themes()[0].layers()[i].subLayers, function(index, sublayer) {
                        sublayer.activateLayer();
                    });
                }
            }
        }
        //alert("Step " + ($(this).data('idx') + 1) + " has been selected.");
      }
    }
  }
}

/* THE ACTIVE PANEL PAGE GUIDE */

var activeGuide = {
  id: 'active-guide',
  title: 'Active Guide',
  steps: [
    {
      target: '#activeTab',
      content: $('#help-text-active-tour-activeTab').html(),
      direction: 'top',
      arrow: {offsetX: 80, offsetY: 0}
    },
    {
      target: '.opacity-button',
      content: $('#help-text-active-tour-opacity-button').html(),
      direction: 'top',
      arrow: {offsetX: 15, offsetY: 5}
    },
    {
      target: '.ui-sortable',
      content: $('#help-text-active-tour-ui-sortable').html(),
      direction: 'right',
      arrow: {offsetX: -20, offsetY: 70}
    }
  ]
}

var activeGuideOverrides = {
  events: {
    open: function () {
      //alert("The guide has begun!"); 
      
        //show the active tab, close any open themes, deactivate all layers, and activate the desired layers
        //NOTE:  the following will need to be executed BEFORE the open event handler (before 'open' is called)
        $('#activeTab').tab('show');
        app.viewModel.closeAllThemes();
        app.viewModel.deactivateAllLayers();
        //activate desired layers
        for (var i=0; i < app.viewModel.themes()[0].layers().length; i++) {
            if ( app.viewModel.themes()[0].layers()[i].name === 'OCS Lease Blocks' ) { //might be more robust if indexOf were used
                app.viewModel.themes()[0].layers()[i].activateLayer();
            }
        }
        for (var i=0; i < app.viewModel.themes()[2].layers().length; i++) {
            if ( app.viewModel.themes()[2].layers()[i].name === 'Benthic Habitats (South)' ) {
                app.viewModel.themes()[2].layers()[i].activateLayer();
            }
        }
        app.setMapPosition(-75, 37.6, 8);

    },
    close: function () { // activated regardless of whether the 'tour' was clicked  or the 'close' was clicked?
      //alert("The guide has ended!");
      //for some reason it seems that the following 4 lines are needed both here and in the 'tour' click event handler
      app.viewModel.deactivateAllLayers();
      app.viewModel.closeAllThemes();
      app.loadState(app.pageguide.state);
      app.saveStateMode = true;
      $.pageguide(defaultGuide, defaultGuideOverrides);
    }
  },
  step: {
    events: {
      select: function() {
        if ($(this).data('idx') === 0) {
            //alert("Step 1");
            $('#activeTab').tab('show');
        } else if ($(this).data('idx') === 1) {
            //alert("Step 2");
            $('#activeTab').tab('show');
            $('.opacity-button:first').click();
        } else if ($(this).data('idx') === 2) {
            //alert("Step 3");
            $('#activeTab').tab('show');
        }
        //alert("Step " + ($(this).data('idx') + 1) + " has been selected.");
      }
    }
  }
}


$(function() {
  // Load the default guide!  
  $.pageguide(defaultGuide, defaultGuideOverrides);
  //$.pageguide(dataGuide, dataGuideOverrides);
  //$.pageguide(activeGuide, activeGuideOverrides);
  
  $('#help-tab').on('click', function() {
    if ( $.pageguide('isOpen') ) { // activated when 'tour' is clicked
        // close the pageguide
        $.pageguide('close');
        
        //restore the state to what it was before the tour
        app.loadState(app.pageguide.state);
        app.saveStateMode = true;
    } else {
        // start the pageguide 
        
        //show the data layers panel
        app.viewModel.showLayers(true);
      
        //save state
        app.pageguide.state = app.getState();
        app.saveStateMode = false;
         
        //start the tour
        setTimeout( function() { $.pageguide('open'); }, 200 );
      
    }
  });
  
  /*$('#active-tour').on('click', function() {
    debugger;
    //$.pageguide('load', guide2);
    //$.pageguide('unload');
  });*/
  
});

