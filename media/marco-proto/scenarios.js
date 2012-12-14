
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
};

function scenarioFormModel(options) {
    var self = this;
    
    self.leaseblocksLeft = ko.observable(app.viewModel.scenarios.leaseblockList.length);
    
    self.filters = {};
    
    self.updateFilters = function(object) {
        self.filters[object.key] = object.value;
    };
    self.removeFilter = function(key) {
        delete self.filters[key];
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
            }
            if (self.filters['max_distance'] && list[i].max_distance > self.filters['max_distance'] || 
                self.filters['min_distance'] && list[i].max_distance < self.filters['min_distance'] ) {
                addOne = false;
            } 
            if (self.filters['max_depth'] && list[i].max_depth > self.filters['max_depth'] || 
                self.filters['min_depth'] && list[i].min_depth < self.filters['min_depth'] ) {
                addOne = false;
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
            if (self.filters['awc'] && list[i].awc_min_distance > self.filters['awc'] || list[i].awc_min_distance === null ) {
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
    };
    
    return self;
}

function scenarioModel(options) {
    var self = this;

    self.id = options.uid;
    self.uid = options.uid;
    self.name = options.name;
    
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
        } else { // otherwise layer is not currently active, so activate
            scenario.activateLayer();
            //app.viewModel.scenarios.addScenarioToMap(scenario);
        }
    };
    
    self.activateLayer = function() {
        var scenario = this;
        app.viewModel.scenarios.addScenarioToMap(scenario);
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
    self.toggleVisible = function(manual) {
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
}


function scenariosModel(options) {
    var self = this;
    
    self.scenarioList = ko.observableArray();
    
    self.scenarioForm = ko.observable(false);
    
    // loading message for showing spinner
    // false for normal operation
    self.loadingMessage = ko.observable(false);
    self.errorMessage = ko.observable(false);

    //restores state of Designs tab to the initial list of designs
    self.reset = function () {
        self.loadingMessage(false);
        self.errorMessage(false);
        self.scenarioForm(false);
        var scenarioForm = document.getElementById('scenario-form');
        $(scenarioForm).empty();
        ko.cleanNode(scenarioForm);
        delete self.scenarioFormModel;
    };

    self.createWindScenario = function() {
        return $.ajax({
            url: '/features/scenario/form/',
            success: function(data) {
                self.scenarioForm(true);
                $('#scenario-form').html(data);
                self.scenarioFormModel = new scenarioFormModel();
                ko.applyBindings(self.scenarioFormModel, document.getElementById('scenario-form'));
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
    
    self.getOCSAttributes = function (title, data) {
        attrs = [];
        if ('BLOCK_LAB' in data) {
            attrs.push({'display': 'OCS Block Number', 'data': data['BLOCK_LAB']});
        }
        if ('PROT_NUMBE' in data) {
            attrs.push({'display': 'Protraction Number', 'data': data['PROT_NUMBE']});
        }
        if ('WINDREV_MI' in data && 'WINDREV_MA' in data) {
            attrs.push({'display': 'Wind Speed Range', 'data': data['WINDREV_MI'].toFixed(2) + ' to ' + data['WINDREV_MA'].toFixed(2) + ' m/s'});
        }
        if ('DEPTHM_MIN' in data && 'DEPTHM_MAX' in data) {
            //convert depth values to positive feet values (from negative meter values)
            var max_depth = (-data['DEPTHM_MAX'] * 3.2808399).toFixed(0);
            var min_depth = (-data['DEPTHM_MIN'] * 3.2808399).toFixed(0);
            attrs.push({'display': 'Depth Range', 'data': max_depth + ' to ' + min_depth + ' feet'});
        }
        if ('MI_MIN' in data && 'MI_MAX' in data) {
            attrs.push({'display': 'Miles to Shore', 'data': data['MI_MIN'].toFixed(0) + ' to ' + data['MI_MAX'].toFixed(0)});
        }
        if ('AWCMI_MIN' in data && 'AWCMI_MAX' in data) {
            attrs.push({'display': 'Miles to Proposed AWC Hub', 'data': data['AWCMI_MIN'].toFixed(0) + ' to ' + data['AWCMI_MAX'].toFixed(0)});
        }
        if ('TRSEP_MIN' in data && 'TRSEP_MAX' in data) {
            attrs.push({'display': 'Miles to Shipping Lanes', 'data': data['TRSEP_MIN'].toFixed(0) + ' to ' + data['TRSEP_MAX'].toFixed(0)});
        }
        if ('AIS7_MEAN' in data) {
            if ( data['AIS7_MEAN'] < 1 ) {
                var rank = 'Low';
            } else {
                var rank = 'High';
            }
            attrs.push({'display': 'Commercial Shipping Density', 'data': rank });
        }
        if ('WEA_NAME' in data) {
            if ( data['WEA_NAME'] !== "" ) {
                attrs.push({'display': 'Part of ' + data['WEA_NAME'] + ' WPA', 'data': null});
            }
        }
        return attrs;
    };
            
    //populates scenarioList
    self.loadScenarios = function (scenarios) {
        $.each(scenarios, function (i, scenario) {
            var scenarioViewModel = new scenarioModel({
                id: scenario.uid,
                uid: scenario.uid,
                name: scenario.name,
                attributes: scenario.attributes
            });
            self.scenarioList.push(scenarioViewModel);
            app.viewModel.layerIndex[scenario.uid] = scenarioViewModel;
        });
    }
    
    self.leaseblockList = [];    
    
    //populates leaseblockList
    self.loadLeaseblocks = function (ocsblocks) {
        self.leaseblockList = ocsblocks;
    }   
    
    return self;
}


app.viewModel.scenarios = new scenariosModel();

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
