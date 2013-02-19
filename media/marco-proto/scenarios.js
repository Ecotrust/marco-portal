
var madrona = { 
    onShow: function(callback) { callback(); },
    setupForm: function($form) {
        $form.find('.btn-submit').hide();

        $form.find('label').each(function (i, label) {
            if ($(label).find('input[type="checkbox"]').length) {
                $(label).addClass('checkbox');

            }
        });
        
        $form.closest('.panel').on('click', '.cancel_button', function(e) {
            app.viewModel.scenarios.reset();
        });

        $form.closest('.panel').on('click', '.submit_button', function(e) {
            e.preventDefault();
            var $form = $(this).closest('.panel').find('form'),
                url = $form.attr('action'),
                $bar = $form.closest('.tab-pane').find('.bar'),
                
                data = {},
                barTimer;

            //progress bar
            barTimer = setInterval(function () {
                var width = parseInt($bar.css('width').replace('px', ''), 10) + 5,
                    barWidth = parseInt($bar.parent().css('width').replace('px',''), 10);
                
                if (width < barWidth) {
                    $bar.css('width', width + "px");    
                } else {
                    clearInterval(barTimer);
                }
            }, 500);
            
            
            $form.find('input,select,textarea').each( function(index, input) {
                var $input = $(input);
                if ($input.attr('type') === 'checkbox') {
                    if ($input.attr('checked')) {
                        data[$input.attr('name')] = 'True';
                    } else {
                        data[$input.attr('name')] = 'False';
                    }
                } else {
                    data[$input.attr('name')] = $input.val();
                }
            });



            app.viewModel.scenarios.scenarioForm(false);
            app.viewModel.scenarios.loadingMessage("Creating Scenario");


            $.ajax( {
                url: url,
                data: data,
                type: 'POST',
                dataType: 'json',
                success: function(result) {
                    app.viewModel.scenarios.addScenarioToMap(null, {uid: result['X-Madrona-Show']});                    
                    app.viewModel.scenarios.loadingMessage(false);
                    clearInterval(barTimer);
                },
                error: function(result) {
                    app.viewModel.scenarios.loadingMessage(null);
                    clearInterval(barTimer);
                    if (result.status === 400) {
                        $('#scenario-form').append(result.responseText);
                        app.viewModel.scenarios.scenarioForm(true);
                    } else {
                        app.viewModel.scenarios.errorMessage(result.responseText.split('\n\n')[0]);
                    }
                }
            });
        }); 
    }
}; // end madrona init

