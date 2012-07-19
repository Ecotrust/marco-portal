## This page describes the custom projection used for MARCO portal

We'll use an Albers Equal Area projection focused on the MARCO boundary
but with the central meridian shifted west to minimize distortion for near-shore analyses.

# WKT 
Use this for .prj files for use with proj4

    PROJCS["MARCO_Albers",
        GEOGCS["GCS_WGS_1984",
            DATUM["WGS_1984",
                SPHEROID["WGS_1984",6378137.0,298.257223563]],
            PRIMEM["Greenwich",0.0],
            UNIT["Degree",0.0174532925199433]],
        PROJECTION["Albers_Conic_Equal_Area"],
        PARAMETER["False_Easting",0.0],
        PARAMETER["False_Northing",0.0],
        PARAMETER["Central_Meridian",-72.0],
        PARAMETER["Standard_Parallel_1",37.25],
        PARAMETER["Standard_Parallel_2",40.25],
        PARAMETER["Latitude_Of_Origin",36.0],
        UNIT["Meter",1.0]]

# ESRI WKT 
Uses "Albers"; necessary for compatibility with ESRI products.

    PROJCS["MARCO_Albers",
        GEOGCS["GCS_WGS_1984",
            DATUM["WGS_1984",
                SPHEROID["WGS_1984",6378137.0,298.257223563]],
            PRIMEM["Greenwich",0.0],
            UNIT["Degree",0.0174532925199433]],
        PROJECTION["Albers"],
        PARAMETER["False_Easting",0.0],
        PARAMETER["False_Northing",0.0],
        PARAMETER["Central_Meridian",-72.0],
        PARAMETER["Standard_Parallel_1",37.25],
        PARAMETER["Standard_Parallel_2",40.25],
        PARAMETER["Latitude_Of_Origin",36.0],
        UNIT["Meter",1.0]]

# Proj4

    +proj=aea +lat_1=37.25 +lat_2=40.25 +lat_0=36 +lon_0=-72 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs 

# EPSG

There is no corresponding EPSG code for this project. For the purposes of this project, we will use the custom code EPSG:99996

### Add projection to GeoDjango and to PostGIS

* Set `GEOMETRY_DB_SRID = 99996` in settings BEFORE you run syncdb

* add the proj4 definition to the bottom of /usr/local/share/proj/epsg (might be in another location) with srid of 99996

```
    # Marco Albers
    <99996> +proj=aea +lat_1=37.25 +lat_2=40.25 +lat_0=36 +lon_0=-72 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs <>
```
* then run the following command from django shell in order to add the projection to the spatial_ref_sys table:

```python
    from django.contrib.gis.utils import add_postgis_srs
    add_postgis_srs(99996) 
```