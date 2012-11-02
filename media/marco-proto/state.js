// represents whether or not restoreState is currently being updated
// example use:  saveStateMode will be false when a user is viewing a bookmark 
app.saveStateMode = true; 

// save the state of app
app.getState = function () {
    var center = app.map.getCenter().transform(
            new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326")),
                layers = $.map(app.viewModel.activeLayers(), function(layer) {
                    //return {id: layer.id, opacity: layer.opacity(), isVisible: layer.visible()};
                    return [ layer.id, layer.opacity(), layer.visible() ];
                });   
    return {
        x: center.lon.toFixed(2),
        y: center.lat.toFixed(2), 
        z: app.map.getZoom(),
        dls: layers.reverse(),
        basemap: app.map.baseLayer.name,
        themes: {ids: app.viewModel.getOpenThemeIDs()},
        tab: $('#dataTab').closest('li').hasClass('active') ? 'data' : 'active',
        legends: app.viewModel.showLegend() ? 'true': 'false'
        //and active tab
    };
};

// load compressed state (the url was getting too long so we're compressing it
app.loadCompressedState = function(state) { 
    console.dir(state);
    // turn off active laters
    // create a copy of the activeLayers list and use that copy to iteratively deactivate
    var activeLayers = $.map(app.viewModel.activeLayers(), function(layer) {
        return layer;
    });
    $.each(activeLayers, function (index, layer) {
        layer.deactivateLayer();
    });
    // turn on the layers that should be active
    if (state.dls) {
        for (x=0; x < state.dls.length; x=x+3) {
            var id = state.dls[x+2],
                opacity = state.dls[x+1],
                isVisible = state.dls[x];
            if (app.viewModel.layerIndex[id]) {
                app.viewModel.layerIndex[id].activateLayer();
                app.viewModel.layerIndex[id].opacity(opacity);
                //must not be understanding something about js, but at the least the following seems to work now...
                if (isVisible || !isVisible) {
                    if (isVisible !== 'true' && isVisible !== true) {
                        app.viewModel.layerIndex[id].toggleVisible();
                    }
                }
            }
       }
    }
    
    if (state.basemap) {
        app.map.setBaseLayer(app.map.getLayersByName(state.basemap)[0]);
    }
    
    // data tab and open themes
    if (state.themes) {
        //console.log('starting with data tab');
        //$('#dataTab').tab('show');
        if (state.themes) {
            $.each(app.viewModel.themes(), function (i, theme) {
                if ( $.inArray(theme.id, state.themes.ids) !== -1 || $.inArray(theme.id.toString(), state.themes.ids) !== -1 ) {
                    if ( app.viewModel.openThemes.indexOf(theme) === -1 ) {
                        app.viewModel.openThemes.push(theme);
                    }
                } else {
                    if ( app.viewModel.openThemes.indexOf(theme) !== -1 ) {
                        app.viewModel.openThemes.remove(theme);
                    }
                }
            });
        } 
    }
    // active tab -- the following prevents theme and data layers from loading in either tab (not sure why...disbling for now)
    // it appears the dataTab show in state.themes above was causing the problem...?
    // timeout worked, but then realized that removing datatab show from above worked as well...
    // now reinstating the timeout which seems to fix the toggling between tours issue (toggling to ActiveTour while already in ActiveTab)
    if (state.tab && state.tab === "active") {
        //console.log('showing active tab');
        //$('#activeTab').tab('show');
        setTimeout( function() { $('#activeTab').tab('show'); }, 200 );
    } else if (state.tab && state.tab === "designs") {
        setTimeout( function() { $('#designsTab').tab('show'); }, 200 );
    } else {
        setTimeout( function() { $('#dataTab').tab('show'); }, 200 );
    }
    
    if ( state.legends && state.legends === "true" ) {
        app.viewModel.showLegend(true);
    } else {
        app.viewModel.showLegend(false);
    }

    // Google.v3 uses EPSG:900913 as projection, so we have to
    // transform our coordinates
    app.setMapPosition(state.x, state.y, state.z);
    //app.map.setCenter(
    //    new OpenLayers.LonLat(state.x, state.y).transform(
    //        new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913") ), state.z);
    
    // is url is indicating a login request then show the login modal
    // /visualize/#login=true
    if (!app.is_authenticated && state.login) { // not sure 
        $('#sign-in-modal').modal('show');
    }
    
};

app.setMapPosition = function(x, y, z) {
    app.map.setCenter(
        new OpenLayers.LonLat(x, y).transform(
            new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913") ), z);
};

// load state from fixture or server
app.loadState = function(state) {
    if (state.z || state.login) {
        return app.loadCompressedState(state);
    }
    // turn off active laters
    // create a copy of the activeLayers list and use that copy to iteratively deactivate
    var activeLayers = $.map(app.viewModel.activeLayers(), function(layer) {
        return layer;
    });
    //var activeLayers = $.extend({}, app.viewModel.activeLayers());
    
    // turn on the layers that should be active
    app.viewModel.deactivateAllLayers();
    if (state.activeLayers) {
        $.each(state.activeLayers, function(index, layer) {
            if (app.viewModel.layerIndex[layer.id]) {
                app.viewModel.layerIndex[layer.id].activateLayer();
                app.viewModel.layerIndex[layer.id].opacity(layer.opacity);
                //must not be understanding something about js, but at the least the following seems to work now...
                if (layer.isVisible || !layer.isVisible) {
                    if (layer.isVisible !== 'true' && layer.isVisible !== true) {
                        app.viewModel.layerIndex[layer.id].toggleVisible();
                    }
                }
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
    
    if ( state.legends && state.legends.visible === "true" ) {
        app.viewModel.showLegend(true);
    } else {
        app.viewModel.showLegend(false);
    }
    
    // Google.v3 uses EPSG:900913 as projection, so we have to
    // transform our coordinates
    if (state.location) {
        app.map.setCenter(new OpenLayers.LonLat(state.location.x, state.location.y).transform(
        new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")), state.location.zoom);
    }
    
    // is url is indicating a login request then show the login modal
    if (!app.is_authenticated && state.login) {
        $('#sign-in-modal').modal('show');
    }
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
    app.viewModel.currentURL(window.location.pathname + window.location.hash);
};
