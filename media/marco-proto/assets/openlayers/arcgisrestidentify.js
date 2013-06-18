OpenLayers.Control.ArcGisRestIdentify = OpenLayers.Class(OpenLayers.Control, {
        layerid:null,
        eventListeners:null,
        url:null,
        clickTolerance:0,
        EVENT_TYPES: ["resultarrived", "arcfeaturequery"],
        outFields : "",
        
        defaultHandlerOptions: {
                'single': true,
                'double': false,
                'pixelTolerance': 0,
                'stopSingle': false,
                'stopDouble': false,
                'sr' : 4326
        },

        initialize: function(options) {
                this.EVENT_TYPES =
                OpenLayers.Control.ArcGisRestIdentify .prototype.EVENT_TYPES.concat(
                        OpenLayers.Control.prototype.EVENT_TYPES
                );
                this.handlerOptions = OpenLayers.Util.extend(
                        {}, this.defaultHandlerOptions
                );
                OpenLayers.Control.prototype.initialize.apply(
                        this, arguments
                ); 
                var callbacks = {};
                callbacks['click'] = this.doQuery;
                this.handler = new OpenLayers.Handler.Click(
                        this,
                        callbacks,
                        this.handlerOptions
                );
        }, 
        
        activate: function () {
                if (!this.active) {
                        this.handler.activate();
                }
                return OpenLayers.Control.prototype.activate.apply(
                        this, arguments
                );
        },

        deactivate: function () {
                return OpenLayers.Control.prototype.deactivate.apply(
                        this, arguments
                );
        },

        /*trigger: function(e) {
                var lonlat = map.getLonLatFromViewPortPx(e.xy);
                alert("You clicked near " + lonlat.lat + " N, " +
                                                                  + lonlat.lon + " E");*/
        
        buildOptions: function(clickPosition,url){
                
                evtlonlat = this.map.getLonLatFromPixel(clickPosition);
                var spatialRel = "esriSpatialRelIntersects";
                var geometryType = "esriGeometryPoint";
                var geometry = evtlonlat.lon+","+evtlonlat.lat;
                //If there is a click tolerance, let's calculate an envelope to use to check for any results.
                if(this.clickTolerance > 0)
                {
                  var urXY = new OpenLayers.Pixel();
                  urXY.x = clickPosition.x + this.clickTolerance;
                  urXY.y = clickPosition.y + this.clickTolerance;
                  var urUR = this.map.getLonLatFromPixel(urXY);
                  
                  var llXY = new OpenLayers.Pixel();
                  llXY.x = clickPosition.x - this.clickTolerance;
                  llXY.y = clickPosition.y - this.clickTolerance;
                  var llLL = this.map.getLonLatFromPixel(llXY);
                  
                  geometryType = "esriGeometryEnvelope";
                  geometry = llLL.lon + "," + llLL.lat + "," + urUR.lon + "," + urUR.lat;
                }
                var queryoptions =
                {
                  geometry : geometry,
                  geometryType : geometryType,
                  inSR : this.sr,
                  outSR : this.sr,
                  spatialRel : spatialRel,
                  f : "json",
                  returnGeometry:"true",
                  outFields : this.outFields
                };
                
                var query = {
                        url:url,
                        headers: {"Content-type" : "application/json"},
                        params : queryoptions,
                        proxy: '/proxy/get_legend_json/?url=',
                        callback: function(request)
                        {
                          this.handleresult(request,clickPosition);
                        },
                        scope: this
                };
                return query
        },
        
        handleresult: function(result,xy){
                this.events.triggerEvent("resultarrived",{
                        text:result.responseText,
                        xy:xy
                });
        },
        
        request: function(clickPosition){
                queryOptions = this.buildOptions(clickPosition,this.url);
                var request = OpenLayers.Request.GET(queryOptions);
        },
        
        doQuery: function(e){
          var makeRequest = this.events.triggerEvent("arcfeaturequery",{});
          if (makeRequest !== false) {
            this.request(e.xy);
          }
        }
});