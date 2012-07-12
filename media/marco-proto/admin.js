
var adminModel = function () {
	var self = this;

	// reference to currently edited layer
	self.activeLayer = ko.observable(false);

	// show admin menus
	self.adminMode = ko.observable(false);
	self.toggleAdmin = function () {
		self.adminMode(! self.adminMode());
	};

	self.addLayer = function () {
		self.activeLayer(new layerModel({
			name: null
		}));
		app.viewModel.showMapPanel(true);
	};

	self.editLayer = function (layer) {
		self.activeLayer($.extend({}, layer));
		app.viewModel.showMapPanel(true);
	};

	self.saveActiveLayer = function () {
		var layer = self.activeLayer(), postData, themes;

		// $.each(layer.themes(), function (index, theme) {
		// 	theme.layers.push(layer);
		// });

		// deref themes
		themes = $.map(layer.themes(), function (theme) {
					return theme.id;
				});

		postData = {
			themes: themes,
			name: layer.name(),
			url: layer.url()
		};

		$('.layer-modal').modal('hide');
		$.ajax({
		  type: 'POST',
		  url: '/data_viewer/layer',
		  data: postData,
		  traditional: true,
		  success: function () {
		  	debugger;
		  },
		  error: function () {
		  	debugger;
		  }
		});
	};

	return self;

};
