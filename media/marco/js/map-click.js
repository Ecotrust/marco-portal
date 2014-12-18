
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
        
        for (var idx in infoLookup) {
            $.each(app.viewModel.visibleLayers(), function (layer_index, potential_layer) {
              if (potential_layer.type !== 'Vector') {
                var new_attributes,
                    info = infoLookup[idx];
                //debugger;
                if (info && info.data) { 
                    var newmsg = '',
                        hasAllAttributes = true,
                        parentHasAllAttributes = false;
                    // if info.data has all the attributes we're looking for
                    // we'll accept this layer as the attribution layer 
                    //if ( ! potential_layer.attributes.length ) {
                    if (potential_layer.attributes.length) {
                        hasAllAttributes = true;
                    } else {
                        hasAllAttributes = false;
                    }
                    //}
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
                        var title = potential_layer.featureAttributionName,
                            text = attribute_objs;
                        if ( potential_layer.name === 'OCS Lease Blocks' ) {
                            text = app.viewModel.getOCSAttributes(info.data);
                        } else if ( potential_layer.name === 'Sea Turtles' ) {
                            text = app.viewModel.getSeaTurtleAttributes(info.data);
                        } else if ( potential_layer.name === 'Toothed Mammals (All Seasons)' ) {
                            text = app.viewModel.getToothedMammalAttributes(info.data);
                        } else if ( potential_layer.name === 'Wind Speed' ) {
                            text = app.viewModel.getWindSpeedAttributes(info.data);
                        } else if ( potential_layer.name === 'BOEM Wind Planning Areas' ) {
                            text = app.viewModel.getWindPlanningAreaAttributes(info.data);
                        } else if ( potential_layer.name === 'Party & Charter Boat' ) {
                            text = app.viewModel.adjustPartyCharterAttributes(attribute_objs);
                        } else if ( potential_layer.name === 'Port Commodity (Points)' ) { 
                            text = app.viewModel.getPortCommodityAttributes(info.data);                             
                        } else if ( potential_layer.name === 'Port Commodity' ) { 
                            text = app.viewModel.getPortCommodityAttributes(info.data);                             
                        } else if ( potential_layer.name === 'Port Ownership (Points)' ) { 
                            text = app.viewModel.getPortOwnershipAttributes(info.data);                             
                        } else if ( potential_layer.name === 'Port Ownership' ) { 
                            text = app.viewModel.getPortOwnershipAttributes(info.data);                             
                        } else if ( potential_layer.name === 'Maintained Channels') {
                            text = app.viewModel.getChannelAttributes(info.data);
                        } else if ( title === 'Benthic Habitats (North)' || title === 'Benthic Habitats (South)' ) {
                            title = 'Benthic Habitats';
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