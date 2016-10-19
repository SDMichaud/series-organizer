var isChangeModeActive = false;
var indexOfChange = -1; // Holds the index of the entry being modified when change mode is active

// a hacky way of sanitizing input
// javascript's createTextNode will automatically escape special characters
// use it to create a node then pull the text from that node
// The node is never appended to the document so it is just forgotten about
function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

$("#addSubmitButton").click(function(event){
	event.preventDefault();
	var showName = escapeHTML($("#showName").val());
	var curSeries = escapeHTML($("#seriesNum").val());
	var curEpisode = escapeHTML($("#episodeNum").val());
	var lunk = escapeHTML($("#linkEpisode").val());
	var showObject = {
		name: showName,
		series: curSeries,
		episode: curEpisode,
		lnk: lunk,  
	}
	if(!isChangeModeActive){
		addon.port.emit("entry-add", showObject);
		clearValues();
	}else{
		changeDataObj = {
			index: indexOfChange,
			entry: showObject,
		}
		addon.port.emit("entry-change", changeDataObj);
		clearValues();
		endChangeMode();
	}
});

// Prevent pressing the enter key from trying to submit the forms
$(document).on("keydown", "input", function(event){
	if(event.keyCode == 13){
		event.preventDefault();
	}
});

$("#firstEpiButton").click(function(event){
	$("#seriesNum").val("1");
	$("#episodeNum").val("1");
	event.preventDefault();
	event.stopPropagation();
});

$("#thisPageButton").click(function(event){
	addon.port.emit("current-page-request");
	event.preventDefault();
	event.stopPropagation();
});

addon.port.on("context-additon", function(selectedName){
	$("#showName").val(selectedName);
});

addon.port.on("current-page-reply", function(tabURL){
	$("#linkEpisode").val(tabURL);
});
// changeDataObj holds index and entry values
addon.port.on("change-entry", function(changeDataObj){
	isChangeModeActive = true;
	$("#addSubmitButton").val("Change");
	indexOfChange = changeDataObj.index;
	$("#showName").val(changeDataObj.entry.name);
	$("#seriesNum").val(changeDataObj.entry.series);
	$("#episodeNum").val(changeDataObj.entry.episode);
	$("#linkEpisode").val(changeDataObj.entry.lnk);
});

addon.port.on("popup-hidden", function(){
	$("#addSubmitButton").val("Add");
	clearValues();	
	endChangeMode();
});

function endChangeMode(){
	isChangeModeActive = false;
	indexOfChange = -1;
}
function clearValues(){
	$("#showName").val("");
	$("#seriesNum").val("");
	$("#episodeNum").val("");
	$("#linkEpisode").val("");		
}

$(".button").button();