function scenarioFormModel(options) {
    var self = this;
    
    self.leaseblocksLeft = ko.observable(app.viewModel.scenarios.leaseblockList.length);
    self.showLeaseblockSpinner = ko.observable(false);
    
    self.isLeaseblockLayerVisible = ko.observable(false);
    self.isLeaseblockLayerVisible.subscribe( function() {
        if ( self.isLeaseblockLayerVisible() ) {
            self.showRemainingBlocks();
        } else {
            self.hideLeaseblockLayer();
        }
    });
    //self.isLeaseblockButtonActivated = ko.observable(false);
    
    //not sure how best to tie the width of the show/hide leaseblocks button to the width of the form...
    //self.showLeaseblockButtonWidth = ko.observable($('#scenario-form').width());
    
    self.activateLeaseblockLayer = function() {
        self.isLeaseblockLayerVisible(true);
        //self.showRemainingBlocks();
    };
    
    self.deactivateLeaseblockLayer = function() {
        self.isLeaseblockLayerVisible(false);
        //remove from attribute list (if it's there)
        app.viewModel.removeFromAggregatedAttributes(app.viewModel.scenarios.scenarioLeaseBlocksLayerName);
        app.viewModel.updateAggregatedAttributesOverlayWidthAndScrollbar();
        //self.hideLeaseblockLayer();
    };
    
    self.lastChange = (new Date()).getTime();
    
    //Parameters
    self.windSpeedParameter = ko.observable(false);
    self.distanceToShoreParameter = ko.observable(false);
    self.depthRangeParameter = ko.observable(false);
    self.distanceToAWCParameter = ko.observable(false);
    self.distanceToShippingParameter = ko.observable(false);
    self.shipTrafficDensityParameter = ko.observable(false);
    
    
    self.filters = {};
    
    self.updateFilters = function(object) {
        self.filters[object.key] = object.value;
        //self.isLeaseblockButtonActivated(true);
    };
    self.removeFilter = function(key) {
        delete self.filters[key];
        //if ( $.isEmptyObject(self.filters) ) {
        //    self.isLeaseblockButtonActivated(false);
        //}
    };
    
    self.updateFiltersAndLeaseBlocks = function() {
        if ( self.depthRangeParameter() ) {
            self.updateFilters({'key': 'min_depth', 'value': $('#id_input_min_depth')[0].value});
            self.updateFilters({'key': 'max_depth', 'value': $('#id_input_max_depth')[0].value});
        } else {
            self.removeFilter('min_depth');
            self.removeFilter('max_depth');
        }
        if ( self.windSpeedParameter() ) {
            self.updateFilters({'key': 'wind', 'value': $('#id_input_avg_wind_speed')[0].value});
        } else {
            self.removeFilter('wind');
        }
        if ( self.distanceToShoreParameter() ) {
            self.updateFilters({'key': 'min_distance', 'value': $('#id_input_min_distance_to_shore')[0].value});
            self.updateFilters({'key': 'max_distance', 'value': $('#id_input_max_distance_to_shore')[0].value});
        } else {
            self.removeFilter('min_distance');
            self.removeFilter('max_distance');
        }
        if ( self.distanceToAWCParameter() ) {
            self.updateFilters({'key': 'awc', 'value': $('#id_input_distance_to_awc')[0].value});
        } else {
            self.removeFilter('awc');
        }
        if ( self.distanceToShippingParameter() ) {
            self.updateFilters({'key': 'tsz', 'value': $('#id_input_distance_to_shipping')[0].value});
        } else {
            self.removeFilter('tsz');
        }
        if ( self.shipTrafficDensityParameter() ) {
            self.updateFilters({'key': 'ais', 'value': 1});
        } else {
            self.removeFilter('ais');
        }
        self.updateLeaseblocksLeft();
    
    };
    
    self.updateLeaseblocksLeft = function() {
        //self.leaseblocksLeft(23);
        var list = app.viewModel.scenarios.leaseblockList,
            count = 0;
            
        for ( var i=0; i<list.length; i++ ) {
            var addOne = true;
            if (self.filters['wind'] && list[i].min_wind_speed < self.filters['wind'] ) {
                addOne = false;
            }
            if (self.filters['max_distance'] && list[i].avg_distance > self.filters['max_distance'] || 
                self.filters['min_distance'] && list[i].avg_distance < self.filters['min_distance'] ) {
                addOne = false;
            } 
            if (self.filters['max_depth'] && list[i].avg_depth > self.filters['max_depth'] || 
                self.filters['min_depth'] && list[i].avg_depth < self.filters['min_depth'] ) {
                addOne = false;
            } 
            if (self.filters['awc'] && list[i].awc_min_distance > self.filters['awc'] || 
                list[i].awc_min_distance === null ) {
                addOne = false;
            } 
            if (self.filters['tsz'] && list[i].tsz_min_distance < self.filters['tsz'] ) {
                addOne = false;
            }
            if (self.filters['ais'] && list[i].ais_mean_density > 1 ) {
                addOne = false;
            } 
            if (addOne) {
                count += 1;
            }
        }     
        self.leaseblocksLeft(count);
        //self.showRemainingBlocks();
    };
    
    self.updateRemainingBlocks = function() {
        self.lastChange = (new Date()).getTime(); 
        setTimeout(function() {
            var newTime = (new Date()).getTime();
            if ( newTime - self.lastChange > 499 ) {
                self.showRemainingBlocks();
            }
        }, 500);
    };
    
    self.showRemainingBlocks = function() {
        if ( self.isLeaseblockLayerVisible() ) {
            self.showLeaseblockSpinner(true);
            //var blockLayer = app.map.getLayersByName('OCS Test')[0];
            if ( ! app.viewModel.scenarios.leaseblockLayer()) {
                app.viewModel.scenarios.loadLeaseblockLayer();
            } 
            var blockLayer = app.viewModel.scenarios.leaseblockLayer();
            var filter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: []
            });
            if ( self.windSpeedParameter() ) {
                filter.filters.push(
                    new OpenLayers.Filter.Comparison({ // if WINDREV_MI >= self.filters['wind']
                        type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
                        property: "WINDREV_MI", 
                        value: self.filters['wind']
                    })
                );
            }
            if ( self.distanceToShoreParameter() ) {
                filter.filters.push(
                    new OpenLayers.Filter.Comparison({ // if MI_MAX >= self.filters['min_distance']
                        type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
                        property: "MI_MEAN", 
                        value: self.filters['min_distance']
                    }),
                    new OpenLayers.Filter.Comparison({ // if MI_MAX <= self.filters['max_distance']
                        type: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
                        property: "MI_MEAN", 
                        value: self.filters['max_distance']
                    })
                );
            }
            if ( self.depthRangeParameter() ) {
                filter.filters.push(
                    new OpenLayers.Filter.Comparison({ // if DEPTHM_MAX >= self.filters['min_distance']
                        type: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
                        property: "DEPTH_MEAN", 
                        value: (-self.filters['min_depth'] * .3048)
                    }),
                    new OpenLayers.Filter.Comparison({ // if DEPTHM_MIN <= self.filters['max_distance']
                        type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
                        property: "DEPTH_MEAN", 
                        value: (-self.filters['max_depth'] * .3048)
                    })
                );
            }
            if ( self.distanceToAWCParameter() ) {
                filter.filters.push(
                    new OpenLayers.Filter.Comparison({ // if AWCMI_MIN <= self.filters['awc']
                        type: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
                        property: "AWCMI_MIN", 
                        value: self.filters['awc']
                    })
                );
            }
            if ( self.distanceToShippingParameter() ) {
                filter.filters.push(
                    new OpenLayers.Filter.Comparison({ // if TRSEP_MIN >= self.filters['tsz']
                        type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
                        property: "TRSEP_MIN", 
                        value: self.filters['tsz']
                    })
                );
            }
            if ( self.shipTrafficDensityParameter() ) {
                filter.filters.push(
                    new OpenLayers.Filter.Comparison({ // if AIS7_MEAN <= 1
                        type: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
                        property: "AIS7_MEAN", 
                        value: 1
                    })
                );
            }
            blockLayer.styleMap.styles['default'].rules[0] = new OpenLayers.Rule({
                filter: filter, 
                symbolizer: { strokeColor: '#fff' } 
            });
            
            self.showLeaseblockLayer(blockLayer);
        }
        
    };
    
    self.showLeaseblockLayer = function(layer) {
        app.map.addLayer(app.viewModel.scenarios.leaseblockLayer());
        layer.layerModel.setVisible();
        app.viewModel.updateAttributeLayers();
        layer.refresh();
    }
    
    self.hideLeaseblockLayer = function() {
        if ( app.map.getLayersByName(app.viewModel.scenarios.leaseblockLayer().name).length ) {
            app.map.removeLayer(app.viewModel.scenarios.leaseblockLayer());
        }
        //remove the key/value pair from aggregatedAttributes
        app.viewModel.removeFromAggregatedAttributes(app.viewModel.scenarios.leaseblockLayer().name);
        app.viewModel.updateAttributeLayers();
    }
    
    self.updateDesignScrollBar = function() {
        var designsWizardScrollpane = $('#wind-design-form').data('jsp');
        if (designsWizardScrollpane === undefined) {
            $('#wind-design-form').jScrollPane();
        } else {
            setTimeout(function() {designsWizardScrollpane.reinitialise();},100);
        }
    };
    
    self.windSpeedLayer = app.viewModel.getLayerById(7);
    self.toggleWindSpeedLayer = function(formModel, event) {
        if ( self.windSpeedLayer.active() ) {
            self.windSpeedLayer.deactivateLayer();
        } else {
            self.windSpeedLayer.activateLayer();
        }
        return true;
    };
    self.toggleWindSpeedDescription = function(formModel) {
        if ( self.windSpeedLayer.infoActive() ) {
            self.windSpeedLayer.hideDescription(self.windSpeedLayer);
        } else {
            self.windSpeedLayer.showDescription(self.windSpeedLayer);
        }
        return true;
    };
    
    self.awcLayer = app.viewModel.getLayerById(65);
    self.toggleAWCLayer = function(formModel, event) {
        if ( self.awcLayer.active() ) {
            self.awcLayer.deactivateLayer();
        } else {
            self.awcLayer.activateLayer();
        }
        return true;
    };
    self.toggleAWCDescription = function(formModel) {
        if ( self.awcLayer.infoActive() ) {
            self.awcLayer.hideDescription(self.awcLayer);
        } else {
            self.awcLayer.showDescription(self.awcLayer);
        }
        return true;
    };
    
    self.shippingLanesLayer = app.viewModel.getLayerById(64);
    self.toggleShippingLanesLayer = function(formModel, event) {
        if ( self.shippingLanesLayer.active() ) {
            self.shippingLanesLayer.deactivateLayer();
        } else {
            self.shippingLanesLayer.activateLayer();
        }
        return true;
    };
    self.toggleShippingLanesDescription = function(formModel) {
        if ( self.shippingLanesLayer.infoActive() ) {
            self.shippingLanesLayer.hideDescription(self.shippingLanesLayer);
        } else {
            self.shippingLanesLayer.showDescription(self.shippingLanesLayer);
        }
        return true;
    };
    
    return self;
} // end scenarioFormModel

