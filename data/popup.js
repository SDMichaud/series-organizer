var isChangeModeActive = false;
var indexOfChange = 0;

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