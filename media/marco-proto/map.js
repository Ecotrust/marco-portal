app.init = function () {

    //to turn basemap indicator off (hide the plus sign)
    //see email from Matt on 7/26 2:24pm with list of controls
    var map = new OpenLayers.Map(null, {
        //allOverlays: true,
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        projection: "EPSG:3857"
    });
    
    esriOcean = new OpenLayers.Layer.XYZ("ESRI Ocean", "http://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/${z}/${y}/${x}", {
        sphericalMercator: true,
        isBaseLayer: true,
        numZoomLevels: 13,
        attribution: "Sources: Esri, GEBCO, NOAA, National Geographic, DeLorme, NAVTEQ, Geonames.org, and others"
    });
    
    openStreetMap = new OpenLayers.Layer.OSM("Open Street Map", "http://a.tile.openstreetmap.org/${z}/${x}/${y}.png", {
        sphericalMercator: true,
        isBaseLayer: true,
        numZoomLevels: 13
    });
    googleStreet = new OpenLayers.Layer.Google("Google Streets", {
        sphericalMercator: true,
        isBaseLayer: true,
        numZoomLevels: 13
    });
    googleTerrain = new OpenLayers.Layer.Google("Google Physical", {
        type: google.maps.MapTypeId.TERRAIN,
        sphericalMercator: true,
        isBaseLayer: true,
        numZoomLevels: 13
    });
    googleSatellite = new OpenLayers.Layer.Google("Google Satellite", {
        type: google.maps.MapTypeId.SATELLITE,
        sphericalMercator: true,
        isBaseLayer: true,
        numZoomLevels: 13
    });
    
    /*var bingHybrid = new OpenLayers.Layer.Bing( {
        name: "Bing Hybrid",
        key: "AvD-cuulbvBqwFDQGNB1gCXDEH4S6sEkS7Yw9r79gOyCvd2hBvQYPaRBem8cpkjv",
        type: "AerialWithLabels",
        sphericalMercator: true,
        isBaseLayer: true,
        numZoomLevels: 13
    });*/
    
    // need api key from http://bingmapsportal.com/
    /*var bingHybrid = new OpenLayers.Layer.Bing({
        name: "Bing Hybrid",
        key: "AvD-cuulbvBqwFDQGNB1gCXDEH4S6sEkS7Yw9r79gOyCvd2hBvQYPaRBem8cpkjv",
        type: "AerialWithLabels"
    });*/
    
    nauticalCharts = new OpenLayers.Layer.WMS("Nautical Charts", "http://egisws02.nos.noaa.gov/ArcGIS/services/RNC/NOAA_RNC/ImageServer/WMSServer", 
        {
            layers: 'null'
        },
        {
            isBaseLayer: true,
            numZoomLevels: 13,
            projection: "EPSG:3857"
        }
    );
    
    map.addLayers([esriOcean, openStreetMap, googleStreet, googleTerrain, googleSatellite, nauticalCharts]);
    
    //map.addLayers([esriOcean]);
    esriOcean.setZIndex(100);

    map.addControl(new SimpleLayerSwitcher());
    
    //Scale Bar
    var scalebar = new OpenLayers.Control.ScaleBar( {
        displaySystem: "english",
        minWidth: 100, //default
        maxWidth: 150, //default
        divisions: 2, //default
        subdivisions: 2, //default
        showMinorMeasures: false //default
    });
    map.addControl(scalebar);    

    map.zoomBox = new OpenLayers.Control.ZoomBox( {
        //enables zooming to a given extent on the map by holding down shift key while dragging the mouse
    });

    map.addControl(map.zoomBox);

    // only allow onetime zooming with box
    map.events.register("zoomend", null, function () {
        if (map.zoomBox.active) {
            app.viewModel.deactivateZoomBox();
        }   
        if( map.getZoom() < 5)
        {
            map.zoomTo(5);
        }        
    });

    // map.addControl(new OpenLayers.Control.MousePosition({
    //     element: document.getElementById('pos')
    // }));

    map.events.register("moveend", null, function () {
        // update the url when we move
        app.updateUrl();
    });

    /*
    // callback functions for vector attribution (SelectFeature Control)
    var report = function(e) {
        var layer = e.feature.layer.layerModel;
        
        if ( layer.attributes.length ) {
            var attrs = layer.attributes,
                title = layer.name,
                text = [];
            app.viewModel.attributeTitle(title); 
            for (var i=0; i<attrs.length; i++) {
                if ( e.feature.data[attrs[i].field] ) {
                    text.push({'display': attrs[i].display, 'data': e.feature.data[attrs[i].field]});
                }
            }
            app.viewModel.attributeData(text);
        }
    };
    */
    /*  
    var clearout = function(e) {
        //document.getElementById("output").innerHTML = ""; 
        app.viewModel.attributeTitle(false);
        app.viewModel.attributeData(false);
    };  
    */
    
    app.map = map;
    
    app.map.attributes = [];
    //app.map.clickOutput = { time: 0, attributes: [] };
    app.map.clickOutput = { time: 0, attributes: {} };
    
    //UTF Attribution
    map.UTFControl = new OpenLayers.Control.UTFGrid({
        //attributes: layer.attributes,
        layers: [],
        //events: {fallThrough: true},
        handlerMode: 'click',
        callback: function(infoLookup, lonlat, xy) {   
            app.map.utfGridClickHandling(infoLookup, lonlat, xy);
        }
    });
    map.addControl(map.UTFControl);    
    
    app.map.utfGridClickHandling = function(infoLookup, lonlat, xy) {
        var clickAttributes = [],
            date = new Date(),
            newTime = date.getTime();
            
        if (newTime - app.map.clickOutput.time > 500) {
            app.map.clickOutput.attributes = {};
            app.map.clickOutput.time = newTime;
        } 
        
        for (var idx in infoLookup) {
            $.each(app.viewModel.visibleLayers(), function (layer_index, potential_layer) {
              if (potential_layer.type !== 'Vector') {
                var new_attributes,
                    info = infoLookup[idx];
                if (info && info.data) { 
                    var newmsg = '',
                        hasAllAttributes = true,
                        parentHasAllAttributes = false;
                    // if info.data has all the attributes we're looking for
                    // we'll accept this layer as the attribution layer 
                    //if ( ! potential_layer.attributes.length ) {
                    hasAllAttributes = false;
                    //}
                    $.each(potential_layer.attributes, function (attr_index, attr_obj) {
                        if ( attr_obj.field in info.data ) {
                            hasAllAttributes = true;
                        }
                    });
                    if ( !hasAllAttributes && potential_layer.parent) {
                        parentHasAllAttributes = true;
                        if ( ! potential_layer.parent.attributes.length ) {
                            parentHasAllAttributes = false;
                        }
                        $.each(potential_layer.parent.attributes, function (attr_index, attr_obj) {
                            if ( !(attr_obj.field in info.data) ) {
                                parentHasAllAttributes = false;
                            }
                        });
                    }
                    if (hasAllAttributes) {
                        new_attributes = potential_layer.attributes;
                    } else if (parentHasAllAttributes) {
                        new_attributes = potential_layer.parent.attributes;
                    }
                    if (new_attributes) { 
                        var attribute_objs = [];
                        $.each(new_attributes, function(index, obj) {
                            if ( potential_layer.compress_attributes ) {
                                var display = obj.display + ': ' + info.data[obj.field];
                                attribute_objs.push({'display': display, 'data': ''});
                            } else {
                                /*** SPECIAL CASE FOR ENDANGERED WHALE DATA ***/
                                var value = info.data[obj.field];
                                if (value === 999999) {
                                    attribute_objs.push({'display': obj.display, 'data': 'No Survey Effort'});
                                } else {
                                    try {
                                        //set the precision and add any necessary commas
                                        value = value.toFixed(obj.precision).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    }
                                    catch (e) {
                                        //keep on keeping on
                                    }
                                    attribute_objs.push({'display': obj.display, 'data': value});
                                }
                            }
                        });
                        var title = potential_layer.name,
                            text = attribute_objs;
                        if ( title === 'OCS Lease Blocks' ) {
                            //title = 'OCS Lease Blocks -- DRAFT REPORT';
                            text = app.viewModel.getOCSAttributes(title, info.data);
                        } else if ( title === 'Sea Turtles' ) {
                            text = app.viewModel.getSeaTurtleAttributes(title, info.data);
                        } else if ( title === 'Toothed Mammals (All Seasons)' ) {
                            text = app.viewModel.getToothedMammalAttributes(title, info.data);
                        } else if ( title === 'Wind Speed' ) {
                            text = app.viewModel.getWindSpeedAttributes(title, info.data);
                        } else if ( title === 'BOEM Wind Planning Areas' ) {
                            text = app.viewModel.getWindPlanningAreaAttributes(title, info.data);
                        } else if ( title === 'Party & Charter Boat' ) {
                            text = app.viewModel.adjustPartyCharterAttributes(attribute_objs);
                        }
                        clickAttributes[title] = text;
                        //app.viewModel.aggregatedAttributes(app.map.clickOutput.attributes);
                    } 
                } 
              }
            });
            $.extend(app.map.clickOutput.attributes, clickAttributes);
            app.viewModel.aggregatedAttributes(app.map.clickOutput.attributes);
        }
        /*app.viewModel.updateMarker();
        setTimeout( function() {
            if (app.marker) {
                console.log(lonlat);
                console.log(xy);
                app.marker.display(true);   
            }
        }, 100);*/
        app.viewModel.updateMarker(lonlat);
        app.marker.display(true); 
        /*app.markers.clearMarkers();
        app.marker = new OpenLayers.Marker(lonlat, app.markers.icon);
        app.marker.map = app.map;
        app.marker.display(true); */
    }; //end utfGridClickHandling
      
    app.map.events.register("featureclick", null, function(e, test) {
        var layer = e.feature.layer.layerModel || e.feature.layer.scenarioModel;
        if (layer) {
            var date = new Date();
            var newTime = date.getTime();
            var text = [],
                title = layer.name;
            
            if ( layer.scenarioAttributes && layer.scenarioAttributes.length ) {
                var attrs = layer.scenarioAttributes;
                for (var i=0; i<attrs.length; i++) {
                    text.push({'display': attrs[i].title, 'data': attrs[i].data});
                }
            } else if ( layer.attributes.length ) {
                var attrs = layer.attributes;
                
                for (var i=0; i<attrs.length; i++) {
                    if ( e.feature.data[attrs[i].field] ) {
                        text.push({'display': attrs[i].display, 'data': e.feature.data[attrs[i].field]});
                    }
                }
            } else if ( app.viewModel.isSelectedLeaseBlock(layer.name) ) {
                text = app.viewModel.getOCSAttributes(title, e.feature.attributes);
            }
            
            if (newTime - app.map.clickOutput.time > 300) {
                app.map.clickOutput.attributes = {};
                app.map.clickOutput.time = newTime;
            } 
            app.map.clickOutput.attributes[title] = text;
            app.viewModel.aggregatedAttributes(app.map.clickOutput.attributes);
            
        }
        
        //app.viewModel.updateMarker(app.map.getLonLatFromViewPortPx(e.xy));
        //the following delay is so that the "click" handler below gets activated (and the marker is created) before the marker is updated here
        setTimeout( function() {
            if (app.marker) {
                app.marker.display(true);   
            }
        }, 100);
    });
    
    app.map.events.register("nofeatureclick", null, function(e) {
        var date = new Date();
        var newTime = date.getTime();
        if (newTime - app.map.clickOutput.time > 300) {
            app.viewModel.closeAttribution();
        } 
    });
    
    app.markers = new OpenLayers.Layer.Markers( "Markers" );
    var size = new OpenLayers.Size(16,25);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    //var icon = new OpenLayers.Icon('/media/marco-proto/assets/img/red-pin.png', size, offset);
    app.markers.icon = new OpenLayers.Icon('/media/marco-proto/assets/img/red-pin.png', size, offset);
    app.map.addLayer(app.markers);
      
    
    //place the marker on click events
    app.map.events.register("click", app.map , function(e){
        /*app.marker = new OpenLayers.Marker(app.map.getLonLatFromViewPortPx(e.xy), app.markers.icon);
        app.marker.map = app.map;
        app.marker.display(false);
        app.viewModel.updateMarker();*/
        app.viewModel.updateMarker(app.map.getLonLatFromViewPortPx(e.xy));
        //the following is in place to prevent flash of marker appearing on what is essentially no feature click
        //display is set to true in the featureclick and utfgridclick handlers (when there is actually a hit)
        app.marker.display(false);
    });
    
    app.map.removeLayerByName = function(layerName) {
        for (var i=0; i<app.map.layers.length; i++) {
            if (app.map.layers[i].name === layerName) {
                app.map.removeLayer(app.map.layers[i]);
                i--;
            }
        }
    };
    
};

