

function topicsModel(options) {
    var self = this;       
    
    self.activeMapView = ko.observable();
    self.activeMapDescription = ko.observable();
    
    self.activeMapViewURL = ko.observable();
    
    self.setMapViewURL = function(urlHash) {
        debugger;
        var url = "http://portal.midatlanticocean.org/embed/map/#" + urlHash;
        self.activeMapViewURL(url);
    };
    
    self.toggleMapView = function(data, event) {
        $('.map-view-iframe').hide();
        
        $('#map-view-list .accordion-body.in').collapse('hide');
        $description = $('#'+event.currentTarget.id+'-description');
        $(self.activeMapDescription()).collapse('show');
        
        $map = $('#'+event.currentTarget.id+'-iframe');
        $map.show();
    };
    
    return self;
} // end topicsModel


    