var isChangeModeActive = false;
var indexOfChange = 0;

/* Old Code
$("#addSubmitButton").click(function(event){
	// Stop the default action from occuring upon submit
	event.preventDefault();
	var title = $("#showName").val();
	var episode = $("#curEpisode").val();
	var lnk = $("#linkEpisode").val();
	// Values are placed into an array for easy handling
	var dataArr = [title, episode, lnk];
	if(!isChangeModeActive){
		// Submit data to the main code and then clear values
		self.port.emit("entry-added", dataArr);
		clearValues();		
	}else{
		var modifyDataArr = [dataArr, indexOfChange];
		self.port.emit("entry-changed", modifyDataArr);
		clearValues();
		isChangeModeActive = false;
	}
});
*/

$("#addSubmitButton").click(function(event){
	event.preventDefault();
	var showName = $("#showName").val();
	var curSeries = $("#seriesNum").val();
	var curEpisode = $("#episodeNum").val();
	var lunk = $("#linkEpisode").val();
	var showObject = {
		name: showName,
		series: curSeries,
		episode: curEpisode,
		lnk: lunk,  
	}
	if(!isChangeModeActive){
		self.port.emit("entry-add", showObject);
		clearValues();
	}else{
		// modify the entry
	}
});

// Prevent pressing the enter key from trying to submit the forms
$(document).on("keydown", "input", function(event){
	if(event.keyCode == 13){
		event.preventDefault();
	}
});

$("#firstEpiButton").click(function(event){
	$("#curEpisode").val("S:1, E:1");
	event.preventDefault();
	event.stopPropagation();
});

$("#thisPageButton").click(function(event){
	self.port.emit("current-page-request");
	event.preventDefault();
	event.stopPropagation();
});

self.port.on("context-additon", function(selectedName){
	//console.log(selectedName);
	$("#showName").val(selectedName);
});

self.port.on("current-page-reply", function(tabURL){
	//console.log(tabURL);
	$("#linkEpisode").val(tabURL);
});
// changeDataArr holds the entry values as an array in [0] and the index this array held in storage in [1];
self.port.on("change-entry", function(changeDataArr){
	isChangeModeActive = true;
	$("#addSubmitButton").val("Change");
	indexOfChange = changeDataArr[1];
	$("#showName").val(changeDataArr[0][0]);
	$("#curEpisode").val(changeDataArr[0][1]);
	$("#linkEpisode").val(changeDataArr[0][2]);
});

self.port.on("popup-hidden", function(){
	isChangeModeActive = false;
	$("#addSubmitButton").val("Add");
	clearValues();	
});

function clearValues(){
	$("#showName").val("");
	$("#curEpisode").val("");
	$("#linkEpisode").val("");		
}