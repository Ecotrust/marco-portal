
var adminModel = function () {
	var self = this;

	// show admin menus
	// options are
	// 	   true --- base editing mode 
	//     "editLayer"
	//     "editTheme"
	self.adminMode = ko.observable(false);
	self.toggleAdmin = function () {
		if (self.adminMode()) {
			// toggle admin mode off
			self.adminMode(false);
			app.viewModel.showMapPanel(true);
		} else {		
			// toggle admin mode on
			self.adminMode(! self.adminMode());
			app.viewModel.showMapPanel(false);
		}
	};

	self.addLayer = function () {
		app.viewModel.activeLayer(new layerModel({}));
		self.layerForEditing($.extend({}, new layerModel({})));
		self.adminMode('editLayer');
	};

	self.layerForEditing = ko.observable();
	self.editLayer = function () {
		self.layerForEditing($.extend({}, app.viewModel.activeLayer()));
		self.adminMode('editLayer');
	};

	self.cancelEdit = function () {
		self.layerForEditing(false);
		self.adminMode(true);
	}

	self.saveActiveLayer = function () {
		var layer = self.layerForEditing(), postData, themes, url;

		if (layer.id) {
			// save existing layer
			url = '/data_viewer/layer/' + layer.id;
		} else {
			// create new layer
			url = '/data_viewer/layer'
		}
        
		// deref themes
		themes = $.map(layer.themes(), function (theme) {
					console.log(theme);
					return theme.id; 
				});
		postData = {
			themes: themes,
			name: layer.name,
			url: layer.url
		};
		
		// update the frontend
		//$.extend(app.viewModel.activeLayer(), self.layerForEditing());
		self.adminMode(true);
		$.ajax({
		   type: 'POST',
		   url: url,
		   data: postData,
		   traditional: true,
		   dataType: 'json',
		   success: function (data) {
		   		var newLayer = new layerModel(data.layer);
				$.each(layer.themes(), function (index, theme) {
					theme.layers.push(newLayer);
				});

			},
		   error: function () {
		   	console.log('error');
		   }
		});
	};

	return self;

};