function selectionModel(options) {
    var self = this;
    
    self.name = 'Selected Lease Blocks';
    
    var ret = scenarioModel.apply(this, arguments);
    
    self.isSelectionModel = true;
        
    self.editSelection = function() {
        var selection = this;
        return $.ajax({
            url: '/features/leaseblockselection/' + selection.uid + '/form/', 
            success: function(data) {
                app.viewModel.scenarios.scenarioForm(true);
                $('#scenario-form').html(data);
                app.viewModel.scenarios.selectionFormModel = new IESelectionFormModel();
                ko.applyBindings(app.viewModel.scenarios.selectionFormModel, document.getElementById('scenario-form'));
                //particular for IE selection form, another ajax call to retrieve the leaseblocks
                app.viewModel.scenarios.selectionFormModel.selectedLeaseBlocks($('#id_leaseblock_ids').val().split(','));
                //app.viewModel.scenarios.scenarioFormModel.updateFiltersAndLeaseBlocks();
            },
            error: function (result) { 
                debugger; 
            }
        });
    }; 
        
    self.createCopySelection = function() {
        var selection = this;
    
        //create a copy of this shape to be owned by the user
        $.ajax({
            url: '/scenario/copy_design/' + selection.uid + '/',
            type: 'POST',
            success: function(data) {
                app.viewModel.scenarios.loadSelectionsFromServer();
            },
            error: function (result) {
                debugger;
            }
        })
    }
    self.deleteSelection = function() {
        var selection = this;
        
        //remove from activeLayers
        app.viewModel.activeLayers.remove(selection);
        //remove from app.map
        if (selection.layer) {
            app.map.removeLayer(selection.layer);
        }
        //remove from selectionList
        app.viewModel.scenarios.selectionList.remove(selection);
        
        //remove from server-side db (this should provide error message to the user on fail)
        $.ajax({
            url: '/scenario/delete_design/' + selection.uid + '/',
            type: 'POST',
            error: function (result) {
                debugger;
            }
        })
    };
    
    return ret;
} // end selectionModel

function selectionFormModel(options) {
    var self = this;
    
    self.IE = false;
    
    self.leaseBlockLayer = app.viewModel.getLayerById(6);
    self.leaseBlockLayer.activateLayer();
    self.leaseBlockLayerUtfGrid = self.leaseBlockLayer.utfgrid;
    
    self.leaseBlockSelectionLayerIsLoaded = false;
    
    self.selectingLeaseBlocks = ko.observable(false);
    
    //will want to load this manually as it will likely be a placeholder layer in the data manager
    self.leaseBlockSelectionLayer = app.viewModel.getLayerById(82);
    
    //self.selectedLeaseBlocks = ko.observableArray();
    
    self.loadLeaseBlockSelectionLayer = function() {
        var defaultStyle = new OpenLayers.Style({
            //display: 'none'
            fillOpacity: 0,
            strokeColor: '#000',
            strokeOpacity: 0
        });
        var selectStyle = new OpenLayers.Style({
            strokeColor: '#ff0',
            strokeOpacity: .8
        });
        var styleMap = new OpenLayers.StyleMap( {
            'default': defaultStyle,
            'select': selectStyle
        });
        self.leaseBlockSelectionLayer.layer = new OpenLayers.Layer.Vector(
            self.leaseBlockSelectionLayer.name,
            {
                projection: new OpenLayers.Projection('EPSG:3857'),
                displayInLayerSwitcher: false,
                strategies: [new OpenLayers.Strategy.Fixed()],
                protocol: new OpenLayers.Protocol.HTTP({
                    url: self.leaseBlockSelectionLayer.url,
                    format: new OpenLayers.Format.GeoJSON()
                }),
                styleMap: styleMap,                    
                layerModel: self.leaseBlockSelectionLayer
            }
        );
        app.map.addLayer(self.leaseBlockSelectionLayer.layer);
        self.leaseBlockSelectionLayerHoverControl = new OpenLayers.Control.SelectFeature(
            self.leaseBlockSelectionLayer.layer, 
            {
                hover: true,
                toggle: false,
                multiple: false
            }
        );
        
        self.leaseBlockSelectionLayerClickControl = new OpenLayers.Control.SelectFeature(
            self.leaseBlockSelectionLayer.layer, 
            {
                hover: false,
                toggle: true,
                multiple: true,
                box: true
            }
        );
        app.map.addControl(self.leaseBlockSelectionLayerClickControl);        
        
        app.map.addLayer(self.leaseBlockSelectionLayer.layer); 
        self.leaseBlockSelectionLayerIsLoaded = true;
    }
    
    self.toggleSelectionProcess = function() {
        if ( ! self.selectingLeaseBlocks() ) { // if not currently in the selection process, enable selection process
            // if lease block selection layer has not yet been loaded...
            if ( ! self.leaseBlockSelectionLayerIsLoaded ) { 
                self.loadLeaseBlockSelectionLayer();
            } 
            //activate the lease block feature selection 
            self.leaseBlockSelectionLayerClickControl.activate();
            //app.addUtfLayerToMap(self.leaseBlockLayer);
            //disable feature attribution
            app.viewModel.disableFeatureAttribution();
            //change button text
            self.selectingLeaseBlocks(true);
            
            
        } else { // otherwise, disable selection process
            //deactivate lease block feature selection
            self.leaseBlockSelectionLayerClickControl.deactivate();
            //enable feature attribution
            app.viewModel.enableFeatureAttribution();
            //change button text
            self.selectingLeaseBlocks(false);
            
            //ON CANCEL, remove self.leaseBlockLayerUtfGrid and selectfeature control
        }           
        
    };
    
    self.toggleLeaseBlockLayer = function(formModel, event) {
        if ( event.target.type === "checkbox" ) {
            if ($('#lease-blocks-layer-toggle input').is(":checked")) {
                self.leaseBlockLayer.activateLayer();
            } else {
                self.leaseBlockLayer.deactivateLayer();
            }
        }
        return true;
    };
    
    return self;
}; // end selectionFormModel


