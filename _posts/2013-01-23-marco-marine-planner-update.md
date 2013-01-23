---
layout: post
title: "MARCO Marine Planner Update"
description: ""
category: 
tags: []
author: Scott Fletcher
---
{% include JB/setup %}

Work on the MARCO Portal website and Marine Planner moves toward user-driven designs.  While not yet available for general users, team members are now able to experiment with the emerging design functionalities.  
Drill-Down Feature Attribution

Drill Down Feature Attribution
------------------------------

Click events on the map now provide the user with information related to all visible layers (all visible layers that have 
feature attribution) under the mouse click.  

![drilldown attribution]({{BASE_PATH}}/assets/img/updates/drilldown_attribution.png)

This drill-down solution was found through a fork of OpenLayers created by [Andreas Hocevar](http://opengeo.org/about/team/andreas.hocevar/) that uses an event registration model for vector related click events rather than the more common (and for our interests, problematic) SelectFeature Control.  The SelectFeature control responds only to events on the top most vector layer.  

Utilizing the SelectFeature control also had the unwanted side effect of forcing the controlled vectors to the top of the layer ordering (manually changing the zindex did not counter this effect), which prevented us from providing full layer ordering control to the user.  Additionally, the SelectFeature control prevented users from click-panning the map while inside a controlled vector feature.  All three of these problems were solved by Hocevar’s feature-events branch, however one problem was created.  

Using Hocevar’s branch, we witnessed an occasional issue in which feature attribution acted in unexpected ways when vector layers were activated.  We eventually realized that registering the featureclick (and nofeatureclick) events intermittently prevented other events and controls (such as the UTFGrid Control, which we use for feature attribution of map tile layers) from being triggered.

The details as to why this was occurring can be found on a recent commit to our own branch of Hocevar’s feature-events branch.   
This commit addresses that issue by altering the way getFeatures queries the features from each vector layer under the mouse event.  


Wind Energy Siting
------------------

As MARCO work moves into the realm of user-driven designs, we are beginning to explore the potential for siting areas (lease blocks) deemed suitable for wind energy development, based on user input.  We currently provide 6 criteria to the user: 

*	Wind Speed, Distance to Shore, 
*	Depth Range, 
*	Distance to AWC Hubs, 
*	Distance to Shipping Lanes, and 
*	Excluding Areas with High Ship Traffic.  

Each of these criteria can be adjusted by the user to produce a result that reflects only those lease blocks that meet the criteria specified.  

![lease blocks]({{BASE_PATH}}/assets/img/updates/lease_blocks.png)
 
We also provide the ability (not available for IE browsers v8 and older) to visualize a dynamic display of those lease blocks that meet their criteria.  This display is updated on-the-fly as the user adjusts the criteria values, providing immediate feedback on how changes made to the criteria affect the number and placement of the sited lease blocks. 

The end result is a collection of dissolved polygons that reflect those lease blocks that meet the criteria specified by the user.  

![lease blocks]({{BASE_PATH}}/assets/img/updates/criteria.png) 

