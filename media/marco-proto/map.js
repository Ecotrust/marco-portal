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
        attribution: "Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri"
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
    });

    // map.addControl(new OpenLayers.Control.MousePosition({
    //     element: document.getElementById('pos')
    // }));

    map.events.register("moveend", null, function () {
        // update the url when we move
        app.updateUrl();
    });


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
      
    var clearout = function(e) {
        //document.getElementById("output").innerHTML = ""; 
        app.viewModel.attributeTitle(false);
        app.viewModel.attributeData(false);
    };  
    
    map.vectorList = [];
    map.selectFeatureControl = new OpenLayers.Control.SelectFeature(map.vectorList, {
        //hover: true,
        highlightOnly: false,
        renderIntent: "temporary",
        cancelBubble: false,
        eventListeners: {
            //beforefeaturehighlighted: report,
            featurehighlighted: report,
            //boxselectionend: report,
            featureunhighlighted: clearout
        }
    });
    //map.addControl(map.selectFeatureControl);
    //map.selectFeatureControl.activate();  
    
    //UTF Attribution
    map.UTFControl = new OpenLayers.Control.UTFGrid({
        //attributes: layer.attributes,
        layers: [],
        handlerMode: 'click',
        callback: function(infoLookup) {
            app.viewModel.attributeTitle(false);
            app.viewModel.attributeData(false);
            if (infoLookup) {
                var attributes;
                $.each(app.viewModel.visibleLayers(), function (layer_index, potential_layer) {
                    if (!attributes) { //only loop if attributes has not yet been populated
                        for (var idx in infoLookup) {
                            if (!attributes) { //only loop if attributes has not yet been populated
                                var info = infoLookup[idx];
                                if (info && info.data) { 
                                    var newmsg = '',
                                        hasAllAttributes = true,
                                        parentHasAllAttributes = false;
                                    // if info.data has all the attributes we're looking for
                                    // we'll accept this layer as the attribution layer 
                                    if ( ! potential_layer.attributes.length ) {
                                        hasAllAttributes = false;
                                    }
                                    $.each(potential_layer.attributes, function (attr_index, attr_obj) {
                                        if ( !(attr_obj.field in info.data) ) {
                                            hasAllAttributes = false;
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
                                        attributes = potential_layer.attributes;
                                    } else if (parentHasAllAttributes) {
                                        attributes = potential_layer.parent.attributes;
                                    }
                                    if (attributes) { 
                                        var attribute_objs = [];
                                        $.each(attributes, function(index, obj) {
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
                                                        value = value.toFixed(obj.precision);
                                                    }
                                                    catch (e) {
                                                        //keep on keeping on
                                                    }
                                                    attribute_objs.push({'display': obj.display, 'data': value});
                                                }
                                                
                                            }
                                        });
                                        app.viewModel.attributeTitle(potential_layer.name);
                                        //app.viewModel.attributeData([{'display': potential_layer.attributeTitle, 'data': newmsg}]);
                                        app.viewModel.attributeData(attribute_objs);
                                    } 
                                } 
                            }
                        }
                    }
                });
            } 
            //document.getElementById("info").innerHTML = msg;
        }
    });
    map.addControl(map.UTFControl);    

    app.map = map;
    
    app.map.attributes = [];
    app.map.clickOutput = { time: 0, attributes: [] };
    
    app.map.events.register("featureclick", null, function(e) {
        var layer = e.feature.layer.layerModel;
        var date = new Date();
        var newTime = date.getTime();
        var attrs = layer.attributes,
            title = layer.name,
            text = [];
        
        if ( layer.attributes.length ) {
            //app.viewModel.attributeTitle(title); 
            for (var i=0; i<attrs.length; i++) {
                if ( e.feature.data[attrs[i].field] ) {
                    text.push({'display': attrs[i].display, 'data': e.feature.data[attrs[i].field]});
                }
            }
        }
        
        if (newTime - app.map.clickOutput.time > 100) {
            //app.map.clickOutput.attributes = [e.feature.layer.name];
            app.map.clickOutput.attributes = [{'title': title, 'attrs': text}];
            app.map.clickOutput.time = newTime;
        } else {
            //app.map.clickOutput.attributes.push(e.feature.layer.name);
            app.map.clickOutput.attributes.push( {'title': title, 'attrs': text} );
        }
        
        app.viewModel.aggregatedAttributes(app.map.clickOutput.attributes);
        
        //debugger;
    });
    
    
};

