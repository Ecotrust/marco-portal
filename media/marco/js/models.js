function layerModel(options, parent) {
    var self = this,
        $descriptionTemp;

    // properties
    self.id = options.id || null;
    self.name = options.name || null;
    self.featureAttributionName = self.name;
    self.url = options.url || null;
    self.arcgislayers = options.arcgis_layers || 0;
    self.type = options.type || null;
    self.utfurl = options.utfurl || false;
    self.legend = options.legend || false;
    self.legendVisibility = ko.observable(false);
    self.legendTitle = options.legend_title || false;
    self.legendSubTitle = options.legend_subtitle || false;
    self.themes = ko.observableArray();
    self.attributes = options.attributes ? options.attributes.attributes : [];
    self.compress_attributes = options.attributes ? options.attributes.compress_attributes : false;
    self.attributeEvent = options.attributes ? options.attributes.event : [];
    self.mouseoverAttribute = options.attributes ? options.attributes.mouseover_attribute : false;
    self.lookupField = options.lookups ? options.lookups.field : null;
    self.lookupDetails = options.lookups ? options.lookups.details : [];
    self.color = options.color || "#ee9900";
    self.outline_color = options.outline_color || self.color;
    self.fillOpacity = options.fill_opacity || 0.0;
    if ( options.opacity === 0 ) {
        self.defaultOpacity = options.opacity;
    } else {
        self.defaultOpacity = options.opacity || 0.5;
    }
    self.opacity = ko.observable(self.defaultOpacity);
    self.outline_opacity = options.outline_opacity || self.defaultOpacity;
    self.graphic = options.graphic || null;
    self.annotated = options.annotated || false;

    self.isDisabled = ko.observable(false);
    if (options.is_disabled) {
        self.isDisabled(options.is_disabled);
    }
    self.disabledMessage = ko.observable(false);
    if (options.disabled_message) {
        self.disabledMessage(options.disabled_message);
    } 
    if (self.annotated && app.viewModel.zoomLevel() < 9) {
        self.isDisabled(true);
        self.disabledMessage(options.disabled_message);
    } 
    app.viewModel.zoomLevel.subscribe( function() {
        if (self.annotated && app.viewModel.zoomLevel() < 9) {
            self.isDisabled(true);
            self.disabledMessage(options.disabled_message); 
            $('.annotated.disabled').popover({
                delay: {'show': 500},
                trigger: 'hover'//,
                //template: '<div class="popover layer-popover"><div class="arrow"></div><div class="popover-inner layer-tooltip"><div class="popover-content"><p></p></div></div></div>'
            });
        } else if (self.annotated && app.viewModel.zoomLevel() >= 9) {
            self.isDisabled(false);
            self.disabledMessage(false);
            $('.annotated').popover('destroy');
        }
    });
    
    //these are necessary to prevent knockout errors when offering non-designs in Active panel
    self.sharedBy = ko.observable(false);
    self.sharedWith = ko.observable(false);
    self.selectedGroups = ko.observableArray();
    self.shared = ko.observable(false);
    
    if (self.featureAttributionName === 'OCS Lease Blocks') {
        self.featureAttributionName = 'OCS Lease Blocks';
    } else if (self.featureAttributionName === 'Party & Charter Boat') {
        self.featureAttributionName = 'Party & Charter Boat Trips';
    } else if (self.featureAttributionName === 'Benthic Habitats (North)' ) {
        self.featureAttributionName = 'Benthic Habitats';
    } else if (self.featureAttributionName === 'Benthic Habitats (South)' ) {
        self.featureAttributionName = 'Benthic Habitats';
    }
    
    
    // if legend is not provided, try using legend from web services 
    if ( !self.legend && self.url && (self.arcgislayers !== -1) ) {
        $.ajax({
            dataType: "jsonp",
            //http://ocean.floridamarine.org/arcgis/rest/services/SAFMC/SAFMC_Regulations/MapServer/legend/?f=pjson
            url: self.url.replace('/export', '/legend/?f=pjson'),
            type: 'GET',
            success: function(data) {
                if (data['layers']) {
                    $.each(data['layers'], function(i, layerobj) {
                        if (parseInt(layerobj['layerId'], 10) === parseInt(self.arcgislayers, 10)) {
                            self.legend = {'elements': []};
                            $.each(layerobj['legend'], function(j, legendobj) {
                                //http://ocean.floridamarine.org/arcgis/rest/services/SAFMC/SAFMC_Regulations/MapServer/13/images/94ed037ab533027972ba3fc4a7c9d05c
                                var swatchURL = self.url.replace('/export', '/'+self.arcgislayers+'/images/'+legendobj['url']),
                                    label = legendobj['label'];
                                if (label === "") {
                                    label = layerobj['layerName'];
                                }
                                self.legend['elements'].push({'swatch': swatchURL, 'label': label});
                                //console.log(self.legend);
                            });
                        }
                    });
                    //reset visibility (to reset activeLegendLayers)
                    var visible = self.visible();
                    self.visible(false);
                    self.visible(visible);
                } else {
                    //debugger;
                }
            }, 
            error: function(error) {
                //debugger;
            }
        });
    }
    
    // set target blank for all links
    if (options.description) {
        $descriptionTemp = $("<div/>", {
            html: options.description
        });
        $descriptionTemp.find('a').each(function() {
            $(this).attr('target', '_blank');
        });
        self.description = $descriptionTemp.html();
    } else {
        self.description = null;
    }
    
    // set overview text for Learn More option
    if (options.overview) {
        self.overview = options.overview;
    } else if (parent && parent.overview) {
        self.overview = parent.overview;
    } else if (self.description) {
        self.overview = self.description;
    } else if (parent && parent.description) {
        self.overview = parent.description;
    } else {
        self.overview = null;
    }
    
    // if no description is provided, try using the web services description
    if ( !self.overview && self.url && (self.arcgislayers !== -1) ) {
        $.ajax({
            dataType: "jsonp",
            url: self.url.replace('/export', '/'+self.arcgislayers) + '?f=pjson',
            type: 'GET',
            success: function(data) {
                self.overview = data['description'];
            }
        });
    }
        
    // set data source and data notes text 
    self.data_source = options.data_source || null;
    if (! self.data_source && parent && parent.data_source) {
        self.data_source = parent.data_source;
    } 
    self.data_notes = options.data_notes || null;
    if (! self.data_notes && parent && parent.data_notes) {
        self.data_notes = parent.data_notes;
    } 
    
    // set download links 
    self.kml = options.kml || null;
    self.data_download = options.data_download || null;
    self.metadata = options.metadata || null;
    self.source = options.source || null;
    self.tiles = options.tiles || null;

    // opacity
    self.opacity.subscribe(function(newOpacity) {
        if (self.layer.CLASS_NAME === "OpenLayers.Layer.Vector") {
            self.layer.styleMap.styles['default'].defaultStyle.strokeOpacity = newOpacity;
            self.layer.styleMap.styles['default'].defaultStyle.graphicOpacity = newOpacity;
            //fill is currently turned off for many of the vector layers
            //the following should not override the zeroed out fill opacity 
            //however we do still need to account for shipping lanes (in which styling is handled via lookup)
            if (self.fillOpacity > 0) {
                var newFillOpacity = self.fillOpacity - (self.defaultOpacity - newOpacity);
                self.layer.styleMap.styles['default'].defaultStyle.fillOpacity = newFillOpacity;
            }
            self.layer.redraw();
        } else {
            self.layer.setOpacity(newOpacity);
        }
    });

    // is description active
    self.infoActive = ko.observable(false);
    app.viewModel.showOverview.subscribe( function() {
        if ( app.viewModel.showOverview() === false ) {
            self.infoActive(false);
        }
    });
    
    // is the layer a checkbox layer
    self.isCheckBoxLayer = ko.observable(false);
    if (self.type === 'checkbox') {
        self.isCheckBoxLayer(true);
    }
    
    // is the layer in the active panel?
    self.active = ko.observable(false);
    // is the layer visible?
    self.visible = ko.observable(false);       

    self.activeSublayer = ko.observable(false);
    self.visibleSublayer = ko.observable(false);

    self.subLayers = [];

    // save a ref to the parent, if it exists
    if (parent) {
        self.parent = parent;
        self.fullName = self.parent.name + " (" + self.name + ")";
        if ( ! self.legendTitle ) {
            self.legendTitle = self.parent.legendTitle;
        }
        if ( ! self.legendSubTitle ) {
            self.legendSubTitle = self.parent.legendSubTitle;
        }
    } else {
        self.fullName = self.name;
    }


    self.toggleLegendVisibility = function() {
        var layer = this;
        layer.legendVisibility(!layer.legendVisibility());
    };
    
    self.hasVisibleSublayers = function() {
        if ( !self.subLayers ) {
            return false;
        }
        var visibleSubLayers = false;
        $.each(self.subLayers, function(i, sublayer) {
            if (sublayer.visible()) {
                visibleSubLayers = true;
            }
        });
        return visibleSubLayers;
    };

    self.deactivateLayer = function() {
        var layer = this;
        
        //deactivate layer
        self.deactivateBaseLayer();
        
        //remove related utfgrid layer
        if (layer.utfgrid) { 
            self.deactivateUtfGridLayer();
        }
        //remove parent layer
        if (layer.parent) {
            self.deactivateParentLayer();
        }
        //remove sublayer
        if (layer.activeSublayer()) {
            self.deactivateSublayer();
        } 
        
        //de-activate arcIdentifyControl (if applicable)
        if (layer.arcIdentifyControl) {
            layer.arcIdentifyControl.deactivate();
        }
        
        layer.layer = null;

    };
    
    // called from deactivateLayer
    self.deactivateBaseLayer = function() {
        var layer = this;
        // remove from active layers
        app.viewModel.activeLayers.remove(layer);

        //remove the key/value pair from aggregatedAttributes
        app.viewModel.removeFromAggregatedAttributes(layer.name);
        
        layer.active(false);
        layer.visible(false);

        app.setLayerVisibility(layer, false);
        layer.opacity(layer.defaultOpacity);
        
        if ($.inArray(layer.layer, app.map.layers) !== -1) {
            app.map.removeLayer(layer.layer);
        }
    };
    
    // called from deactivateLayer
    self.deactivateUtfGridLayer = function() {
        var layer = this;
        //NEED TO CHECK FOR PARENT LAYER HERE TOO...?
        //the following removes this layers utfgrid from the utfcontrol and prevents continued utf attribution on this layer
        app.map.UTFControl.layers.splice($.inArray(layer.utfgrid, app.map.UTFControl.layers), 1);
        app.map.removeLayer(layer.utfgrid);
    };

    // called from deactivateLayer
    self.deactivateParentLayer = function() {
        var layer = this;
        if (layer.parent && layer.parent.isCheckBoxLayer()) { // if layer has a parent and that layer is a checkbox layer
            // see if there are any remaining active sublayers in this checkbox layer
            var stillActive = false;
            $.each(layer.parent.subLayers, function(i, sublayer) {
                if ( sublayer.active() ) {
                    stillActive = true;
                }
            });
            // if there are no remaining active sublayers, then deactivate parent layer
            if (!stillActive) {
                layer.parent.active(false);
                layer.parent.activeSublayer(false);
                layer.parent.visible(false);
                layer.parent.visibleSublayer(false);
            }
            //check to see if any sublayers are still visible 
            if (!layer.parent.hasVisibleSublayers()) {
                layer.parent.visible(false);
            }
        } else if (layer.parent) { // if layer has a parent
            // turn off the parent shell layer
            layer.parent.active(false);
            layer.parent.activeSublayer(false);
            layer.parent.visible(false);
            layer.parent.visibleSublayer(false);
        } 
    };
    
    // called from deactivateLayer
    self.deactivateSublayer = function() {
        var layer = this;
        if ($.inArray(layer.activeSublayer().layer, app.map.layers) !== -1) {
            app.map.removeLayer(layer.activeSublayer().layer);
        }
        layer.activeSublayer().deactivateLayer();
        layer.activeSublayer(false);
        layer.visibleSublayer(false);
    };
    
    self.activateLayer = function() {
        var layer = this;

        if (!layer.active() && layer.type !== 'placeholder' && !layer.isDisabled()) {
        
            self.activateBaseLayer();

            // save reference in parent layer
            if (layer.parent) {
                self.activateParentLayer();
            }

            //add utfgrid if applicable
            if (layer.utfgrid) {
                self.activateUtfGridLayer();
            }
            
            //activate arcIdentifyControl (if applicable)
            if (layer.arcIdentifyControl) {
                layer.arcIdentifyControl.activate();
            }

        }
    };
    
    // called from activateLayer
    self.activateBaseLayer = function() {
        var layer = this;
        
        app.addLayerToMap(layer);

        //now that we now longer use the selectfeature control we can simply do the following 
        //if (app.map.getLayersByName('Canyon Labels').length > 0) {
        if (app.viewModel.activeLayers().length > 0 && app.viewModel.activeLayers()[0].name === 'Canyon Labels') {
            app.viewModel.activeLayers.splice(1, 0, layer);
        } else {
            app.viewModel.activeLayers.unshift(layer);
        }

        // set the active flag
        layer.active(true);
        layer.visible(true);
    };
    
    // called from activateLayer
    self.activateParentLayer = function() {
        var layer = this;
        
        if (layer.parent.type === 'radio' && layer.parent.activeSublayer()) {
            // only allow one sublayer on at a time
            layer.parent.activeSublayer().deactivateLayer();
        }
        layer.parent.active(true);
        layer.parent.activeSublayer(layer);
        layer.parent.visible(true);
        layer.parent.visibleSublayer(layer);
    };
    
    // called from activateLayer
    self.activateUtfGridLayer = function() {
        var layer = this;
        
        app.map.UTFControl.layers.unshift(layer.utfgrid);
    };

    // bound to click handler for layer visibility switching in Active panel
    self.toggleVisible = function() {
        var layer = this;
        
        if (layer.visible()) { //make invisible
            self.setInvisible(layer);
        } else { //make visible
            self.setVisible(layer);
        }
    };
    
    self.setVisible = function() {
        var layer = this;
        
        layer.visible(true);
        if (layer.parent) {
            layer.parent.visible(true);
        }
        app.setLayerVisibility(layer, true);
        
        //add utfgrid if applicable
        if (layer.utfgrid && app.map.UTFControl.layers.indexOf(layer.utfgrid) === -1) {
            app.map.UTFControl.layers.splice($.inArray(this, app.viewModel.activeLayers()), 0, layer.utfgrid);
        }
    };
    
    self.setInvisible = function() {
        var layer = this;
        
        layer.visible(false);
        if (layer.parent) {
            // if layer.parent is not a checkbox, set parent to invisible
            if (layer.parent.type !== 'checkbox') {
                layer.parent.visible(false);
            } else { //otherwise layer.parent is checkbox 
                //check to see if any sublayers are still visible 
                if (!layer.parent.hasVisibleSublayers()) {
                    layer.parent.visible(false);
                }
            }
        }
        app.setLayerVisibility(layer, false);
        
        app.viewModel.removeFromAggregatedAttributes(layer.name);
        
        if ($.isEmptyObject(app.viewModel.visibleLayers())) {
            app.viewModel.closeAttribution();
        }

        //remove related utfgrid layer
        if (layer.utfgrid) {
            //the following removes this layers utfgrid from the utfcontrol and prevents continued utf attribution on this layer
            app.map.UTFControl.layers.splice($.inArray(this.utfgrid, app.map.UTFControl.layers), 1);
        }
    };

    self.showSublayers = ko.observable(false);

    self.showSublayers.subscribe(function () {
        setTimeout(function () {
            if ( app.viewModel.activeLayer().subLayers.length > 1 ) {
                $('.layer').find('.open .layer-menu').jScrollPane();
            }
        });
    });

    // bound to click handler for layer switching
    self.toggleActive = function(self, event) {
        var layer = this;

        // save a ref to the active layer for editing,etc
        app.viewModel.activeLayer(layer);
        
        //handle possible dropdown/sublayer behavior
        if (layer.subLayers.length) {
            app.viewModel.activeParentLayer(layer);
            if ( app.embeddedMap ) { // if data viewer is mobile app
                $('.carousel').carousel('prev');
                var api = $("#sublayers-div").jScrollPane({}).data('jsp');
                if ( api ) {
                    api.destroy();
                }
                $('#mobile-data-right-button').show();
                $('#mobile-map-right-button').hide(); 
            } /*else if (!layer.activeSublayer()) { //if layer does not have an active sublayer, then show/hide drop down menu
                if (!layer.showSublayers()) {
                    //show drop-down menu
                    layer.showSublayers(true);
                } else {
                    //hide drop-down menu
                    layer.showSublayers(false);
                }
            } else if ( layer.type === 'checkbox' ) { //else if layer does have an active sublayer and it's checkbox (not radio) 
                if (!layer.showSublayers()) {
                    //show drop-down menu
                    layer.showSublayers(true);
                } else {
                    //hide drop-down menu
                    layer.showSublayers(false);
                }
            } else {
                //turn off layer
                layer.deactivateLayer();
                layer.showSublayers(false);
            } */
            if (!layer.showSublayers()) {
                //show drop-down menu
                layer.showSublayers(true);
            } else {
                //hide drop-down menu
                layer.showSublayers(false);
            }
            return;
        }

        // start saving restore state again and remove restore state message from map view
        app.saveStateMode = true;
        app.viewModel.error(null);
        //app.viewModel.unloadedDesigns = [];

        if (layer.active()) { // if layer is active
            layer.deactivateLayer();
        } else { // otherwise layer is not currently active
            layer.activateLayer();
        }
    };
    

    self.raiseLayer = function(layer, event) {
        var current = app.viewModel.activeLayers.indexOf(layer);
        if (current === 0) {
            // already at top
            return;
        }
        $(event.target).closest('tr').fadeOut('fast', function() {
            app.viewModel.activeLayers.remove(layer);
            app.viewModel.activeLayers.splice(current - 1, 0, layer);
        });
    };

    self.lowerLayer = function(layer, event) {
        var current = app.viewModel.activeLayers.indexOf(layer);
        if (current === app.viewModel.activeLayers().length) {
            // already at top
            return;
        }
        $(event.target).closest('tr').fadeOut('fast', function() {
            app.viewModel.activeLayers.remove(layer);
            app.viewModel.activeLayers.splice(current + 1, 0, layer);
        });
    };

    self.isTopLayer = function(layer) {
        return app.viewModel.activeLayers.indexOf(layer) === 0;
    };

    self.isBottomLayer = function(layer) {
        return app.viewModel.activeLayers.indexOf(layer) === app.viewModel.activeLayers().length - 1;
    };
      
    self.showingLegendDetails = ko.observable(true);
    self.toggleLegendDetails = function() {
        var legendID = '#' + app.viewModel.convertToSlug(self.name) + '-legend-content';
        if ( self.showingLegendDetails() ) {
            self.showingLegendDetails(false);
            $(legendID).css('display', 'none');
            //$(legendID).collapse('hide');
            //$(legendID).slideUp(200);
            //setTimeout( function() { $(legendID).css('display', 'none'); }, 300 );
        } else {
            self.showingLegendDetails(true);
            $(legendID).css('display', 'block');
            //$(legendID).collapse('show');
            //$(legendID).slideDown(200);
        }
        //update scrollbar
        setTimeout( function() { app.viewModel.updateScrollBars(); }, 200 );
    };      
    
    self.showingLayerAttribution = ko.observable(true);
    self.toggleLayerAttribution = function() {
        var layerID = '#' + app.viewModel.convertToSlug(self.name);
        if ( self.showingLayerAttribution() ) {
            self.showingLayerAttribution(false);
            $(layerID).css('display', 'none');
        } else {
            self.showingLayerAttribution(true);
            $(layerID).css('display', 'block');
        }
        //update scrollbar
        app.viewModel.updateAggregatedAttributesOverlayScrollbar();
    };
    
    self.toggleSublayerDescription = function(layer) {
        if ( ! self.infoActive() ) {
            self.showSublayerDescription(self);
        } else if (layer === app.viewModel.activeInfoSublayer()) {
        } else {
            self.showDescription(self);
        }
    };
    
    self.showSublayerDescription = function(layer) {
        app.viewModel.showOverview(false);
        app.viewModel.activeInfoSublayer(layer);
        layer.infoActive(true);
        layer.parent.infoActive(true);
        app.viewModel.showOverview(true);
        app.viewModel.updateCustomScrollbar('#overview-overlay-text');
        //app.viewModel.updateDropdownScrollbar('#overview-overlay-dropdown');
        app.viewModel.hideMapAttribution();
    };
    
    // display descriptive text below the map
    self.toggleDescription = function(layer) {
        if ( ! layer.infoActive() ) {
            self.showDescription(layer);
        } else {
            self.hideDescription(layer);
        }
    };
    
    self.showDescription = function(layer) {
        app.viewModel.showOverview(false);
        app.viewModel.activeInfoSublayer(false);
        app.viewModel.activeInfoLayer(layer);
        self.infoActive(true);
        if (layer.subLayers.length > 0) {
            $('#overview-overlay').height(195);
        } else {
            $('#overview-overlay').height(186);
        }
        app.viewModel.showOverview(true);
        app.viewModel.updateCustomScrollbar('#overview-overlay-text');
        //app.viewModel.updateDropdownScrollbar('#overview-overlay-dropdown');
        app.viewModel.hideMapAttribution();
    };
    
    self.hideDescription = function(layer) {
        app.viewModel.showOverview(false);
        app.viewModel.activeInfoSublayer(false);
        app.viewModel.showMapAttribution();
    };
    
    self.toggleDescriptionMenu = function(layer) {
        //console.dir(layer);
    };
    
    
    self.showTooltip = function(layer, event) {
        var layerActual;
        $('#layer-popover').hide();
        if (layer.activeSublayer() && layer.activeSublayer().description) {
            layerActual = layer.activeSublayer();
        } else {
            layerActual = layer;
        }
        if (layerActual.description) {
            app.viewModel.layerToolTipText(layerActual.description);
            $('#layer-popover').show().position({
                "my": "right middle",
                "at": "left middle",
                "of": $(event.target).closest(".btn-group")
            });
        }
    };

    // remove the layer dropdrown menu
    self.closeMenu = function(layer, event) {
        $(event.target).closest('.btn-group').removeClass('open');
        layer.showSublayers(false);
    };

    return self;
} // end layerModel