app.addLayerToMap = function(layer) {
    if (!layer.layer) {
        /***BEGIN TEMPORARY FIX FOR CORALS LAYER IN IE8***/
        if ( $.browser.msie && $.browser.version < 9.0 && layer.name === "Coldwater Corals" ) {
        //if ( layer.name === "Coldwater Corals" ) {    
            layer.type = 'XYZ';
            layer.url = 'https://s3.amazonaws.com/marco-public-2d/Conservation/CoralTiles/${z}/${x}/${y}.png';
            layer.utfurl = '/media/data_manager/utfgrid/coldwater_corals/${z}/${x}/${y}.json';
        }
        /***END TEMPORARY FIX FOR CORALS LAYER IN IE8***/
        
        if (layer.utfurl || (layer.parent && layer.parent.utfurl)) {
            app.addUtfLayerToMap(layer);
        } else if (layer.type === 'Vector') {
            app.addVectorLayerToMap(layer);
        } else if (layer.type === 'ArcRest') {
            app.addArcRestLayerToMap(layer);
        } else if (layer.type === 'WMS') {
            app.addWmsLayerToMap(layer);
        } else { //if XYZ with no utfgrid
            app.addXyzLayerToMap(layer);
        }
    } 
    app.map.addLayer(layer.layer); 
    layer.layer.opacity = layer.opacity();
    layer.layer.setVisibility(true);
};

