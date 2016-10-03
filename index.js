// TODO Context menu for adding shows so highlighted text can be added as a show name
// TODO Add the option to use the current tab's url as the episode link 
// TODO Separate season and episode into numbers that can be quickly added up or down
// TODO Style everything to look super sick
// TODO Possibly modify code so everything is done in one panel/fork repository?

// Basically the "include" section
var { ToggleButton } = require("sdk/ui/button/toggle");
var panels = require("sdk/panel");
var self = require("sdk/self");
var store = require("sdk/simple-storage");
var tabs = require("sdk/tabs");
var contextMenu = require("sdk/context-menu");

// Check to see if an episode list array exists in firefox storage and create one if not
if(!store.storage.epiList){
	store.storage.epiList = [];
}

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

// Create the popup for editing values
var popup = panels.Panel({
	contentURL: self.data.url("popup.html"),
	// Technically don't need to use a contentScriptFile, all scripts can just be included in the html of the panels
	contentScriptFile: [self.data.url("jquery.min.js"), self.data.url("popup.js")],
	onHide: handlePopupHide,
});

var cm = contextMenu.Item({
	label: "Add show to Series Organizer",
	context: contextMenu.SelectionContext(),
	contentScript: "self.on('click', function(){"+
	               "    var text = window.getSelection().toString();"+
				   "    self.postMessage(text);"+
	               "});",
	onMessage: function(selectionText){
		//console.log(selectionText);
		popup.port.emit("context-additon", selectionText);
		popup.show({
			position: {
				top: 40,
			}			
		});
	}
});


// Runs when the toggle button state changes
function toggleChange(state){
	if(state.checked){
		panel.port.emit("panel-show", store.storage.epiList);
		panel.show({
			position: button,
		});
	}
}

// Runs when the panel is hidden for any reason
function handleHide(){
	button.state("window", {checked: false});
}

// Runs when the popup is hidden for any reason
function handlePopupHide(){
	popup.port.emit("popup-hidden");
}

// When the add entry button is clicked
panel.port.on("add-button-click", function(){
	popup.show({
		position: {
			top: 40,
		}
	});
});

// When the delete entry button is clicked
panel.port.on("delete-button-click", function(entryArr){
	var entryIndex = getEntryIndexFromStorage(entryArr);
	store.storage.epiList.splice(entryIndex, 1);
	panel.port.emit("epiList-change");
});

// When the change entry button is clicked
panel.port.on("change-button-click", function(entryArr){
	var entryIndex = getEntryIndexFromStorage(entryArr);
	var entry = store.storage.epiList[entryIndex];
	var changeDataArr = [entry, entryIndex];
	popup.port.emit("change-entry", changeDataArr);
	popup.show({
		position: {
			top: 40,
		}
	});
});

// Returns the index an entry has in the episode list
// Used for modifying and deleting these entries
// entryArr has the format: entryArr[showName, currentEpisode]
function getEntryIndexFromStorage(entryArr){
	for( ii = 0; ii < store.storage.epiList.length; ii++ ){
		if(entryArr[0] == store.storage.epiList[ii][0] && entryArr[1] == store.storage.epiList[ii][1]){
			return ii;
		}
	}
}

// Returns the index an entry has in the episode list
function getEntryIndexByShowName(showName){
	for( ii = 0; ii < store.storage.epiList.length; ii++ ){
		if(store.storage.epiList[ii][0] == showName){
			return ii;
		}
	}
}

// Runs when an entry is added to the episode list
popup.port.on("entry-added", function(dataArr){
	panel.port.emit("epiList-change");
	store.storage.epiList.push(dataArr);
	console.log("Current storage quota: " + store.quotaUsage*100 + "%");
	popup.hide();
});

// modifyDataArr holds the data to update as an array in [0] and the index to update in [1]
// TODO Change these complex arrays to be objects instead?
popup.port.on("entry-changed", function(modifyDataArr){
	panel.port.emit("epiList-change");
	store.storage.epiList[modifyDataArr[1]] = modifyDataArr[0];
	popup.hide();
});

// When a row is clicked, navigate to the provided show link in a new tab 
panel.port.on("row-clicked", function(showName){
	//console.log(showName);
	var showIndex = getEntryIndexByShowName(showName);
	var episodeLink = store.storage.epiList[showIndex][2];
    tabs.open(episodeLink);
    panel.hide();	
	
});

popup.port.on("current-page-request", function(){
	popup.port.emit("current-page-reply", tabs.activeTab.url);
});



// Runs when an "OverQuota" event is triggered by storage, this is unlikely
store.on("OverQuota", overQuotaListener);
function overQuotaListener(){
	console.log("Over quota!!")
}

