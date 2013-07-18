
/** THE FOLLOWING WAS COPIED FROM ANDREAS HOCEVAR'S PULL REQUEST https://github.com/openlayers/openlayers/pull/174 **/

/**
* Class: OpenLayers.FeatureAgent
* An agent that manages feature related events.
*/
OpenLayers.Events.featureclick = OpenLayers.Class({
    
    /**
    * Property: cache
    * {Object} A cache of features under the mouse.
    */
    cache: null,
    
    /**
    * Property: map
    * {<OpenLayers.Map>} The map to register browser events on.
    */
    map: null,
    
    /**
    * Property: provides
    * {Array(String)} The event types provided by this extension.
    */
    provides: ["featureclick", "nofeatureclick", "featureover", "featureout"],
    
    /**
    * Constructor: OpenLayers.FeatureAgent
    * Create a new feature agent.
    *
    * Parameters:
    * target - {<OpenLayers.Events>} The events instance to create the events
    * for.
    */
    initialize: function(target) {
        this.target = target;
        if (target.object instanceof OpenLayers.Map) {
            this.setMap(target.object);
        } else if (target.object instanceof OpenLayers.Layer.Vector) {
            if (target.object.map) {
                this.setMap(target.object.map);
            } else {
                target.object.events.register("added", this, function(evt) {
                    this.setMap(target.object.map);
                });
            }
        } else {
            throw("Listeners for '" + this.provides.join("', '") +
                "' events can onlybe registered for OpenLayers.Layer.Vector " +
                "or OpenLayers.Map instances");
        }
        for (var i=this.provides.length-1; i>=0; --i) {
            target.extensions[this.provides[i]] = true;
        }
    },
    
    /**
    * Method: setMap
    *
    * Parameters:
    * map - {<OpenLayers.Layer.Map>} The map to register browser events on.
    */
    setMap: function(map) {
        this.map = map;
        this.cache = {};
        map.events.register("mousedown", this, this.start, {extension: true});
        map.events.register("mouseup", this, this.onClick, {extension: true});
        map.events.register("touchstart", this, this.start, {extension: true});
        map.events.register("touchmove", this, this.cancel, {extension: true});
        map.events.register("touchend", this, this.onClick, {extension: true});
        map.events.register("mousemove", this, this.onMousemove, {extension: true});
    },
    
    start: function(evt) {
        this.startEvt = evt;
    },
    
    cancel: function(evt) {
        delete this.startEvt;
    },
    
    /**
    * Method: onClick
    * Listener for the click event.
    *
    * Parameters:
    * evt - {<OpenLayers.Event>}
    */
    onClick: function(evt) {
        if (!this.startEvt || evt.type !== "touchend"
           && !OpenLayers.Event.isLeftClick(evt)) {
            return;
        }
        var features = this.getFeatures(this.startEvt);
        delete this.startEvt;
        
        // fire featureclick events for vector features
        var feature, layer, more, clicked = {};
        for (var i=0, len=features.length; i<len; ++i) {
            feature = features[i];
            layer = feature.layer;
            clicked[layer.id] = true;
            more = this.triggerEvent("featureclick", {feature: feature, event: evt});
            if (more === false) {
                break;
            }
        }
        
        // fire nofeatureclick events on all vector layers with no targets
        for (i=0, len=this.map.layers.length; i<len; ++i) {
            layer = this.map.layers[i];
            if (layer instanceof OpenLayers.Layer.Vector && !clicked[layer.id]) {
                this.triggerEvent("nofeatureclick", {layer: layer});
            } 
        }
    },
    
    /**
    * Method: onMousemove
    * Listener for the mousemove event.
    *
    * Parameters:
    * evt - {<OpenLayers.Event>}
    */
    onMousemove: function(evt) {
        delete this.startEvt;
        var features = this.getFeatures(evt);
        var over = {}, newly = [], feature;
        for (var i=0, len=features.length; i<len; ++i) {
            feature = features[i];
            over[feature.id] = feature;
            if (!this.cache[feature.id]) {
                newly.push(feature);
            }
        }
        // check if already over features
        var out = [];
        for (var id in this.cache) {
            feature = this.cache[id];
            if (feature.layer && feature.layer.map) {
                if (!over[feature.id]) {
                    out.push(feature);
                }
            } else {
                // removed
                delete this.cache[id];
            }
        }
        // fire featureover events
        var more;
        for (i=0, len=newly.length; i<len; ++i) {
            feature = newly[i];
            this.cache[feature.id] = feature;
            more = this.triggerEvent("featureover", {feature: feature});
            if (more === false) {
                break;
            }
        }
        // fire featureout events
        for (i=0, len=out.length; i<len; ++i) {
            feature = out[i];
            delete this.cache[feature.id];
            more = this.triggerEvent("featureout", {feature: feature});
            if (more === false) {
                break;
            }
        }
    },
    
    /**
    * Method: triggerEvent
    * Determines where to trigger the event and triggers it.
    *
    * Parameters:
    * type - {String} The event type to trigger
    * evt - {Object} The listener argument
    */
    triggerEvent: function(type, evt) {
        var layer = evt.feature ? evt.feature.layer : evt.layer,
            object = this.target.object;
        if (object instanceof OpenLayers.Map || object === layer) {
            return this.target.triggerEvent(type, evt);
        }
    },

    /**
    * Method: getFeatures
    * Get all features at the given screen location.
    *
    * Parameters:
    * x - {Number} Screen x coordinate.
    * y - {Number} Screen y coordinate.
    *
    * Returns:
    * {Array(<OpenLayers.Feature.Vector>)} List of features at the given point.
    */
    getFeatures: function(evt) {
        var x = evt.clientX, y = evt.clientY,
            features = [], targets = [], layers = [],
            layer, target, feature, i, len;
        // go through all layers looking for targets
        for (i=this.map.layers.length-1; i>=0; --i) {
            layer = this.map.layers[i];
            if (layer.renderer instanceof OpenLayers.Renderer.Elements) {
                if (layer.div.style.display !== "none") {
                    if (layer instanceof OpenLayers.Layer.Vector) {
                        //elevating the layer's zindex to ensure it is the first layer hit by document.elementFromPoint
                        layer.setZIndex(parseInt(layer.getZIndex()) + 1000000);
                        
                        target = document.elementFromPoint(x, y); 
                        if (target && target._featureId) {
                            feature = layer.getFeatureById(target._featureId);
                            if (feature) {
                                features.push(feature);
                            }
                        }
                        
                        layer.setZIndex(parseInt(layer.getZIndex()) - 1000000);
                        
                        //Removing the following as it seems to prevent other events/controls from being triggered
                        //Not sure how this (overlapping features in a single layer) would be handled with the new strategy...
                        /*
                        while (target) { // && target._featureId) {
                            feature = layer.getFeatureById(target._featureId);
                            if (feature) {
                                features.push(feature);
                                target.style.display = "none";
                                targets.push(target);
                                target = document.elementFromPoint(x, y);
                            } else {
                                // sketch, all bets off
                                target = false;
                            }
                        }               
                        // restore feature visibility
                        for (i=0, len=targets.length; i<len; ++i) {
                            targets[i].style.display = "";
                        }
                        targets = [];
                        */ 
                    }
                }
            } else if (layer.renderer instanceof OpenLayers.Renderer.Canvas) {
                feature = layer.renderer.getFeatureIdFromEvent(evt);
                if (feature) {
                    features.push(feature);
                    layers.push(layer);
                }
            } else {
                //debugger;
            }
        }
        
        return features;
    },
    
    /**
    * APIMethod: destroy
    * Clean up.
    */
    destroy: function() {
        for (var i=this.provides.length-1; i>=0; --i) {
            delete this.target.extensions[this.provides[i]];
        }
        this.map.events.un({
            click: this.onClick,
            mousemove: this.onMousemove,
            scope: this
        });
        delete this.cache;
        delete this.map;
        delete this.target;
    }
    
});
OpenLayers.Events.nofeatureclick = OpenLayers.Events.featureclick;
OpenLayers.Events.featureover = OpenLayers.Events.featureclick;
OpenLayers.Events.featureout = OpenLayers.Events.featureclick;