// add XYZ layer with no utfgrid
app.addXyzLayerToMap = function(layer) {
    var opts = { displayInLayerSwitcher: false };
        
    // adding layer to the map for the first time		
    layer.layer = new OpenLayers.Layer.XYZ(layer.name, 
        //layer.type === 'XYZ' ? layer.url : layer.url + '.png', 
        layer.url,
        $.extend({}, opts, 
            {
                sphericalMercator: true,
                isBaseLayer: false //previously set automatically when allOverlays was set to true, must now be set manually
            }
        )
    ); 
};

app.addWmsLayerToMap = function(layer) {
    layer.layer = new OpenLayers.Layer.WMS(
        layer.name, 
        layer.url,
        {
            'layers': 'basic'
        }
    );
};

app.addArcRestLayerToMap = function(layer) {
    layer.layer = new OpenLayers.Layer.ArcGIS93Rest(
        layer.name, 
        layer.url,
        {
            layers: "show:"+layer.arcgislayers,
            srs: 'EPSG:3857',
            transparent: true
        },
        {
            isBaseLayer: false
        }
    );
};

app.addVectorLayerToMap = function(layer) {
    var styleMap = new OpenLayers.StyleMap( {
        fillColor: layer.color,
        fillOpacity: layer.fillOpacity,
        //strokeDashStyle: "dash",
        //strokeOpacity: 1,
        strokeColor: layer.color,
        strokeOpacity: layer.defaultOpacity,
        //strokeLinecap: "square",
        //http://dev.openlayers.org/apidocs/files/OpenLayers/Feature/Vector-js.html
        //title: 'testing'
        pointRadius: 2,
        externalGraphic: layer.graphic,
        graphicWidth: 8,
        graphicHeight: 8,
        graphicOpacity: layer.defaultOpacity
    });
    if (layer.name === 'Coral Protection Mockups') {
        /*styleMap.styles['default']['defaultStyle']['label'] = '${NAME}';
        styleMap.styles['default']['defaultStyle']['fontColor'] = "red";
        styleMap.styles['default']['defaultStyle']['fontSize'] = "14px";
        styleMap.styles['default']['defaultStyle']['labelAlign'] = "cm";
        styleMap.styles['default']['defaultStyle']['labelOutlineColor'] = "white";
        styleMap.styles['default']['defaultStyle']['labelOutlineWidth'] = 3;*/
    }
    if (layer.lookupField) {
        var mylookup = {};
        $.each(layer.lookupDetails, function(index, details) {    
            var fillOp = 0.5;
            //the following are special cases for Shipping Lanes that ensure suitable attribution with proper display 
            if (details.value === 'Precautionary Area') {
                fillOp = 0.0; 
            } else if (details.value === 'Shipping Safety Fairway') {
                fillOp = 0.0;
            } else if (details.value === 'Traffic Lane') {
                fillOp = 0.0;
            }
            mylookup[details.value] = { 
                strokeColor: details.color, 
                strokeDashstyle: details.dashstyle, 
                fill: details.fill,
                fillColor: details.color, 
                fillOpacity: fillOp,
                externalGraphic: details.graphic 
            }; 
            /*special case for Discharge Flow
            if (layer.lookupField === "Flow") {
                mylookup[details.value] = { 
                    strokeColor: layer.color,
                    pointRadius: details.value * 5
                }; 
                console.log(mylookup);
            }*/
        });
        styleMap.addUniqueValueRules("default", layer.lookupField, mylookup);
        //styleMap.addUniqueValueRules("select", layer.lookupField, mylookup);
    }
    layer.layer = new OpenLayers.Layer.Vector(
        layer.name,
        {
            projection: new OpenLayers.Projection('EPSG:3857'),
            displayInLayerSwitcher: false,
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                url: layer.url,
                format: new OpenLayers.Format.GeoJSON()
            }),
            styleMap: styleMap,                    
            layerModel: layer
        }
    );

};

