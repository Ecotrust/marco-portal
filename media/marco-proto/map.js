app.init = function () {

    var map = new OpenLayers.Map(null, {
        allOverlays: true,
        displayProjection: new OpenLayers.Projection("EPSG:4326")
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
                                 
                utfgridResolution: 4, // default is 2
                displayInLayerSwitcher: false,
                useJSONP: false
            });
            //layer.utfgrid.projection = new OpenLayers.Projection("EPSG:4326");  
            app.map.addLayer(layer.utfgrid); 
            
            layer.utfcontrol = new OpenLayers.Control.UTFGrid({
                layers: [layer.utfgrid],
                handlerMode: 'click',
                callback: function(infoLookup) {
                    console.dir(infoLookup);
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
            
        } else if (layer.type == 'Vector') {
            layer.layer = new OpenLayers.Layer.Vector(
                layer.name,
                {
                    projection: new OpenLayers.Projection('EPSG:3857'),
                    strategies: [new OpenLayers.Strategy.Fixed()],
                    protocol: new OpenLayers.Protocol.HTTP({
                        url: layer.url,
                        format: new OpenLayers.Format.GeoJSON()
                    })
                }
            );
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



app.setLayerVisibility = function(layer, visibility) {
    // if layer is in openlayers, hide it
    if (layer.layer) {
        layer.layer.setVisibility(visibility);
    }
}

app.setLayerZIndex = function(layer, index) {
    layer.layer.setZIndex(index);
}