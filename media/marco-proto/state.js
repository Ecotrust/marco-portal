// represents whether or not restoreState is currently being updated
// example use:  saveStateMode will be false when a user is viewing a bookmark 
app.saveStateMode = true; 

// save the state of app
app.getState = function () {
    var center = app.map.getCenter().transform(
            new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326")),
                layers = $.map(app.viewModel.activeLayers(), function(layer) {
                    return {id: layer.id, opacity: layer.opacity()};
                });   
    return {
        location: {
            x: center.lon,
            y: center.lat,
            zoom: app.map.getZoom()
        },
        activeLayers: layers.reverse(),
        basemap: {name: app.map.baseLayer.name},
        openThemes: {ids: app.viewModel.getOpenThemeIDs()},
        activeTab: {tab: $('#dataTab').closest('li').hasClass('active') ? 'data' : 'active'},
        //description: {  visible: app.viewModel.showDescription(), 
        //                layer_name: app.viewModel.activeInfoLayer().name },
        legends: { visible: app.viewModel.showLegend() ? 'true': 'false' }
        //and active tab
    };
};


// load state from fixture or server
app.loadState = function(state) {
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
       $.each(state.activeLayers, function(index, layer) {
            if (app.viewModel.layerIndex[layer.id]) {
                app.viewModel.layerIndex[layer.id].activateLayer();
                app.viewModel.layerIndex[layer.id].opacity(layer.opacity);
            }
            
       });
    }
    
    if (state.basemap) {
        app.map.setBaseLayer(app.map.getLayersByName(state.basemap.name)[0]);
    }
    
    if (state.activeTab && state.activeTab.tab === 'active') {
        $('#activeTab').tab('show');
    } else {
        if (state.activeTab || state.openThemes) {
            $('#dataTab').tab('show');
            if (state.openThemes) {
                $.each(app.viewModel.themes(), function (i, theme) {
                    if ( $.inArray(theme.id, state.openThemes.ids) !== -1 || $.inArray(theme.id.toString(), state.openThemes.ids) !== -1 ) {
                        theme.setOpenTheme();
                    } else {
                        app.viewModel.openThemes.remove(theme);
                    }
                });
            } 
        }
    }
    
    /*if ( state.description && state.description.visible === "true" ) {
        //debugger;
        //app.viewModel.activeInfoLayer(state.description.name);
        //app.viewModel.showDescription(true);
        app.viewModel.showDescription(false);
    } else {
        app.viewModel.showDescription(false);
    }*/
    
    if ( state.legends && state.legends.visible === "true" ) {
        app.viewModel.showLegend(true);
    } else {
        app.viewModel.showLegend(false);
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