function IESelectionFormModel(options) {
    var self = this;
    
    self.IE = true;
    
    self.leaseBlockLayer = app.viewModel.getLayerById(6);
    self.leaseBlockLayer.activateLayer();
    self.leaseBlockLayer.setVisible();
    
    self.leaseBlockLayerUtfGrid = self.leaseBlockLayer.utfgrid;
        
    self.selectingLeaseBlocks = ko.observable(false);
    
    self.selectedLeaseBlocksLayerName = 'Selected Lease Blocks';
    
    self.selectedLeaseBlocks = ko.observableArray();
    self.selectedLeaseBlocks.subscribe(function(test) {
        if (self.selectedLeaseBlocksLayer) {
            app.map.removeLayer(self.selectedLeaseBlocksLayer);
        }
        $.ajax({
            url: '/scenario/get_leaseblock_features',
            type: 'GET',
            dataType: 'json',
            data: { leaseblock_ids: test },
            success: function (feature) {
                var layer = new OpenLayers.Layer.Vector(
                    self.selectedLeaseBlocksLayerName,
                    {
                        projection: new OpenLayers.Projection('EPSG:3857'),
                        displayInLayerSwitcher: false,
                        styleMap: new OpenLayers.StyleMap({
                            strokeColor: '#ff0',
                            strokeOpacity: .8,
                            fillOpacity: 0
                        })//,     
                        //scenarioModel: new selectionModel()
                    }
                );
                
                //assign leaseblock ids to hidden leaseblock ids form field
                $('#id_leaseblock_ids').val(self.selectedLeaseBlocks().join(","))
                
                layer.addFeatures(new OpenLayers.Format.GeoJSON().read(feature));
                self.selectedLeaseBlocksLayer = layer
                app.map.addLayer(self.selectedLeaseBlocksLayer);
            },
            error: function (result) {
                debugger;
            }
        })
    });
    
    self.toggleSelectionProcess = function() {
        if ( ! self.selectingLeaseBlocks() ) { // if not currently in the selection process, enable selection process
            self.enableSelectionProcess();
        } else { // otherwise, disable selection process
            self.disableSelectionProcess();
        }  
    };
    
    self.enableSelectionProcess = function() {
        //disable feature attribution
        app.viewModel.disableFeatureAttribution();
        //ensure lease blocks are visible
        self.leaseBlockLayer.activateLayer();
        self.leaseBlockLayer.setVisible();
        //disable Show Lease Blocks checkbox 
        $('#lease-blocks-layer-checkbox').prop('checked', true);
        $('#lease-blocks-layer-checkbox').attr('disabled', 'disabled');
        //change button text
        self.selectingLeaseBlocks(true);
    };
    
    self.disableSelectionProcess = function() {
        //enable feature attribution
        app.viewModel.enableFeatureAttribution();
        //re-enable Show Lease Blocks checkbox
        $('#lease-blocks-layer-checkbox').removeAttr('disabled');
        //change button text
        self.selectingLeaseBlocks(false);
    };
    
    self.toggleLeaseBlockLayer = function(formModel, event) {
        if ( event.target.type === "checkbox" ) {
            if ($('#lease-blocks-layer-toggle input').is(":checked")) {
                self.leaseBlockLayer.setVisible();
            } else {
                self.leaseBlockLayer.setInvisible();
            }
        }
        return true;
    };
    
    return self;
}; // end IESelectionFormModel

