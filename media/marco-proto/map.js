app.init = function () {

    //to turn basemap indicator off (hide the plus sign)
    //see email from Matt on 7/26 2:24pm with list of controls
    var map = new OpenLayers.Map(null, {
        //allOverlays: true,
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        projection: "EPSG:900913"
    });
    esriOcean = new OpenLayers.Layer.XYZ("ESRI Ocean", "http://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/${z}/${y}/${x}", {
        sphericalMercator: true,
        isBaseLayer: true,
        numZoomLevels: 13
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
    
    /* need api key from http://bingmapsportal.com/
    bingHybrid = new OpenLayers.Layer.Bing({
        name: "Bing Hybrid",
        key: "",
        type: "AerialWithLabels"
    });
    */
    
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
    
    map.addControl(new OpenLayers.Control.ZoomBox( {
        //enables zooming to a given extent on the map by holding down shift key while dragging the mouse
    }));
    map.addControl(new OpenLayers.Control.MousePosition({
        element: document.getElementById('pos')
    }));

    map.events.register("moveend", null, function () {
        // update the url when we move
        app.updateUrl();
    });
    
    // callback functions for vector attribution (SelectFeature Control)
    var report = function(e) {
        var layer = e.feature.layer.layerModel;
        if ( layer ) {
            var attrs = layer.attributes,
                title = e.feature.data[attrs[0].field],
                text = [];
            app.viewModel.attributeTitle(title); 
            for (var i=1; i<attrs.length; i++) {
                text.push({'display': attrs[i].display, 'data': e.feature.data[attrs[i].field]});
            }
            app.viewModel.attributeData(text);
            //app.viewModel.attributeData($.map(attrs, function(attr) { 
            //    return { 'display': attr.display, 'data': e.feature.data[attr.field] }; 
            //}));
        }
    };
      
    var clearout = function(e) {
        //document.getElementById("output").innerHTML = ""; 
        app.viewModel.attributeTitle(false);
        app.viewModel.attributeData(false);
    };  
    
    map.vectorList = [];
    map.selectFeatureControl = new OpenLayers.Control.SelectFeature(map.vectorList, {
        hover: true,
        //highlightOnly: true,
        renderIntent: "temporary",
        cancelBubble: false,
        eventListeners: {
            beforefeaturehighlighted: report,
            featurehighlighted: report,
            featureunhighlighted: clearout
        }
    });
    map.addControl(map.selectFeatureControl);
    map.selectFeatureControl.activate();  
    

    app.map = map;
}

app.addLayerToMap = function(layer) {
    if (!layer.layer) {
        var opts = {
            displayInLayerSwitcher: false
        };
        if (layer.utfurl) {
            layer.utfgrid = new OpenLayers.Layer.UTFGrid({
                url: layer.utfurl,
                sphericalMercator: true,
                                 
                utfgridResolution: 4, // default is 2
                displayInLayerSwitcher: false,
                useJSONP: false
            });
            //layer.utfgrid.projection = new OpenLayers.Projection("EPSG:4326");  
            app.map.addLayer(layer.utfgrid); 
            
            layer.utfcontrol = app.addUTFControl(layer);
            app.map.addControl(layer.utfcontrol); 
            	
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
                    style: {
                        fillColor: layer.color,
                        fillOpacity: layer.fillOpacity,
                        //strokeDashStyle: "dash",
                        //strokeOpacity: 1,
                        strokeColor: layer.color,
                        strokeOpacity: .8,
                        //http://dev.openlayers.org/apidocs/files/OpenLayers/Feature/Vector-js.html
                        //title: 'testing'
                        pointRadius: 2
                    },
                    layerModel: layer
                }
            );
            //app.addVectorAttribution(layer);
            app.map.addLayer(layer.layer);  
            //selectFeatureControl = app.map.getControlsByClass("OpenLayers.Control.SelectFeature")[0];
            app.map.vectorList.unshift(layer.layer);
            app.map.selectFeatureControl.setLayer(app.map.vectorList);
        } else if (layer.type === 'ArcRest') {
            layer.layer = new OpenLayers.Layer.ArcGIS93Rest(
                layer.name, 
                layer.url,
                {
                    layers: "show:"+layer.arcgislayers,
                    srs: 'EPSG:3857'
                }
            );
            app.map.addLayer(layer.layer);  
        } else if (layer.type === 'WMS') {
            layer.layer = new OpenLayers.Layer.WMS(
                layer.name, 
                layer.url,
                {
                    //'layers': 'topp:tasmania_cities', transparent: true, format: 'image/gif'
                },
                {
                    isBaseLayer: false
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
        layer.utfcontrol = app.addUTFControl(layer);
        app.map.addControl(layer.utfcontrol); 
    }
    layer.layer.opacity = layer.opacity();
    layer.layer.setVisibility(true);
}

app.addUTFControl = function(layer) {
    return new OpenLayers.Control.UTFGrid({
        attributes: layer.attributes,
        layers: [layer.utfgrid],
        handlerMode: 'hover',
        callback: function(infoLookup) {
            app.viewModel.attributeTitle(false);
            app.viewModel.attributeData(false);
            if (infoLookup) {
                var info, 
                    msg;
                //wish the following for loop wasn't needed (seems wrong when it's only going to loop once)
                for (var idx in infoLookup) {
                    info = infoLookup[idx];
                    if (info && info.data) {  
                        app.viewModel.attributeTitle('');
                        newmsg = '';
                        $.each(this.attributes, function(index, obj) {
                            newmsg += info.data[obj.field];
                        });
                        app.viewModel.attributeData([{'display': '', 'data': newmsg}]);
                    } else {
                        app.viewModel.attributeTitle(false);
                        app.viewModel.attributeData(false);
                    }
                }
            } 
            //document.getElementById("info").innerHTML = msg;
        }
    });
}

app.setLayerVisibility = function(layer, visibility) {
    // if layer is in openlayers, hide it
    if (layer.layer) {
        layer.layer.setVisibility(visibility);
    }
}

app.setLayerZIndex = function(layer, index) {
    layer.layer.setZIndex(index);
}