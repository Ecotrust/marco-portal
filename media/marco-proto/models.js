
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
    self.themes = ko.observableArray();
    self.attributeTitle = options.attributes ? options.attributes['title'] : null;
    self.attributes = options.attributes ? options.attributes['attributes'] : [];
    self.attributeEvent = options.attributes ? options.attributes['event'] : [];
    self.lookupField = options.lookups ? options.lookups['field'] : null;
    self.lookupDetails = options.lookups ? options.lookups['details'] : [];
    self.color = options.color || "#ee9900";
    self.fillOpacity = options.fill_opacity || 0.0;
    self.graphic = options.graphic || null;
    
    // set target blank for all links
    if (options.description) {
    	$descriptionTemp = $("<div/>", { html: options.description });
    	$descriptionTemp.find('a').each(function () {
    		$(this).attr('target', '_blank');
    	});
    	self.description = $descriptionTemp.html();
    } else {
    	self.description = null;
    }

    // opacity
    self.opacity = ko.observable(.5);
    self.opacity.subscribe(function (newOpacity) {
    	self.layer.setOpacity(newOpacity);
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

	} else {
    	self.fullName = self.name;
	}
    

    self.toggleLegendVisibility = function() {
        var layer = this;
        layer.legendVisibility(!layer.legendVisibility());
        
    }

	self.deactivateLayer = function () {
		var layer = this;
        // remove from active layers
		app.viewModel.activeLayers.remove(layer);
        // remove from visible layers
        app.viewModel.visibleLayers.remove(layer);
        
        //remove related utfgrid layer
        if ( layer.utfgrid ) {
            //the following removes this layers utfgrid from the utfcontrol and prevents continued utf attribution on this layer
            app.map.UTFControl.layers.splice( $.inArray(this.utfgrid, app.map.UTFControl.layers), 1);
        }
        if ( app.viewModel.attributeTitle() === layer.name ) {
            app.viewModel.attributeTitle(false);
            app.viewModel.attributeData(false);
        }
        
		layer.active(false);
        layer.visible(false);
        
        app.setLayerVisibility(layer, false);
        layer.opacity(.5);
        
        if (layer.activeSublayer()) {
        	layer.activeSublayer().deactivateLayer();
        	layer.activeSublayer(false);
            layer.visibleSublayer(false);
        }
        
	};

	self.activateLayer = function () {
		var layer = this;
        
        if (!layer.active()) {
            app.addLayerToMap(layer);            
            // add it to the top of the active layers
            app.viewModel.activeLayers.unshift(layer);
            // add it to the visible layers
            app.viewModel.visibleLayers.unshift(layer);
            // set the active flag
            layer.active(true);
            layer.visible(true);

            // save reference in parent layer
            if (layer.parent) {
                layer.parent.active(true);
                layer.parent.activeSublayer(layer);
                layer.parent.visible(true);
                layer.parent.visibleSublayer(layer);
            }
            
            //add utfgrid if applicable
            if ( layer.utfgrid ) {
                app.map.UTFControl.layers.unshift(layer.utfgrid);
            }
        }
	};

    // bound to click handler for layer visibility switching in Active panel
    self.toggleVisible = function() {
        var layer = this;
        if ( layer.visible() ) { //make invisilbe
            app.viewModel.visibleLayers.remove(layer);
            
            layer.visible(false);
            if (layer.parent) {
                layer.parent.visible(false);
            }
            app.setLayerVisibility(layer, false);
            
            //remove related utfgrid layer
            if ( layer.utfgrid ) {
                //the following removes this layers utfgrid from the utfcontrol and prevents continued utf attribution on this layer
                app.map.UTFControl.layers.splice( $.inArray(this.utfgrid, app.map.UTFControl.layers), 1);
            }
            if ( app.viewModel.attributeTitle() === layer.name ) {
                app.viewModel.attributeTitle(false);
                app.viewModel.attributeData(false);
            }
        } else { //make visible
            //app.viewModel.enabledLayers.unshift(layer);
            
            layer.visible(true);
            if (layer.parent) {
                layer.parent.visible(true);
            }
            app.setLayerVisibility(layer, true);
            
            //re-ordering visible list to match activeLayers ordering
            app.viewModel.visibleLayers.splice(0,app.viewModel.visibleLayers().length);
            $.each(app.viewModel.activeLayers(), function (i, layer) {
                if (layer.visible()) {
                    app.viewModel.visibleLayers.push(layer);
                }
            });
            
            //add utfgrid if applicable
            if ( layer.utfgrid ) {
                //debugger;
                app.map.UTFControl.layers.splice( $.inArray(this, app.viewModel.activeLayers()), 0, layer.utfgrid);
                //app.map.UTFControl.layers.unshift(layer.utfgrid);
            }            
        }
    }
            
    
    // bound to click handler for layer switching
	self.toggleActive = function () {
		var layer = this;
        // start saving restore state again and remove restore state message from map view
        app.saveStateMode = true;
		app.viewModel.error(null);

		// save a ref to the active layer for editing,etc
        app.viewModel.activeLayer(layer);
        
		if (layer.active()) {
			// layer is active
			layer.deactivateLayer();
			if (layer.parent) {
				// layer has a parent
				// turn off the parent shell layer
				layer.parent.active(false);
				layer.parent.activeSublayer(false);
				layer.parent.visible(false);
                layer.parent.visibleSublayer(false);
			}
		} else {
			// layer has a parent
			if (layer.parent) {
				// toggle sibling layers
				if (layer.parent.type === 'radio' && layer.parent.activeSublayer()) {
					// only allow one sublayer on at a time
					layer.parent.activeSublayer().deactivateLayer();
				}
				// turn on the parent
				layer.parent.active(true);
                layer.parent.visible(true);
			}
			if (layer.subLayers.length) {
				// layer has sublayer, activate first layer
				layer.subLayers[0].activateLayer();
				layer.active(true);
                layer.visible(true);
			} else {
				// otherwise just activate the layer
				layer.activateLayer();
			}

		}
	};

	self.raiseLayer = function (layer, event) {
		var current = app.viewModel.activeLayers.indexOf(layer);
		if (current === 0) {
			// already at top
			return;
		}
		$(event.target).closest('tr').fadeOut('fast', function () {
			app.viewModel.activeLayers.remove(layer);
            app.viewModel.visibleLayers.remove(layer);
			app.viewModel.activeLayers.splice(current - 1, 0, layer);
			app.viewModel.visibleLayers.splice(current - 1, 0, layer);
		});
	};

	self.lowerLayer = function (layer, event) {
		var current = app.viewModel.activeLayers.indexOf(layer);
		if (current === app.viewModel.activeLayers().length) {
			// already at top
			return;
		}
		$(event.target).closest('tr').fadeOut('fast', function () {
			app.viewModel.activeLayers.remove(layer);
			app.viewModel.visibleLayers.remove(layer);
			app.viewModel.activeLayers.splice(current + 1, 0, layer);
			app.viewModel.visibleLayers.splice(current + 1, 0, layer);
		});
	};

	self.isTopLayer = function (layer) {
		return app.viewModel.activeLayers.indexOf(layer) === 0;
	};

	self.isBottomLayer = function (layer) {
		return app.viewModel.activeLayers.indexOf(layer) === app.viewModel.activeLayers().length - 1;
	}
    
    // display descriptive text below the map
    self.showDescription = function (layer) {
        app.viewModel.activeName(layer.name);
        app.viewModel.activeText(layer.description);
        app.viewModel.activeLearnLink(layer.learn_link);
    }
    
    self.showTooltip = function (layer, event) {
        $('#layer-popover').hide();
        if ( layer.activeSublayer() && layer.activeSublayer().description ) {
            var layerActual = layer.activeSublayer();
        } else {
            var layerActual = layer;
        }
        if ( layerActual.description ) {
            app.viewModel.layerToolTipText(layerActual.description);
            $('#layer-popover').show().position({
                "my": "right middle",
                "at": "left middle",
                "of": $(event.target).closest(".btn-group")
            });
        }
    }
    

	// remove the layer dropdrown menu
	self.closeMenu = function (layer, event) {
		$(event.target).closest('.btn-group').removeClass('open');

	}

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
	self.setOpenTheme = function () {
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
	self.isOpenTheme = function () {
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
        if ( app.viewModel.activeTheme() == theme ) {
            return true;
        }
        return false;
    };
   
    // display descriptive text below the map
    self.showDescription = function (theme) {
        app.viewModel.activeName(theme.name);
        app.viewModel.activeText(theme.description);
        app.viewModel.activeLearnLink(theme.learn_link);
    }
    
    self.hideTooltip = function (theme, event) {
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
	self.loadBookmark = function (bookmark) {
    
        app.saveStateMode = false;
		app.loadState(bookmark.state);

		// show the alert for resting state
		app.viewModel.error("restoreState");
		$('#bookmark-popover').hide();
        
	}

	self.restoreState = function () {
		// hide the error
		app.viewModel.error(null);
		// restore the state
		app.loadState(app.restoreState);
	}

	self.removeBookmark = function (bookmark) {
        self.bookmarksList.remove(bookmark);
		//$('#bookmark-popover').hide();
		// store the bookmarks
		self.storeBookmarks();
	}

	// handle the bookmark submit
	self.saveBookmark = function () {
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
	self.getUrl = function (bookmark) {
        var host = window.location.href.split('#')[0];
		return host + "#" + $.param(bookmark.state);
	};
    
    self.getEmailHref = function (bookmark) {
        return "mailto:?subject=MARCO Bookmark&body=<a href='" + self.getUrl(bookmark).replace(/&/g, '%26') + "'>bookmark</a>";
    };

	// store the bookmarks to local storage or server
	self.storeBookmarks = function () {
		localStorage.setItem("marco-bookmarks", JSON.stringify(self.bookmarksList()));
	};

	// method for loading existing bookmarks
	self.getBookmarks = function () {
		var existingBookmarks = localStorage.getItem("marco-bookmarks");
		if (existingBookmarks) {
			self.bookmarksList = ko.observableArray(JSON.parse(existingBookmarks));
		}
	}

	self.cancel = function () {
		$('#bookmark-popover').hide();
	}
    
	// load the bookmarks
	self.getBookmarks();

	return self;
}


function viewModel() {
	var self = this;

	// list of active layermodels
	self.activeLayers = ko.observableArray();
    
    // list of visible layermodels 
    self.visibleLayers = ko.observableArray();

	// reference to open themes in accordion
	self.openThemes = ko.observableArray();
    
    // reference to active theme model/name for display text
    self.activeTheme = ko.observable();    
    self.activeThemeName = ko.observable();

	// list of theme models
	self.themes = ko.observableArray();

	// last clicked layer for editing, etc
	self.activeLayer = ko.observable();
    
    // theme text currently on display
    self.themeText = ko.observable();

	// index for filter autocomplete and lookups
	self.layerIndex = {};
    self.layerSearchIndex = {};

	// viewmodel for bookmarks
	self.bookmarks = new bookmarkModel();

	// text for tooltip popup
	self.layerToolTipText = ko.observable();
    
    // descriptive text below the map 
    self.activeName = ko.observable();
    self.activeText = ko.observable();
    self.activeLearnLink = ko.observable();
    
    // attribute data
    //self.vectorAttributeTitle = ko.observable(false);
    //self.vectorAttributeData = ko.observable(false);
    //self.utfAttributeTitle = ko.observable(false);
    //self.utfAttributeData = ko.observable(false);
    self.attributeTitle = ko.observable(false);
    self.attributeData = ko.observable(false);

	// set the error type
	// can be one of:
	// 	restoreState
	self.error = ko.observable();
    self.clearError = function () {
    	self.error(null);
    };

    // show the map?
    self.showMapPanel = ko.observable(true);

    //show/hide the list of basemaps
    self.showBasemaps = function (self, event) {
        var $layerSwitcher = $('#SimpleLayerSwitcher_30');
        if ($layerSwitcher.is(":visible")) {
            $layerSwitcher.hide();
        } else {
            $layerSwitcher.show();
        }
    }
    
    
    //show Legend by default
    self.showLegend = ko.observable(false);

    self.toggleLegend = function () {
    	self.showLegend(! self.showLegend());
    	//app.map.render('map');
    };
    self.hasActiveLegends = ko.computed( function() {
        var hasLegends = false;
        $.each(self.visibleLayers(), function(index, layer) {
            if (layer.legend || layer.legendTitle) {
                hasLegends = true;
            }
        });
        return hasLegends;
    });


	// show bookmark stuff
	self.showBookmarks = function (self, event) {
		var $button = $(event.target),
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
				"of": $button
			});

		}
	};
	self.selectedLayer = ko.observable();
	self.showOpacity = function (layer, event) {
		var $button = $(event.target).closest('button'),
			$popover = $('#opacity-popover');
        
        self.selectedLayer(layer);
        
        if ( $button.hasClass('active') ) {
            self.hideOpacity();
        } else {
            $popover.show().position({
                "my": "center top",
                "at": "center bottom",
                "of": $button
            });
            $button.addClass('active');
        }
	
	}
	self.hideOpacity = function (self, event) {
		$('#opacity-popover').hide();
        $('.opacity-button.active').removeClass('active');
        app.updateUrl();
	}
    self.hideTooltip = function () {
	    $('#layer-popover').hide();
	}


	// show coords info in pointer
	self.showPointerInfo = ko.observable(false);
	self.togglePointerInfo = function () {
		self.showPointerInfo(!self.showPointerInfo());
	};



	// handle the search form
	self.searchTerm = ko.observable();
	self.layerSearch = function () {
		var found = self.layerSearchIndex[self.searchTerm()];	
        //self.activeTheme(theme);
        self.openThemes.push(found.theme);
        found.layer.activateLayer();
	};
	self.keySearch = function (_, event) {

		if (event.which === 13) {
			self.searchTerm($('.typeahead .active').text());
			self.layerSearch();
		}
	}


	// do this stuff when the active layers change
	self.activeLayers.subscribe(function () {
		// initial index
		var index = 300;
		app.state.activeLayers = [];        
        
        //self.showLegend(false);
		$.each(self.activeLayers(), function (i, layer) {
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
        app.map.layers.sort( function(a,b) 
        { 
            return a.getZIndex()-b.getZIndex() 
        });
        if ( ! self.hasActiveLegends() ) {
            self.showLegend(false);
        }
        /*
        // will eventually want to adjust so that it is the top-most 'visible' layer (not simple the top-most layer)
        var topLayer = self.activeLayers()[0];        
        if (topLayer && topLayer.utfurl) { //ensure utfgrid is activated (when relevant) for top layer
            topLayer.utfcontrol = app.addUTFControl(topLayer);
            app.map.addControl(topLayer.utfcontrol); 
        }
        */
		// update the url hash
		app.updateUrl();
        
        // re-ordering vectorList
        app.map.vectorList = [];
        $.each(self.activeLayers(), function (i, layer) {
            if ( layer.layer.CLASS_NAME === "OpenLayers.Layer.Vector" ) {
                app.map.vectorList.push(layer.layer);
            }
        });
        
        //re-ordering visible list to match activeLayers ordering
        self.visibleLayers.splice(0,self.visibleLayers().length);
        $.each(self.activeLayers(), function (i, layer) {
            self.visibleLayers.push(layer);
        });
        
        app.map.selectFeatureControl.setLayer(app.map.vectorList);
	});
    
	// do this stuff when the visible layers change
	self.visibleLayers.subscribe(function () {
        if ( ! self.hasActiveLegends() ) {
            self.showLegend(false);
        }
    });  

    /*
    // output single attribute (for now...)
    self.vectorAttributeTitle.subscribe(function () {
        if ( !self.utfAttributeTitle() ) {
            self.attributeTitle(self.vectorAttributeTitle()); 
            self.attributeData(self.vectorAttributeData());
        }
    });

    // output single attribute (for now...)
    self.utfAttributeTitle.subscribe(function () {
        if ( !self.vectorAttributeTitle() ) {
            self.attributeTitle(self.utfAttributeTitle()); 
            self.attributeData(self.utfAttributeData());
        }
    });
    */
    
	return self;
}


app.viewModel = new viewModel();
