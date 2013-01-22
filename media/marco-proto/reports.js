
function reportsModel(options) {
    var self = this;

    self.getCollectionNames = function() {
        var names = [];
        var selections = app.viewModel.scenarios.selectionList();
        for (var i=0; i<selections.length; i++) {
            names.push(selections[i].name);
        }
        return names;
    };
    
    self.getSeriesData = function(key) {
        var data = [];
        var selections = app.viewModel.scenarios.selectionList();
        for (var i=0; i<selections.length; i++) {
            var vals = selections[i].scenarioReportValues[key];
            data.push({'low': vals.min, 'high': vals.max, 'avg': vals.avg, 'id': vals.selection_id});
        }
        return data;
    };
    
    self.showingReport = ko.observable(false);
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
    
    self.showWindReport = function() {
        var windReportOptions = {
            'title': {
                text: 'Wind Energy Potential'
            },
            'xAxis': {
                categories: self.getCollectionNames()
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
            'series': [{
                name: 'Wind Speed',
                data: self.getSeriesData('wind-speed')
            }]        
        };
        var options = $.extend({}, self.reportOptions, windReportOptions);
        self.createChart(options);
        self.showingReport(true);
    };
    
    self.showAWCReport = function() {
        var awcReportOptions = {
            'title': { 
                text: 'Distance to AWC Hubs' 
            },
            'xAxis': {
                categories: self.getCollectionNames()
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
            'series': [{
                name: 'Distance to AWC Hubs',
                data: self.getSeriesData('distance-to-awc')
            }]
        };
        var options = $.extend({}, self.reportOptions, awcReportOptions);
        self.createChart(options);
        self.showingReport(true);
    };
    
    self.showShorelineReport = function() {
        var shorelineOptions = {
            'title': { 
                text: 'Distance to Shore' 
            },
            'xAxis': {
                categories: self.getCollectionNames()
            },
            'yAxis': {
                title: {
                    text: 'Distance in miles'
                },
                min: 0,
                max: 50
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
            'series': [{
                name: 'Distance to Shoreline',
                data: self.getSeriesData('distance-to-shore')
            }]
        };
        var options = $.extend({}, self.reportOptions, shorelineOptions);
        self.createChart(options);
        self.showingReport(true);
    };
    
    self.showDepthReport = function() {
        var depthOptions = {
            'title': { 
                text: 'Depth Range' 
            },
            'xAxis': {
                categories: self.getCollectionNames()
            },
            'yAxis': {
                title: {
                    text: 'Depth in feet'
                },
                min: 0,
                max: 200
            },
            'tooltip': {
                valueSuffix: 'feet',
                formatter: function() {
                    return  'Depth Range: ' +
                            this.point.low + ' - ' +
                            this.point.high + ' feet' +
                            '<br/>Average Depth: ' + 
                            this.point.avg + ' feet'; 
              }
            },
            'series': [{
                name: 'Depth Range',
                data: self.getSeriesData('depth')
            }]
        };
        var options = $.extend({}, self.reportOptions, depthOptions);
        self.createChart(options);
        self.showingReport(true);
    };
    
    self.showShippingReport = function() {
        var shippingOptions = {
            'title': { 
                text: 'Distance to Shipping Lanes' 
            },
            'xAxis': {
                categories: self.getCollectionNames()
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
            'series': [{
                name: 'Distance to Shipping Lanes',
                data: self.getSeriesData('distance-to-shipping')
            }]
        };
        var options = $.extend({}, self.reportOptions, shippingOptions);
        self.createChart(options);
        self.showingReport(true);
    };
    
    
    self.createChart = function(options) {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'reports-container',
                type: 'columnrange',
                inverted: true
            },
            title: options.title,
            subtitle: options.subtitle,
            xAxis: options.xAxis,
            yAxis: options.yAxis,
            tooltip: options.tooltip,
            plotOptions: options.plotOptions,
            legend: options.legend,
            series: options.series,
            plotOptions: {
                series: {
                    point: {
                        events: {
                            click: function() {
                                var selection = app.viewModel.scenarios.getSelectionById(this.id);
                                if (selection) {
                                    selection.toggleActive();
                                }
                            },
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
                debugger;
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