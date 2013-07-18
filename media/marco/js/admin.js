var adminModel = function() {
		var self = this;

		self.adminMode = ko.observable(false);

		self.objectForEditing = ko.observable();
		self.activeObject = ko.observable();

		self.toggleAdmin = function() {
			if (self.adminMode()) {
				// toggle admin mode off
				self.adminMode(false);
				app.viewModel.showMapPanel(true);
			} else {
				// toggle admin mode on
				self.adminMode(!self.adminMode());
				app.viewModel.showMapPanel(false);
			}
		};

		self.addLayer = function() {
			self.activeObject(new layerModel({}));
			self.objectForEditing($.extend({}, new layerModel({})));
			self.adminMode('editLayer');
		};

		self.editLayer = function(layer) {
			self.activeObject(layer);
			self.objectForEditing($.extend({}, layer));
			self.adminMode('editLayer');
		};

		self.editTheme = function(theme) {

		};

		self.cancelEdit = function() {
			self.objectForEditing(false);
			self.adminMode(true);
		};

		self.saveActiveLayer = function() {
			var layer = self.objectForEditing(),
				postData, themes, url, update = false,
				oldLayerActive = false;
			if (layer.id) {
				// save existing layer
				url = '/data_manager/layer/' + layer.id;
				update = true;
				oldLayerActive = layer.active();
			} else {
				// create new layer
				url = '/data_manager/layer';
			}

			// deref themes
			themes = $.map(layer.themes(), function(theme) {
				return theme.id;
			});
			postData = {
				themes: themes,
				name: layer.name,
				url: layer.url
			};

			self.adminMode(true);
			$.ajax({
				type: 'POST',
				url: url,
				data: postData,
				traditional: true,
				dataType: 'json',
				success: function(data) {
					var newLayer = new layerModel(data.layer);

					if (oldLayerActive) {
						// edited layer was active, keep it active
						newLayer.activateLayer();
					}

					// updating, remove from existing themes
					if (update) {
						$.each(app.viewModel.themes(), function(index, theme) {
							theme.layers.remove(self.activeObject());
						});
					}

					$.each(layer.themes(), function(index, theme) {
						theme.layers.unshift(newLayer);
					});

				},
				error: function() {
					console.log('error');
				}
			});
		};

		return self;

	};