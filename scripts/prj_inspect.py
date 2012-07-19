#!/usr/bin/env python
from osgeo import osr
import sys

file = sys.argv[1]

wkt = open(file,'r').read()

srs = osr.SpatialReference()
srs.ImportFromWkt(wkt)
srs.MorphFromESRI()

print "ESRI WKT"
wkt_esri = srs.ExportToPrettyWkt()
print wkt_esri

print
print "Proj4"
proj4 = srs.ExportToProj4()
print proj4
