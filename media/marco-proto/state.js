// represents whether or not restoreState is currently being updated
// example use:  saveStateMode will be false when a user is viewing a bookmark 
app.saveStateMode = true; 

// save the state of app
app.getState = function () {
    var center = app.map.getCenter().transform(
    new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326")),
        layers = $.map(app.viewModel.activeLayers(), function(layer) {
            return layer.id;
        });        
    return {
        location: {
            x: center.lon,
            y: center.lat,
            zoom: app.map.getZoom()
        },
        activeLayers: layers.reverse()
    }
};


// load state from fixture or server
app.loadState = function( state) {
    // turn off active laters
    // create a copy of the activeLayers list and use that copy to iteratively deactivate
    var activeLayers = $.map(app.viewModel.activeLayers(), function(layer) {
        return layer;
    });
    //var activeLayers = $.extend({}, app.viewModel.activeLayers());
    $.each(activeLayers, function (index, layer) {
        layer.deactivateLayer();
    });
    // turn on the layers that should be active
    if (state.activeLayers) {
        $.each(state.activeLayers, function(index, layer_id) {
            app.viewModel.layerIndex[layer_id].activateLayer();
        });
    }

    // Google.v3 uses EPSG:900913 as projection, so we have to
    // transform our coordinates
    app.map.setCenter(new OpenLayers.LonLat(state.location.x, state.location.y).transform(
    new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")), state.location.zoom);

};

// load the state from the url hash
app.loadStateFromHash = function (hash) {
    app.loadState($.deparam(hash.slice(1)));
};

// update the hash
app.updateUrl = function () {
    var state = app.getState();
    // save the restore state
    if (app.saveStateMode) {
        app.restoreState = state;
    }
		
    window.location.hash = $.param(state);
};
