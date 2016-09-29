$("#addSubmitButton").click(function(event){
	// Stop the default action from occuring upon submit
	event.preventDefault();

	var title = $("#showName").val();
	var episode = $("#curEpisode").val();
	var lnk = $("#linkEpisode").val();
	// Values are placed into an array for easy handling
	var dataArr = [title, episode, lnk];
	// Submit data to the main code and then clear values
	self.port.emit("entry-added", dataArr);
	$("#showName").val("");
	$("#curEpisode").val("");
	$("#linkEpisode").val("");	
});