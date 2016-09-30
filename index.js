var { ToggleButton } = require("sdk/ui/button/toggle");
var panels = require("sdk/panel");
var self = require("sdk/self");
var store = require("sdk/simple-storage");

if(!store.storage.epiList){
	store.storage.epiList = [];
}

// TODO Figure out how to save and load data
// TODO Figure out how to create a table of saved elements (use some test data?)
// TODO Add code to add entries to current list

// Create the button
var button = ToggleButton({
	id: "series-organizer",
	label: "Series Organizer",
	icon:{
		"16": "./so_logo_16.ico",
		"32": "./so_logo_32.ico",
		"64": "./so_logo_64.ico",
	},
	onChange: toggleChange,
});

// Create the panel
var panel = panels.Panel({
	contentURL: self.data.url("panel.html"),
	contentScriptFile: [self.data.url("jquery.min.js"), self.data.url("panel.js")],
	onHide: handleHide,
	width: 600,
	height: 400,
});

var popup = panels.Panel({
	contentURL: self.data.url("popup.html"),
	contentScriptFile: [self.data.url("jquery.min.js"), self.data.url("popup.js")],
	onHide: handlePopupHide,
	//width: ,
	//height: 512,
});


// Runs when the toggle button state changes
function toggleChange(state){
	//console.log(state.label + " Current state: " + state.checked);
	if(state.checked){
		panel.port.emit("panel-show", store.storage.epiList);
		panel.show({
			position: button,
		});
	}
}

// Runs when the panel is hidden for any reason
function handleHide(){
	console.log("Hidden");
	button.state("window", {checked: false});
}

function handlePopupHide(){
	console.log("Popup is hidden");
}
panel.port.on("add-button-click", function(){
	console.log("click!");
	//panel.resize(200, 200);
	popup.show({
		position: {
			top: 40,
		}
	});
});

// TODO Add code to update list after deleting entry
panel.port.on("delete-button-click", function(entryArr){
	for( ii = 0; ii < store.storage.epiList.length; ii++ ){
		//console.log(store.storage.epiList[ii]);
		if(entryArr[0] == store.storage.epiList[ii][0] && entryArr[1] == store.storage.epiList[ii][1]){
			console.log("Deleting " + store.storage.epiList[ii]);
			store.storage.epiList.splice(ii, 1); // Deleting
			panel.port.emit("epiList-change");
		}
	}
	//console.log(entryArr);
});
popup.port.on("entry-added", function(dataArr){
	//console.log(dataArr);
	// TODO add code for updating table when something is added or removed
	// TODO add a panel.port.emit() to let the panel know data has been modified (isTableUpToDate)
	panel.port.emit("epiList-change");
	store.storage.epiList.push(dataArr);
	console.log(store.quotaUsage);
	popup.hide();
	/*
	panel.show({
		position: button,
	});
	*/
});

store.on("OverQuota", overQuotaListener);
function overQuotaListener(){
	console.log("Over quota!!")
}
