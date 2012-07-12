
// save the initial load hash so we can use it if set
app.hash = window.location.hash;

app.onResize = function() {
	var height = $(window).height() * .60;
	$("#map").height(height);
	$("#data-accordion").height(height);
	$("#legend-accordion").height(height);
	app.map.render('map');
};


// state of the app
app.state = {
	//list of active layer ids in order they appear on the map
	activeLayers: [],
	location: {}
}

// property to store the state of the map for restoring
app.restoreState = {};



app.viewModel = new viewModel();
app.viewModel.admin = new adminModel() || false;
app.viewModel.loadLayers(app.fixture);
ko.applyBindings(app.viewModel);


// initialize the map
app.init();
// Google.v3 uses EPSG:900913 as projection, so we have to
// transform our coordinates
app.map.setCenter(new OpenLayers.LonLat(-66.0, 41.5).transform(
	new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")), 6);		


// if we have the hash state go ahead and load it now
if (app.hash) {
	app.loadStateFromHash(app.hash);
}

$(document).ready(function () {
	app.onResize();
	$(window).resize(app.onResize);
	
	// autocomplete for filter
	$('.search-query').typeahead({
		source: function () {
            var keys = [];
            for (var searchTerm in app.viewModel.layerSearchIndex) {
                if (app.viewModel.layerSearchIndex.hasOwnProperty(searchTerm)) {
                    keys.push(searchTerm);
                }
            }
            return keys;
        }()
	});

	// handle coordinate indicator on pointer
	$('#map').bind('mouseleave mouseenter', function (e) {
		$('#pos').toggle();
	});
	$('#map').bind('mousemove', function (e) {
		$('#pos').css({
			left: e.pageX + 20,
			top: e.pageY + 20
		});
	});       
});

$(document).click(function (e) {
    if (e.target.id === "bookmarks-button") {
    } else if (!$(e.target).closest("#bookmark-popover").length) {
        $('#bookmark-popover').hide();
    }
});