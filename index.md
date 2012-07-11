---
layout: default
title: MARCO Portal Project Log
tagline: 
---
{% include JB/setup %}

<div class="row">
	<div class="span12">
		<img src="{{BASE_PATH}}/assets/img/windmill-ocean.jpg"/>
	</div>
	<div class="span12">
		<p class='big-text'>Insight into the ongoing development of the MARCO Portal for Mid-Atlantic ocean planning</p>
	</div>
</div>

<hr/>

<div class="row">
  <div class="span3">
    <h2>Latest Dev News</h2>
  </div>	
  {% for post in site.posts limit:2 %}
  <div class="span3">
    <h3>{{ post.title }}</h3>
	<div class="date">{{ post.date | date_to_long_string }}</div>
    <p>{{ post.content | strip_html | truncatewords: 25 }}</p>    
    <p class="pull-right">
      <a href="{{BASE_PATH}}{{ post.url }}">Read more</a>
    </p>
  </div>
  {% endfor %}
  <div class="span2">
    <p><a class='btn' href="{{BASE_PATH}}/archive.html">Archives</a></p>
    <p><a class='btn' href="{{BASE_PATH}}/categories.html">Categories</a></p>
    <p><a class='btn' href="{{BASE_PATH}}/tags.html">Tags</a></p>
    <p><a href="http://feeds.feedburner.com/MarcoPortalDevelopmentLog"><img height="20" width="20" src="{{BASE_PATH}}/assets/img/feed-icon-28x28.png"/></a></p>
  </div> 
</div>

<hr/>

<div class="row">
  <div class="span3">
    <h2>Portal Project Timeline</h2>
  </div>
  <div class="span3">
  	<h3>Release 2 - August 2012</h3>
  	<p>Launch of the revamped portal website. Preliminary data catalog and mapping tool with sector-specific parameters and spatial filters.  Additional datasets with stakeholder vetting.</p>
  </div>	
  <div class="span3">
  	<h3>Release 3 - Late Fall 2012</h3>
  	<p>More data.  Improved spatial filters based on stakeholder feedback.  Ability to design and generate reports.</p>
  </div>  
  <div class="span3">
  	<h3>Final release - June 2013</h3>
  	<p>Stakeholder data and views incorporated to the extent possible.  Enhanced features and functions based on feedback and testing.</p>
  </div>  
</div>

<hr/>

<div class="row">
	<div class="span10">
		<div class="row blocks">
			<div class="span5">
				<div class="well">
					<h3>Project Links</h3>
					<p>
						<ul>
							<li><a href="http://midatlanticocean.org/map_portal.html">What is the MARCO Portal?</a></li>							
							<li><a href="{{BASE_PATH}}/technology.html">Technology stack</a></li>
							<li><a href="http://github.com/ecotrust/marco-portal">GitHub site (code and issue tracking)</a></li>							
						</ul>
					</p>
				</div>
			</div>
      <div class="span5">
        <div class="well">
          <h3>Development Team</h3>
          <p>
            <ul>
              <li>The Nature Conservancy</li>              
              <li>Ecotrust</li>              
              <li>Rutgers - Center for Remote Sensing and Spatial Analysis</li>
              <li>Monmouth University</li>
            </ul>
          </p>
        </div>
      </div>
		</div>
	</div>
</div>
