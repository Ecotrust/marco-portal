
default_value = '---'

def kmlcolor_to_htmlcolor(kmlcolor):
    return str('#' + kmlcolor[6] + kmlcolor[7] + kmlcolor[4] + kmlcolor[5] + kmlcolor[2] + kmlcolor[3] )
    
def format(value, precision=1):
    if precision == 0:
        return int(float(value))
    new_value = int(float(value) * 10 ** precision)
    return new_value / 10. ** precision
    
def miles_to_meters(miles):
    return int(float(miles) * 1609.344)
    
def meters_to_miles(meters):
    return float(meters) * 0.000621371192
    
def feet_to_meters(feet):
    return int(float(feet) * .3048)
    
def meters_to_feet(meters):
    return int(float(meters) * 3.2808399)
    
def sq_meters_to_sq_miles(sq_meters):
    return float(sq_meters) * .000000386102159
    
def sq_meters_to_acres(sq_meters):
    return float(sq_meters) * .000247104393
    
def mps_to_mph(mps):
    return mps * 2.23693629
    