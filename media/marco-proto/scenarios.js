
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

    self.features = options.features;
    
    self.active = ko.observable(false);
    self.visible = ko.observable(false);
    
    self.toggleActive = function(self, event) {
        var scenario = this;
        //app.viewModel.activeLayer(layer);
        if (scenario.active()) { // if layer is active, then deactivate
            scenario.active(false);
            scenario.visible(false);
            app.setLayerVisibility(scenario, false);
            console.log('toggle off');
            console.dir(scenario);
        } else { // otherwise layer is not currently active, so activate
            //scenario.activateLayer();
            app.viewModel.scenarios.addScenarioToMap(scenario);
            console.log('toggle on');
            console.dir(scenario);
        }
    };
    
    self.deleteDesign = function() {
        var design = this;
        
        //remove from app.map
        if (design.layer) {
            app.map.removeLayer(design.layer);
        }
        //remove from scenarioList
        app.viewModel.scenarios.scenarioList.remove(design);
        
        //remove from server-side db (this should provide error message to the user on fail)
        $.ajax({
            url: '/scenario/delete_scenario/' + design.id + '/',
            type: 'POST',
            error: function (result) {
                debugger;
            }
        })
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
        var scenarioId;
        if ( !scenario ) {
            scenarioId = options.uid;
        } else {
            scenarioId = scenario.uid;
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
                            fillOpacity: .8,
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
                    scenario.active(true);
                    scenario.visible(true);
                } else { //create new scenario
                    //only do the following if creating a scenario
                    var properties = feature.features[0].properties;
                    scenario = new scenarioModel({
                        id: properties.id,
                        uid: properties.uid,
                        name: properties.name, 
                        features: layer.features
                    });
                    scenario.layer = layer;
                    scenario.active(true);
                    scenario.visible(true);
                    self.scenarioList.push(scenario);
                    self.scenarioForm(false);
                }
                
                //app.addVectorAttribution(layer);
                app.map.addLayer(scenario.layer); 
                
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
                name: scenario.name
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