function themeModel(options) {
    var self = this;
    self.name = options.display_name;
    self.id = options.id;
    self.description = options.description;
    self.learn_link = options.learn_link;
    self.is_visible = options.is_visible;

    // array of layers
    self.layers = ko.observableArray();

    //add to open themes
    self.setOpenTheme = function() {
        var theme = this;
        
        // ensure data tab is activated
        $('#dataTab').tab('show');

        if (self.isOpenTheme(theme)) {
            //app.viewModel.activeTheme(null);
            app.viewModel.openThemes.remove(theme);
            app.viewModel.updateScrollBars();
        } else {
            app.viewModel.openThemes.push(theme);
            //setTimeout( app.viewModel.updateScrollBar(), 1000);
            app.viewModel.updateScrollBars();
        }
    };
    
    //is in openThemes
    self.isOpenTheme = function() {
        var theme = this;
        if (app.viewModel.openThemes.indexOf(theme) !== -1) {
            return true;
        }
        return false;
    };

    //display theme text below the map
    self.setActiveTheme = function() {
        var theme = this;
        app.viewModel.activeTheme(theme);
        app.viewModel.activeThemeName(self.name);
        app.viewModel.themeText(theme.description);
    };

    // is active theme
    self.isActiveTheme = function() {
        var theme = this;
        if (app.viewModel.activeTheme() == theme) {
            return true;
        }
        return false;
    };

    self.hideTooltip = function(theme, event) {
        $('.layer-popover').hide();
    };

    return self;
} // end of themeModel

