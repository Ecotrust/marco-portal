if (typeof app === 'undefined') {
	app = {};
}

// TODO: same layer belongs to multiple themes
app.fixture = {
	state: {
		activeLayers: []
	},
	layers: [{
		name: "BOEM Protraction Diagram",
		type: "Vector",
		url: "data/vector/BOEMProtractionNoDecimals.json",
		id: 1
	}, {
		name: "Marine Jurisdictions",
		type: "XYZ",
		url: "",
		id: 2
	}, {
		name: "OCS Administrative Boundaries",
		type: "XYZ",
		url: "",
		id: 3
	}, {
		name: "OCS Blocks UTF",
		type: "XYZ",
		url: "https://s3.amazonaws.com/marco-public-2d/Test/ocsb2/ocsb/${z}/${x}/${y}.png",
		legend: "https://s3.amazonaws.com/marco-public-2d/Test/ocsb2/ocsb/Legend.png",
		id: 104
	}, {
		name: "Regional Ocean Councils",
		type: "XYZ",
		url: "",
		id: 5
	}, {
		name: "Benthic Habitats",
		type: "XYZ",
		url: "",
		id: 6
	}, {
		name: "Coldwater Corals",
		type: "XYZ",
		url: "",
		id: 7
	}, {
		name: "EFH Overlay",
		type: "XYZ",
		url: "",
		id: 8
	}, {
		name: "Essential Fish Habitat",
		type: "WMS",
		url: "http://egisws02.nos.noaa.gov/ArcGIS/services/NMFS/HAPC/MapServer/WMSServer?service=WMS",
		id: 101
	}, {
		name: "Marine Mammals and Sea Turtles",
		type: "XYZ",
		url: "",
		id: 9
	}, {
		name: "New Jersey Baseline Data",
		type: "XYZ",
		url: "",
		id: 10
	}, {
		name: "Seabed Form",
		type: "XYZ",
		url: "http://s3.amazonaws.com/marco-public-2d/Geophysical/SeabedForm/${z}/${x}/${y}.png",
		id: 11
	}, {
		name: "Waterbird Survey",
		type: "XYZ",
		url: "",
		id: 12
	}, {
		name: "Vulnerability to Sea Level Rise",
		type: "XYZ",
		url: "",
		id: 13
	}, {
		name: "U.S. Marine Protected Areas",
		type: "WMS",
		url: "http://egisws02.nos.noaa.gov/ArcGIS/services/MPA/MPA_Inventory/MapServer/WMSServer?service=WMS",
		id: 102
	}, {
		name: "Wind Speed",
		type: "XYZ",
		url: "https://s3.amazonaws.com/marco-public-2d/Energy/WindSpeed/${z}/${x}/${y}.png",
		legend: "https://s3.amazonaws.com/marco-public-2d/Energy/WindSpeed/Legend.png",
		id: 14
	}, {
		name: "Wind Energy Areas",
		type: "XYZ",
		url: "https://s3.amazonaws.com/marco-public-2d/Energy/WEA/${z}/${x}/${y}.png",
		utfurl: "data/utfgrids/weas/${z}/${x}/${y}.json",
		id: 114
	}, {
		name: "Fishing Effort",
		type: 'radio',
		id: 501,
		subLayers: [{
		name: "All Gear Types",
		type: "XYZ",
		url: "http://s3.amazonaws.com/marco-public-2d/Fishing/AllGearTypes/${z}/${x}/${y}.png",
		legend: "https://s3.amazonaws.com/marco-public-2d/Fishing/AllGearTypes/Legend.png",
		id: 15,
		parent: 501
	}, {
		name: "Bottom Gear Types",
		type: "XYZ",
		url: "http://s3.amazonaws.com/marco-public-2d/Fishing/BottomGearTypes/${z}/${x}/${y}.png",
		id: 16,
		parent: 501
	}, {
		name: "Pelagic Gear Types",
		type: "XYZ",
		url: "http://s3.amazonaws.com/marco-public-2d/Fishing/PelagicGearTypes/${z}/${x}/${y}.png",
		id: 17,
		parent: 501
	}, {
		name: "Summer Flounder Landings",
		type: "XYZ",
		url: "http://s3.amazonaws.com/marco-public-2d/Fishing/SummerFlounderLandings/${z}/${x}/${y}.png",
		id: 18,
		parent: 501
	}]
	}, {
		name: "Danger Zones",
		type: "XYZ",
		url: "",
		id: 19
	}, {
		name: "Oil and Gas Stipulations",
		type: "XYZ",
		url: "",
		id: 20
	}, {
		name: "Wind Stipulations",
		type: "XYZ",
		url: "",
		id: 21
	}, {
		name: "Bathymetry",
		type: "XYZ",
		url: "",
		id: 22
	}, {
		name: "Depth Contours",
		type: "XYZ",
		url: "",
		id: 23
	}, {
		name: "Major Canyons",
		type: "XYZ",
		url: "",
		id: 24
	}, {
		name: "Sediment Grain Size",
		type: "XYZ",
		url: "https://s3.amazonaws.com/marco-public-2d/Conservation/SedimentGrainSize/${z}/${x}/${y}.png",
		legend: "https://s3.amazonaws.com/marco-public-2d/Conservation/SedimentGrainSize/Legend.png",
		id: 25
	}, {
		name: "Artificial Reefs",
		type: "XYZ",
		url: "",
		id: 222
	}, {
		name: "Recreational Uses",
		type: "XYZ",
		url: "",
		id: 223
	}, {
		name: "AIS Shipping Density",
		type: "XYZ",
		url: "http://s3.amazonaws.com/marco-public-2d/Shipping/AISDensity/${z}/${x}/${y}.png",
		id: 224
	}, {
		name: "Dredging",
		type: "XYZ",
		url: "",
		id: 225
	}, {
		name: "Dredge Spoil Sites",
		type: "XYZ",
		url: "",
		id: 226
	}, {
		name: "Marina Construction",
		type: "XYZ",
		url: "",
		id: 227
	}, {
		name: "Maryland Shoals",
		type: "XYZ",
		url: "",
		id: 228
	}, {
		name: "Ports",
		type: "XYZ",
		url: "",
		id: 229
	}, {
		name: "Sand Mining",
		type: "XYZ",
		url: "",
		id: 230
	}, {
		name: "Ship Traffic Separation Zones",
		type: "XYZ",
		url: "",
		id: 231
	}, {
		name: "Submarine Cables",
		type: "Vector",
		url: "data/vector/SubmarineCablesNoDecimals.json",
		id: 232
	}],
	themes: [{
		name: "Administrative",
		id: 1,
		layers: [1, 2, 3, 104, 5]
	}, {
		name: "Conservation",
		id: 2,
		layers: [6, 7, 8, 101, 9, 10, 11, 12, 13, 102]
	}, {
		name: "Energy",
		id: 3,
		layers: [14, 114]
	}, {
		name: "Fishing",
		id: 4,
		layers: [501]
	}, {
		name: "Military",
		id: 5,
		layers: [19, 20, 21]
	}, {
		name: "Ocean",
		id: 6,
		layers: [22, 23, 24, 25]
	}, {
		name: "Recreation",
		id: 7,
		layers: [222, 223]
	}, {
		name: "Maritime Industries",
		id: 8,
		layers: [224, 225, 226, 227, 228, 229, 230, 231, 232]
	}]
};