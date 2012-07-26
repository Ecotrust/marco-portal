app.init = function () {

    //to turn basemap indicator off (hide the plus sign)
    //see email from Matt on 7/26 2:24pm with list of controls
    var map = new OpenLayers.Map(null, {
        allOverlays: true,
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        projection: "EPSG:900913"
    });
    esriOcean = new OpenLayers.Layer.XYZ("ESRI Ocean Basemap", "http://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/${z}/${y}/${x}", {
        sphericalMercator: true,
        isBaseLayer: true,
        numZoomLevels: 13
    });
    
    map.addLayers([esriOcean]);
    esriOcean.setZIndex(100);

    map.addControl(new OpenLayers.Control.LayerSwitcher( {
        roundedCorner: true
    }));
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
            
            layer.utfcontrol = new OpenLayers.Control.UTFGrid({
                layers: [layer.utfgrid],
                handlerMode: 'hover',
                callback: function(infoLookup) {
                    app.viewModel.attributeTitle(false);
                    app.viewModel.attributeData(false);
                    if (infoLookup) {
                        var info, 
                            msg;
                        for (var idx in infoLookup) {
                            info = infoLookup[idx];
                            if (info && info.data) {                                     
                                msg = info.data.OBJECTID;
                            } else {
                                app.viewModel.attributeTitle(false);
                                app.viewModel.attributeData(false);
                            }
                        }
                        if (info && info.data) {
                            app.viewModel.attributeTitle('');
                            app.viewModel.attributeData([{'display': 'ID: ', 'data': msg}]);
                        }
                    } 
                    //document.getElementById("info").innerHTML = msg;
                }
            });

            app.map.addControl(layer.utfcontrol); 
            	
            layer.layer = new OpenLayers.Layer.XYZ(layer.name, 
                //layer.type === 'XYZ' ? layer.url : layer.url + '.png', 
                layer.url,
                $.extend({}, opts, 
                    {
                        sphericalMercator: true
                    }
                )
            );  
            //app.addUTFAttribution(layer);
        } else if (layer.type == 'Vector') {
            layer.layer = new OpenLayers.Layer.Vector(
                layer.name,
                {
                    projection: new OpenLayers.Projection('EPSG:3857'),
                    strategies: [new OpenLayers.Strategy.Fixed()],
                    protocol: new OpenLayers.Protocol.HTTP({
                        url: layer.url,
                        format: new OpenLayers.Format.GeoJSON()
                    }),
                    //style: {
                        //fillColor: '#aaa',
                        //strokeWidth
                        //strokeColor
                        //http://dev.openlayers.org/apidocs/files/OpenLayers/Feature/Vector-js.html
                        //title: 'testing'
                    //}
                }
            );
            app.addAttribution(layer);
        } else { //if XYZ with no utfgrid
            // adding layer to the map for the first time		
            layer.layer = new OpenLayers.Layer.XYZ(layer.name, 
                //layer.type === 'XYZ' ? layer.url : layer.url + '.png', 
                layer.url,
                $.extend({}, opts, 
                    {
                        sphericalMercator: true
                    }
                )
            );
        }
        //layer.layer.projection = new OpenLayers.Projection("EPSG:3857");
        app.map.addLayer(layer.layer);            
    }
    layer.layer.opacity = layer.opacity();
    layer.layer.setVisibility(true);
}

app.addUTFAttribution = function(layer) {
    app.map.events.register("mouseover", layer, function(e) {
        //app.viewModel.attributeTitle(this.layer.name);
        //app.viewModel.attributeData( [{'display': '', 'data': this.utfgrid.id}] ); 
        var feature = this.layer.getFeatureById(e.target._featureId);
        if ( feature ) {
            debugger;
            app.viewModel.attributeTitle(this.layer.name);
            app.viewModel.attributeData( [{'display': '', 'data': this.utfgrid.id}] ); 
        }
        /*var feature = this.layer.getFeatureById(e.target._featureId);
        if ( feature ) {
            var attrs = this.attributes,
                title = this.attributeTitle;
            app.viewModel.attributeTitle(title);            
            app.viewModel.attributeData($.map(attrs, function(attr) { 
                return { 'display': attr.display, 'data': feature.data[attr.field] }; 
            }));
        }
        return true;*/
    });
    
    app.map.events.register("mouseout", layer.layer, function(e) {
        app.viewModel.attributeTitle(false);
        app.viewModel.attributeData(false);
    });
    
}

app.addAttribution = function(layer) {
    app.map.events.register(layer.attributeEvent, layer, function(e) {
        var feature = this.layer.getFeatureById(e.target._featureId);
        if ( feature ) {
            var attrs = this.attributes,
                title = this.attributeTitle;
            app.viewModel.attributeTitle(title);            
            app.viewModel.attributeData($.map(attrs, function(attr) { 
                return { 'display': attr.display, 'data': feature.data[attr.field] }; 
            }));
        }
        return true;
    });
    app.map.events.register("mouseout", layer.layer, function(e) {
        app.viewModel.attributeTitle(false);
        app.viewModel.attributeData(false);
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