// TODO See about using hidden ID elements for the table instead of looking up names

// TODO add buttons to add or subtract one from seasons or episodes
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

// savedEntries will work similar to epiList but hold entries as objects 
if(!store.storage.savedEntries){
	store.storage.savedEntries = [];
}

/* Entry objects will have the format
*  myEntry = {
*      name: Show Name,
*      series: 1,
*      episode: 1,
*      lnk: www.google.ca, // "link" is a reserved word	
*  }
*/

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

// Context menu item that will copy highlighted text and use it as a show name
var cm = contextMenu.Item({
	label: "Add show to Series Organizer",
	context: contextMenu.SelectionContext(),
	contentScript: "self.on('click', function(){"+
	               "    var text = window.getSelection().toString();"+
				   "    self.postMessage(text);"+
	               "});",
	onMessage: function(selectionText){
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
		panel.port.emit("panel-show", store.storage.savedEntries);
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
panel.port.on("delete-button-click", function(showName){
	var entryIndex = getEntryIndexByShowName(showName);
	store.storage.savedEntries.splice(entryIndex, 1);
	panel.port.emit("savedEntries-modified");
});

// When the change entry button is clicked
panel.port.on("change-button-click", function(showName){
	var entryIndex = getEntryIndexByShowName(showName);
	var entryObject = store.storage.savedEntries[entryIndex];
	var changeDataObj = {
		index: entryIndex,
		entry: entryObject,
	}
	popup.port.emit("change-entry", changeDataObj);
	popup.show({
		position: {
			top: 40,
		}
	});
});

// Returns the index an entry has in the episode list
function getEntryIndexByShowName(showName){
	for (ii = 0; ii < store.storage.savedEntries.length; ii++){
		if(store.storage.savedEntries[ii].name == showName){
			return ii
		}
	}
	return null
}

popup.port.on("entry-change", function(changeDataObj){
	panel.port.emit("savedEntries-modified");
	store.storage.savedEntries[changeDataObj.index] = changeDataObj.entry;
	popup.hide();
});

// When a row is clicked, navigate to the provided show link in a new tab 
panel.port.on("row-clicked", function(showName){
	var showIndex = getEntryIndexByShowName(showName);
	var episodeLink = store.storage.savedEntries[showIndex].lnk 
    tabs.open(episodeLink);
    panel.hide();	
	
});

popup.port.on("current-page-request", function(){
	popup.port.emit("current-page-reply", tabs.activeTab.url);
});

popup.port.on("entry-add", function(showObject){
	panel.port.emit("savedEntries-modified");
	store.storage.savedEntries.push(showObject);
	popup.hide();
});


// Runs when an "OverQuota" event is triggered by storage, this is unlikely
store.on("OverQuota", overQuotaListener);
function overQuotaListener(){
	console.log("Over quota!!")
}