function mapLinksModel() {
    var self = this;
    
    self.cancel = function() {
        $('#map-links-popover').hide();
    };
    
    self.getURL = function() {
        //return window.location.href;
        return 'http://portal.midatlanticocean.org' + app.viewModel.currentURL();
    };
    
    self.shrinkURL = ko.observable();
    self.shrinkURL.subscribe( function() {
        if (self.shrinkURL()) {
            self.useShortURL();
        } else {
            self.useLongURL();
        }
    });
    
    self.useLongURL = function() {
        $('#short-url')[0].value = self.getURL();
    };
        
    self.useShortURL = function() {
        var bitly_login = "ecofletch",
            bitly_api_key = 'R_d02e03290041107b75e3720d7e3c4b95',
            long_url = self.getURL();
            
        $.getJSON( 
            "http://api.bitly.com/v3/shorten?callback=?", 
            { 
                "format": "json",
                "apiKey": bitly_api_key,
                "login": bitly_login,
                "longUrl": long_url
            },
            function(response)
            {
                $('#short-url')[0].value = response.data.url;
            }
        );
    };
    
    self.getPortalURL = function() {
        var urlOrigin = window.location.origin,
            urlHash = window.location.hash;
        return urlOrigin + '/visualize/' + urlHash;
    };
    
    self.setIFrameHTML = function() {
        $('#iframe-html')[0].value = self.getIFrameHTML();
    };
    
    self.getIFrameHTML = function(bookmarkState) {
        var urlOrigin = window.location.origin,
            urlHash = window.location.hash;
            
        if ( bookmarkState ) {
            //urlHash = '#'+$.param(bookmarkState);
            urlHash = '#' + bookmarkState;
        }
        if ( !urlOrigin ) {
            urlOrigin = 'http://' + window.location.host;
        }
        var embedURL = urlOrigin + '/embed/map/' + urlHash;
        //console.log(embedURL);
        return '<iframe width="600" height="450" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"' +
                                     'src="' + embedURL + '">' + '</iframe>' + '<br />';
        //$('#iframe-html')[0].value = '<iframe width="600" height="450" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"' +
        //                             'src="' + embedURL + '">' + '</iframe>' + '<br />';
    };
    
    self.openIFrameExample = function(info) {
        var windowName = "newMapWindow",
            windowSize = "width=650, height=550";
            mapWindow = window.open('', windowName, windowSize);
        var urlOrigin = window.location.origin;
        if ( !urlOrigin ) {
            urlOrigin = 'http://' + window.location.host;
        }
        var header = '<a href="/visualize"><img src="'+urlOrigin+'/media/marco/img/marco-logo_planner.jpg" style="border: 0px;"/></a>';
        var iframeID = '';
        if (info === 'bookmark') {
            iframeID = '#bookmark-iframe-html';
        } else {
            iframeID = '#iframe-html';
        }
        mapWindow.document.write('<html><body>' + $(iframeID)[0].value + '</body></html>');
        mapWindow.document.title = "Your MARCO Map!";
        mapWindow.document.close();
        
    };

    return self;
} // end of mapLinks Model


