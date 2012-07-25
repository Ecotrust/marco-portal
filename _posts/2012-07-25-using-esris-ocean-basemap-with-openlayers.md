---
layout: post
title: "Using ESRI's Ocean Basemap with OpenLayers"
description: ""
category: 
tags: []
---
{% include JB/setup %}
ESRI has produced a basemap that is perfect for use in marine projects.  ESRI's [Ocean Basemap](http://www.arcgis.com/home/item.html?id=6348e67824504fc9a62976434bf0d8d5) features beautiful cartography and includes marine placenames.  It is a natural fit for the MARCO planning tool and works well with [OpenLayers](http://openlayers.org/), the javascript web mapping library we are using for the project.

<style>
#map_container {
	height: 400px;
	width: 620px;
}
img.olTileImage {
    max-width: 256px !important;
}

</style>

<div id="map_container"> </div>
<br/>

Here is the javascript to use the Ocean Basemap with OpenLayers.

<script src="https://gist.github.com/3177975.js?file=map.js"> </script>

<script src="http://dev.marco.marineplanning.org/media/marco-proto/assets/openlayers/OpenLayers.js"> </script>

<script src="https://gist.github.com/raw/3177975/b9ea8ad227556d6235c3c9f86b5402367769e4df/map.js"> </script>