app.addLayerToMap = function(layer) {
    if (!layer.layer) {
        var opts = {
            displayInLayerSwitcher: false
        };
        
        /***BEGIN TEMPORARY FIX FOR CORALS LAYER IN IE8***/
        if ( $.browser.msie && $.browser.version < 9.0 && layer.name === "Coldwater Corals" ) {
        //if ( layer.name === "Coldwater Corals" ) {    
            layer.type = 'XYZ';
            layer.url = 'https://s3.amazonaws.com/marco-public-2d/Conservation/CoralTiles/${z}/${x}/${y}.png';
            layer.utfurl = '/media/data_manager/utfgrid/coldwater_corals/${z}/${x}/${y}.json';
        }
        /***END TEMPORARY FIX FOR CORALS LAYER IN IE8***/
        
        if (layer.utfurl || (layer.parent && layer.parent.utfurl)) {
            layer.utfgrid = new OpenLayers.Layer.UTFGrid({
                layerModel: layer,
                url: layer.utfurl ? layer.utfurl : layer.parent.utfurl,
                sphericalMercator: true,
                                 
                utfgridResolution: 4, // default is 2
                displayInLayerSwitcher: false,
                useJSONP: false
            });
            //layer.utfgrid.projection = new OpenLayers.Projection("EPSG:4326");  
            app.map.addLayer(layer.utfgrid);           
            //app.map.UTFControl.layers = [layer.utfgrid];
            //layer.utfcontrol = app.addUTFControl(layer);
            //app.map.addControl(layer.utfcontrol); 
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
            app.map.addLayer(layer.layer);  
            //app.addUTFAttribution(layer);
        } else if (layer.type === 'Vector') {
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
            if (layer.lookupField) {
                var mylookup = {};
                $.each(layer.lookupDetails, function(index, details) {                  
                    mylookup[details.value] = { strokeColor: details.color, 
                                                strokeDashstyle: details.dashstyle, 
                                                fill: details.fill,
                                                fillColor: details.color, 
                                                fillOpacity: 0.5,
                                                externalGraphic: details.graphic }; 
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
            //app.addVectorAttribution(layer);
            app.map.addLayer(layer.layer);  
            //selectFeatureControl = app.map.getControlsByClass("OpenLayers.Control.SelectFeature")[0];
            if (layer.attributes.length) {
                app.map.vectorList.unshift(layer.layer);
                //app.map.selectFeatureControl.setLayer(app.map.vectorList);
            }
        } else if (layer.type === 'ArcRest') {
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
            app.map.addLayer(layer.layer);  
        } else if (layer.type === 'WMS') {
            layer.layer = new OpenLayers.Layer.WMS(
                layer.name, 
                layer.url,
                {
                    'layers': 'basic'
                }
            );
            app.map.addLayer(layer.layer);  
        } else { //if XYZ with no utfgrid
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
            app.map.addLayer(layer.layer);  
        }
        //app.map.addLayer(layer.layer);  
        //layer.layer.projection = new OpenLayers.Projection("EPSG:3857");
    } else if ( layer.utfurl ) { //re-adding utfcontrol for existing utf layers (they are destroyed in layer.deactivateLayer)
        //layer.utfcontrol = app.addUTFControl(layer);
        //app.map.addControl(layer.utfcontrol); 
    }
    layer.layer.opacity = layer.opacity();
    layer.layer.setVisibility(true);
};

app.setLayerVisibility = function(layer, visibility) {
    // if layer is in openlayers, hide it
    if (layer.layer) {
        layer.layer.setVisibility(visibility);
    }
};

app.setLayerZIndex = function(layer, index) {
    layer.layer.setZIndex(index);
};


// block mousehweel when over overlay
$("#overview-overlay-text").hover(
    // mouseenter
    function () {
        var controls = app.map.getControlsByClass('OpenLayers.Control.Navigation');
        console.log('disable');
        for(var i = 0; i < controls.length; ++i) {
            controls[i].disableZoomWheel();
        }
            
    }, 
    function () {
        var controls = app.map.getControlsByClass('OpenLayers.Control.Navigation');
        console.log('enable');
        for(var i = 0; i < controls.length; ++i) {
            controls[i].enableZoomWheel();
        }
    }
)
