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
        logo: app.viewModel.showLogo(),
        dls: layers.reverse(),
        basemap: app.map.baseLayer.name,
        themes: {ids: app.viewModel.getOpenThemeIDs()},
        tab: $('#myTab').find('li.active').data('tab'),
        legends: app.viewModel.showLegend() ? 'true': 'false',
        layers: app.viewModel.showLayers() ? 'true': 'false'
        //and active tab
    };
};

$(document).on('map-ready', function () {
    app.state = app.getState();
});

app.layersAreLoaded = false;
app.establishLayerLoadState = function () {
    var loadTimer, status;
    if (app.map.layers.length === 0) {
        app.layersAreLoaded = true;
    } else {
        loadTimer = setInterval(function () {
            status = true;
            $.each(app.map.layers, function (i, layer) {
                if (layer.loading === true) {
                    status = false;
                }
            });
            if (status === true) {
                app.layersAreLoaded = true;
                //console.log('layers are loaded');
                clearInterval(loadTimer);
            }
        }, 100);
    }
        
};
// load compressed state (the url was getting too long so we're compressing it
app.loadCompressedState = function(state) { 
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
        var unloadedDesigns = [];
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
            } else {
                unloadedDesigns.push({id: id, opacity: opacity, isVisible: isVisible});
            }
       }
       if ( unloadedDesigns.length ) {
            app.viewModel.unloadedDesigns = unloadedDesigns;
            $('#designsTab').tab('show'); //to activate the loading of designs
       }
    }
    
    if (state.logo === 'false') {
        app.viewModel.hideLogo();
    }
    
    if (state.print === 'true') {
        app.printMode();
    }
    if (state.borderless === 'true') {
        app.borderLess();
    }

    if (state.basemap) {
        app.map.setBaseLayer(app.map.getLayersByName(state.basemap)[0]);
    }

    app.establishLayerLoadState();
    // data tab and open themes
    if (state.themes) {
        //$('#dataTab').tab('show');
        if (state.themes) {
            $.each(app.viewModel.themes(), function (i, theme) {
                if ( $.inArray(theme.id, state.themes.ids) !== -1 || $.inArray(theme.id.toString(), state.themes.ids) !== -1 ) {
                    if ( app.viewModel.openThemes.indexOf(theme) === -1 ) {
                        //app.viewModel.openThemes.push(theme);
                        theme.setOpenTheme();
                    }
                } else {
                    if ( app.viewModel.openThemes.indexOf(theme) !== -1 ) {
                        app.viewModel.openThemes.remove(theme);
                    }
                }
            });
        } 
    }
    
    //if (app.embeddedMap) {
    if ( $(window).width() < 768 || app.embeddedMap ) {
        state.tab = "data";
    }
    
    // active tab -- the following prevents theme and data layers from loading in either tab (not sure why...disbling for now)
    // it appears the dataTab show in state.themes above was causing the problem...?
    // timeout worked, but then realized that removing datatab show from above worked as well...
    // now reinstating the timeout which seems to fix the toggling between tours issue (toggling to ActiveTour while already in ActiveTab)
    if (state.tab && state.tab === "active") {
        //$('#activeTab').tab('show');
        setTimeout( function() { $('#activeTab').tab('show'); }, 200 );
    } else if (state.tab && state.tab === "designs") {
        setTimeout( function() { $('#designsTab').tab('show'); }, 200 );
    } else {
        setTimeout( function() { $('#dataTab').tab('show'); }, 200 );
    }
    
    if ( state.legends && state.legends === 'true' ) {
        app.viewModel.showLegend(true);
    } else {
        app.viewModel.showLegend(false);
    }

    if (state.layers && state.layers === 'false') {
        app.viewModel.showLayers(false);
        app.map.render('map');
    } else {
        app.viewModel.showLayers(true);
    }

    // map title for print view
    if (state.title) {
        app.viewModel.mapTitle(state.title);
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

// hide buttons and other features for printing
app.printMode = function () {
    $('body').addClass('print');
};

// also hide logo and rules
app.borderLess = function () {
    $('body').addClass('borderless');
};

// load state from fixture or server

app.loadState = function(state) {
    var loadTimer;
    if (state.z || state.login) {
        return app.loadCompressedState(state);
    }

    if (state.print === 'true') {
        app.printMode();
    }
    if (state.borderless === 'true') {
        app.borderLess();
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
    // now that we have our layers
    // to allow for establishing the layer load state
    app.establishLayerLoadState();

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

    if (state.layers && state.layers === 'true') {
        app.viewModel.showLayers(true);
    } else {
        app.viewModel.showLayers(false);
        app.map.render('map');
    }

    // map title for print view
    if (state.title) {
        app.viewModel.mapTitle(state.title);
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


