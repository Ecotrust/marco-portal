---
layout: page
title: Technology  
---
{% include JB/setup %}

<div class="row">
	<div class="span6">
		<h2>Overview</h2>			
		<div class="well">
			<p>There are 3 main components to the MARCO Portal:
				<ul>
					<li>Portal website</li>
					<li>Marine Planner</li>
					<li>Data Catalog</li>
				</ul>	
			</p>
		</div>
	</div>
	<div class="span9">
	<p>
		The Portal website is hosted using the Wordpress platform.  The Marine Planner and Data Catalog are separate applications integrated into the website and are described in more detail below.  The code is available for all three and you can watch the ongoing development on the <a href="http://github.com/ecotrust/marco-portal">GitHub project site</a>.  If you have any questions or are interested in learning about or using any of the technology please contact Tim Welch at Ecotrust, 503-467-0786.
	</p>
	<h2>MARCO Marine Planner</h2>
	<p>The Marine Planner application is a decision support tool for state, federal, and local decision-makers and the public to visualize, query, map, and analyze ocean and coastal data in the Mid-Atlantic region.</p>
	<p>The <a href="midatlanticocean.org/map_portal.html">current version</a> of the Portal was developed using ArcServer and the ArcGIS viewer for Flex.  While it functions well as a data viewer we recognized it isn't designed for collaborative decision support.  There is no notion of user accounts, groups, private data, sharing, etc.  The decision was made to continue to leverage the excellent ESRI basemaps but to develop an enhanced Marine Planner application using the Madrona framework.  This enhanced portal will be introduced with release 2 of the MARCO Portal.</p>
	</div>
