// instantiate the viewmodel and load layers
var vm = new viewModel();
vm.loadLayers(app.fixture.layers);
vm.loadState(app.fixture.state)

test('loadLayers()', function () {
	equal(4, vm.themes.length, "Should have four themes");
});

test('loadState()', function () {
	// OCS Lease Blocks Should be Active
	var layer = vm.themes[1].layers[0];
	ok(layer.active(), "layer should be active");
})