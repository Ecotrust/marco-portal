// load layers from fixture or the server
app.viewModel.loadLayers = function(data) {
	var self = app.viewModel;
	// load layers
	$.each(data.layers, function(i, layer) {
		var layerViewModel = new layerModel(layer);

		self.layerIndex[layer.id] = layerViewModel;
		// add sublayers if they exist
		if (layer.subLayers) {
			$.each(layer.subLayers, function(i, layer_options) {
				var subLayer = new layerModel(layer_options, layerViewModel);
				app.viewModel.layerIndex[subLayer.id] = subLayer;
				layerViewModel.subLayers.push(subLayer);
			});
		}
	});

	// load themes
	$.each(data.themes, function(i, themeFixture) {
		var layers = [],
			theme = new themeModel(themeFixture);
		$.each(themeFixture.layers, function(j, layer_id) {
			// create a layerModel and add it to the list of layers
			var layer = self.layerIndex[layer_id],
				searchTerm = layer.name + ' (' + themeFixture.name + ')';
			layer.themes.push(theme);
			theme.layers.push(layer);
			self.layerSearchIndex[searchTerm] = {
				layer: layer,
				theme: theme
			};
			if (layer.subLayers) {
				$.each(layer.subLayers, function(i, subLayer) {
					var searchTerm = layer.name + ' / ' + subLayer.name + ' (' + themeFixture.name + ')';
					self.layerSearchIndex[searchTerm] = {
						layer: subLayer,
						theme: theme
					};
				});
			}

		});
		self.themes.push(theme);
	});
	app.typeAheadSource = (function () {
            var keys = [];
            for (var searchTerm in app.viewModel.layerSearchIndex) {
                if (app.viewModel.layerSearchIndex.hasOwnProperty(searchTerm)) {
                    keys.push(searchTerm);
                }
            }
            return keys;
        })();
    // autocomplete for filter
    $(document).ready(function () {    	
	    $('.search-box').typeahead({
	    	source: app.typeAheadSource 
	    });
    });

};
app.viewModel.loadLayersFromFixture = function() {
	app.viewModel.loadLayers(app.fixture);
};


app.viewModel.loadLayersFromServer = function() {
	$.getJSON('/data_manager/get_json', function(data) {
		app.viewModel.loadLayers(data);
	});
};