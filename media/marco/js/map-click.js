
app.addClickEventHandling = function() {

    //UTF Click Attribution
    app.map.UTFClickControl = new OpenLayers.Control.UTFGrid({
        //attributes: layer.attributes,
        layers: [],
        //events: {fallThrough: true},
        handlerMode: 'click',
        callback: function(infoLookup, lonlat, xy) {   
            app.map.utfGridClickHandling(infoLookup, lonlat, xy);
        }
    });
    app.map.addControl(app.map.UTFClickControl);    

    // UTF Click Event Handler
    app.map.utfGridClickHandling = function(infoLookup, lonlat, xy) {
        var clickAttributes = {};
        
        // identify which grid layers were clicked
        var gridLayersHit = [];
        for (var idx in infoLookup) {
            var info = infoLookup[idx];
            if (info && info.data) {
                var gridLayer = app.map.layers[idx];
                if (gridLayer && gridLayer.layerModel && gridLayer.layerModel.name) {
                    gridLayersHit[gridLayer.layerModel.name] = info;
                }
            }
        }

        // loop through visible layers and show attributes for any visible layers that match the grid layers that were clicked
        $.each(app.viewModel.visibleLayers(), function(layer_index, potential_layer) {
            var gridLayerInfo = gridLayersHit[potential_layer.name];
            if (gridLayerInfo) {
                var attributes = undefined;
                var attribute_objs = [];

                if (potential_layer.attributes) {
                    attributes = potential_layer.attributes;
                } else if (potential_layer.parent && potential_layer.parent.attributes) {
                    attributes = potential_layer.parent.attributes;
                }

                if (attributes) {
                    $.each(attributes, function(index, obj) {
                        if (potential_layer.compress_attributes) {
                            var display = obj.display + ': ' + gridLayerInfo.data[obj.field];
                            attribute_objs.push({
                                'display': display,
                                'data': ''
                            });
                        } else {
                            var value = gridLayerInfo.data[obj.field];
                            try {
                                //set the precision and add any necessary commas
                                value = value.toFixed(obj.precision).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            } catch (e) {
                                //keep on keeping on
                            }
                            attribute_objs.push({
                                'display': obj.display,
                                'data': value
                            });
                        }
                    });

                    var title = potential_layer.featureAttributionName,
                        text = attribute_objs;
                    if ( potential_layer.name === 'OCS Lease Blocks' ) {
                        text = app.viewModel.getOCSAttributes(gridLayerInfo.data);
                    } else if ( potential_layer.name === 'Sea Turtles' ) {
                        text = app.viewModel.getSeaTurtleAttributes(gridLayerInfo.data);
                    } else if ( potential_layer.name === 'Toothed Mammals (All Seasons)' ) {
                        text = app.viewModel.getToothedMammalAttributes(gridLayerInfo.data);
                    } else if ( potential_layer.name === 'Wind Speed' ) {
                        text = app.viewModel.getWindSpeedAttributes(gridLayerInfo.data);
                    } else if ( potential_layer.name === 'BOEM Wind Planning Areas' ) {
                        text = app.viewModel.getWindPlanningAreaAttributes(gridLayerInfo.data);
                    } else if ( potential_layer.name === 'Party & Charter Boat' ) {
                        text = app.viewModel.adjustPartyCharterAttributes(attribute_objs);
                    } else if ( potential_layer.name === 'Port Commodity (Points)' ) { 
                        text = app.viewModel.getPortCommodityAttributes(gridLayerInfo.data);                             
                    } else if ( potential_layer.name === 'Port Commodity' ) { 
                        text = app.viewModel.getPortCommodityAttributes(gridLayerInfo.data);                             
                    } else if ( potential_layer.name === 'Port Ownership (Points)' ) { 
                        text = app.viewModel.getPortOwnershipAttributes(gridLayerInfo.data);                             
                    } else if ( potential_layer.name === 'Port Ownership' ) { 
                        text = app.viewModel.getPortOwnershipAttributes(gridLayerInfo.data);                             
                    } else if ( potential_layer.name === 'Maintained Channels') {
                        text = app.viewModel.getChannelAttributes(gridLayerInfo.data);
                    } else if ( title === 'Benthic Habitats (North)' || title === 'Benthic Habitats (South)' ) {
                        title = 'Benthic Habitats';
                    } else if ( potential_layer.name === 'Essential Fish Habitats') {
                        text = app.clickAttributes.getEFHAttributes(gridLayerInfo.data);
                    } 
                    clickAttributes[title] = text;
                }
            }
            $.extend(app.map.clickOutput.attributes, clickAttributes);
            app.viewModel.aggregatedAttributes(app.map.clickOutput.attributes);
        });

        app.viewModel.updateMarker(lonlat);
        
    }; //end utfGridClickHandling
      
    // vector click events
    app.map.events.register("featureclick", null, function(e, test) {
        var layer = e.feature.layer.layerModel || e.feature.layer.scenarioModel;
        if (layer) {
            var text = [],
                title = layer.featureAttributionName;
                
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
            }
            
            if (text.length) {
                // adding this delay so that the mouseup event in app.js (which closes any attribute overlay) is fired before the following (and not after)
                setTimeout( function() {
                    app.map.clickOutput.attributes[layer.featureAttributionName] = text;
                    app.viewModel.aggregatedAttributes(app.map.clickOutput.attributes);
                    app.viewModel.updateMarker(app.map.getLonLatFromViewPortPx(e.event.xy));
                }, 100);
            }
            
        }
        
    });//end featureclick event registration

};
app.addClickEventHandling();