function viewModel() {
    var self = this;

    self.modernBrowser = ko.observable( !($.browser.msie && $.browser.version < 9.0) );
    
    // list of active layermodels
    self.activeLayers = ko.observableArray();

    // list of visible layermodels in same order as activeLayers
    self.visibleLayers = ko.computed(function() {
        return $.map(self.activeLayers(), function(layer) {
            if (layer.visible()) {
                return layer;
            }
        });
    });
    
    self.visibleLayers.subscribe( function() {
        self.updateAttributeLayers();
    });
    
    self.attributeLayers = ko.observable();
    
    self.featureAttribution = ko.observable(true);
    self.enableFeatureAttribution = function() {
        self.aggregatedAttributes(false);
        self.featureAttribution(true);
    };
    self.disableFeatureAttribution = function() {
        self.featureAttribution(false); 
        app.markers.clearMarkers();
    };
    
    self.showFeatureAttribution = ko.observable(false);
    
    self.featureAttribution.subscribe( function() {
        self.showFeatureAttribution( self.featureAttribution() && !($.isEmptyObject(self.aggregatedAttributes())) );
    });
    
    self.updateAttributeLayers = function() {
        var attributeLayersList = [];
        if (self.scenarios && self.scenarios.scenarioFormModel && self.scenarios.scenarioFormModel.isLeaseblockLayerVisible()) {
            attributeLayersList.push(self.scenarios.leaseblockLayer().layerModel);
        }
        
        $.each(self.visibleLayers(), function(index, layer) {
            //special case for Benthic habitats -- make sure it doesn't exist already so it doesn't produce 2 attribute outputs when both layers are active
            if ( ! app.utils.getObjectFromList(attributeLayersList, 'featureAttributionName', 'Benthic Habitats') ) {
                attributeLayersList.push(layer);
            }
        });
        self.attributeLayers(attributeLayersList);
    };
    
    // boolean flag determining whether or not to show layer panel
    self.showLayers = ko.observable(true);
    
    self.showLayersText = ko.computed(function() {
        if (self.showLayers()) return "Hide Layers";
        else return "Show Layers";
    });
    
    // toggle layer panel visibility
    self.toggleLayers = function() {
        self.showLayers(!self.showLayers());
        self.updateScrollBars();
        app.map.render('map');
        if (self.showLayers()) {
            app.map.render('map'); //doing this again seems to prevent the vector wandering effect
        }
        app.updateUrl();
        //if toggling layers during default pageguide, then correct step 4 position
        //self.correctTourPosition();
        //throws client-side error in pageguide.js for some reason...
    };

    // reference to open themes in accordion
    self.openThemes = ko.observableArray();
    
    self.openThemes.subscribe( function() {
        app.updateUrl();
    });

    self.getOpenThemeIDs = function() {
        return $.map(self.openThemes(), function(theme) {
            return theme.id;
        });
    };
    
    // reference to active theme model/name for display text
    self.activeTheme = ko.observable();
    self.activeThemeName = ko.observable();

    // list of theme models
    self.themes = ko.observableArray();
    self.hiddenThemes = ko.observableArray();

    // last clicked layer for editing, etc
    self.activeLayer = ko.observable();
    self.activeParentLayer = ko.observable();

    // determines visibility of description overlay
    self.showDescription = ko.observable();
    // determines visibility of expanded description overlay
    self.showOverview = ko.observable();
    
    // theme text currently on display
    self.themeText = ko.observable();

    // index for filter autocomplete and lookups
    self.layerIndex = {};
    self.layerSearchIndex = {};

    self.bookmarkEmail = ko.observable();
        
    self.mapLinks = new mapLinksModel();

    // text for tooltip popup
    self.layerToolTipText = ko.observable();

    // descriptive text below the map 
    self.activeInfoLayer = ko.observable(false);
    self.activeInfoSublayer = ko.observable(false);
    self.activeInfoSelector = ko.observable(false);
    self.activeInfoLayer.subscribe( function() {
        if ( self.activeInfoLayer() && self.activeInfoLayer().subLayers && self.activeInfoLayer().subLayers.length > 0 ) {
            self.activeInfoSelector(true);
        } else {
            self.activeInfoSelector(false);
        }
    });


    // attribute data
    self.aggregatedAttributes = ko.observable(false);
    self.aggregatedAttributesWidth = ko.observable('280px');
    self.aggregatedAttributes.subscribe( function() {
        self.updateAggregatedAttributesOverlayWidthAndScrollbar();
        self.showFeatureAttribution( self.featureAttribution() && !($.isEmptyObject(self.aggregatedAttributes())) );
    });
    self.removeFromAggregatedAttributes = function(layerName) {
        delete app.viewModel.aggregatedAttributes()[layerName];
        //if there are no more attributes left to display, then remove the overlay altogether
        if ($.isEmptyObject(self.aggregatedAttributes())) {
            self.closeAttribution();
        } else {
            //because the subscription on aggregatedAttributes is not triggered by this delete process
            self.updateAggregatedAttributesOverlayWidthAndScrollbar();
            //self.updateCustomScrollbar('#aggregated-attribute-content');
        }
    };
    self.updateAggregatedAttributesOverlayWidthAndScrollbar = function() {
        setTimeout( function() {
            var overlayWidth = (document.getElementById('aggregated-attribute-overlay-test').clientWidth+50),
                width = overlayWidth < 380 ? overlayWidth : 380;
            //console.log('setting overlay width to ' + width);
            self.aggregatedAttributesWidth(width + 'px');
            self.updateCustomScrollbar('#aggregated-attribute-content');
        }, 500);
    };
    self.updateAggregatedAttributesOverlayScrollbar = function() {
        self.updateCustomScrollbar('#aggregated-attribute-content');
    };

    // title for print view
    self.mapTitle = ko.observable();

    self.closeAttribution = function() {
        self.aggregatedAttributes(false);
        app.markers.clearMarkers();
    };
    
    self.updateMarker = function(lonlat) {
        //at some point this function is being called without an appropriate lonlat object...
        if (lonlat.lon && lonlat.lat) {
            app.markers.clearMarkers();
            app.marker = new OpenLayers.Marker(lonlat, app.markers.icon);
            app.marker.map = app.map;
            //app.marker.display(true);
            if (app.marker && !$.isEmptyObject(self.aggregatedAttributes()) && self.featureAttribution()) {
                app.markers.addMarker(app.marker);
                app.map.setLayerIndex(app.markers, 99);
            }
        }
    };
    
    self.zoomLevel = ko.observable(false);
    
    
    // minimize data panel
    self.minimized = false;
    self.minimizeLayerSwitcher = function() {
        if ( !self.minimized ) {
            $('#mafmc-layer-switcher').animate( {height: '55px'}, 400 );
            $('#mafmc-tab-content').hide();
            $('#mafmc-tabs').hide();
            $('#mafmc-active-content').hide();
            $('#mafmc-layer-list').hide();
            // $('#myTabContent').hide();
        } else {
            $('#mafmc-layer-switcher').animate( {height: '350px'}, 400 );
            setTimeout( function() {
                $('#mafmc-tabs').show();
                $('#mafmc-active-content').show();
                $('#mafmc-layer-list').show();
                $('#mafmc-tab-content').show();
                // $('#myTabContent').show();
            }, 200);
            setTimeout( function() {
                self.updateAllScrollBars();
            }, 400);
        }
        self.minimized = !self.minimized;
    };
    
    
    /*
    self.getAttributeHTML = function() {
        var html = "";
        $.each(self.activeLayers(), function(i, layer) {
            if (self.aggregatedAttributes()[layer.name]) {
                html += "<h4>"+layer.name+".<h4>";
                html += "<dl>";
                $.each(self.aggregatedAttributes()[layer.name], function(j, attrs) {
                    html += "<dt><span>"+attrs.display+"</span>:";
                    html += "<span>"+attrs.data+"</span></dt>";
                });
                html += "</dl>";
            }
        });
        return html;
    };
    */
    // hide tours for smaller screens
    self.hideTours = ko.observable(false);

    // set the error type
    // can be one of:
    //  restoreState
    self.error = ko.observable();
    self.clearError = function() {
        self.error(null);
    };
    
    self.showLogo = ko.observable(true);
    self.hideLogo = function() {
        self.showLogo(false);
    };
    self.showZoomControls = ko.observable(true);
    self.hideZoomControls = function() {
        self.showZoomControls(false);
    };
    self.showZoomControls.subscribe(function (newVal) {
        if (newVal === false) {
            $('.olControlZoom').css('display', 'none');
        } else {
            $('.olControlZoom').css('display', '');
        }
    });
    
    self.isFullScreen = ko.observable(false);
    
    self.fullScreenWithLayers = function() {
        return self.isFullScreen() && self.showLayers();
    };

    // show the map?
    self.showMapPanel = ko.observable(true);

    //show/hide the list of basemaps
    self.showBasemaps = function(self, event) {
        var $layerSwitcher = $('#SimpleLayerSwitcher_28'),
            $button = $('#basemaps'); //$(event.target).closest('.btn');
        if ($layerSwitcher.is(":visible")) {
            $layerSwitcher.hide();
        } else {
            $layerSwitcher.show();
        }
    };
    self.showMAFMCBasemaps = function(self) {
        var $layerSwitcher = $('#SimpleLayerSwitcher_28');
        $layerSwitcher.css({ "top": "38px", "right": "12px", "width": "138px" });
        setTimeout( function() {
            $layerSwitcher.slideDown(150);
        }, 250);
    };

    // zoom with box
    self.zoomBoxIn = function (self, event) {
        var $button = $(event.target).closest('.btn');
        self.zoomBox($button);
    };
    self.zoomBoxOut = function (self, event) {
        var $button = $(event.target).closest('.btn');
        self.zoomBox($button, true);
    };
    self.zoomBox = function  ($button, out) {
        // out is a boolean to specify whether we are zooming in or out
        // true: zoom out
        // not present/false zoom in
        if ($button.hasClass('active')) {
            self.deactivateZoomBox();
        } else {
            $button.addClass('active');
            $button.siblings('.btn-zoom').removeClass('active');
            if (out) {
                app.map.zoomBox.out = true;
            } else {
                app.map.zoomBox.out = false;
            }
            app.map.zoomBox.activate();            
            $('#map').addClass('zoomBox');

        }
    };
    self.deactivateZoomBox = function ($button) {
        var $button = $button || $('.btn-zoom');
        app.map.zoomBox.deactivate();
        $button.removeClass('active');
        $('#map').removeClass('zoomBox');
    };

    // is the legend panel visible?
    self.showLegend = ko.observable(false);
    self.showLegend.subscribe(function (newVal) {
        self.updateScrollBars();
        if (self.printing.enabled()) {
            self.printing.showLegend(newVal);
        }

        //app.reCenterMap();

    });

    self.activeLegendLayers = ko.computed(function() {
        var layers = $.map(self.visibleLayers(), function(layer) {
            if (layer.legend || layer.legendTitle) {
                return layer;
            }
        });

        // remove any layers with duplicate legend titles
        var seen = {};
        for (i = 0; i < layers.length; i++) {
            var title = layers[i].legendTitle ? layers[i].legendTitle : layers[i].name;
            if (seen[title]) {
                layers.splice(i, 1);
                i--;
            } else {
                seen[title] = true;
            }
        }
        return layers;
    });

    self.legendButtonText = ko.computed(function() {
        if (self.showLegend()) return "Hide Legend";
        else return "Show Legend";
    });

    // is the legend panel visible?
    self.showEmbeddedLegend = ko.observable(false);
    /*self.showEmbeddedLegend.subscribe(function (newVal) {
        self.updateScrollBars();
        if (self.printing.enabled()) {
            self.printing.showLegend(newVal);
        }
    });*/

    // toggle embedded legend (on embedded maps)
    self.toggleEmbeddedLegend = function() {
        self.showEmbeddedLegend( !self.showEmbeddedLegend() );
        var legendScrollpane = $('#embedded-legend').data('jsp');
        if (legendScrollpane === undefined) {
            $('#embedded-legend').jScrollPane();
        } else {
            legendScrollpane.reinitialise();
        }
    };
    
    // toggle legend panel visibility
    self.toggleLegend = function() {
        self.showLegend(!self.showLegend());
        if (!self.showLegend()) {
            app.map.render('map');
        } else {
            //update the legend scrollbar
            //$('#legend-content').data('jsp').reinitialise();
            self.updateScrollBars();
        }
        
        //app.map.render('map');
        //if toggling legend during default pageguide, then correct step 4 position
        self.correctTourPosition();
    };

    // determine whether app is offering legends 
    self.hasActiveLegends = ko.computed(function() {
        var hasLegends = false;
        $.each(self.visibleLayers(), function(index, layer) {
            if (layer.legend || layer.legendTitle) {
                hasLegends = true;
            }
        });
        return hasLegends;
    });

    // close error-overlay
    self.closeAlert = function(self, event) {
        app.viewModel.error(null);
        $('#fullscreen-error-overlay').hide();
    };
    
    self.updateAllScrollBars = function() {
        self.updateScrollBars();
        if (self.scenarios) {
            self.scenarios.updateDesignsScrollBar();
        }
    };
    
    //update jScrollPane scrollbar
    self.updateScrollBars = function() {
    
        if ( app.mafmc || !app.embeddedMap ) {
            var dataScrollpane = $('#data-accordion').data('jsp');
            if (dataScrollpane === undefined) {
                $('#data-accordion').jScrollPane();
            } else {
                dataScrollpane.reinitialise();
            }
            
            var activeScrollpane = $('#active').data('jsp');
            if (activeScrollpane === undefined) {
                $('#active').jScrollPane();
            } else {
                activeScrollpane.reinitialise();
            }
            if ($('#mafmc-active-content')) {
                var mafmcActiveScrollpane = $('#mafmc-active-content').data('jsp');
                if (mafmcActiveScrollpane === undefined) {
                    $('#mafmc-active-content').jScrollPane();
                } else {
                    setTimeout(function() {
                        mafmcActiveScrollpane.reinitialise();
                        $('.jspScrollable').css("outline", "none"); 
                    },100);
                }
            }
            var legendScrollpane = $('#legend-content').data('jsp');
            if (legendScrollpane === undefined) {
                $('#legend-content').jScrollPane();
            } else {
                setTimeout(function() {legendScrollpane.reinitialise();},100);
            }
            if ($('#mafmc-legend')) {
                var mafmcLegendScrollpane = $('#mafmc-legend').data('jsp');
                if (mafmcLegendScrollpane === undefined) {
                    $('#mafmc-legend').jScrollPane();
                } else {
                    setTimeout(function() {
                        mafmcLegendScrollpane.reinitialise();
                        $('.jspScrollable').css("outline", "none"); 
                    },100);
                }
            }
            if (app.viewModel.scenarios) {
                app.viewModel.scenarios.updateDesignsScrollBar();
            }
        }
        $('.jspScrollable').css("outline", "none");
        
    };

    // expand data description overlay
    self.expandDescription = function(self, event) {
        if ( ! self.showOverview() ) {
            self.showOverview(true);
            self.updateCustomScrollbar('#overview-overlay-text');
        } else {
            self.showOverview(false);
        }
    };
    
    self.scrollBarElements = [];
    
    self.updateCustomScrollbar = function(elem) {
        if (app.viewModel.scrollBarElements.indexOf(elem) == -1) {
            app.viewModel.scrollBarElements.push(elem);
            $(elem).mCustomScrollbar({
                scrollInertia:250,
                mouseWheel: 6
            });
        }
        //$(elem).mCustomScrollbar("update");
        //$(elem).mCustomScrollbar("scrollTo", "top"); 
        setTimeout( function() { 
            $(elem).mCustomScrollbar("update"); 
            $(elem).mCustomScrollbar("scrollTo", "top"); 
        }, 500);
    };
    
    // close layer description
    self.closeDescription = function() {
        //self.showDescription(false);
        app.viewModel.showOverview(false);
        if ( ! app.pageguide.tourIsActive ) {
            app.viewModel.showMapAttribution();
        }
    };
    
    self.activateOverviewDropdown = function(model, event) {
        var $btnGroup = $(event.target).closest('.btn-group');
        if ( $btnGroup.hasClass('open') ) {
            $btnGroup.removeClass('open');
        } else {
            //$('#overview-dropdown-button').dropdown('toggle');  
            $btnGroup.addClass('open');
            if (app.viewModel.scrollBarElements.indexOf('#overview-overlay-dropdown') == -1) {
                app.viewModel.scrollBarElements.push('#overview-overlay-dropdown');
                $('#overview-overlay-dropdown').mCustomScrollbar({
                    scrollInertia:250,
                    mouseWheel: 6
                });
            }
            //debugger;
            //setTimeout( $('#overview-overlay-dropdown').mCustomScrollbar("update"), 1000);
            $('#overview-overlay-dropdown').mCustomScrollbar("update");
        }
    }; 
    
    self.getOverviewText = function() {
        //activeInfoSublayer() ? activeInfoSublayer().overview : activeInfoLayer().overview
        if ( self.activeInfoSublayer() ) {
            if ( self.activeInfoSublayer().overview === null ) {
                return '';
            } else {
                return self.activeInfoSublayer().overview;
            }   
        } else if (self.activeInfoLayer() ) {
            if ( self.activeInfoLayer().overview === null ) {
                return '';
            } else {
                return self.activeInfoLayer().overview;
            }  
        } else {
            return '';
        }
    };
    
    self.activeKmlLink = function() {
        if ( self.activeInfoSublayer() ) {
            return self.activeInfoSublayer().kml;
        } else if (self.activeInfoLayer() ) {
            return self.activeInfoLayer().kml;
        } else {
            return false;
        }
    };

    self.activeDataLink = function() {
        //activeInfoLayer().data_download
        if ( self.activeInfoSublayer() ) {
            return self.activeInfoSublayer().data_download;
        } else if (self.activeInfoLayer() ) {
            return self.activeInfoLayer().data_download;
        } else {
            return false;
        }
    };
    
    self.activeMetadataLink = function() {
        //activeInfoLayer().metadata
        if ( self.activeInfoSublayer() ) {
            return self.activeInfoSublayer().metadata;
        } else if (self.activeInfoLayer() ) {
            return self.activeInfoLayer().metadata;
        } else {
            return false;
        }
    };
    
    self.activeSourceLink = function() {
        //activeInfoLayer().source
        if ( self.activeInfoSublayer() ) {
            return self.activeInfoSublayer().source;
        } else if (self.activeInfoLayer() ) {
            return self.activeInfoLayer().source;
        } else {
            return false;
        }
    };
        
    self.activeTilesLink = function() {
        //activeInfoLayer().source
        if ( self.activeInfoSublayer() ) {
            return self.activeInfoSublayer().tiles;
        } else if (self.activeInfoLayer() ) {
            return self.activeInfoLayer().tiles;
        } else {
            return false;
        }
    };
        
    //assigned in app.updateUrl (in state.js)
    self.currentURL = ko.observable();


    // show bookmark stuff
    self.showBookmarks = function(self, event) {
        var $button = $(event.target).closest('.btn'),
            $popover = $('#bookmark-popover');

        if ($popover.is(":visible")) {
            $popover.hide();
        } else {
            self.bookmarks.newBookmarkName(null);
            //TODO: move all this into bookmarks model
            // hide the popover if already visible
            $popover.show().position({
                "my": "right middle",
                "at": "left middle",
                "of": $button,
                offset: "-10px 0px"
            });
            self.bookmarks.updateBookmarkScrollBar();
        }
    };
    
    //show Map Links
    /*
    self.showMapLinks = function(self, event) {
        var $button = $(event.target).closest('.btn'),
            $popover = $('#map-links-popover');

        if ($popover.is(":visible")) {
            $popover.hide();
        } else {
            self.resetMapLinks();
            $popover.show().position({
                "my": "top",
                "at": "top",
                "of": $('#map'),
                offset: "0px 10px"
            });
        }
    };
    */
    
    self.resetMapLinks = function() {
        self.mapLinks.shrinkURL(false);
        $('#short-url').text = self.mapLinks.getURL();
        self.mapLinks.setIFrameHTML();
    };
    
    self.selectedLayer = ko.observable();

    self.showOpacity = function(layer, event) {
        var $button = $(event.target).closest('a'),
            $popover = $('#opacity-popover');

        self.selectedLayer(layer);

        if ($button.hasClass('active')) {
            self.hideOpacity();
        } else {
            $popover.show().position({
                "my": "center top",
                "at": "center bottom",
                "of": $button,
                "offset": "0px 10px"
            });
            $button.addClass('active');
        }
    };

    self.hideOpacity = function(self, event) {
        $('#opacity-popover').hide();
        $('.opacity-button.active').removeClass('active');
        app.updateUrl();
    };
    self.hideTooltip = function() {
        $('#layer-popover').hide();
    };


    // show coords info in pointer
    self.showPointerInfo = ko.observable(false);
    self.togglePointerInfo = function() {
        self.showPointerInfo(!self.showPointerInfo());
    };

    // get layer by id
    self.getLayerById = function(id) {
        for (var x=0; x<self.themes().length; x++) {
            var layer_list = $.grep(self.themes()[x].layers(), function(layer) { return layer.id === id; });
            if (layer_list.length > 0) {
                return layer_list[0];
            }
        }
        return false;
    };

    self.getLayerBySlug = function(slug) {
        for (var x=0; x<self.themes().length; x++) {
            var layer_list = $.grep(self.themes()[x].layers(), function(layer) { 
                return self.convertToSlug(layer.name) === slug; 
            });
            if (layer_list.length > 0) {
                return layer_list[0];
            }
        }
        for (var x=0; x<self.themes().length; x++) {
            for (var y=0; y<self.themes()[x].layers().length; y++) {
                var sublayer_list = $.grep(self.themes()[x].layers()[y].subLayers, function(sublayer) {
                    return self.convertToSlug(sublayer.name) === slug;
                });
                if (sublayer_list.length > 0) {
                    return sublayer_list[0];
                }
            }
        }
        return false;
    };

    // handle the search form
    self.searchTerm = ko.observable();
    self.layerSearch = function() {
        var found = self.layerSearchIndex[self.searchTerm()];
        //self.activeTheme(theme);
        self.openThemes.push(found.theme);
        found.layer.activateLayer();
    };
    self.keySearch = function(_, event) {

        if (event.which === 13) {
            self.searchTerm($('.typeahead .active').text());
            self.layerSearch();
        }
        $('ul.typeahead').on('click', 'li', function () {
            self.searchTerm($('.typeahead .active').text());
            self.layerSearch();
            //search($(this).text());
        });
    };

    // do this stuff when the active layers change
    self.activeLayers.subscribe(function() {
        // initial index
        var index = 300;
        app.state.activeLayers = [];

        //self.showLegend(false);
        $.each(self.activeLayers(), function(i, layer) {
            // set the zindex on the openlayers layer
            // layers at the beginning of activeLayers
            // are above those that are at the end
            // also save the layer state
            app.setLayerZIndex(layer, index);
            index--;
        });

        // re-ordering map layers by z value
        app.map.layers.sort(function(a, b) {
            return a.getZIndex() - b.getZIndex();
        });

        //update the legend scrollbar
        //setTimeout(function() {$('#legend-content').data('jsp').reinitialise();}, 200);
        setTimeout(function() { app.viewModel.updateScrollBars(); }, 200);
        
        // update the url hash
        app.updateUrl();
        
    });
    
    self.deactivateAllLayers = function() {
        //$.each(self.activeLayers(), function (index, layer) {
        var numActiveLayers = self.activeLayers().length;
        for (var i=0; i < numActiveLayers; i++) {
            self.activeLayers()[0].deactivateLayer();
        }
    };
    
    self.closeAllThemes = function() {
        var numOpenThemes = self.openThemes().length;
        for (var i=0; i< numOpenThemes; i++) {
            self.openThemes.remove(self.openThemes()[0]);
        }
        self.updateScrollBars();
    };

    // do this stuff when the visible layers change
    /*self.visibleLayers.subscribe(function() {
        if (!self.hasActiveLegends()) {
            self.showLegend(false);
        }
    });*/
    
    /* DESIGNS */
    
    self.showCreateButton = ko.observable(true);
    
    /* Wind Design */
    self.showWindDesignWizard = ko.observable(false);
    self.windDesignStep1 = ko.observable(false);
    self.windDesignStep2 = ko.observable(false);
    self.windDesignStep3 = ko.observable(false);
    
    self.startWindDesignWizard = function() {
        self.showCreateButton(false);
        self.showWindDesignWizard(true);
        self.showWindDesignStep1();
    };
    
    self.showWindDesignStep1 = function() {
        self.windDesignStep1(true);
        $('#wind-design-breadcrumb-step-1').addClass('active');
        self.windDesignStep2(false);
        $('#wind-design-breadcrumb-step-2').removeClass('active');
        self.windDesignStep3(false);
        $('#wind-design-breadcrumb-step-3').removeClass('active');
    };
    
    self.showWindDesignStep2 = function() {
        self.windDesignStep1(false);
        $('#wind-design-breadcrumb-step-1').removeClass('active');
        self.windDesignStep2(true);
        $('#wind-design-breadcrumb-step-2').addClass('active');
        self.windDesignStep3(false);
        $('#wind-design-breadcrumb-step-3').removeClass('active');
    };
    
    self.showWindDesignStep3 = function() {
        self.windDesignStep1(false);
        $('#wind-design-breadcrumb-step-1').removeClass('active');
        self.windDesignStep2(false);
        $('#wind-design-breadcrumb-step-2').removeClass('active');
        self.windDesignStep3(true);
        $('#wind-design-breadcrumb-step-3').addClass('active');
    };
    /* END Wind Design */
    
    self.startDefaultTour = function() {
        if ( $.pageguide('isOpen') ) { // activated when 'tour' is clicked
            // close the pageguide
            app.pageguide.togglingTours = true;
            $.pageguide('close');
        } else {
            //save state
            app.pageguide.state = app.getState();
            app.saveStateMode = false;   
        }
        
        //show the data layers panel
        app.viewModel.showLayers(true);
        
        //ensure pageguide is managing the default guide
        $.pageguide(defaultGuide, defaultGuideOverrides);
        
        //adding delay to ensure the message will load 
        setTimeout( function() { $.pageguide('open'); }, 700 );
        //$('#help-tab').click();
        
        app.pageguide.togglingTours = false;
    };
    
    self.stepTwoOfBasicTour = function() {
        $('.pageguide-fwd')[0].click();
    };
    
    self.startDataTour = function() {
        //ensure the pageguide is closed 
        if ( $.pageguide('isOpen') ) { // activated when 'tour' is clicked
            // close the pageguide
            app.pageguide.togglingTours = true;
            $.pageguide('close');
        } else {
            //save state
            app.pageguide.state = app.getState();
            app.saveStateMode = false;   
        }
        
        //show the data layers panel
        app.viewModel.showLayers(true);
        
        //switch pageguide from default guide to data guide
        $.pageguide(dataGuide, dataGuideOverrides);
        
        //show the data tab, close all themes and deactivate all layers, and open the Admin theme
        app.viewModel.closeAllThemes();
        app.viewModel.deactivateAllLayers();
        app.viewModel.themes()[0].setOpenTheme();
        app.setMapPosition(-73, 38.5, 7);
        $('#dataTab').tab('show');
         
        //start the tour
        setTimeout( function() { $.pageguide('open'); }, 700 );
        
        app.pageguide.togglingTours = false;
    };
    
    self.startActiveTour = function() {
        //ensure the pageguide is closed 
        if ( $.pageguide('isOpen') ) { // activated when 'tour' is clicked
            // close the pageguide
            app.pageguide.togglingTours = true;
            $.pageguide('close');
        } else {
            //save state
            app.pageguide.state = app.getState();
            app.saveStateMode = false;   
        }
        
        //show the data layers panel
        app.viewModel.showLayers(true);
        
        //switch pageguide from default guide to active guide
        $.pageguide(activeGuide, activeGuideOverrides);
        
        //show the active tab, close all themes and deactivate all layers, activate a couple layers
        //app.viewModel.closeAllThemes();
        app.viewModel.deactivateAllLayers();
        //activate desired layers
        for (var i=0; i < app.viewModel.themes()[0].layers().length; i++) {
            if ( app.viewModel.themes()[0].layers()[i].name === 'OCS Lease Blocks' ) { //might be more robust if indexOf were used
                app.viewModel.themes()[0].layers()[i].activateLayer();
            }
        }
        for (var i=0; i < app.viewModel.themes()[2].layers().length; i++) {
            if ( app.viewModel.themes()[2].layers()[i].name === 'Benthic Habitats (South)' ) {
                app.viewModel.themes()[2].layers()[i].activateLayer();
            }
        }
        app.setMapPosition(-75, 37.6, 8);
        $('#activeTab').tab('show');
        
        //start the tour
        setTimeout( function() { $.pageguide('open'); }, 700 );
        
        app.pageguide.togglingTours = false;
    };
    
    self.startDesignsTour = function() {
        if ( $.pageguide('isOpen') ) { // activated when 'tour' is clicked
            // close the pageguide
            app.pageguide.togglingTours = true;
            $.pageguide('close');
        } else {
            //save state
            app.pageguide.state = app.getState();
            app.saveStateMode = false;   
        }
        
        //show the designs panel
        $('#designsTab').tab('show');
        
        //ensure pageguide is managing the default guide
        $.pageguide(designsGuide, designsGuideOverrides);
        
        //adding delay to ensure the message will load 
        setTimeout( function() { $.pageguide('open'); }, 700 );
        //$('#help-tab').click();
        
        app.pageguide.togglingTours = false;
    };
    
    
    //if toggling legend or layers panel during default pageguide, then correct step 4 position
    self.correctTourPosition = function() {
        if ( $.pageguide('isOpen') ) {
            if ($.pageguide().guide().id === 'default-guide') {
                $.pageguide('showStep', $.pageguide().guide().steps.length-1);
            }
        }
    };
    
    self.showMapAttribution = function() {
        $('.olControlScaleBar').show();
        $('.olControlAttribution').show();
    };
    self.hideMapAttribution = function() {
        $('.olControlScaleBar').hide();
        $('.olControlAttribution').hide();
    };
    
    self.convertToSlug = function(orig) {
        return orig
            .toLowerCase()
            .replace(/[^\w ]+/g,'')
            .replace(/ +/g,'-');
    };
    
    /* REGISTRATION */
    self.username = ko.observable();
    self.usernameError = ko.observable(false);
    self.password1 = ko.observable("");
    self.password2 = ko.observable("");
    self.passwordWarning = ko.observable(false);
    self.passwordError = ko.observable(false);
    self.passwordSuccess = ko.observable(false);
    self.inactiveError = ko.observable(false);
    
    self.verifyLogin = function(form) {
        var username = $(form.username).val(),
            password = $(form.password).val();
        if (username && password) {
            $.ajax({ 
                async: false,
                url: '/marco_profile/verify_password', 
                data: { username: username, password: password }, 
                type: 'POST',
                dataType: 'json',
                success: function(result) { 
                    if (result.verified === 'inactive') {
                        self.inactiveError(true);
                    } else if (result.verified === true) {
                        self.passwordError(false);
                    } else {
                        self.passwordError(true);
                    }
                },
                error: function(result) { } 
            });
            if (self.passwordError() || self.inactiveError()) {
                return false;
            } else {
                self.bookmarks.getBookmarks();
                return true;
            }
        }
        return false;
    };
    self.turnOffInactiveError = function() {
        self.inactiveError(false);
    };
    
    self.verifyPassword = function(form) {
        var username = $(form.username).val(),
            old_password = $(form.old_password).val();
        self.password1($(form.new_password1).val());
        self.password2($(form.new_password2).val());
        self.checkPassword();
        if ( ! self.passwordWarning() ) {
            if (username && old_password) {
                $.ajax({ 
                    async: false,
                    url: '/marco_profile/verify_password', 
                    data: { username: username, password: old_password }, 
                    type: 'POST',
                    dataType: 'json',
                    success: function(result) { 
                        if (result.verified === true) {
                            self.passwordError(false);
                        } else {
                            self.passwordError(true);
                        }
                    },
                    error: function(result) { } 
                });
                if (self.passwordError()) {
                    return false;
                } else {
                    return true;
                }
            }
        }
        return false;
    };
    self.turnOffPasswordError = function() {
        self.passwordError(false);
    };
    
    
    self.checkPassword = function() {
        if (self.password1() && self.password2() && self.password1() !== self.password2()) {
            self.passwordWarning(true);
            self.passwordSuccess(false);
        } else if (self.password1() && self.password2() && self.password1() === self.password2()) {
            self.passwordWarning(false);
            self.passwordSuccess(true);
        } else {
            self.passwordWarning(false);
            self.passwordSuccess(false);
        }
        return true;
    };
    
    self.checkUsername = function() {
        if (self.username()) {
            $.ajax({ 
                url: '/marco_profile/duplicate_username', 
                data: { username: self.username() }, 
                method: 'GET',
                dataType: 'json',
                success: function(result) { 
                    if (result.duplicate === true) {
                        self.usernameError(true);
                    } else {
                        self.usernameError(false);
                    }
                },
                error: function(result) { } 
            });
        }
    };
    self.turnOffUsernameError = function() {
        self.usernameError(false);
    };
    
    self.getWindPlanningAreaAttributes = function (data) {
        attrs = [];
        if ('INFO' in data) {
            var state = data.INFO,
                first = state.indexOf("Call"),
                second = state.indexOf("WEA"),
                third = state.indexOf("RFI");
            /*if (first !== -1) {
                state = state.slice(0, first);
            } else if (second !== -1) {
                state = state.slice(0, second);
            } else if (third !== -1) {
                state = state.slice(0, third);
            }*/
            attrs.push({'display': '', 'data': state});
        } 
        return attrs;
    };
    
    self.getSeaTurtleAttributes = function (data) {
        attrs = [];
        if ('ST_LK_NUM' in data && data['ST_LK_NUM']) {
            //attrs.push({'display': 'Sightings', 'data': data['ST_LK_NUM']});
            if (data['ST_LK_NUM'] === 99) {
                attrs.push({'display': 'Insufficient Data available for this area', 'data': ''});
            } else {
                attrs.push({'display': 'Above Average Sightings for the following species:', 'data': ''});
            }
        } else {
            attrs.push({'display': 'Sightings were in the normal range for all species', 'data': ''});
        }
        
        if ('ST_LK_NUM' in data && data['ST_LK_NUM'] ) {
            var season, species, sighting; 
            if ('GREEN_LK' in data && data['GREEN_LK']) {
                season = data['GREEN_LK'];
                species = 'Green Sea Turtle';
                sighting = species + ' (' + season + ') ';
                attrs.push({'display': '', 'data': sighting});
            }  
            if ('LEATH_LK' in data && data['LEATH_LK']) {
                season = data['LEATH_LK'];
                species = 'Leatherback Sea Turtle';
                sighting = species + ' (' + season + ') ';
                attrs.push({'display': '', 'data': sighting});
            }  
            if ('LOGG_LK' in data && data['LOGG_LK']) {
                season = data['LOGG_LK'];
                species = 'Loggerhead Sea Turtle';
                sighting = species + ' (' + season + ') ';
                attrs.push({'display': '', 'data': sighting});
            }
        }
        return attrs;
    };
    
    self.getToothedMammalAttributes = function (data) {
        attrs = [];
        if ('TOO_LK_NUM' in data && data['TOO_LK_NUM']) {
            if (data['TOO_LK_NUM'] === 99) {
                attrs.push({'display': 'Insufficient Data available for this area', 'data': ''});
            } else {
                attrs.push({'display': 'Above Average Sightings for the following species:', 'data': ''});
            }
        } else {
            attrs.push({'display': 'Sightings were in the normal range for all species', 'data': ''});
        }
        if ('TOO_LK_NUM' in data && data['TOO_LK_NUM'] ) {
            var season, species, sighting; 
            if ('SPERM_LK' in data && data['SPERM_LK']) {
                season = data['SPERM_LK'];
                species = 'Sperm Whale';
                sighting = species + ' (' + season + ') ';
                attrs.push({'display': '', 'data': sighting});
            }  
            if ('BND_LK' in data && data['BND_LK']) {
                season = data['BND_LK'];
                species = 'Bottlenose Dolphin';
                sighting = species + ' (' + season + ') ';
                attrs.push({'display': '', 'data': sighting});
            }  
            if ('STRIP_LK' in data && data['STRIP_LK']) {
                season = data['STRIP_LK'];
                species = 'Striped Dolphin';
                sighting = species + ' (' + season + ') ';
                attrs.push({'display': '', 'data': sighting});
            }
        }
        return attrs;
    };
    
    self.getWindSpeedAttributes = function (data) {
        attrs = [];
        if ('SPEED_90' in data) {
            var min_speed = (parseFloat(data['SPEED_90'])-0.125).toPrecision(3),
                max_speed = (parseFloat(data['SPEED_90'])+0.125).toPrecision(3);
            attrs.push({'display': 'Estimated Avg Wind Speed', 'data': min_speed + ' to ' + max_speed + ' m/s'});
        } 
        return attrs;
    };
    
    self.adjustPartyCharterAttributes = function (attrs) {
        for (var x=0; x<attrs.length; x=x+1) {
            attrs[x].display = 'Total Trips (2000-2009)';
        }
        return attrs;
    };
    
    self.isSelectedLeaseBlock = function(name) {
        if (name === "OCS Lease Blocks") {
            return true;
        }
        if (self.scenarios && 
            self.scenarios.selectionFormModel && 
            self.scenarios.selectionFormModel.selectedLeaseBlockLayer && 
            self.scenarios.selectionFormModel.selectedLeaseBlocksLayerName === name) {
            return true;
        } 
        if (self.scenarios && 
            self.scenarios.scenarioFormModel && 
            self.scenarios.scenarioLeaseBlocksLayerName === name) {
            return true;
        }
        return false;
    };


    self.getChannelAttributes = function (data) {
        attrs = [];
        if ('location' in data) {
            attrs.push({'display': '', 'data': data['location']});
        } 
        if ('minimumDep' in data) {
            var meters = data['minimumDep'],
                feet =  new Number(meters * 3.28084).toPrecision(2);
            attrs.push({'display': 'Minimum Depth', 'data': feet + ' feet'}); // + meters + ' meters)'});
        }
        return attrs;
    };

    self.getPortOwnershipAttributes = function (data) {
        attrs = [];
        if ('Ownership' in data) {
            attrs.push({'display': '', 'data': data['Ownership']});
        }
        return attrs;
    };

    self.getPortCommodityAttributes = function (data) {
        attrs = [];
        if ('Commodity_' in data) {
            var commodity = 'Unknown';
            switch (data['Commodity_']) {
                case 0: 
                    commodity = 'Not applicable';
                    break;
                case 10:
                    commodity = 'Coal';
                    break;
                case 20:
                    commodity = 'Petroleum & petroleum products';
                    break;
                case 30:
                    commodity = 'Chemicals & related products';
                    break;
                case 40:
                    commodity = 'Crude materials, inedible, except fuels';
                    break;
                case 50:
                    commodity = 'Primary manufactured goods';
                    break;
                case 60:
                    commodity = 'Food & farm products';
                    break;
                case 70:
                    commodity = 'All manufactured equipment and machinery';
                    break;
                case 80:
                    commodity = 'Waste material; garbage, landfill, sewage sludge & waste water';
                    break;
                case 91:
                    commodity = 'Multi-commodities';
                    break;
                case 99:
                    commodity = 'Unknown';
                    break;
            }
            attrs.push({'display': '', 'data': commodity});
        }
        return attrs;
    };
    
    self.getOCSAttributes = function (data) {
        attrs = [];
        if ('BLOCK_LAB' in data) {
            attrs.push({'display': 'OCS Block Number', 'data': data['BLOCK_LAB']});
        } else if ('PROT_NUMB' in data) {
            var blockLab = data['PROT_NUMB'].substring(data['PROT_NUMB'].indexOf('_')+1);
            attrs.push({'display': 'OCS Block Number', 'data': blockLab});
        }
        if ('PROT_NUMBE' in data) {
            attrs.push({'display': 'Protraction Number', 'data': data['PROT_NUMBE']});
        }else if ('PROT_NUMB' in data) {
            var protNumbe = data['PROT_NUMB'].substring(0,data['PROT_NUMB'].indexOf('_'));
            attrs.push({'display': 'Protraction Number', 'data': protNumbe});
        }
        if ('PROT_NUMB' in data) {
            if (self.scenarios && 
                self.scenarios.selectionFormModel && 
                self.scenarios.selectionFormModel.IE && 
                self.scenarios.selectionFormModel.selectingLeaseBlocks()) {
                var blockID = data['PROT_NUMB'],
                    index = self.scenarios.selectionFormModel.selectedLeaseBlocks.indexOf(blockID);
                if ( index === -1) {
                    //add that lease block to the list of selected leaseblocks
                    self.scenarios.selectionFormModel.selectedLeaseBlocks.push(blockID);
                } else {
                    //remove that lease block from the list of selected leaseblocks
                    self.scenarios.selectionFormModel.selectedLeaseBlocks.splice(index, 1);
                }
            }
        }
        
        //Wind Speed
        if ('WINDREV_MI' in data && 'WINDREV_MA' in data) {
            if ( data['WINDREV_MI'] ) {                
                var min_speed = data['WINDREV_MI'].toFixed(3),
                    max_speed = data['WINDREV_MA'].toFixed(3),
                    min_range = (parseFloat(min_speed)-.125).toPrecision(3),
                    max_range = (parseFloat(max_speed)+.125).toPrecision(3);
                /*if ( min_speed === max_speed ) {
                    attrs.push({'display': 'Estimated Avg Wind Speed (m/s)', 'data': speed});
                } else {
                    var speed = (min_speed-.125) + ' to ' + (max_speed+.125);
                    attrs.push({'display': 'Estimated Avg Wind Speed (m/s)', 'data': speed});
                }*/
                attrs.push({'display': 'Estimated Avg Wind Speed', 'data': min_range + ' to ' + max_range + ' m/s'});
            } else {
                attrs.push({'display': 'Estimated Avg Wind Speed', 'data': 'Unknown'});
            }
        }
        
        //Distance to Coastal Substation
        if ('SUBSTAMIN' in data && 'SUBSTMAX' in data) {
            if (data['SUBSTAMIN'] !== 0 && data['SUBSTMAX'] !== 0) {
                attrs.push({'display': 'Distance to Coastal Substation', 'data': data['SUBSTAMIN'].toFixed(0) + ' to ' + data['SUBSTMAX'].toFixed(0) + ' miles'});
            } else {
                attrs.push({'display': 'Distance to Coastal Substation Unknown', 'data': null});
            }
        }
        
        //Distance to AWC Hubs
        if ('AWCMI_MIN' in data && 'AWCMI_MAX' in data) {
            attrs.push({'display': 'Distance to Proposed AWC Hub', 'data': data['AWCMI_MIN'].toFixed(0) + ' to ' + data['AWCMI_MAX'].toFixed(0) + ' miles'});
        }
        
        //Wind Planning Areas
        if ('WEA2' in data && data['WEA2'] !== 0) {
            var weaName = data['WEA2_NAME'],
                stateName = weaName.substring(0, weaName.indexOf(' '));
            if (stateName === 'New') { 
                stateName = 'New Jersey'; 
            } else if (stateName === 'Rhode') {
                stateName = 'Rhode Island / Massachusetts';
            }
            //if ( data['WEA2_NAME'].replace(/\s+/g, '') !== "" ) {
            //TAKING THIS OUT TEMPORARILY UNTIL WE HAVE UPDATED THE DATA SUMMARY FOR WPAS AND LEASE AREAS
            //attrs.push({'display': 'Within the ' + stateName + ' WPA', 'data': null});
            //}
        }
        
        //Distance to Shipping Lanes
        if ('TRAFFCMIN' in data && 'TRAFFCMAX' in data) {
            attrs.push({'display': 'Distance to Ship Routing Measures', 'data': data['TRAFFCMIN'].toFixed(0) + ' to ' + data['TRAFFCMAX'].toFixed(0) + ' miles'});
        }
        
        //Distance to Shore
        if ('MI_MIN' in data && 'MI_MAX' in data) {
            attrs.push({'display': 'Distance to Shore', 'data': data['MI_MIN'].toFixed(0) + ' to ' + data['MI_MAX'].toFixed(0) + ' miles'});
        }
        
        //Depth Range
        if ('DEPTHM_MIN' in data && 'DEPTHM_MAX' in data) {
            if ( data['DEPTHM_MIN'] ) {
                //convert depth values to positive feet values (from negative meter values)
                var max_depth = (-data['DEPTHM_MAX']).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    min_depth = (-data['DEPTHM_MIN']).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                attrs.push({'display': 'Depth Range', 'data': max_depth + ' to ' + min_depth + ' meters'});
            } else {
                attrs.push({'display': 'Depth Range', 'data': 'Unknown'});
            }
        }
        
        //Seabed Form
        if ('PCT_TOTAL' in data) {
            if (data['PCT_TOTAL'] < 99.9) {
                attrs.push({'display': 'Seabed Form', 'data': 'Unknown'});
            } else {
                attrs.push({'display': 'Seabed Form', 'data': ''});
                if ('PCTDEPRESS' in data && Math.round(data['PCTDEPRESS']) > 0) {
                    attrs.push({'tab': true, 'display': 'Depression (' + Math.round(data['PCTDEPRESS']) + '%)', 'data': ''});
                }
                if ('PCTHIGHFLA' in data && Math.round(data['PCTHIGHFLA']) > 0) {
                    attrs.push({'tab': true, 'display': 'High Flat (' + Math.round(data['PCTHIGHFLA']) + '%)', 'data': ''}); 
                }
                if ('PCTHIGHSLO' in data && Math.round(data['PCTHIGHSLO']) > 0) {
                    attrs.push({'tab': true, 'display': 'High Slope (' + Math.round(data['PCTHIGHSLO']) + '%)', 'data': ''}); 
                }
                if ('PCTLOWSLOP' in data && Math.round(data['PCTLOWSLOP']) > 0) {
                    attrs.push({'tab': true, 'display': 'Low Slope (' + Math.round(data['PCTLOWSLOP']) + '%)', 'data': ''});
                }
                if ('PCTMIDFLAT' in data && Math.round(data['PCTMIDFLAT']) > 0) {
                    attrs.push({'tab': true, 'display': 'Mid Flat (' + Math.round(data['PCTMIDFLAT']) + '%)', 'data': ''});
                }
                if ('PCTSIDESLO' in data && Math.round(data['PCTSIDESLO']) > 0) {
                    attrs.push({'tab': true, 'display': 'Side Slope (' + Math.round(data['PCTSIDESLO']) + '%)', 'data': ''}); 
                }
                if ('PCTSTEEP' in data && Math.round(data['PCTSTEEP']) > 0) {
                    attrs.push({'tab': true, 'display': 'Steep (' + Math.round(data['PCTSTEEP']) + '%)', 'data': ''});
                }
            }
        }
        
        //Coral Count
        var coralCount = 0,
            laceCount = 0,
            blackCount = 0,
            softCount = 0,
            gorgoCount = 0,
            hardCount = 0;
        if ('FREQ_LACE' in data) {
            laceCount = data['FREQ_LACE'];
            coralCount += laceCount;
        }
        if ('FREQ_BLACK' in data) {
            blackCount = data['FREQ_BLACK'];
            coralCount += blackCount;
        }
        if ('FREQ_SOFT' in data) {
            softCount = data['FREQ_SOFT'];
            coralCount += softCount;
        }
        if ('FREQ_GORGO' in data) {
            gorgoCount = data['FREQ_GORGO'];
            coralCount += gorgoCount;
        }
        if ('FREQ_HARD' in data) {
            hardCount = data['FREQ_HARD'];  
            coralCount += hardCount;  
        }
        if (coralCount > 0) {
            attrs.push({'display': 'Identified Corals', 'data': coralCount});
            if (laceCount > 0) {
                attrs.push({'tab': true, 'display': 'Lace Corals (' + laceCount + ')', 'data': ''});
            }
            if (blackCount > 0) {
                attrs.push({'tab': true, 'display': 'Black/Thorny Corals (' + blackCount + ')', 'data': ''});
            }
            if (softCount > 0) {
                attrs.push({'tab': true, 'display': 'Soft Corals (' + softCount + ')', 'data': ''});
            }
            if (gorgoCount > 0) {
                attrs.push({'tab': true, 'display': 'Gorgonian Corals (' + gorgoCount + ')', 'data': ''});
            }
            if (hardCount > 0) {
                attrs.push({'tab': true, 'display': 'Hard Corals (' + hardCount + ')', 'data': ''});
            }
        }
        if ('FREQ_PENS' in data && data['FREQ_PENS'] > 0) {
            var seaPenCount = data['FREQ_PENS'];
            attrs.push({'display': 'Sea Pens Identified', 'data': seaPenCount});
        }
        
        //Shipwrecks
        if ('BOEMSHPDEN' in data) {
            attrs.push({'display': 'Number of Shipwrecks', 'data': data['BOEMSHPDEN']});
        }
                
        //Distance to Discharge Point Locations
        if ('DISCHMEAN' in data) {
            attrs.push({'display': 'Avg Distance to Offshore Discharge', 'data': data['DISCHMEAN'].toFixed(1) + ' miles'});
        }
        if ('DFLOWMEAN' in data) {
            attrs.push({'display': 'Avg Distance to Flow-Only Offshore Discharge', 'data': data['DFLOWMEAN'].toFixed(1) + ' miles'});
        }
        
        //Dredge Disposal Locations
        if ('DREDGE_LOC' in data) {
            if (data['DREDGE_LOC'] > 0) {
                attrs.push({'display': 'Contains a Dredge Disposal Location', 'data': ''});
            } else {
                attrs.push({'display': 'Does not contain a Dredge Disposal Location', 'data': ''});
            }
        }
        
        //Unexploded Ordinances 
        if ('UXO' in data) {
            if (data['UXO'] === 0) {
                attrs.push({'display': 'No known Unexploded Ordnances', 'data': ''});
            } else {
                attrs.push({'display': 'Known to contain Unexploded Ordnance(s)', 'data': ''});
            }
        }

        //Traffic Density (High/Moderate/Low)
        if ('PCTALL_LO' in data && data['PCTALL_LO'] !== 999) {
            attrs.push({'display': 'Ship Traffic Density (All Vessels)', 'data': ''});
            if (data['PCTALL_LO'] > 0) {
                attrs.push({'tab': true, 'display': 'Low Traffic', 'data': data['PCTALL_LO'] + '%'});
            }
            if (data['PCTALL_ME'] > 0) {
                attrs.push({'tab': true, 'display': 'Moderate Traffic', 'data': data['PCTALL_ME'] + '%'});
            }
            if (data['PCTALL_HI'] > 0) {
                attrs.push({'tab': true, 'display': 'High Traffic', 'data': data['PCTALL_HI'] + '%'});
            }
        }
        if ('PCTCAR_LO' in data && data['PCTCAR_LO'] !== 999) {
            attrs.push({'display': 'Ship Traffic Density (Cargo Vessels)', 'data': ''});
            if (data['PCTCAR_LO'] > 0) {
                attrs.push({'tab': true, 'display': 'Low Traffic', 'data': data['PCTCAR_LO'] + '%'});
            }
            if (data['PCTCAR_ME'] > 0) {
                attrs.push({'tab': true, 'display': 'Moderate Traffic', 'data': data['PCTCAR_ME'] + '%'});
            }
            if (data['PCTCAR_HI'] > 0) {
                attrs.push({'tab': true, 'display': 'High Traffic', 'data': data['PCTCAR_HI'] + '%'});
            }
        }
        if ('PCTPAS_LO' in data && data['PCTPAS_LO'] !== 999) {
            attrs.push({'display': 'Ship Traffic Density (Passenger Vessels)', 'data': ''});
            if (data['PCTPAS_LO'] > 0) {
                attrs.push({'tab': true, 'display': 'Low Traffic', 'data': data['PCTPAS_LO'] + '%'});
            }
            if (data['PCTPAS_ME'] > 0) {
                attrs.push({'tab': true, 'display': 'Moderate Traffic', 'data': data['PCTPAS_ME'] + '%'});
            }
            if (data['PCTPAS_HI'] > 0) {
                attrs.push({'tab': true, 'display': 'High Traffic', 'data': data['PCTPAS_HI'] + '%'});
            }
        }
        if ('PCTTAN_LO' in data && data['PCTTAN_LO'] !== 999) {
            attrs.push({'display': 'Ship Traffic Density (Tanker Vessels)', 'data': ''});
            if (data['PCTTAN_LO'] > 0) {
                attrs.push({'tab': true, 'display': 'Low Traffic', 'data': data['PCTTAN_LO'] + '%'});
            }
            if (data['PCTTAN_ME'] > 0) {
                attrs.push({'tab': true, 'display': 'Moderate Traffic', 'data': data['PCTTAN_ME'] + '%'});
            }
            if (data['PCTTAN_HI'] > 0) {
                attrs.push({'tab': true, 'display': 'High Traffic', 'data': data['PCTTAN_HI'] + '%'});
            }
        }
        if ('PCTTUG_LO' in data && data['PCTTUG_LO'] !== 999) {
            attrs.push({'display': 'Ship Traffic Density (Tug/Tow Vessels)', 'data': ''});
            if (data['PCTTUG_LO'] > 0) {
                attrs.push({'tab': true, 'display': 'Low Traffic', 'data': data['PCTTUG_LO'] + '%'});
            }
            if (data['PCTTUG_ME'] > 0) {
                attrs.push({'tab': true, 'display': 'Moderate Traffic', 'data': data['PCTTUG_ME'] + '%'});
            }
            if (data['PCTTUG_HI'] > 0) {
                attrs.push({'tab': true, 'display': 'High Traffic', 'data': data['PCTTUG_HI'] + '%'});
            }
        }
        // if ('AIS7_MEAN' in data) {
        //     if ( data['AIS7_MEAN'] < 1 ) {
        //         var rank = 'Low';
        //     } else {
        //         var rank = 'High';
        //     }
        //     attrs.push({'display': 'Commercial Ship Traffic Density', 'data': rank });
        // }
        
        return attrs;
    };
    
    self.adjustAidsToNavigationAttributes = function (attrObj) {
        aidType = _.find(attrObj, function(obj) { return obj["display"] === 'Aid Type'; });
        if ( aidType["data"] === "PA" ) {
            aidType["data"] = "PA (Position Approximate)";
        } else if (aidType["data"] === "PD" ) {
            aidType["data"] = "PD (Position Doubtful)";
        } else if (aidType["data"] === "FD" ) {
            aidType["data"] = "FD (Undocumented)";
        }
    }
            
    return self;
} //end viewModel

app.viewModel = new viewModel();
