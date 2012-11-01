

(function () {
	var socket = io.connect('http://localhost:8989');

	function printModel (map, viewModel) {
		var self = this;
		self.$popover = $('#printing-popover');
		// show print dialog
		self.showPrintDialog = function (vm, event) {
		    var $button = $(event.target).closest('.btn');

		    self.shotHeight($(document).height());
		    self.shotWidth($(document).width());

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
		            "of": $button,
		            offset: "0px -10px"
		        });
		    }
		};

		self.thumbnail = ko.observable(false);
		self.jobStatus = ko.observable();
		self.showSpinner = ko.observable();
		self.format = ko.observable(".png");
		self.shotHeight = ko.observable();
		self.shotWidth = ko.observable();
		self.title = ko.observable();

		self.print = function () {
			var w = window.open(self.thumbnail());
			w.print();
			w.close();
		};

		self.sendJob = function (self, event) {
			var width = $("#map-panel").width() + $("#legend:visible").width();

			if ($("#legand").is(":visible")) {
				width = width + 40;
			} else {
				width = width + 40;
			}

			event.preventDefault();
			self.$popover.hide();
			$("#print-modal").modal('show');
			socket.emit('shot', {
				hash: window.location.hash,
				screenHeight: $(document).height(),
				screenWidth: $(document).width(),
				shotHeight: self.shotHeight(),
				shotWidth: width,
				title: self.title(),
				format: self.format()
			}, function (data) {
				self.jobStatus("Job is Complete");
				self.showSpinner(false);
				self.thumbnail(data.path);
			});
		};

		self.cancel = function () {
			self.$popover.hide();
		};
		self.text = ko.observable('try');
	}
	var shots = {
		$popover: $("#printing-popover")	
	};
	app.viewModel.printing = new printModel(app.map, app.viewModel);
	
})();
