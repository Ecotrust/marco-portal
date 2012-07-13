

// load layers from fixture or the server
app.viewModel.loadLayers = function (data) {
	var self = app.viewModel;

	// load layers
	$.each(data.layers, function (i, layer) {
		var layerViewModel = new layerModel(layer);
		self.layerIndex[layer.id] = layerViewModel;
	});

	// load themes
	$.each(data.themes, function (i, themeFixture) {
		var layers = [],
            theme = new themeModel(themeFixture);
		$.each(themeFixture.layers, function (j, layer_id) {
			// create a layerModel and add it to the list of layers
			var layer = self.layerIndex[layer_id], 
                searchTerm = layer.name + ' (' + themeFixture.name + ')';
            layer.themes.push(theme);
            theme.layers.push(layer);
            self.layerSearchIndex[searchTerm] = {layer: layer, theme: theme};
		});
		self.themes.push(theme);
	});
};

app.viewModel.loadLayersFromFixture = function () {
	app.viewModel.loadLayers(app.fixture);
};


app.viewModel.loadLayersFromServer = function () {
	$.getJSON('/data_viewer/get_json', function(data) {
	    app.viewModel.loadLayers(data);
	});	
};
