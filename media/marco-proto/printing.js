var io = io || false;

(function () {
	var socket;

	function printModel (map, viewModel) {
		var self = this;
		self.$popover = $('#printing-popover');
		// show print dialog
		self.showPrintDialog = function (vm, event) {
		    var width = $("#map-panel").width() + $("#legend:visible").width();

		    self.$button = $(event.target).closest('.btn');

		    if ($("#legend").is(":visible")) {
		    	width = width + 90;
		    } else {
		    	width = width + 40;
		    }

		    self.shotHeight($(document).height());
		    self.mapHeight($(document).height());
		    self.shotWidth(width);
		    self.mapWidth(width);
		    self.thumbnail(false);
		    self.showLegend(app.viewModel.showLegend());
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
		self.enabled = ko.observable(false);
		self.download = ko.observable();
		self.thumbnail = ko.observable(false);
		self.jobStatus = ko.observable();
		self.showSpinner = ko.observable();
		self.format = ko.observable(".png");
		self.shotHeight = ko.observable();
		self.shotWidth = ko.observable();
		self.mapHeight = ko.observable();
		self.mapWidth = ko.observable();
		self.showLegend = ko.observable();
		self.title = ko.observable();


		self.showLegend.subscribe(function (newValue) {
			app.viewModel.showLegend(newValue);
			self.$popover.position({
			    "my": "right top",
			    "at": "left middle",
			    "of": self.$button,
			    offset: "0px -30px"
			});
		});


		// self.shotWidth.subscribe(function (newVal) {
		// 	self.shotHeight(newVal * self.ratio);
		// });
		self.shotHeight.subscribe(function (newVal) {
			var width = Math.floor(newVal / self.ratio);
			if ($.isNumeric(width) && width !== self.shotWidth()) {
				self.shotWidth(width);		
			}
		});
		self.print = function () {
			var w = window.open(self.thumbnail());
			setTimeout(function () {
				w.print();
				w.close();
			}, 500);
				
		};

		self.sendJob = function (self, event) {
		
			event.preventDefault();
			self.$popover.hide();
			$("#print-modal").modal('show');
			socket.emit('shot', {
				hash: window.location.hash,
				screenHeight: $(document).height(),
				screenWidth: $(document).width(),
				shotHeight: self.shotHeight(),
				shotWidth: self.shotWidth(),
				mapHeight: self.mapHeight(),
				mapWidth: self.mapWidth(),
				title: self.title(),
				format: self.format()
			}, function (data) {
				self.jobStatus("Job is Complete");
				self.showSpinner(false);
				self.thumbnail(data.path);
				self.download(data.download);
			});
		};

		self.cancel = function () {
			self.$popover.hide();
		};

		if (io !== false) {
			socket = io.connect('http://localhost:8989');	
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
