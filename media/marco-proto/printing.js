

(function () {
	var socket = io.connect('http://localhost:8989');
	
	function printModel (map, viewModel) {
		var self = this;
		self.$popover = $('#printing-popover');
		// show print dialog
		self.showPrintDialog = function (vm, event) {
		    var $button = $(event.target).closest('.btn');
		        
		    if (self.$popover.is(":visible")) {
		        self.$popover.hide();
		    } else {
		        // hide the popover if already visible
		        self.$popover.show().position({
		            "my": "right middle",
		            "at": "left middle",
		            "of": $button,
		            offset: "-10px 0px"
		        });
		    }
		};

		self.thumbnail = ko.observable(false);
		self.jobStatus = ko.observable("Waiting for print/export to complete");
		self.showSpinner = ko.observable(true);

		self.print = function (self, event) {
			var height = $('#map-wrapper').height(),
				width = $('#map-wrapper').width();
			event.preventDefault();
			self.$popover.hide();
			$("#print-modal").modal('show');
			socket.emit('shot', {
				hash: window.location.hash,
				height: height,
				width: width
			}, function (data) {
				window.open(data.path,'MARCO Print','height='+height/2+',width='+width/2);	
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
