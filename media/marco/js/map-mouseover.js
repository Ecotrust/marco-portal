    
app.addMouseoverEventHandling = function() {

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

    //UTF Move Attribution
    app.map.UTFMoveControl = new OpenLayers.Control.UTFGrid({
        layers: [],
        handlerMode: "move",
        callback: function(infoLookup, lonlat, xy) {                   
            if (app.map.currentPopup) {
                if (app.map.currentPopup.layerModel.utfurl) {
                    app.map.deactivateAllPopups();
                }                
            }
            if (infoLookup) {   
                for (var idx in infoLookup) {
                    var info = infoLookup[idx];
                    if (info && info.data) {   
                        app.map.utfGridMoveHandling(info, lonlat, xy)                        
                    } 
                }
            }
        }
    });
    app.map.addControl(app.map.UTFMoveControl);   

    app.map.utfGridMoveHandling = function(info, lonlat, pixel) {
        $.each(app.viewModel.visibleLayers(), function (layer_index, potential_layer) {
            if (potential_layer.type !== 'Vector' && potential_layer.utfurl && potential_layer.attributeEvent === 'mouseover' && potential_layer.mouseoverAttribute !== '') {

                var attribute = potential_layer.mouseoverAttribute;
                if (info && info.data) { 
                    app.map.activatePopup(info.data[attribute], lonlat, potential_layer);
                } 
            }
        });
    };

    //mouseover events
    app.map.events.register("featureover", null, function(e) {
        var feature = e.feature,
            layerModel = e.feature.layer.layerModel;

        if (layerModel.attributeEvent === 'mouseover') {        
            var mouseoverAttribute = app.map.getFeatureMouseoverAttribute(feature),
                location = app.map.getFeatureLocation(feature),
                layer = feature.layer;  
            setTimeout(function() {
                app.map.activatePopup(mouseoverAttribute, location, layerModel);
            }, 50);
        }        
    });

    //mouseout events
    app.map.events.register("featureout", null, function(e) {
        var feature = e.feature,
            layer = feature.layer,
            layerModel = layer.layerModel;
        setTimeout(function() {
            app.map.deactivateAllPopups();
        }, 20);
    });

    // app.map.vectorFeatureMouseOver = function(feature) {
    //     if (feature) {
    //         var layerModel = feature.layer.layerModel;
    //         if (layerModel.attributeEvent === 'mouseover') {        
    //             var mouseoverAttribute = app.map.getFeatureMouseoverAttribute(feature),
    //                 location = app.map.getFeatureLocation(feature),
    //                 layer = feature.layer;  
    //             setTimeout(function() {
    //                 app.map.activatePopup(mouseoverAttribute, location, layerModel);
    //             }, 100);
    //         }      
    //     }
    // };

    app.map.getFeatureMouseoverAttribute = function(feature) {        
        var mouseoverAttribute = feature.layer.layerModel.mouseoverAttribute,
            attributeValue = mouseoverAttribute ? feature.attributes[mouseoverAttribute] : feature.layer.layerModel.name;
        return attributeValue;
    };

    app.map.getFeatureLocation = function(feature) {
        return feature.geometry.getBounds().getCenterLonLat();   
    }

    app.map.activatePopup = function(mouseoverAttribute, location, layerModel) {
        var layer = layerModel.layer;
        if (app.map.currentPopup && app.map.currentPopup.layer === layer) {
            // do nothing
        } else if (!app.map.currentPopup || layer.getZIndex() >= app.map.currentPopup.layer.getZIndex()) {            

            if (app.map.currentPopup) {                
                app.map.deactivateAllPopups();
            }

            app.map.currentPopup = app.map.createPopup(mouseoverAttribute, location, layerModel);
            app.map.currentPopup.layer = layer;
        }
    };

    app.map.deactivateAllPopups = function() {
        app.map.currentPopup = undefined;
        for (var i=0; i<app.map.popups.length; i+=1) {
            app.map.removePopup(app.map.popups[i]);
        }
    };

    app.map.createPopup = function(attributeValue, location, layerModel) {
        
        if ( ! app.map.getExtent().containsLonLat(location) ) {
            location = app.map.center;
        }
        var popup = new OpenLayers.Popup.FramedCloud(
            "",
            location,
            new OpenLayers.Size(100,100),
            "<div>" + attributeValue + "</div>",
            null,
            false,
            null
        );
        popup.layerModel = layerModel;
        app.map.addPopup(popup);
        return popup;
    };

    app.map.hidePopups = function() {
        for (var i=0; i<app.map.popups.length; i+=1) {
            app.map.popups[i].hide();
        }
    }

    app.map.anyVisiblePopups = function() {
        for (var i=0; i<app.map.popups.length; i+=1) {
            if (app.map.popups[i].visible()) {
                return true;
            }
        }
        return false;
    };

    //place the marker on click events
    app.map.events.register("click", app.map , function(e){
        // remove any mouseover popups
        app.map.deactivateAllPopups();
    });    

}