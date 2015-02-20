
app.clickAttributes = (function() {

	var getEFHData = function(keys) {
		var output = [];
    	if (keys.indexOf('X') !== -1) {
			output.push('Life stage data not developed');
    	} else {
    		if (keys.indexOf('E') !== -1) {
    			output.push('Eggs');
    		}
    		if (keys.indexOf('L') !== -1) {
    			output.push('Larvae');
    		}
    		if (keys.indexOf('J') !== -1) {
    			output.push('Juveniles');
    		}
    		if (keys.indexOf('A') !== -1) {
    			output.push('Adults');
    		}
    	}
    	return output.join(', ');
	};

	var getEFHAttributes = function(data) {
		var attrs = [];
        if ('American_P' in data && data['American_P']) {
        	output = getEFHData(data['American_P']);
            attrs.push({'display': 'American Plaice', 'data': output});
        }
        if ('Atlantic_C' in data && data['Atlantic_C']) {
        	output = getEFHData(data['Atlantic_C']);
            attrs.push({'display': 'Atlantic Cod', 'data': output});
        }
        if ('Atlantic_1' in data && data['Atlantic_1']) {
        	output = getEFHData(data['Atlantic_1']);
            attrs.push({'display': 'Atlantic Halibut', 'data': output});
        }
        if ('Atlantic_H' in data && data['Atlantic_H']) {
        	output = getEFHData(data['Atlantic_H']);
            attrs.push({'display': 'Atlantic Herring', 'data': output});
        }
        if ('Atlantic_S' in data && data['Atlantic_S']) {
        	output = getEFHData(data['Atlantic_S']);
            attrs.push({'display': 'Atlantic Sea Scallop', 'data': output});
        }
        if ('Atlantic_W' in data && data['Atlantic_W']) {
        	output = getEFHData(data['Atlantic_W']);
            attrs.push({'display': 'Atlantic Wolffish', 'data': output});
        }
        if ('Barndoor_S' in data && data['Barndoor_S']) {
        	output = getEFHData(data['Barndoor_S']);
            attrs.push({'display': 'Barndoor Skate', 'data': output});
        }
        if ('Black_Sea_' in data && data['Black_Sea_']) {
        	output = getEFHData(data['Black_Sea_']);
            attrs.push({'display': 'Black Sea Bass', 'data': output});
        }
        if ('Bluefish' in data && data['Bluefish']) {
        	output = getEFHData(data['Bluefish']);
            attrs.push({'display': 'Bluefish', 'data': output});
        }
        if ('Butterfish' in data && data['Butterfish']) {
        	output = getEFHData(data['Butterfish']);
            attrs.push({'display': 'Butterfish', 'data': output});
        }
        if ('Clearnose_' in data && data['Clearnose_']) {
        	output = getEFHData(data['Clearnose_']);
            attrs.push({'display': 'Clearnose Skate', 'data': output});
        }
        if ('Haddock' in data && data['Haddock']) {
        	output = getEFHData(data['Haddock']);
            attrs.push({'display': 'Haddock', 'data': output});
        }
        if ('Little_Ska' in data && data['Little_Ska']) {
        	output = getEFHData(data['Little_Ska']);
            attrs.push({'display': 'Little Skate', 'data': output});
        }
        if ('Longfin_In' in data && data['Longfin_In']) {
        	output = getEFHData(data['Longfin_In']);
            attrs.push({'display': 'Longfin Inshore Squid', 'data': output});
        }
        if ('Mackerel' in data && data['Mackerel']) {
        	output = getEFHData(data['Mackerel']);
            attrs.push({'display': 'Mackerel', 'data': output});
        }
        if ('Monkfish' in data && data['Monkfish']) {
        	output = getEFHData(data['Monkfish']);
            attrs.push({'display': 'Monkfish', 'data': output});
        }
        if ('Northern_S' in data && data['Northern_S']) {
        	output = getEFHData(data['Northern_S']);
            attrs.push({'display': 'Northern Shortfin Squid', 'data': output});
        }
        if ('Ocean_Pout' in data && data['Ocean_Pout']) {
        	output = getEFHData(data['Ocean_Pout']);
            attrs.push({'display': 'Ocean Pout', 'data': output});
        }
        if ('Offshore_H' in data && data['Offshore_H']) {
        	output = getEFHData(data['Offshore_H']);
            attrs.push({'display': 'Offshore Hake', 'data': output});
        }
        if ('Pollock' in data && data['Pollock']) {
        	output = getEFHData(data['Pollock']);
            attrs.push({'display': 'Pollock', 'data': output});
        }
        if ('Quahog' in data && data['Quahog']) {
        	output = getEFHData(data['Quahog']);
            attrs.push({'display': 'Quahog', 'data': output});
        }
        if ('Red_Crab' in data && data['Red_Crab']) {
        	output = getEFHData(data['Red_Crab']);
            attrs.push({'display': 'Red Crab', 'data': output});
        }
        if ('Red_Hake' in data && data['Red_Hake']) {
        	output = getEFHData(data['Red_Hake']);
            attrs.push({'display': 'Red Hake', 'data': output});
        }
        if ('Redfish' in data && data['Redfish']) {
        	output = getEFHData(data['Redfish']);
            attrs.push({'display': 'Redfish', 'data': output});
        }
        if ('Rosette_Sk' in data && data['Rosette_Sk']) {
        	output = getEFHData(data['Rosette_Sk']);
            attrs.push({'display': 'Rosette Skate', 'data': output});
        }
        if ('Scup' in data && data['Scup']) {
        	output = getEFHData(data['Scup']);
            attrs.push({'display': 'Scup', 'data': output});
        }
        if ('Silver_Hak' in data && data['Silver_Hak']) {
        	output = getEFHData(data['Silver_Hak']);
            attrs.push({'display': 'Silver Hake', 'data': output});
        }
        if ('Smooth_Ska' in data && data['Smooth_Ska']) {
        	output = getEFHData(data['Smooth_Ska']);
            attrs.push({'display': 'Smooth Skate', 'data': output});
        }
        if ('Spiny_Dogf' in data && data['Spiny_Dogf']) {
        	output = getEFHData(data['Spiny_Dogf']);
            attrs.push({'display': 'Spiny Dogfish', 'data': output});
        }
        if ('Summer_Flo' in data && data['Summer_Flo']) {
        	output = getEFHData(data['Summer_Flo']);
            attrs.push({'display': 'Summer Flounder', 'data': output});
        }
        if ('Surfclam' in data && data['Surfclam']) {
        	output = getEFHData(data['Surfclam']);
            attrs.push({'display': 'Surfclam', 'data': output});
        }
        if ('Thorny_Ska' in data && data['Thorny_Ska']) {
        	output = getEFHData(data['Thorny_Ska']);
            attrs.push({'display': 'Thorny Skate', 'data': output});
        }
        if ('Tilefish' in data && data['Tilefish']) {
        	output = getEFHData(data['Tilefish']);
            attrs.push({'display': 'Tilefish', 'data': output});
        }
        if ('Witch_Flou' in data && data['Witch_Flou']) {
        	output = getEFHData(data['Witch_Flou']);
            attrs.push({'display': 'Witch Flounder', 'data': output});
        }
        if ('White_Hake' in data && data['White_Hake']) {
        	output = getEFHData(data['White_Hake']);
            attrs.push({'display': 'White Hake', 'data': output});
        }
        if ('Windowpane' in data && data['Windowpane']) {
        	output = getEFHData(data['Windowpane']);
            attrs.push({'display': 'Windowpane', 'data': output});
        }
        if ('Winter_Flo' in data && data['Winter_Flo']) {
        	output = getEFHData(data['Winter_Flo']);
            attrs.push({'display': 'Winter Flounder', 'data': output});
        }
        if ('Winter_Ska' in data && data['Winter_Ska']) {
        	output = getEFHData(data['Winter_Ska']);
            attrs.push({'display': 'Winter Skate', 'data': output});
        }
        if ('Yellowtail' in data && data['Yellowtail']) {
        	output = getEFHData(data['Yellowtail']);
            attrs.push({'display': 'Yellowtail', 'data': output});
        }
        if ('Species_Co' in data && data['Species_Co']) {
        	attrs.unshift({'display': '', 'data': data['Species_Co'] + ' Overlapping Essential Fish Habitats'});
        }
        return attrs;
	};

	return {
    	getEFHAttributes: getEFHAttributes
    };

})();