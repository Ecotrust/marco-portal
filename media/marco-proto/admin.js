
var adminModel = function () {
	var self = this;

	self.activeLayer = ko.observable(false);

	self.addLayer = function () {
		self.activeLayer(new layerModel({
			name: null
		}));
	}

	self.saveActiveLayer = function () {
		var layer = self.activeLayer();
		$.each(layer.themes(), function (index, theme) {
			theme.layers.push(layer);
		});
		$('.layer-modal').modal('hide');
	};

	return self;

};