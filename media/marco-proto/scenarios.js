
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
                        app.viewModel.scenarios.scenarioForm(result.responseText);
                    } else {
                        app.viewModel.scenarios.errorMessage(result.responseText.split('\n\n')[0]);
                    }
                }
            });
        }); 
    }
};


function scenarioModel(options) {
    var self = this;

    self.id = options.id;
    self.uid = options.uid;
    self.name = options.name;
    
    self.attributes = options.attributes ? options.attributes.attributes : [];

    self.features = options.features;
    
    self.active = ko.observable(false);
    self.visible = ko.observable(false);
    self.defaultOpacity = options.opacity || 0.8;
    self.opacity = ko.observable(self.defaultOpacity);
    
    self.toggleActive = function(self, event) {
        var scenario = this;
        //app.viewModel.activeLayer(layer);
        if (scenario.active()) { // if layer is active, then deactivate
            scenario.active(false);
            scenario.visible(false);
            app.setLayerVisibility(scenario, false);
            app.viewModel.activeLayers.remove(scenario);
            console.log('toggle off');
            console.dir(scenario);
        } else { // otherwise layer is not currently active, so activate
            //scenario.activateLayer();
            app.viewModel.scenarios.addScenarioToMap(scenario);
            console.log('toggle on');
            console.dir(scenario);
        }
    };
    
    self.editScenario = function() {
        var scenario = this;
        return $.ajax({
            url: '/features/scenario/' + scenario.uid + '/form/', 
            success: function(data) {
                app.viewModel.scenarios.scenarioForm(data);
            },
            error: function (result) { 
                debugger; 
            }
        });
    }; 
        
    self.deleteScenario = function() {
        var scenario = this;
        
        //remove from app.map
        if (scenario.layer) {
            app.map.removeLayer(scenario.layer);
        }
        //remove from scenarioList
        app.viewModel.scenarios.scenarioList.remove(scenario);
        
        //remove from server-side db (this should provide error message to the user on fail)
        $.ajax({
            url: '/scenario/delete_scenario/' + scenario.id + '/',
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
        
        if (scenario.visible()) { //make invisilbe
            scenario.visible(false);
            app.setLayerVisibility(scenario, false);
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
    };

    self.createWindScenario = function() {
        return $.ajax({
            url: '/features/scenario/form/',
            success: function(data) {
                self.scenarioForm(data);
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
            opacity = scenario.opacity();
            scenario.active(true);
            scenario.visible(true);
        } else {
            scenarioId = options.uid;
            opacity = .8;
        }
        
        $.ajax( {
            url: '/features/generic-links/links/geojson/' + scenarioId + '/', 
            type: 'GET',
            dataType: 'json',
            success: function(feature) {
                var layer = new OpenLayers.Layer.Vector(
                    scenarioId,
                    {
                        projection: new OpenLayers.Projection('EPSG:3857'),
                        displayInLayerSwitcher: false,
                        styleMap: new OpenLayers.StyleMap({
                            fillColor: "#2F6A6C",
                            fillOpacity: opacity,
                            strokeColor: "#1F4A4C",
                            strokeOpacity: 1
                        }),     
                        //style: OpenLayers.Feature.Vector.style['default'],
                        scenarioModel: scenario
                    }
                );
                
                layer.addFeatures(new OpenLayers.Format.GeoJSON().read(feature));
                
                if ( scenario ) {
                    scenario.layer = layer;
                } else { //create new scenario
                    //only do the following if creating a scenario
                    var properties = feature.features[0].properties;
                    //HOW TO GET ATTRIBUTES? 
                    //ANOTHER CALL TO SERVER?
                    scenario = new scenarioModel({
                        id: properties.id,
                        uid: properties.uid,
                        name: properties.name, 
                        features: layer.features
                    });
                    scenario.layer = layer;
                    scenario.active(true);
                    scenario.visible(true);
                    //in case of edit, removes previously stored scenario
                    self.scenarioList.remove(function(item) { return item.uid === scenario.uid } );
                    self.scenarioList.push(scenario);
                    self.scenarioForm(false);
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
            self.scenarioList.push(new scenarioModel({
                id: scenario.id,
                uid: scenario.uid,
                name: scenario.name,
                attributes: scenario.attributes
            }));
        });
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