function scenarioModel(options) {
    var self = this;

    self.id = options.uid || null;
    self.uid = options.uid || null;
    self.name = options.name;
    self.description = options.description;
    self.shared = ko.observable();
    self.sharedByName = options.sharedByName || null;
    self.sharedByUsername = options.sharedByUsername;
    if (self.sharedByName && $.trim(self.sharedByName) !== '') {
        self.sharedByWho = self.sharedByName + ' (' + self.sharedByUsername + ')';
    } else {
        self.sharedByWho = self.sharedByUsername;
    }
    self.sharedBy = ko.observable();
    if (options.shared) {
        self.shared(true);
        self.sharedBy('Shared by ' + self.sharedByWho);
    } else {
        self.shared(false);
        self.sharedBy(false);
    }
    self.selectedGroups = ko.observableArray();
    self.sharedGroupsList = [];
    if (options.sharingGroups && options.sharingGroups.length) {
        self.selectedGroups(options.sharingGroups);
    } 
    
    self.attributes = [];
    self.scenarioAttributes = options.attributes ? options.attributes.attributes : [];
    
    //self.overview = self.description || 'no description was provided';
    self.constructInfoText = function() {
        var attrs = self.scenarioAttributes;
        if (self.description && self.description !== '') {
            var output = self.description + '\n\n';
        } else {
            var output = '';
        }
        for (var i=0; i< attrs.length; i++) {
            output += attrs[i].title + ': ' + attrs[i].data + '\n';
        }
        return output;
    };
    self.overview = self.constructInfoText();
        
    self.scenarioReportValues = options.attributes ? options.attributes.report_values : [];

    self.features = options.features;
    
    self.active = ko.observable(false);
    self.visible = ko.observable(false);
    self.defaultOpacity = options.opacity || 0.8;
    self.opacity = ko.observable(self.defaultOpacity);
    self.type = 'Vector';
    
    self.opacity.subscribe( function(newOpacity) {
        if ( self.layer ) {
            self.layer.styleMap.styles['default'].defaultStyle.strokeOpacity = newOpacity;
            self.layer.styleMap.styles['default'].defaultStyle.fillOpacity = newOpacity;
            self.layer.redraw();
        } else {
            //debugger;
        }
    });
    
    self.toggleActive = function(self, event) {
        var scenario = this;
        //app.viewModel.activeLayer(layer);
        if (scenario.active()) { // if layer is active, then deactivate
            scenario.deactivateLayer();
        } else { // otherwise layer is not currently active, so activate
            scenario.activateLayer();
            //app.viewModel.scenarios.addScenarioToMap(scenario);
        }
    };
    
    self.activateLayer = function() {
        var scenario = this;
        app.viewModel.scenarios.addScenarioToMap(scenario);
        if ( scenario.isSelectionModel ) {
            app.viewModel.scenarios.activeSelections().push(scenario);
        }
    };
    
    self.deactivateLayer = function() {
        var scenario = this;
        
        scenario.active(false);
        scenario.visible(false);
        
        if ( scenario.isSelectionModel ) {
            var index = app.viewModel.scenarios.activeSelections().indexOf(scenario);
            app.viewModel.scenarios.activeSelections().splice(index, 1);
        }
        
        scenario.opacity(scenario.defaultOpacity);
        app.setLayerVisibility(scenario, false);
        app.viewModel.activeLayers.remove(scenario);
        
        //remove the key/value pair from aggregatedAttributes
        delete app.viewModel.aggregatedAttributes()[scenario.name];
        //if there are no more attributes left to display, then remove the overlay altogether
        if ($.isEmptyObject(app.viewModel.aggregatedAttributes())) {
            app.viewModel.aggregatedAttributes(false);
        }
    
    };
    
    self.editScenario = function() {
        var scenario = this;
        return $.ajax({
            url: '/features/scenario/' + scenario.uid + '/form/', 
            success: function(data) {
                //$('#scenario-form').append(data);
                app.viewModel.scenarios.scenarioForm(true);
                $('#scenario-form').html(data);
                app.viewModel.scenarios.scenarioFormModel = new scenarioFormModel();
                ko.applyBindings(app.viewModel.scenarios.scenarioFormModel, document.getElementById('scenario-form'));
                app.viewModel.scenarios.scenarioFormModel.updateFiltersAndLeaseBlocks();
                if ($('#id_input_parameter_wind_speed').is(':checked')) {
                    app.viewModel.scenarios.scenarioFormModel.windSpeedParameter(true);
                } 
                if ($('#id_input_parameter_depth').is(':checked')) {
                    app.viewModel.scenarios.scenarioFormModel.depthRangeParameter(true);
                } 
                if ($('#id_input_parameter_distance_to_shore').is(':checked')) {
                    app.viewModel.scenarios.scenarioFormModel.distanceToShoreParameter(true);
                } 
                if ($('#id_input_parameter_distance_to_awc').is(':checked')) {
                    app.viewModel.scenarios.scenarioFormModel.distanceToAWCParameter(true);
                } 
                if ($('#id_input_filter_distance_to_shipping').is(':checked')) {
                    app.viewModel.scenarios.scenarioFormModel.distanceToShippingParameter(true);
                } 
                if ($('#id_input_filter_ais_density').is(':checked')) {
                    app.viewModel.scenarios.scenarioFormModel.shipTrafficDensityParameter(true);
                } 
                app.viewModel.scenarios.scenarioFormModel.updateFiltersAndLeaseBlocks();
            },
            error: function (result) { 
                debugger; 
            }
        });
    }; 
    
    self.createCopyScenario = function() {
        var scenario = this;
    
        //create a copy of this shape to be owned by the user
        $.ajax({
            url: '/scenario/copy_design/' + scenario.uid + '/',
            type: 'POST',
            success: function(data) {
                app.viewModel.scenarios.loadScenariosFromServer();
            },
            error: function (result) {
                debugger;
            }
        })
    };
                
    self.deleteScenario = function() {
        var scenario = this;
        
        //remove from activeLayers
        app.viewModel.activeLayers.remove(scenario);
        //remove from app.map
        if (scenario.layer) {
            app.map.removeLayer(scenario.layer);
        }
        //remove from scenarioList
        app.viewModel.scenarios.scenarioList.remove(scenario);
        
        //remove from server-side db (this should provide error message to the user on fail)
        $.ajax({
            url: '/scenario/delete_design/' + scenario.uid + '/',
            type: 'POST',
            error: function (result) {
                debugger;
            }
        })
    };
    
    self.visible = ko.observable(false);  
    
    // bound to click handler for layer visibility switching in Active panel
    self.toggleVisible = function() {
        var scenario = this;
        
        if (scenario.visible()) { //make invisible
            scenario.visible(false)
            app.setLayerVisibility(scenario, false)
        } else { //make visible
            scenario.visible(true);
            app.setLayerVisibility(scenario, true);
        }
    };

    // is description active
    self.infoActive = ko.observable(false);
    app.viewModel.showOverview.subscribe( function() {
        if ( app.viewModel.showOverview() === false ) {
            self.infoActive(false);
        }
    });
    
    // display descriptive text below the map
    self.toggleDescription = function(scenario) {
        if ( ! scenario.infoActive() ) {
            self.showDescription(scenario);
        } else {
            self.hideDescription(scenario);
        }
    };
    
    self.showDescription = function(scenario) {
        app.viewModel.showOverview(false);
        app.viewModel.activeInfoSublayer(false);
        app.viewModel.activeInfoLayer(scenario);
        self.infoActive(true);
        $('#overview-overlay').height(186);
        app.viewModel.showOverview(true);
        app.viewModel.updateCustomScrollbar('#overview-overlay-text');
        app.viewModel.hideMapAttribution();
    };
    
    self.hideDescription = function(scenario) {
        app.viewModel.showOverview(false);
        app.viewModel.activeInfoSublayer(false);
        app.viewModel.showMapAttribution();
    };
    
    return self;
} // end scenarioModel


