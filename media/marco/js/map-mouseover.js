    
app.addMouseoverEventHandling = function() {

    //UTF Mouseover Events

    app.map.UTFMoveControl = new OpenLayers.Control.UTFGrid({
        layers: [],
        handlerMode: "move",
        callback: function(infoLookup, lonlat, xy) { 
            console.log('inside callback');
            console.log(infoLookup);                  
            if (app.map.currentPopup) {
                if (app.map.currentPopup.layerModel.utfurl) {
                    // app.map.deactivateAllPopups();
                    app.map.deactivateCurrentPopup();
                    console.log('deactivating current popup');
                }                
            }
            if (infoLookup) {  
                var activatingPopup = false; 
                for (var idx in infoLookup) {
                    var info = infoLookup[idx];
                    if (info && info.data) {   
                        var potential_layer = app.map.layers[idx].layerModel;
                        var attribute = potential_layer.mouseoverAttribute;
                        app.map.activatePopup(info.data[attribute], lonlat, potential_layer);  
                        activatingPopup = true;                   
                    } 
                }
                if (!activatingPopup && app.map.nextPopup) {
                    app.map.currentPopup = app.map.nextPopup;
                    app.map.deactivateAllPopups();
                    app.map.addPopup(app.map.currentPopup);
                    app.map.nextPopup = undefined;
                }
            }
        }
    });
    app.map.addControl(app.map.UTFMoveControl);   

    // Vector Mouseover Events

    //mouseover events
    app.map.events.register("featureover", null, function(e) {
        var feature = e.feature,
            layerModel = e.feature.layer.layerModel;

        if (layerModel.attributeEvent === 'mouseover') {        
            var mouseoverAttribute = app.map.getFeatureMouseoverAttribute(feature),
                location = app.map.getFeatureLocation(feature),
                layer = feature.layer;  
            // the following setTimeout ensures activating popup occurs after removing popups
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
        if (app.map.currentPopup && app.map.currentPopup.layer === layer) {
            app.map.deactivateCurrentPopup();
        }
        if (app.map.nextPopup && app.map.nextPopup.layer === layer) {
            app.map.deactivateNextPopup();
        } else if (app.map.nextPopup && app.map.nextPopup.layer !== layer) {
            app.map.currentPopup = app.map.nextPopup;
            app.map.deactivateAllPopups();
            app.map.addPopup(app.map.currentPopup);
            app.map.nextPopup = undefined;
        }
    });

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
                // app.map.deactivateAllPopups();
                app.map.nextPopup = app.map.currentPopup;
                app.map.removePopup(app.map.nextPopup);
            }

            app.map.currentPopup = app.map.createPopup(mouseoverAttribute, location, layerModel);
            app.map.deactivateAllPopups();
            app.map.addPopup(app.map.currentPopup);
            app.map.currentPopup.layer = layer;
        } else {
            app.map.nextPopup = app.map.createPopup(mouseoverAttribute, location, layerModel);
            app.map.nextPopup.layer = layer;
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
        return popup;
    };

    app.map.deactivateCurrentPopup = function() {
        app.map.removePopup(app.map.currentPopup);
        app.map.currentPopup = undefined;
    };

    app.map.deactivateNextPopup = function() {
        app.map.removePopup(app.map.nextPopup);
        app.map.nextPopup = undefined;
    };

    app.map.deactivateAllPopups = function() {
        for (var i=0; i<app.map.popups.length; i+=1) {
            app.map.removePopup(app.map.popups[i--]);
        }
    };

    //place the marker on click events
    app.map.events.register("click", app.map , function(e){
        // remove any and all mouseover popups
        app.map.deactivateAllPopups();
        app.map.currentPopup = undefined;
        app.map.nextPopup = undefined;
    });    

}