app.addUtfLayerToMap = function(layer) {
    var opts = { displayInLayerSwitcher: false };
    layer.utfgrid = new OpenLayers.Layer.UTFGrid({
        layerModel: layer,
        url: layer.utfurl ? layer.utfurl : layer.parent.utfurl,
        sphericalMercator: true,
        //events: {fallThrough: true},
        utfgridResolution: 4, // default is 2
        displayInLayerSwitcher: false,
        useJSONP: false
    });
     
    app.map.addLayer(layer.utfgrid);      
    
    if (layer.type === 'ArcRest') {
        app.addArcRestLayerToMap(layer);
    } else if (layer.type === 'XYZ') {
        //maybe just call app.addXyzLayerToMap(layer)
        app.addXyzLayerToMap(layer);
        /*
        layer.layer = new OpenLayers.Layer.XYZ(
            layer.name, 
            layer.url,
            $.extend({}, opts, 
                {
                    sphericalMercator: true,
                    isBaseLayer: false //previously set automatically when allOverlays was set to true, must now be set manually
                }
            )
        );  
        */
    } else {
        //debugger;
    }
};

app.setLayerVisibility = function(layer, visibility) {
    // if layer is in openlayers, hide/show it
    if (layer.layer) {
        layer.layer.setVisibility(visibility);
    }
};

app.setLayerZIndex = function(layer, index) {
    layer.layer.setZIndex(index);
};


app.reCenterMap = function () {
    app.map.setCenter(new OpenLayers.LonLat(app.state.x, app.state.y).transform(
        new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")), 7);
};

// block mousehweel when over overlay
$("#overview-overlay-text").hover(
    // mouseenter
    function () {
        var controls = app.map.getControlsByClass('OpenLayers.Control.Navigation');
        for(var i = 0; i < controls.length; ++i) {
            controls[i].disableZoomWheel();
        }
            
    }, 
    function () {
        var controls = app.map.getControlsByClass('OpenLayers.Control.Navigation');
        for(var i = 0; i < controls.length; ++i) {
            controls[i].enableZoomWheel();
        }
    }
);
