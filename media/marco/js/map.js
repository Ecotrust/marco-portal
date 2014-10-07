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
    // nauticalCharts = new OpenLayers.Layer.TMS("Nautical Charts", ["http://c3429629.r29.cf0.rackcdn.com/stache/NETiles_layer/"],
    //     {
    //         buffer: 1,
    //         'isBaseLayer': true,
    //         'sphericalMercator': true,
    //         getURL: function (bounds) {
    //             var z = map.getZoom();
    //             var url = this.url;
    //             var path = 'blank.png' ;
    //             if ( z <= 13 && z >= 0 ) {
    //                 var res = map.getResolution();
    //                 var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
    //                 var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
    //                 var limit = Math.pow(2, z);
    //                 var path = (z) + "/" + x + "/" + y + ".png";
    //             }
    //             tilepath = url + path;
    //             return url + path;
    //         }
    //     }
    // );               
    
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

    map.minZoom = 5;
    map.maxZoom = 12;

    // only allow onetime zooming with box
    map.events.register("zoomend", null, function () {
        if (map.zoomBox.active) {
            app.viewModel.deactivateZoomBox();
        }   
        if (map.getZoom() == map.minZoom) {
            $('.olControlZoomOut').addClass('disabled');
        } else if (map.getZoom() == map.maxZoom) {
            $('.olControlZoomIn').addClass('disabled');
        } else {
            var zoomIn = $('.olControlZoomIn');
            if (zoomIn.hasClass('disabled')) {
                zoomIn.removeClass('disabled');
            }
            var zoomOut = $('.olControlZoomOut');
            if (zoomOut.hasClass('disabled')) {
                zoomOut.removeClass('disabled');
            }
        }
        if( map.getZoom() < map.minZoom)
        {
            map.zoomTo(map.minZoom);
        }  
        if (map.getZoom() > map.maxZoom)
        {
            map.zoomTo(map.maxZoom);
        }
        app.viewModel.zoomLevel(map.getZoom());
        /*if ( app.viewModel.activeLayers().length ) {
            $.each(app.viewModel.activeLayers(), function(index, layer) {
                if (layer.name === 'Aids to Navigation') {
                    var zoom = map.getZoom();
                    if (zoom < 10) {
                        layer.legend = layer.legend.substring(0, layer.legend.lastIndexOf('/')+1) + 'legend_1_Level0_9.png'
                    } else if (zoom === 10) {
                        layer.legend = layer.legend.substring(0, layer.legend.lastIndexOf('/')+1) + 'legend_2_Level10.png'
                    } else if (zoom === 11) {
                        layer.legend = layer.legend.substring(0, layer.legend.lastIndexOf('/')+1) + 'legend_3_Level11.png'
                    } else {
                        layer.legend = layer.legend.substring(0, layer.legend.lastIndexOf('/')+1) + 'legend_4_Level12_13.png'
                    }
                }
            });

        }*/
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

    app.markers = new OpenLayers.Layer.Markers( "Markers" );
    var size = new OpenLayers.Size(16,25);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    app.markers.icon = new OpenLayers.Icon('/media/marco/assets/img/red-pin.png', size, offset);
    app.map.addLayer(app.markers);
     
    app.addMouseoverEventHandling();
    app.addClickEventHandling();
    
    //place the marker on click events
    app.map.events.register("click", app.map , function(e){
        //is the following no longer necessary? replaced with #map mouseup and move events in app.js?
        //the following ensures that the location of the marker is not displaced while waiting for web services
        app.map.clickLocation = app.map.getLonLatFromViewPortPx(e.xy);
    });    
    
    app.map.removeLayerByName = function(layerName) {
        for (var i=0; i<app.map.layers.length; i++) {
            if (app.map.layers[i].name === layerName) {
                app.map.removeLayer(app.map.layers[i]);
                i--;
            }
        }
    };
    
    app.utils = {};
    app.utils.isNumber = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    app.utils.numberWithCommas = function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    app.utils.isInteger = function(n) {
        return app.utils.isNumber(n) && (Math.floor(n) === n);
    }
    app.utils.formatNumber = function(n) {
        var number = Number(n);
        if (app.utils.isInteger(number)) {
            var preciseNumber = number.toFixed(0);
        } else {
            var preciseNumber = number.toFixed(1);
        }
        return app.utils.numberWithCommas(preciseNumber);
    }
    app.utils.trim = function(str) {
        return str.replace(/^\s+|\s+$/g,'');
    }
    app.utils.getObjectFromList = function(list, field, value) {
        for (var i=0; i<list.length; i+=1) {
            if (list[i][field] === value) {
                return list[i];
            }
        }
        return undefined;
    }
    
    setTimeout( function() {
        if (app.mafmc) {
            map.removeLayer(openStreetMap);
            map.removeLayer(googleStreet);
            map.removeLayer(googleTerrain);
            map.removeLayer(googleSatellite);
        } 
    }, 1000);

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
    var identifyUrl = layer.url.replace('export', layer.arcgislayers + '/query');
    
    layer.arcIdentifyControl = new OpenLayers.Control.ArcGisRestIdentify(
    {
        eventListeners: {
            arcfeaturequery: function() {
                //if ( ! layer.attributesFromWebServices || layer.utfurl ) {
                if ( layer.utfurl ) { // || layer.name === 'Offshore Wind Compatibility Assessments' ) {
                    return false;
                }
            },
            //the handler for the return click data
            resultarrived : function(responseText) {
                var clickAttributes = {},
                    jsonFormat = new OpenLayers.Format.JSON(),
                    returnJSON = jsonFormat.read(responseText.text);
                    
                if(returnJSON['features'] && returnJSON['features'].length) { 
                    var attributeObjs = [];
                    
                    $.each(returnJSON['features'], function(index, feature) {
                        if(index == 0) {
                            var attributeList = feature['attributes'];
                            
                            if('fields' in returnJSON) {
                                if (layer.attributes.length) {
                                    for (var i=0; i<layer.attributes.length; i+=1) {
                                        if (attributeList[layer.attributes[i].field]) {
                                            var data = attributeList[layer.attributes[i].field],
                                                field_obj = app.utils.getObjectFromList(returnJSON['fields'], 'name', layer.attributes[i].field);
                                            if (field_obj && field_obj.type === 'esriFieldTypeDate') {
                                                data = new Date(data).toDateString();
                                            } else if (app.utils.isNumber(data)) {
                                                data = app.utils.formatNumber(data);
                                            } 
                                            if (data && app.utils.trim(data) !== "") {
                                                attributeObjs.push({
                                                    'display': layer.attributes[i].display, 
                                                    'data': data
                                                });
                                            }
                                        }
                                    }
                                } else {
                                    $.each(returnJSON['fields'], function(fieldNdx, field) {
                                        if (field.name.indexOf('OBJECTID') === -1 && field.name.indexOf('CFR_id') === -1) {
                                            var data = attributeList[field.name]
                                            if (field.type === 'esriFieldTypeDate') {
                                                data = new Date(data).toDateString();
                                            } else if (app.utils.isNumber(data)) {
                                                data = app.utils.formatNumber(data);
                                            } 
                                            if (data && app.utils.trim(data) !== "") {
                                                attributeObjs.push({
                                                    'display': field.alias,
                                                    'data': data
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                            return;
                        }
                    });  
                    if ( layer.name === 'Aids to Navigation' ) {
                        app.viewModel.adjustAidsToNavigationAttributes(attributeObjs);
                    } 
                }
                  
                if (attributeObjs && attributeObjs.length) {
                    clickAttributes[layer.featureAttributionName] = attributeObjs;
                    $.extend(app.map.clickOutput.attributes, clickAttributes);
                    app.viewModel.aggregatedAttributes(app.map.clickOutput.attributes);
                    //app.viewModel.updateMarker(app.map.getLonLatFromViewPortPx(responseText.xy));
                    //the following ensures that the location of the marker has not been displaced while waiting for web services
                    app.viewModel.updateMarker(app.map.clickLocation);
                }
            }
        },
        url : identifyUrl,
        layerid : layer.arcgislayers,
        sr : 3857,
        clickTolerance: 2,
        outFields: '*'
    });
    app.map.addControl(layer.arcIdentifyControl);

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
    if (layer.annotated) { // such as the canyon labels in the mafmc project
        var styleMap = new OpenLayers.StyleMap( {
            label: "${NAME}",
            fontColor: "#333",
            fontSize: "12px",
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
    } else {
        var styleMap = new OpenLayers.StyleMap( {
            fillColor: layer.color,
            fillOpacity: layer.fillOpacity,
            //strokeDashStyle: "dash",
            //strokeOpacity: 1,
            strokeColor: layer.outline_color,
            strokeOpacity: layer.outline_opacity,
            //strokeLinecap: "square",
            //http://dev.openlayers.org/apidocs/files/OpenLayers/Feature/Vector-js.html
            //title: 'testing'
            pointRadius: 2,
            externalGraphic: layer.graphic,
            graphicWidth: 8,
            graphicHeight: 8,
            graphicOpacity: layer.defaultOpacity
        });
    }
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
            layerModel: layer,
            // set minZoom to 9 for annotated layers, set minZoom to some much smaller zoom level for non-annotated layers
            scales: layer.annotated ? [1000000, 1] : [90000000, 1], 
            units: 'm'
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