function scenariosModel(options) {
    var self = this;
    
    self.scenarioList = ko.observableArray();    
    self.scenarioForm = ko.observable(false);
    
    self.selectionList = ko.observableArray(); 
    self.getSelectionById = function(id) {
        var selections = self.selectionList();
        for (var i=0; i<selections.length; i++) {
            if ( selections[i].id === id ) {
                return selections[i];
            }
        }
        return false;
    };
    
    self.activeSelections = ko.observableArray();
    
    self.selectionForm = ko.observable(false);
        
    self.reportsVisible = ko.observable(false);
    self.showComparisonReports = function() {
        setTimeout(function() {
            $('#designs-slide').hide('slide', {direction: 'left'}, 300);
        }, 100);
        setTimeout(function() {
            self.reportsVisible(true);
            $('#designs-slide').show('slide', {direction: 'right'}, 300);
            if (self.activeSelections().length > 0) {
                self.reports.noActiveCollections(false);
                app.viewModel.scenarios.reports.updateChart();
            } else { 
                self.reports.noActiveCollections(true);
            }
        }, 420);
    };
    
    self.returnToDesigns = function() {
        setTimeout(function() {
            $('#designs-slide').hide('slide', {direction: 'right'}, 300);
        }, 100);
        setTimeout(function() {
            app.viewModel.scenarios.reportsVisible(false);
            $('#designs-slide').show('slide', {direction: 'left'}, 300);
        }, 420);
    };
    
    
    self.leaseblockLayer = ko.observable(false);

    self.leaseblockLayer.subscribe( function() {
        app.viewModel.updateAttributeLayers();
    });
    
    self.scenarioLeaseBlocksLayerName = 'Selected OCS Blocks';
        
    // loading message for showing spinner
    // false for normal operation
    self.loadingMessage = ko.observable(false);
    self.errorMessage = ko.observable(false);
    
    self.sharingGroups = ko.observableArray();
    
    self.sharingLayer = ko.observable();
    self.showSharingModal = function(scenario) {
        self.sharingLayer(scenario);
        $('#share-modal').modal('show');
    };
    
    self.groupMembers = function(groupName) {
        var memberList = "";
        for (var i=0; i<self.sharingGroups().length; i++) {
            var group = self.sharingGroups()[i];
            if (group.group_name === groupName) {
                for (var m=0; m<group.members.length; m++) {
                    var member = group.members[m];
                    memberList += member.name + '<br>';
                }
            }
        }
        return memberList;
    };
        
    self.toggleGroup = function(obj) {
        var groupName = obj.group_name,
            indexOf = self.sharingLayer().selectedGroups.indexOf(groupName);
    
        if ( indexOf === -1 ) {  //add group to list
            self.sharingLayer().selectedGroups.push(groupName);
        } else { //remove group from list
            self.sharingLayer().selectedGroups.splice(indexOf, 1);
        }
    };
    
    self.initSharingModal = function() {
        for (var i=0; i<self.sharingGroups().length; i++) {
            var groupID = '#' + self.sharingGroups()[i].group_slug;
            $(groupID).collapse( { toggle: false } );
        }
    }
    
    //TODO:  Fix the problem in which the first group toggled open will not toggle open again, once it's closed
    self.lastMembersClickTime = 0;
    self.toggleGroupMembers = function(obj, e) {
        var groupName = obj.group_name,
            groupID = '#' + obj.group_slug,
            clickTime = new Date().getTime();
        if (clickTime - self.lastMembersClickTime > 800) {
            self.lastMembersClickTime = clickTime;
            if ( ! $(groupID).hasClass('in') ) {  //toggle on and add group to list
                $(groupID).css("display", "none"); //allows the fade effect to display as expected
                if ( $.browser.msie ) {
                    $(groupID).fadeIn(0, function() {});
                } else {
                    $(groupID).fadeIn('slow', function() {});
                }
                $(groupID).collapse('show'); 
            } else { //toggle off and remove group from list
                if ( $.browser.msie ) {
                    $(groupID).fadeOut(0, function() {});
                } else {
                    $(groupID).fadeOut('slow', function() {});
                }
                $(groupID).collapse('hide');
                //set .modal-body background to eliminate residue that appears when the last Group is opened and then closed?
            }
            setTimeout(function() { self.updateSharingScrollBar(groupID); }, 300);
        }
    };
    
    self.groupIsSelected = function(groupName) {
        if (self.sharingLayer()) {
            var indexOf = self.sharingLayer().selectedGroups.indexOf(groupName);
            return indexOf !== -1;
        }
        return false;
    };
    
    self.updateSharingScrollBar = function(groupID) {
        var sharingScrollpane = $('#sharing-groups').data('jsp');
        if (sharingScrollpane === undefined) {
            $('#sharing-groups').jScrollPane( {animateScroll: true});
        } else {
            sharingScrollpane.reinitialise();
            var groupPosition = $(groupID).position().top,
                containerPosition = $('#sharing-groups .jspPane').position().top,
                actualPosition = groupPosition + containerPosition;
            //console.log('group position = ' + groupPosition);
            //console.log('container position = ' + containerPosition);
            //console.log('actual position = ' + actualPosition);
            if (actualPosition > 140) {
                //console.log('scroll to ' + (groupPosition-120));
                sharingScrollpane.scrollToY(groupPosition-120);
            } 
            
        }
    };
    
    
    // scenariosLoaded will be set to true after they have been loaded
    self.scenariosLoaded = false;
    self.selectionsLoaded = false;
    
    self.isScenariosOpen = ko.observable(false);
    self.toggleScenariosOpen = function() {
        // ensure designs tab is activated
        $('#designsTab').tab('show');
        
        if ( self.isScenariosOpen() ) {
            self.isScenariosOpen(false);
        } else {
            self.isScenariosOpen(true);
        }
        self.updateDesignsScrollBar();
    }        
    self.isCollectionsOpen = ko.observable(false);
    self.toggleCollectionsOpen = function() {
        // ensure designs tab is activated
        $('#designsTab').tab('show');
        
        if ( self.isCollectionsOpen() ) {
            self.isCollectionsOpen(false);
        } else {
            self.isCollectionsOpen(true);
        }
        self.updateDesignsScrollBar();
    }       
    
    self.updateDesignsScrollBar = function() {
        var designsScrollpane = $('#designs-accordion').data('jsp');
        if (designsScrollpane === undefined) {
            $('#designs-accordion').jScrollPane();
        } else {
            designsScrollpane.reinitialise();
        }
    } 
    
    //restores state of Designs tab to the initial list of designs
    self.reset = function () {
        self.loadingMessage(false);
        self.errorMessage(false);
        
        //clean up scenario form
        if (self.scenarioForm() || self.scenarioFormModel) {
            self.removeScenarioForm();
        }
        
        //clean up selection form
        if (self.selectionForm() || self.selectionFormModel) {
            self.removeSelectionForm();
        }
        
        //remove the key/value pair from aggregatedAttributes
        app.viewModel.removeFromAggregatedAttributes(self.leaseblockLayer().name);
        app.viewModel.updateAttributeLayers();
        
        self.updateDesignsScrollBar();
    };
    
    self.removeSelectionForm = function() {
        self.selectionForm(false);
        var selectionForm = document.getElementById('selection-form');
        $(selectionForm).empty();
        ko.cleanNode(selectionForm); 
        if (self.selectionFormModel.IE) {
            if (self.selectionFormModel.selectedLeaseBlocksLayer) {
                app.map.removeLayer(self.selectionFormModel.selectedLeaseBlocksLayer);
            }
        } else {
            app.map.removeControl(self.selectionFormModel.leaseBlockSelectionLayerClickControl); 
            app.map.removeLayer(self.selectionFormModel.leaseBlockSelectionLayer.layer);        
        }
        delete self.selectionFormModel;
        app.viewModel.enableFeatureAttribution();
    };
    
    self.removeScenarioForm = function() {
        self.scenarioForm(false);
        var scenarioForm = document.getElementById('scenario-form');
        $(scenarioForm).empty();
        ko.cleanNode(scenarioForm);
        delete self.scenarioFormModel;
        //hide remaining leaseblocks
        if ( self.leaseblockLayer() && app.map.getLayersByName(self.leaseblockLayer().name).length ) {
            app.map.removeLayer(self.leaseblockLayer()); 
        }
    };

    self.createWindScenario = function() {
        //hide designs tab by sliding left
        return $.ajax({
            url: '/features/scenario/form/',
            success: function(data) {
                self.scenarioForm(true);
                $('#scenario-form').html(data);
                self.scenarioFormModel = new scenarioFormModel();
                ko.applyBindings(self.scenarioFormModel, document.getElementById('scenario-form'));
                self.scenarioFormModel.updateDesignScrollBar();
                if ( ! self.leaseblockLayer() && app.viewModel.modernBrowser() ) {
                    self.loadLeaseblockLayer();
                }
            },
            error: function (result) { debugger; }
        });
    };    

    self.createSelectionDesign = function() {
        return $.ajax({
            url: '/features/leaseblockselection/form/',
            success: function(data) {
                /*$('#selection-form').html(data);
                setTimeout(function() {
                    $('#designs').hide('slide', {direction: 'left'}, 300);
                }, 100);
                setTimeout(function() {*/
                    self.selectionForm(true);
                    $('#selection-form').html(data);
                /*    $('#designs').show('slide', {direction: 'right'}, 300);
                }, 420);*/
                self.selectionFormModel = new IESelectionFormModel(); //new selectionFormModel();
                ko.applyBindings(self.selectionFormModel, document.getElementById('selection-form'));
            },
            error: function (result) { debugger; }
        });
    };        
    
    //
    self.addScenarioToMap = function(scenario, options) {
        var scenarioId,
            opacity = .8,
            stroke = 1,
            fillColor = "#2F6A6C",
            strokeColor = "#1F4A4C";
        if ( scenario ) {
            scenarioId = scenario.uid;
            scenario.active(true);
            scenario.visible(true);
        } else {
            scenarioId = options.uid;
        }
        if (scenarioId.indexOf('leaseblockselection') !== -1) {
            var isSelectionModel = true;
        } else {
            var isSelectionModel = false;
        }
        if (self.scenarioFormModel) {
            self.scenarioFormModel.isLeaseblockLayerVisible(false);
        }
        //perhaps much of this is not necessary once a scenario has been added to app.map.layers initially...?
        //(add check for scenario.layer, reset the style and move on?)
        $.ajax( {
            url: '/features/generic-links/links/geojson/' + scenarioId + '/', 
            type: 'GET',
            dataType: 'json',
            success: function(feature) {
                if ( scenario ) {
                    opacity = scenario.opacity();
                    stroke = scenario.opacity();
                } 
                if ( isSelectionModel ) {
                    fillColor = "#00467F";
                    strokeColor = "#00265F";
                } 
                var layer = new OpenLayers.Layer.Vector(
                    scenarioId,
                    {
                        projection: new OpenLayers.Projection('EPSG:3857'),
                        displayInLayerSwitcher: false,
                        styleMap: new OpenLayers.StyleMap({
                            fillColor: fillColor,
                            fillOpacity: opacity,
                            strokeColor: strokeColor,
                            strokeOpacity: stroke
                        }),     
                        //style: OpenLayers.Feature.Vector.style['default'],
                        scenarioModel: scenario
                    }
                );
                
                layer.addFeatures(new OpenLayers.Format.GeoJSON().read(feature));
                
                if ( scenario ) {
                    //reasigning opacity here, as opacity wasn't 'catching' on state load for scenarios
                    scenario.opacity(opacity);
                    scenario.layer = layer;
                } else { //create new scenario
                    //only do the following if creating a scenario
                    var properties = feature.features[0].properties;
                    if (isSelectionModel) {
                        scenario = new selectionModel({
                            id: properties.uid,
                            uid: properties.uid,
                            name: properties.name, 
                            description: properties.description,
                            features: layer.features
                        });
                    } else {
                        scenario = new scenarioModel({
                            id: properties.uid,
                            uid: properties.uid,
                            name: properties.name, 
                            description: properties.description,
                            features: layer.features
                        });
                    }
                    scenario.layer = layer;
                    scenario.layer.scenarioModel = scenario;
                    scenario.active(true);
                    scenario.visible(true);
                    
                    //get attributes
                    $.ajax( {
                        url: '/scenario/get_attributes/' + scenarioId + '/', 
                        type: 'GET',
                        dataType: 'json',
                        success: function(result) {
                            scenario.scenarioAttributes = result.attributes;
                            if (isSelectionModel) {
                                scenario.scenarioReportValues = result.report_values;
                            }
                        },
                        error: function (result) {
                            debugger;
                        }
                    
                    });
                    
                    //in case of edit, removes previously stored scenario
                    //self.scenarioList.remove(function(item) { return item.uid === scenario.uid } );
                    
                    if ( isSelectionModel ) {
                        var previousSelection = ko.utils.arrayFirst(self.selectionList(), function(oldSelection) {
                            return oldSelection.uid === scenario.uid;
                        });
                        if ( previousSelection ) {
                            self.selectionList.replace( previousSelection, scenario );
                        } else {
                            self.selectionList.push(scenario);
                        }
                    } else {
                        var previousScenario = ko.utils.arrayFirst(self.scenarioList(), function(oldScenario) {
                            return oldScenario.uid === scenario.uid;
                        });
                        if ( previousScenario ) {
                            self.scenarioList.replace( previousScenario, scenario );
                        } else {
                            self.scenarioList.push(scenario);
                        }
                    }
                    app.viewModel.scenarios.activeSelections().push(scenario)
                    
                    //self.scenarioForm(false);
                    self.reset();
                }
                
                //app.addVectorAttribution(layer);
                //in case of edit, removes previously displayed scenario
                for (var i=0; i<app.map.layers.length; i++) {
                    if (app.map.layers[i].name === scenario.uid) {
                        app.map.removeLayer(app.map.layers[i]);
                        i--;
                    }
                }
                app.map.addLayer(scenario.layer); 
                //add scenario to Active tab    
                app.viewModel.activeLayers.remove(function(item) { return item.uid === scenario.uid } );
                app.viewModel.activeLayers.unshift(scenario);
                
            },
            error: function(result) {
                debugger;
                app.viewModel.scenarios.errorMessage(result.responseText.split('\n\n')[0]);
            }
        });
    };
    
    self.loadScenariosFromServer = function() {
        $.ajax({
            url: '/scenario/get_scenarios',
            type: 'GET',
            dataType: 'json',
            success: function (scenarios) {
                self.loadScenarios(scenarios);
                self.scenariosLoaded = true;
            },
            error: function (result) {
                debugger;
            }
        });
    };
    
    //populates scenarioList
    self.loadScenarios = function (scenarios) {
        self.scenarioList.removeAll();
        $.each(scenarios, function (i, scenario) {
            var scenarioViewModel = new scenarioModel({
                id: scenario.uid,
                uid: scenario.uid,
                name: scenario.name,
                description: scenario.description,
                attributes: scenario.attributes,
                shared: scenario.shared,
                sharedByUsername: scenario.shared_by_username,
                sharedByName: scenario.shared_by_name,
                sharingGroups: scenario.sharing_groups
            });
            self.scenarioList.push(scenarioViewModel);
            app.viewModel.layerIndex[scenario.uid] = scenarioViewModel;
        });
    };
    
    self.loadSelectionsFromServer = function() {
        $.ajax({
            url: '/scenario/get_selections',
            type: 'GET',
            dataType: 'json',
            success: function (selections) {
                app.viewModel.scenarios.loadSelections(selections);
                app.viewModel.scenarios.selectionsLoaded = true;
            },
            error: function (result) {
                debugger;
            }
        });
    };
    //populates selectionList..?
    self.loadSelections = function (selections) {
        self.selectionList.removeAll();
        $.each(selections, function (i, selection) {
            var selectionViewModel = new selectionModel({
                id: selection.uid,
                uid: selection.uid,
                name: selection.name,
                description: selection.description,
                attributes: selection.attributes,
                shared: selection.shared,
                sharedByUsername: selection.shared_by_username,
                sharedByName: selection.shared_by_name,
                sharingGroups: selection.sharing_groups
            });
            self.selectionList.push(selectionViewModel);
            app.viewModel.layerIndex[selection.uid] = selectionViewModel;
        });
    };
    
    self.loadLeaseblockLayer = function() {
        self.leaseblockLayer( new OpenLayers.Layer.Vector(
            self.scenarioLeaseBlocksLayerName,
            {
                projection: new OpenLayers.Projection('EPSG:3857'),
                displayInLayerSwitcher: false,
                strategies: [new OpenLayers.Strategy.Fixed()],
                protocol: new OpenLayers.Protocol.HTTP({
                    url: '/media/data_manager/geojson/LeaseBlockWindSpeedOnlySimplifiedNoDecimal.json',
                    format: new OpenLayers.Format.GeoJSON()
                }),
                //styleMap: new OpenLayers.StyleMap( { 
                //    "default": new OpenLayers.Style( { display: "none" } )
                //})
                layerModel: new layerModel({
                    name: self.scenarioLeaseBlocksLayerName
                })
            }
        ));
        
        self.leaseblockLayer().events.register("loadend", self.leaseblockLayer(), function() {
            if (self.scenarioFormModel && ! self.scenarioFormModel.IE) {
                self.scenarioFormModel.showLeaseblockSpinner(false);
            }
        });
    };      
    
    self.leaseblockList = [];    
    
    //populates leaseblockList
    self.loadLeaseblocks = function (ocsblocks) {
        self.leaseblockList = ocsblocks;
    };  
    
    //SHARING DESIGNS
    self.submitShare = function() {
        var data = { 'scenario': self.sharingLayer().uid, 'groups': self.sharingLayer().selectedGroups() };
        $.ajax( {
            url: '/scenario/share_design',
            data: data,
            type: 'POST',
            dataType: 'json',
            error: function(result) {
                debugger;
            }
        });
    };
    
    return self;
} // end scenariosModel


app.viewModel.scenarios = new scenariosModel();

$('#designsTab').on('show', function (e) {
    //if ( app.viewModel.scenarios.reports && app.viewModel.scenarios.reports.showingReport() ) {
    //    app.viewModel.scenarios.reports.updateChart();
    //}
    if ( !app.viewModel.scenarios.scenariosLoaded || !app.viewModel.scenarios.selectionsLoaded) {
        // load the scenarios
        app.viewModel.scenarios.loadScenariosFromServer();
        
        // load the selections
        app.viewModel.scenarios.loadSelectionsFromServer();

        // load the leaseblocks
        $.ajax({
            url: '/scenario/get_leaseblocks',
            type: 'GET',
            dataType: 'json',
            success: function (ocsblocks) {
                app.viewModel.scenarios.loadLeaseblocks(ocsblocks);
            },
            error: function (result) {
                debugger;
            }
        });
        
        $.ajax({
            url: '/scenario/get_sharing_groups',
            type: 'GET',
            dataType: 'json',
            success: function (groups) {
                app.viewModel.scenarios.sharingGroups(groups);
            },
            error: function (result) {
                debugger;
            }
        });
    }
});