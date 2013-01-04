
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
    
    self.selectedLeaseblocksLayerName = 'Selected OCS Blocks';
    
    self.loadLeaseblockLayer = function() {
        app.viewModel.scenarios.leaseblockLayer( new OpenLayers.Layer.Vector(
            self.selectedLeaseblocksLayerName,
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
                    name: self.selectedLeaseblocksLayerName
                })
            }
        ));
    };
    
    self.activateLeaseblockLayer = function() {
        self.isLeaseblockLayerVisible(true);
        //self.showRemainingBlocks();
    };
    
    self.deactivateLeaseblockLayer = function() {
        self.isLeaseblockLayerVisible(false);
        //remove from attribute list (if it's there)
        app.viewModel.removeFromAggregatedAttributes(self.selectedLeaseblocksLayerName);
        app.viewModel.updateAggregatedAttributesOverlayWidthAndScrollbar();
        //self.hideLeaseblockLayer();
    };
    
    self.lastChange = (new Date()).getTime();
    
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
        if ($('#depth_widget').css('display') !== "none") {
            self.updateFilters({'key': 'min_depth', 'value': $('#id_input_min_depth')[0].value});
            self.updateFilters({'key': 'max_depth', 'value': $('#id_input_max_depth')[0].value});
        } else {
            self.removeFilter('min_depth');
            self.removeFilter('max_depth');
        }
        if ($('#wind_speed_widget').css('display') !== "none") {
            self.updateFilters({'key': 'wind', 'value': $('#id_input_avg_wind_speed')[0].value});
        } else {
            self.removeFilter('wind');
        }
        if ($('#distance_to_shore_widget').css('display') !== "none") {
            self.updateFilters({'key': 'min_distance', 'value': $('#id_input_min_distance_to_shore')[0].value});
            self.updateFilters({'key': 'max_distance', 'value': $('#id_input_max_distance_to_shore')[0].value});
        } else {
            self.removeFilter('min_distance');
            self.removeFilter('max_distance');
        }
        if ($('#distance_to_awc_widget').css('display') !== "none") {
            self.updateFilters({'key': 'awc', 'value': $('#id_input_distance_to_awc')[0].value});
        } else {
            self.removeFilter('awc');
        }
        if ($('#distance_to_shipping_widget').css('display') !== "none") {
            self.updateFilters({'key': 'tsz', 'value': $('#id_input_distance_to_shipping')[0].value});
        } else {
            self.removeFilter('tsz');
        }
        if ( $('#id_input_filter_ais_density').attr('checked') ) {
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
            
        //console.log('min input is: ' + self.filters['min_depth']);
        //console.log('max input is: ' + self.filters['max_depth']);
        //console.log('list length is: ' + list.length);
        for ( var i=0; i<list.length; i++ ) {
            var addOne = true;
            if (self.filters['wind'] && list[i].min_wind_speed < self.filters['wind'] ) {
                addOne = false;
                //console.log('false for wind');
            }
            if (self.filters['max_distance'] && list[i].avg_distance > self.filters['max_distance'] || 
                self.filters['min_distance'] && list[i].avg_distance < self.filters['min_distance'] ) {
                addOne = false;
                //console.log('false for distance to shore');
            } 
            if (self.filters['max_depth'] && list[i].avg_depth > self.filters['max_depth'] || 
                self.filters['min_depth'] && list[i].avg_depth < self.filters['min_depth'] ) {
                addOne = false;
                //console.log('false for depth');
            } else {
                //NOTE: at times there seems to be some sort of rounding error that causes a discrepancy 
                //      in which the client side count is more inclusive than the server side result
                //      examples include requests for depth range of 40 to 50 feet
                //      on the client there are 6 blocks identified, 2 of which have a max depth of 50 feet
                //      these 2 blocks with a max depth of 50 feet (rounded result from -15.5237 and -15.3398 meters) 
                //      are not part of the server side results
                //FIX:  added 1 point of precision to feet to meters (and meters to feet) conversions 
                //      on both client and server implementations
                //console.log('counting this lease block');
                //console.log('ocs min depth is: ' + list[i].min_depth);
                //console.log('ocs max depth is: ' + list[i].max_depth);
                //console.log('count is now: ' + count);
                //console.log(self.filters['max_depth'] && list[i].max_depth + ' <= ' + self.filters['max_depth']);
                //console.log('or');
                //console.log(self.filters['min_depth'] && list[i].min_depth + ' >= ' + self.filters['min_depth']);
                //console.log('');
            }
            if (self.filters['awc'] && list[i].awc_min_distance > self.filters['awc'] || 
                list[i].awc_min_distance === null ) {
                addOne = false;
                //console.log('false for awc');
            } 
            if (self.filters['tsz'] && list[i].tsz_min_distance < self.filters['tsz'] ) {
                addOne = false;
                //console.log('false for tsz');
            }
            if (self.filters['ais'] && list[i].ais_mean_density > 1 ) {
                addOne = false;
                //console.log('false for ais');
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
            //var blockLayer = app.map.getLayersByName('OCS Test')[0];
            if ( ! app.viewModel.scenarios.leaseblockLayer()) {
                self.loadLeaseblockLayer();
            } 
            var blockLayer = app.viewModel.scenarios.leaseblockLayer();
            var filter = new OpenLayers.Filter.Logical({
                type: OpenLayers.Filter.Logical.AND,
                filters: []
            });
            if ( $('#wind_speed_widget').css('display') !== "none" ) {
                filter.filters.push(
                    new OpenLayers.Filter.Comparison({ // if WINDREV_MI >= self.filters['wind']
                        type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
                        property: "WINDREV_MI", 
                        value: self.filters['wind']
                    })
                );
            }
            if ( $('#distance_to_shore_widget').css('display') !== "none" ) {
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
            if ( $('#depth_widget').css('display') !== "none" ) {
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
            if ( $('#distance_to_awc_widget').css('display') !== "none" ) {
                filter.filters.push(
                    new OpenLayers.Filter.Comparison({ // if AWCMI_MIN <= self.filters['awc']
                        type: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
                        property: "AWCMI_MIN", 
                        value: self.filters['awc']
                    })
                );
            }
            if ( $('#distance_to_shipping_widget').css('display') !== "none" ) {
                filter.filters.push(
                    new OpenLayers.Filter.Comparison({ // if TRSEP_MIN >= self.filters['tsz']
                        type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
                        property: "TRSEP_MIN", 
                        value: self.filters['tsz']
                    })
                );
            }
            if ( $('#id_input_filter_ais_density').attr('checked') ) {
                filter.filters.push(
                    new OpenLayers.Filter.Comparison({ // if AIS7_MEAN <= 1
                        type: OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO,
                        property: "AIS7_MEAN", 
                        value: 1
                    })
                );
            }
            //blockLayer.styleMap = { "default": new OpenLayers.Style( { display: "block" } ) }; 
            /*
            blockLayer.styleMap.styles.default.setDefaultStyle(
                new OpenLayers.Style({
                    'fillOpacity': 0,
                    'display': 'block'
                })
            );
            */
            //if ( filter.filters.length ) {
            blockLayer.styleMap.styles['default'].rules[0] = new OpenLayers.Rule({
                filter: filter, 
                symbolizer: { strokeColor: '#fff' } 
            });
                //blockLayer.display(true);
            self.showLeaseblockLayer(blockLayer);
            //} else {
                //self.isLeaseblockLayerVisible(false);
                //self.hideLeaseblockLayer();
            //}
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
        if ( event.target.type === "checkbox" ) {
            if ($('#wind-speed-layer-toggle input').is(":checked")) {
                self.windSpeedLayer.activateLayer();
            } else {
                self.windSpeedLayer.deactivateLayer();
            }
        }
        return true;
    };
    
    self.awcLayer = app.viewModel.getLayerById(65);
    self.toggleAWCLayer = function(formModel, event) {
        if ( event.target.type === "checkbox" ) {
            if ($('#awc-layer-toggle input').is(":checked")) {
                self.awcLayer.activateLayer();
            } else {
                self.awcLayer.deactivateLayer();
            }
        }
        return true;
    };
    
    self.shippingLanesLayer = app.viewModel.getLayerById(65);
    self.toggleShippingLanesLayer = function(formModel, event) {
        if ( event.target.type === "checkbox" ) {
            if ($('#shipping-lanes-layer-toggle input').is(":checked")) {
                self.shippingLanesLayer.activateLayer();
            } else {
                self.shippingLanesLayer.deactivateLayer();
            }
        }
        return true;
    };
    
    return self;
} // end scenarioFormModel

function scenarioModel(options) {
    var self = this;

    self.id = options.uid;
    self.uid = options.uid;
    self.name = options.name;
    self.description = options.description;
    
    self.overview = self.description || 'no description was provided';
    
    self.attributes = [];
    self.scenarioAttributes = options.attributes ? options.attributes.attributes : [];

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
    };
    
    self.deactivateLayer = function() {
        var scenario = this;
        
        scenario.active(false);
        scenario.visible(false);
        
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
            },
            error: function (result) { 
                debugger; 
            }
        });
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
            url: '/scenario/delete_scenario/' + scenario.uid + '/',
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
            //console.log('making invisible');
        } else { //make visible
            scenario.visible(true);
            app.setLayerVisibility(scenario, true);
            //console.log('making visible');
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
        
    self.leaseblockLayer = ko.observable(false);

    self.leaseblockLayer.subscribe( function() {
        app.viewModel.updateAttributeLayers();
    });
    
    // loading message for showing spinner
    // false for normal operation
    self.loadingMessage = ko.observable(false);
    self.errorMessage = ko.observable(false);
    
    // scenariosLoaded will be set to true after they have been loaded
    self.scenariosLoaded = false;

    //restores state of Designs tab to the initial list of designs
    self.reset = function () {
        self.loadingMessage(false);
        self.errorMessage(false);
        self.scenarioForm(false);
        var scenarioForm = document.getElementById('scenario-form');
        $(scenarioForm).empty();
        ko.cleanNode(scenarioForm);
        delete self.scenarioFormModel;
        //hide remaining leaseblocks
        if ( self.leaseblockLayer() && app.map.getLayersByName(self.leaseblockLayer().name).length ) {
            app.map.removeLayer(self.leaseblockLayer()); 
        }
        //remove the key/value pair from aggregatedAttributes
        app.viewModel.removeFromAggregatedAttributes(self.leaseblockLayer().name);
        app.viewModel.updateAttributeLayers();
    };

    self.createWindScenario = function() {
        return $.ajax({
            url: '/features/scenario/form/',
            success: function(data) {
                self.scenarioForm(true);
                $('#scenario-form').html(data);
                self.scenarioFormModel = new scenarioFormModel();
                ko.applyBindings(self.scenarioFormModel, document.getElementById('scenario-form'));
                self.scenarioFormModel.updateDesignScrollBar();
                if ( ! self.leaseblockLayer() && app.viewModel.modernBrowser() ) {
                    self.scenarioFormModel.loadLeaseblockLayer();
                }
            },
            error: function (result) { debugger }
        });
    };     
    
    //
    self.addScenarioToMap = function(scenario, options) {
        var scenarioId,
            opacity;
        if ( scenario ) {
            scenarioId = scenario.uid;
            scenario.active(true);
            scenario.visible(true);
        } else {
            scenarioId = options.uid;
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
                } else {
                    opacity = .8;
                    stroke = 1;
                }
                var layer = new OpenLayers.Layer.Vector(
                    scenarioId,
                    {
                        projection: new OpenLayers.Projection('EPSG:3857'),
                        displayInLayerSwitcher: false,
                        styleMap: new OpenLayers.StyleMap({
                            fillColor: "#2F6A6C",
                            fillOpacity: opacity,
                            strokeColor: "#1F4A4C",
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
                    
                    scenario = new scenarioModel({
                        id: properties.uid,
                        uid: properties.uid,
                        name: properties.name, 
                        description: properties.description,
                        features: layer.features
                    });
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
                        },
                        error: function (result) {
                            debugger;
                        }
                    
                    });
                    
                    //in case of edit, removes previously stored scenario
                    //self.scenarioList.remove(function(item) { return item.uid === scenario.uid } );
                    
                    var previousScenario = ko.utils.arrayFirst(self.scenarioList(), function(oldScenario) {
                        return oldScenario.uid === scenario.uid;
                    });
                    if ( previousScenario ) {
                        self.scenarioList.replace( previousScenario, scenario );
                    } else {
                        self.scenarioList.push(scenario);
                    }
                    
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
    }
    
    //populates scenarioList
    self.loadScenarios = function (scenarios) {
        $.each(scenarios, function (i, scenario) {
            var scenarioViewModel = new scenarioModel({
                id: scenario.uid,
                uid: scenario.uid,
                name: scenario.name,
                description: scenario.description,
                attributes: scenario.attributes
            });
            self.scenarioList.push(scenarioViewModel);
            app.viewModel.layerIndex[scenario.uid] = scenarioViewModel;
        });
        self.scenariosLoaded = true;
    }
    
    self.leaseblockList = [];    
    
    //populates leaseblockList
    self.loadLeaseblocks = function (ocsblocks) {
        self.leaseblockList = ocsblocks;
    }   
    
    return self;
} // end scenariosModel


app.viewModel.scenarios = new scenariosModel();

$('#designsTab').on('show', function (e) {
    if ( !app.viewModel.scenarios.scenariosLoaded ) {
        // load the scenarios
        $.ajax({
            url: '/scenario/get_scenarios',
            type: 'GET',
            dataType: 'json',
            success: function (scenarios) {
                app.viewModel.scenarios.loadScenarios(scenarios);
            },
            error: function (result) {
                debugger;
            }
        })

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
        })
    }
});