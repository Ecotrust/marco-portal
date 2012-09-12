function layerModel(options, parent) {
    var self = this,
        $descriptionTemp;

    // properties
    self.id = options.id || null;
    self.name = options.name || null;
    self.url = options.url || null;
    self.arcgislayers = options.arcgis_layers || 0;
    self.type = options.type || null;
    self.utfurl = options.utfurl || false;
    self.legend = options.legend || false;
    self.learn_link = options.learn_link || null;
    self.legendVisibility = ko.observable(false);
    self.legendTitle = options.legend_title || false;
    self.legendSubTitle = options.legend_subtitle || false;
    self.themes = ko.observableArray();
    self.attributeTitle = options.attributes ? options.attributes.title : self.name;
    self.attributes = options.attributes ? options.attributes.attributes : [];
    self.compress_attributes = options.attributes ? options.attributes.compress_attributes : false;
    self.attributeEvent = options.attributes ? options.attributes.event : [];
    self.lookupField = options.lookups ? options.lookups.field : null;
    self.lookupDetails = options.lookups ? options.lookups.details : [];
    self.color = options.color || "#ee9900";
    self.fillOpacity = options.fill_opacity || 0.0;
    self.graphic = options.graphic || null;

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

    // opacity
    self.opacity = ko.observable(0.5);
    self.opacity.subscribe(function(newOpacity) {
        if (self.layer.CLASS_NAME === "OpenLayers.Layer.Vector") {
            self.layer.styleMap.styles['default'].defaultStyle.strokeOpacity = newOpacity;
            self.layer.styleMap.styles['default'].defaultStyle.graphicOpacity = newOpacity;
            self.layer.redraw();
        } else {
            self.layer.setOpacity(newOpacity);
        }
    });

    // is description active
    self.infoActive = ko.observable(false);
    app.viewModel.showDescription.subscribe( function() {
        if ( app.viewModel.showDescription() === false ) {
            self.infoActive(false);
        }
    });
    
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

    self.deactivateLayer = function() {
        var layer = this;
        // remove from active layers
        app.viewModel.activeLayers.remove(layer);

        //remove related utfgrid layer
        if (layer.utfgrid) {
            //the following removes this layers utfgrid from the utfcontrol and prevents continued utf attribution on this layer
            app.map.UTFControl.layers.splice($.inArray(this.utfgrid, app.map.UTFControl.layers), 1);
        }
        if (app.viewModel.attributeTitle() === layer.name) {
            app.viewModel.attributeTitle(false);
            app.viewModel.attributeData(false);
        }

        layer.active(false);
        layer.visible(false);

        app.setLayerVisibility(layer, false);
        layer.opacity(0.5);

        if (layer.parent) { // if layer has a parent
            // turn off the parent shell layer
            layer.parent.active(false);
            layer.parent.activeSublayer(false);
            layer.parent.visible(false);
            layer.parent.visibleSublayer(false);
        }
        
        if (layer.activeSublayer()) {
            layer.activeSublayer().deactivateLayer();
            layer.activeSublayer(false);
            layer.visibleSublayer(false);
        }

    };

    self.activateLayer = function() {
        var layer = this;

        if (!layer.active()) {
            app.addLayerToMap(layer);

            //changed the following so that 
            //if the layer is an attributed vector layer, it will be added to the top of activeLayers
            //otherwise, it will be added just before the first non-vector layer
            if (layer.type === "Vector" && layer.attributes.length) {
                // add it to the top of the active layers
                app.viewModel.activeLayers.unshift(layer);
            } else {
                var index = 0;
                $.each(app.viewModel.activeLayers(), function(i, layer) {
                    if (!(layer.type === "Vector" && layer.attributes.length)) {
                        return false;
                    } else {
                        index += 1;
                    }
                });
                app.viewModel.activeLayers.splice(index, 0, layer);
            }

            // set the active flag
            layer.active(true);
            layer.visible(true);

            // save reference in parent layer
            if (layer.parent) {
                if (layer.parent.type === 'radio' && layer.parent.activeSublayer()) {
                    // only allow one sublayer on at a time
                    layer.parent.activeSublayer().deactivateLayer();
                }
                layer.parent.active(true);
                layer.parent.activeSublayer(layer);
                layer.parent.visible(true);
                layer.parent.visibleSublayer(layer);
            }

            //add utfgrid if applicable
            if (layer.utfgrid) {
                app.map.UTFControl.layers.unshift(layer.utfgrid);
            }

        }
    };

    // bound to click handler for layer visibility switching in Active panel
    self.toggleVisible = function() {
        var layer = this;
        if (layer.visible()) { //make invisilbe
            layer.visible(false);
            if (layer.parent) {
                layer.parent.visible(false);
            }
            app.setLayerVisibility(layer, false);

            //remove related utfgrid layer
            if (layer.utfgrid) {
                //the following removes this layers utfgrid from the utfcontrol and prevents continued utf attribution on this layer
                app.map.UTFControl.layers.splice($.inArray(this.utfgrid, app.map.UTFControl.layers), 1);
            }
            if (app.viewModel.attributeTitle() === layer.name) {
                app.viewModel.attributeTitle(false);
                app.viewModel.attributeData(false);
            }
        } else { //make visible
            layer.visible(true);
            if (layer.parent) {
                layer.parent.visible(true);
            }
            app.setLayerVisibility(layer, true);

            //add utfgrid if applicable
            if (layer.utfgrid) {
                app.map.UTFControl.layers.splice($.inArray(this, app.viewModel.activeLayers()), 0, layer.utfgrid);
            }
        }
    };

    self.showSublayers = ko.observable(false);

    // bound to click handler for layer switching
    self.toggleActive = function() {
        var layer = this;

        //handle possible dropdown/sublayer behavior
        if (layer.subLayers.length) {
            if (!layer.activeSublayer()) {
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
            }
            return;
        }

        // start saving restore state again and remove restore state message from map view
        app.saveStateMode = true;
        app.viewModel.error(null);

        // save a ref to the active layer for editing,etc
        app.viewModel.activeLayer(layer);

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

    // display descriptive text below the map
    self.toggleDescription = function(layer) {
        if ( layer.infoActive() ) {
            app.viewModel.showDescription(false);
        } else {
            app.viewModel.showDescription(false);
            app.viewModel.activeInfoLayer(layer);
            self.infoActive(true);
            app.viewModel.showDescription(true);
        }
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
}

function themeModel(options) {
    var self = this;
    self.name = options.display_name;
    self.id = options.id;
    self.description = options.description;
    self.learn_link = options.learn_link;

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
        } else {
            app.viewModel.openThemes.push(theme);
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
}

function bookmarkModel($popover) {
    var self = this;

    // name of the bookmark
    self.bookmarkName = ko.observable();

    // list of bookmarks
    self.bookmarksList = ko.observableArray();

    // load state from bookmark
    self.loadBookmark = function(bookmark) {
        app.saveStateMode = false;
        app.loadState(bookmark.state);

        app.viewModel.activeBookmark(bookmark.name);

        // show the alert for resting state
        app.viewModel.error("restoreState");
        $('#bookmark-popover').hide();
    };
    
    self.restoreState = function() {
        // hide the error
        app.viewModel.error(null);
        // restore the state
        app.loadState(app.restoreState);
        app.saveStateMode = true;
    };

    self.removeBookmark = function(bookmark) {
        self.bookmarksList.remove(bookmark);
        //$('#bookmark-popover').hide();
        // store the bookmarks
        self.storeBookmarks();
    };

    // handle the bookmark submit
    self.saveBookmark = function() {
        // add to the list of bookmarks
        self.bookmarksList.unshift({
            state: app.getState(),
            name: self.bookmarkName()
        });
        $('#bookmark-popover').hide();
        // store the bookmarks
        self.storeBookmarks();
    };

    // get the url from a bookmark
    self.getUrl = function(bookmark) {
        var host = window.location.href.split('#')[0];
        return host + "#" + $.param(bookmark.state);
    };

    self.prepareEmail = function(bookmark) {
        app.viewModel.bookmarkEmail(self.getUrl(bookmark));
    }

    self.getEmailHref = function(bookmark) {
        return "mailto:?subject=MARCO Bookmark&body=<a href='" + self.getUrl(bookmark).replace(/&/g, '%26') + "'>bookmark</a>";
    };

    // store the bookmarks to local storage or server
    self.storeBookmarks = function() {
        localStorage.setItem("marco-bookmarks", JSON.stringify(self.bookmarksList()));
    };

    // method for loading existing bookmarks
    self.getBookmarks = function() {
        var existingBookmarks = localStorage.getItem("marco-bookmarks");
        if (existingBookmarks) {
            self.bookmarksList = ko.observableArray(JSON.parse(existingBookmarks));
        }
    };

    self.cancel = function() {
        $('#bookmark-popover').hide();
    };

    // load the bookmarks
    self.getBookmarks();

    return self;
}


function viewModel() {
    var self = this;

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

    // reference to open themes in accordion
    self.openThemes = ko.observableArray();

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

    // last clicked layer for editing, etc
    self.activeLayer = ko.observable();

    // determines visibility of description overlay
    self.showDescription = ko.observable();
    
    // theme text currently on display
    self.themeText = ko.observable();

    // index for filter autocomplete and lookups
    self.layerIndex = {};
    self.layerSearchIndex = {};

    // viewmodel for bookmarks
    self.bookmarks = new bookmarkModel();

    self.activeBookmark = ko.observable();
    
    self.bookmarkEmail = ko.observable();
        

    // text for tooltip popup
    self.layerToolTipText = ko.observable();

    // descriptive text below the map 
    self.activeInfoLayer = ko.observable(false);

    // attribute data
    self.attributeTitle = ko.observable(false);
    self.attributeData = ko.observable(false);

    self.closeAttribution = function() {
        self.attributeData(false);
    };

    // set the error type
    // can be one of:
    //  restoreState
    self.error = ko.observable();
    self.clearError = function() {
        self.error(null);
    };

    // show the map?
    self.showMapPanel = ko.observable(true);

    //show/hide the list of basemaps
    self.showBasemaps = function(self, event) {
        var $layerSwitcher = $('#SimpleLayerSwitcher_30'),
            $button = $(event.target).closest('.btn');
        if ($layerSwitcher.is(":visible")) {
            $layerSwitcher.hide();
        } else {
            $layerSwitcher.show().position({
                "my": "right top",
                "at": "left top",
                "of": $button,
                offset: "0px 0px"
            });
        }
    };


    // is the legend panel visible?
    self.showLegend = ko.observable(false);

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

    // toggle legend panel visibility
    self.toggleLegend = function() {
        self.showLegend(!self.showLegend());
        //app.map.render('map');
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
    };

    // close layer description
    self.closeDescription = function(self, event) {
        self.showDescription(false);
    };

    // show bookmark stuff
    self.showBookmarks = function(self, event) {
        var $button = $(event.target).closest('.btn'),
            $popover = $('#bookmark-popover');

        if ($popover.is(":visible")) {
            $popover.hide();
        } else {
            self.bookmarks.bookmarkName(null);
            //TODO: move all this into bookmarks model
            // hide the popover if already visible
            $popover.show().position({
                "my": "right middle",
                "at": "left middle",
                "of": $button,
                offset: "-10px 0px"
            });

        }
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
    };

    // self.goFullScreen = function () {
    //     if (BigScreen.enabled) {
    //            BigScreen.request($("#fullscreen"));
    //            // You could also use .toggle(element)
    //        }
    //        else {
    //            // fallback for browsers that don't support full screen
    //        }
    // }

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
            /*
            if (layer.utfurl) { //remove utfcontrol for all layers (utfcontrol for top layer will be re-established below)
                layer.utfcontrol.destroy();
            }
            */
        });

        // re-ordering map layers by z value
        app.map.layers.sort(function(a, b) {
            return a.getZIndex() - b.getZIndex();
        });
        if (!self.hasActiveLegends()) {
            self.showLegend(false);
        }

        // update the url hash
        app.updateUrl();

        // re-ordering vectorList
        app.map.vectorList = [];
        $.each(self.activeLayers(), function(i, layer) {
            if (layer.type === 'Vector' && layer.attributes.length) {
                app.map.vectorList.push(layer.layer);
            }
        });

        //update attribute selection for vector layers 
        app.map.selectFeatureControl.setLayer(app.map.vectorList);

    });

    // do this stuff when the visible layers change
    self.visibleLayers.subscribe(function() {
        if (!self.hasActiveLegends()) {
            self.showLegend(false);
        }
    });

    return self;
}


app.viewModel = new viewModel();