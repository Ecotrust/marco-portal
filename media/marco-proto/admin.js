
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
	};

	self.saveActiveLayer = function () {
		var layer = self.activeLayer();
		$.each(layer.themes(), function (index, theme) {
			theme.layers.push(layer);
		});
		$('.layer-modal').modal('hide');
	};

	return self;

};