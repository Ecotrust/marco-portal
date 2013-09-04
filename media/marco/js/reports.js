
function reportsModel(options) {
    var self = this;
    
    self.getCollectionNames = function() {
        var names = [];
        
        //maintains the order presented under the Selections accordion
        var selections = app.viewModel.scenarios.selectionList();
        for (var i=0; i<selections.length; i++) {
            if ( selections[i].active() ) {
                names.push(selections[i].name);
            }
        }
        return names;
    };
    
    self.getSeriesData = function(key) {
        var data = [];
        //var selections = app.viewModel.scenarios.selectionList();
        //var selections = app.viewModel.scenarios.activeSelections();
        var selections = app.viewModel.scenarios.selectionList();
        for (var i=0; i<selections.length; i++) {
            if ( selections[i].active() ) {
                var vals = selections[i].scenarioReportValues[key];
                if (vals) {
                    data.push({'low': vals.min, 'high': vals.max, 'avg': vals.avg, 'id': vals.selection_id});
                }
            }
        }
        return data;
    };
    
    self.showingReport = ko.observable(false);
    self.noActiveCollections = ko.observable(true);
    self.noActiveCollections.subscribe( function() {
        if ( self.noActiveCollections() === true ) {
            self.showingReport(false);
        } 
    });
    /*
    self.reportOptions = {
        'plotOptions': {
            columnrange: {
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return this.y;
                    }
                }
            }
        },
        'legend': {
            enabled: false
        }
    };
    */
    
    self.hideReport = function() {
        self.showingReport(false);
    };
        
    self.showWindReport = function() {
        var windReportOptions = {
            'title': {
                text: 'Wind Energy Potential'
            },
            'yAxis': {
                title: {
                    text: 'Average Annual Wind Speed (m/s)'
                },
                min: 7.5,
                max: 9.5
            },
            'tooltip': {
                valueSuffix: 'm/s',
                formatter: function() {
                    return  'Estimated Wind Speed: ' +
                            this.point.low + ' - ' +
                            this.point.high + ' m/s' +
                            '<br/>Average Speed: ' + 
                            this.point.avg + ' m/s'; 
                }
            },
            'seriesName': 'Wind Speed',
            'seriesStub': 'wind-speed'
        };
        //var options = $.extend({}, self.reportOptions, windReportOptions);
        //self.createChart(options);
        self.reportOptions = windReportOptions;
        self.createChart(windReportOptions);
    };
    
    self.showSubstationReport = function() {
        var awcReportOptions = {
            'title': { 
                text: 'Distance to Coastal Substations' 
            },
            'yAxis': {
                title: {
                    text: 'Distance in miles'
                },
                min: 0,
                max: 100
            },
            'tooltip': {
                valueSuffix: 'miles',
                formatter: function() {
                    return  'Distance to Coastal Substation: ' +
                            this.point.low + ' - ' +
                            this.point.high + ' miles' +
                            '<br/>Average Distance: ' + 
                            this.point.avg + ' miles'; 
              }
            },
            'seriesName': 'Distance to Coastal Substation',
            'seriesStub': 'distance-to-substation'
        };
        //var options = $.extend({}, self.reportOptions, awcReportOptions);
        //self.createChart(options);
        self.reportOptions = awcReportOptions;
        self.createChart(awcReportOptions);
    };
    
    self.showAWCReport = function() {
        var awcReportOptions = {
            'title': { 
                text: 'Distance to AWC Hubs' 
            },
            'yAxis': {
                title: {
                    text: 'Distance in miles'
                },
                min: 0,
                max: 100
            },
            'tooltip': {
                valueSuffix: 'miles',
                formatter: function() {
                    return  'Distance to AWC Hub: ' +
                            this.point.low + ' - ' +
                            this.point.high + ' miles' +
                            '<br/>Average Distance: ' + 
                            this.point.avg + ' miles'; 
              }
            },
            'seriesName': 'Distance to AWC Hubs',
            'seriesStub': 'distance-to-awc'
        };
        //var options = $.extend({}, self.reportOptions, awcReportOptions);
        //self.createChart(options);
        self.reportOptions = awcReportOptions;
        self.createChart(awcReportOptions);
    };
    
    self.showShorelineReport = function() {
        var shorelineOptions = {
            'title': { 
                text: 'Distance to Shore' 
            },
            'yAxis': {
                title: {
                    text: 'Distance in miles'
                },
                min: 0,
                max: 65
            },
            'tooltip': {
                valueSuffix: 'miles',
                formatter: function() {
                    return  'Distance to Shoreline: ' +
                            this.point.low + ' - ' +
                            this.point.high + ' miles' +
                            '<br/>Average Distance: ' + 
                            this.point.avg + ' miles'; 
              }
            },
            'seriesName': 'Distance to Shoreline',
            'seriesStub': 'distance-to-shore'
        };
        //var options = $.extend({}, self.reportOptions, shorelineOptions);
        //self.createChart(options);
        self.reportOptions = shorelineOptions;
        self.createChart(shorelineOptions);
    };
    
    self.showDepthReport = function() {
        var depthOptions = {
            'title': { 
                text: 'Depth Range' 
            },
            'yAxis': {
                title: {
                    text: 'Depth in meters'
                },
                min: 0,
                max: 100
            },
            'tooltip': {
                valueSuffix: 'meters',
                formatter: function() {
                    return  'Depth Range: ' +
                            this.point.low + ' - ' +
                            this.point.high + ' meters' +
                            '<br/>Average Depth: ' + 
                            this.point.avg + ' meters'; 
              }
            },
            'seriesName': 'Depth Range',
            'seriesStub': 'depth'
        };
        //var options = $.extend({}, self.reportOptions, depthOptions);
        //self.createChart(options);
        self.reportOptions = depthOptions;
        self.createChart(depthOptions);
    };
    
    self.showShippingReport = function() {
        var shippingOptions = {
            'title': { 
                text: 'Distance to Ship Routing Measures' 
            },
            'yAxis': {
                title: {
                    text: 'Distance in miles'
                },
                min: 0,
                max: 100
            },
            'tooltip': {
                valueSuffix: 'miles',
                formatter: function() {
                    return  'Distance: ' +
                            this.point.low + ' - ' +
                            this.point.high + ' miles' +
                            '<br/>Average Distance: ' + 
                            this.point.avg + ' miles'; 
              }
            },
            'seriesName': 'Distance to Ship Routing Measures',
            'seriesStub': 'distance-to-shipping'
        };
        //var options = $.extend({}, self.reportOptions, shippingOptions);
        //self.createChart(options);
        self.reportOptions = shippingOptions;
        self.createChart(shippingOptions);
    };
    
    self.updateChart = function() {
        if (self.reportOptions) {
            self.createChart(self.reportOptions);
        }
    };
    
    self.createChart = function(options) {
        if (app.viewModel.scenarios.activeSelections().length > 0) {
            self.noActiveCollections(false);
            self.showingReport(true);
        } else {
            $('#comparison-report-flash-instructions').effect("highlight", {}, 1000);
            self.noActiveCollections(true);
            return;
        }
        var draftTitle = {text: options.title.text};
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'reports-container',
                type: 'columnrange',
                inverted: true
            },
            credits: {
                enabled: false
            },
            title: draftTitle,
            subtitle: options.subtitle,
            xAxis: {
                categories: self.getCollectionNames()
            },
            //xAxis: options.xAxis,
            yAxis: options.yAxis,
            tooltip: options.tooltip,
            plotOptions: {
                columnrange: {
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return this.y;
                        }
                    }
                }
            },
            legend: {
                enabled: false
            },
            //plotOptions: options.plotOptions,
            //legend: options.legend,
            series: [{
                name: options.seriesName,
                data: self.getSeriesData(options.seriesStub)
            }],        
            //series: options.series,
            plotOptions: {
                series: {
                    point: {
                        events: {
                            mouseOver: function() {
                                var selection = app.viewModel.scenarios.getSelectionById(this.id);
                                if (selection && selection.layer) {
                                    selection.layer.styleMap.styles['default'].defaultStyle.strokeColor = '#0ff';
                                    selection.layer.redraw();
                                }
                            },
                            mouseOut: function() {
                                var selection = app.viewModel.scenarios.getSelectionById(this.id);
                                if (selection && selection.layer) {
                                    selection.layer.styleMap.styles['default'].defaultStyle.strokeColor = '#00265F';  
                                    selection.layer.redraw(); 
                                }                         
                            }
                        }
                    }
                }
            }
                           
        });
        var width = 385,
            height = 90 + app.viewModel.scenarios.activeSelections().length * 60;
        if (height > 500) { 
            height = 500;
        }
        chart.setSize(width, height);
    };

}

app.viewModel.scenarios.reports = new reportsModel();


$('#reportsTab').on('show', function (e) {
    if ( !app.viewModel.scenarios.scenariosLoaded || !app.viewModel.scenarios.selectionsLoaded) {
        // load the scenarios
        $.ajax({
            url: '/scenario/get_scenarios',
            type: 'GET',
            dataType: 'json',
            success: function (scenarios) {
                app.viewModel.scenarios.loadScenarios(scenarios);
                app.viewModel.scenarios.scenariosLoaded = true;
            },
            error: function (result) {
                //debugger;
            }
        });
        
        // load the selections
        $.ajax({
            url: '/scenario/get_selections',
            type: 'GET',
            dataType: 'json',
            success: function (selections) {
                app.viewModel.scenarios.loadSelections(selections);
                app.viewModel.scenarios.selectionsLoaded = true;
            },
            error: function (result) {
                //debugger;
            }
        });

        // load the leaseblocks
        $.ajax({
            url: '/scenario/get_leaseblocks',
            type: 'GET',
            dataType: 'json',
            success: function (ocsblocks) {
                app.viewModel.scenarios.loadLeaseblocks(ocsblocks);
            },
            error: function (result) {
                //debugger;
            }
        });
    }
});