</div>
<div class="row">
	<div class="span9">
		<h3>Server-side libraries</h3>
		<p>Madrona is primarily a server-side framework built on top of the Django framework.  It provides a number of features tailored for spatial planning including a powerful spatial CMS with a full REST API and support for sharing between users and groups.  PostGIS is used as the backend database.  Other server-side libraries will be integrated as needed for spatial analysis and reporting features.</p>
	</div>	
	<div class="span12">
		<div class="row blocks">			
			<div class="span3">
				<div class="well">
					<a name="Madrona"> </a>
					<h3>Madrona</h3>
					<a href="http://madrona.ecotrust.org">Learn More</a>
					<p>
						<ul>
							<li>Spatial CMS</li>							
							<li>Collaboration</li>
							<li>Map Bookmarks</li>
							<li>Data Layer management</li>
							<li>Spatial Analysis</li>
							<li>Reports</li>
						</ul>
					</p>
				</div>
			</div>
			<div class="span3">
				<div class="well">
					<a name="Django"> </a>
					<h3>Django</h3>
					<a href="http://www.djangoproject.com">Learn More</a>
					<p>
						<ul>
							<li>Model-Template-View architecture</li>
							<li>Automatic admin interface</li>
							<li>Elegant URL design</li>
							<li>Template system</li>
							<li>Caching</li>
							<li>Internationalization</li>
							<li>User accounts and groups</li>
							<li>Content management</li>
							<li><a href="http://djangopackages.com/">Third-party packages</a></li>
						</ul>
					</p>
				</div>
			</div>
			<div class="span3">
				<div class="well">
					<a name="GeoDjango"> </a>
					<h3>GeoDjango</h3>
					<a href="http://geodjango.org/">Learn More</a>
					<p>
						<ul>
							<li>PostGIS support</li>
							<li>Geographic models</li>
							<li>Object-oriented spatial queries</li>
							<li>GEOS Python API</li>
							<li>GDAL Python API</li>
						</ul>
					</p>
				</div>
			</div>			
			<div class="span3">
				<div class="well">
					<a name="PostGIS"> </a>
					<h3>PostGIS</h3>
						<a href="http://postgis.refractions.net/ ">Learn More</a>
					<p>
						<ul>
							<li>Vector and raster support</li>
							<li>First-class geographic data types</li>
							<li>Full spatial query support</li>
							<li>GiST indexing</li>
						</ul>
					</p>
				</div>
			</div>
		</div>
		<div class="span9">
			<h3>Client-side libraries</h3>
			<p>The Madrona framework gives us the flexibility to use whatever technology we want.  For this particular project it was decided that a 2D mapping solution would provide better performance and cartography than a 3D Google Earth solution.  Licensing of the free Google Earth plugin was also a concern for some agencies.  A number of 2D mapping clients are available but we decided that this project required the use of <a href="http://mapbox.com/developers/utfgrid/">UTFGrid layers</a> for scalable map feature interaction, mobile support (touch interaction), as well as support for vector drawing/editing on the map.  The only mapping client that matched these requirements was OpenLayers.  For the application UI and interaction we decided to go with the Bootstrap and Knockout libraries.  Robust, extendable and cross-platform, these libraries take a lot of the pain out of UI development.</p>	
		</div>	
		<div class="row blocks">
			<div class="span3">
				<div class="well">
					<a name="JQuery"> </a>
					<h3>JQuery</h3>
					<a href="http://jquery.com">Learn More</a>
					<p>
						<ul>
							<li>Lightweight</li>
							<li>Cross-browser DOM manipulation and event handling</li>
							<li>Extendable through plugin architecture</li>
							<li>Extensive third-party plugins</li>
						</ul>
					</p>
				</div>
			</div>
			<div class="span3">
				<div class="well">
					<a name="OpenLayers"> </a>
					<h3>OpenLayers</h3>
					<a href="http://openlayers.org">Learn More</a>
					<p>
						<ul>
							<li>2D tile-based maps</li>
							<li>Vector support with drawing tools</li>				
							<li>Extensive support for mapping services including ESRI basemaps and <a href="http://mapbox.com/mbtiles-spec/utfgrid/">UTF-Grid</a></li>
							<li>Google maps integration</li>
						</ul>
					</p>
				</div>
			</div>		
			<div class="span3">
				<div class="well">
					<a name="Bootstrap"> </a>
					<h3>Bootstrap</h3>
					<a href="http://twitter.github.com/bootstrap/">Learn More</a>
					<p>
						<ul>
							<li>Grid layout system</li>
							<li>Support for responsive design</li>
							<li>Suite of UI widgets</li>
							<li>CSS3 support</li>							
						</ul>
					</p>
				</div>
			</div>
			<div class="span3">
				<div class="well">
					<a name="Knockout"> </a>
					<h3>Knockout</h3>
					<a href="http://knockoutjs.com/">Learn More</a>
					<p>
						<ul>
							<li>Simplifies dynamic Javascript UI's</li>
							<li>Templating</li>
							<li>Automatic UI Refresh</li>
							<li>Dependency tracking</li>

						</ul>
					</p>
				</div>
			</div>						
		</div>
		<h3>Map production</h3>
		<div class="span9">			
			<p>ArcGIS is the product of choice for processing of data layers and map production.  The Arc2Earth plugin is used to export maps as tile layers for use by the web mapping client.  Arc2Earth allows you to render tiles for only the region you desire and for as many zoom levels as you need.  All zoom levels are pre-rendered and published to Amazon S3 for exceptionally high-performance serving of map tiles through Amazon CloudFront at a relatively low cost.</p>
			<p>The one thing that the ArcGIS-based workflow does not support is <a href="http://mapbox.com/developers/utfgrid/">UTFGrid</a> output.  This is the key to getting scalable map feature interaction.  Suddenly you can hover over a feature and get its attributes as opposed to having to click on the map and query the server for what feature is at that place on the map.  To get this UTFGrid functionality we use TileMill, a cross-platform map production tool created by Development Seed.</p>
		</div>			
		<div class="row blocks">
			<div class="span3">
				<div class="well">
					<a name="ArcGIS"> </a>
					<h3>ArcGIS</h3>
					<a href="http://www.esri.com/software/arcgis">Learn More</a>
					<p>
						<ul>
							<li>Data layer processing</li>
							<li>Cartographic rendering</li>
						</ul>
					</p>
				</div>
			</div>
			<div class="span3">
				<div class="well">
					<a name="Arc2Earth"> </a>
					<h3>Arc2Earth</h3>
					<a href="http://www.arc2earth.com/">Learn More</a>
					<p>
						<ul>
							<li>Robust map tile production (more features than ArcGIS)</li>							
							<li>Publish directly to Amazon S3 storage</li>			
						</ul>
					</p>
				</div>
			</div>		
			<div class="span3">
				<div class="well">
					<a name="TileMill"> </a>
					<h3>TileMill</h3>
					<a href="http://mapbox.com/tilemill/">Learn More</a>
					<p>
						<ul>
							<li>Supports UTFGrid layer creation (ArcGIS does not)</li>
							<li>Robust workflow for map production</li>
							<li>Powerful carto map styling language</li>			
							<li>Excellent rendering quality with Mapnik map engine</li>
						</ul>
					</p>
				</div>
			</div>									
		</div>		
		<h3>Hosting</h3>
		<div class="span9">			
			<p>The MARCO Portal is hosted on a Ubuntu Linux Server on Amazon's Elastic Compute Cloud.  We maintain a development and production server at a hosting cost of about $3000-$4000/year depending on usage.  Large files such as map tiles, videos, and other static media are hosted on Amazon S3 and published through Amazon CloudFront.  This takes the load of serving all of that static content off of the application server.</p>
		</div>			
		<div class="row blocks">
			<div class="span3">
				<div class="well">
					<a name="ArcGIS"> </a>
					<h3>Amazon EC2</h3>
					<a href="http://aws.amazon.com/ec2/">Learn More</a>
					<p>
						<ul>
							<li>Pay only for the resource you use</li>
							<li>Scalable infrastructure, add more resources during times of anticipated high-server load</li>						
							<li>Simplified server maintenance</li>
							<li>No physical server, straightforward transition of control</li>
							<li>Secure</li>
						</ul>
					</p>
				</div>
			</div>
			<div class="span3">
				<div class="well">
					<a name="Amazon S3"> </a>
					<h3>Amazon S3</h3>
					<a href="http://aws.amazon.com/s3/">Learn More</a>
					<p>
						<ul>
							<li>Scalable - never worry about performance degrading due to the number of people accessing files</li>					
							<li>Inexpensive</li>
							<li>Secure</li>
						</ul>
					</p>
				</div>
			</div>										
		</div>				
	</div>
</div>

<h2>MARCO Data Catalog</h2>
<p>Coming soon</p>
