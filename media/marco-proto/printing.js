var io = io || false;

(function () {
	var socket,
		socketUrl = 'http://localhost:8989';

	function printModel (map, viewModel) {
		var self = this;
		self.$popover = $('#printing-popover');
		// show print dialog
		self.showPrintDialog = function (vm, event) {
		    var width = $("#map-panel").width() + $("#legend:visible").width();

		    self.$button = $(event.target).closest('.btn');

		    // adjust the width depending on legend visibility
		    if ($("#legend").is(":visible")) {
		    	width = width + 60;
		    } else {
		    	width = width + 40;
		    }

		    // set some default options
		    self.shotHeight($(document).height());
		    self.shotWidth(width);
		    self.mapHeight($(document).height());

		    self.mapWidth(width);
		    self.thumbnail(false);
		    self.showLegend(app.viewModel.showLegend() || false);
		    self.ratio = self.shotHeight() / self.shotWidth();

		    if (self.$popover.is(":visible")) {
		        self.$popover.hide();
		    } else {
		        // hide the popover if already visible
		        self.jobStatus("Waiting for print/export to complete");
		        self.showSpinner(true);
		        self.thumbnail(false);
		        self.$popover.show().position({
		            "my": "right top",
		            "at": "left middle",
		            "of": self.$button,
		            offset: "0px -30px"
		        });
		    }
		};

		// print server is enabled, don't show button without it
		self.enabled = ko.observable(false);

		self.jobStatus = ko.observable();
		self.showSpinner = ko.observable();

		// job options
		self.format = ko.observable(".png");
		self.paperSize = ko.observable("letter");

		// final dimensions of image
		self.shotHeight = ko.observable();
		self.shotWidth = ko.observable();

		// working dimensions of map for rendering purposes
		self.mapHeight = ko.observable();
		self.mapWidth = ko.observable();

		// output options
		self.showLegend = ko.observable();
		self.borderLess = ko.observable(false);
		self.title = ko.observable();

		// job results
		self.download = ko.observable();
		self.thumbnail = ko.observable(false);

		// legend checkbox shows/hides real legend
		// update positon of popover
		self.showLegend.subscribe(function (newValue) {
			app.viewModel.showLegend(newValue);
			self.$popover.position({
			    "my": "right top",
			    "at": "left middle",
			    "of": self.$button,
			    offset: "0px -30px"
			});
		});


		
		// lock aspect ratio with these subscriptions
		self.shotHeight.subscribe(function (newVal) {
			var width = Math.round(newVal / self.ratio);
			if ($.isNumeric(width) && width !== self.shotWidth()) {
				self.shotWidth(width);		
			}
		});
		self.shotWidth.subscribe(function (newVal) {
			var height = Math.round(newVal * self.ratio);
			if ($.isNumeric(height) && height !== self.shotHeight()) {
				self.shotHeight(height);		
			}
		});
		
		// borderless turned on will disable title and legend
		self.borderLess.subscribe(function (newVal) {
			if (newVal === true) {
				self.showLegend(false);
				self.oldTitle = self.title();
				self.title(null);
			} else {
				if (self.oldTitle) {
					self.title(self.oldTitle);
				}
			}
		})

		// print button in result dialog
		self.print = function () {
			var w = window.open(self.thumbnail());
			setTimeout(function () {
				w.print();
				w.close();
			}, 500);
				
		};

		// handle export button in print popover
		self.sendJob = function (self, event) {
			var mapHeight, mapWidth;
			event.preventDefault();
			self.$popover.hide();
			$("#print-modal").modal('show');

			if (self.borderLess()) {
				mapHeight = $('#map-panel').height() - 4;
				mapWidth = $("#map-panel").width() + 10;
			} else {
				mapHeight = self.mapHeight();
				mapWidth = self.mapWidth();
			}

			socket.emit('shot', {
				hash: window.location.hash,
				screenHeight: $(document).height(),
				screenWidth: $(document).width(),
				shotHeight: self.shotHeight(),
				shotWidth: self.shotWidth(),
				mapHeight: mapHeight,
				mapWidth: mapWidth,
				title: self.title(),
				format: self.format(),
				borderless: self.borderLess(),
				userAgent: navigator.userAgent,
				paperSize: self.paperSize()
			}, function (data) {
				self.jobStatus("Job is Complete");
				self.showSpinner(false);
				self.thumbnail(data.path);
				self.download(data.download);
			});
		};

		// handle cancel is popover
		self.cancel = function () {
			self.$popover.hide();
		};

		// make sure we have a socket
		if (io !== false) {
			socket = io.connect(socketUrl);	
			self.enabled(true);
		} else {
			self.enabled(false);				
		}

	}
	var shots = {
		$popover: $("#printing-popover")	
	};
	app.viewModel.printing = new printModel(app.map, app.viewModel);
	
})();
