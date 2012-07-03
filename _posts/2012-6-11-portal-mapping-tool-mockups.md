---
layout: post
category: event
tags: [design, planner, catalog]
title: New Marco Marine Planner Mapping Tool Mockups
author: Tim Welch
---
{% include JB/setup %}

After an initial needs assessment the team has worked up some preliminary mockups for the Marco Marine Planner mapping tool.  Please be aware, these are a work in progress and  are not finalized.

In August, the entire MARCO Portal website will be getting a facelift, but the Marine Planner application is where things are getting interesting.  We're moving away from the ArcServer flex interface and using the Madrona framework developed by Ecotrust in addition to a suite of other libraries.  Take a look at the [technology]({{BASE_PATH}}/technology.html) page of this website to get a better understanding of how all of these different libraries are being used and follow along on the <a href="http://github.com/ecotrust/marco-portal">GitHub project page</a>.

<div class="row">
	<div class="span10">
		<div class="span3">
			<div class="thumbnail">
				<a href="{{BASE_PATH}}/assets/img/portal-front-page.png"><img src="{{BASE_PATH}}/assets/img/portal-front-page.png"/></a>
				<div class="attrib caption">Draft - MARCO Portal front page</div>
			</div>
		</div>
		<div class="span3">
			<div class="thumbnail">
				<a href="{{BASE_PATH}}/assets/img/mockup-data-catalog.png"><img src="{{BASE_PATH}}/assets/img/mockup-data-catalog.png"/></a>
				<div class="attrib caption">Draft - Data Catalog mockup.  NOAA CMSP Data Registry inspired</div>
			</div>
		</div>
		<div class="span3">
			<div class="thumbnail">
				<a href="{{BASE_PATH}}/assets/img/mockup-data-layers.png"><img src="{{BASE_PATH}}/assets/img/mockup-data-layers.png"/></a>
				<div class="attrib caption">Draft - Data layer panel with themes and grouping</div>
			</div>
		</div>		
	</div>
</div>

<div class="row">
	<div class="span10">
		<div class="span3">
			<div class="thumbnail">
				<a href="{{BASE_PATH}}/assets/img/mockup-designs-scenario.png"><img src="{{BASE_PATH}}/assets/img/mockup-designs-scenario.png"/></a>
				<div class="attrib caption">Draft - spatial filter feature</div>
			</div>
		</div>		
		<div class="span3">
			<div class="thumbnail">
				<a href="{{BASE_PATH}}/assets/img/mockup-designs-sharing.png"><img src="{{BASE_PATH}}/assets/img/mockup-designs-sharing.png"/></a>
				<div class="attrib caption">Draft - sharing designs.  Google Docs inspired</div>
			</div>
		</div>
		<div class="span3">
			<div class="thumbnail">
				<a href="{{BASE_PATH}}/assets/img/mockup-data-layers.png"><img src="{{BASE_PATH}}/assets/img/mockup-data-layers.png"/></a>
				<div class="attrib caption">Draft - Data layer panel</div>
			</div>
		</div>
	</div>
</div>

The MARCO Marine Planner Mapping Tool will be leveraging a lot of the functionality developed for Oregon MarineMap and the Washington Marine Planner including map bookmarks and spatial filtering (show me the areas that match my criteria).  The most notable difference is that with MARCO we'll be using a 2D mapping interface and we're taking additional strides to simplify the user interface, recognizing that the audience will be diverse and may not receive one-on-one training on how to use it. Approaches to simplification include themes (fishing, shipping, wind energy, etc.) and making it easier to work with large numbers of data layers.