$("#backButton").button({
	icon:"ui-icon-arrowthick-1-w",
	showLabel: false,
});

$("#backButton").click(function(){
	addon.port.emit("back-button-click");
	location.href = "panel.html";
});

$("#gitLink").click(function(event){
	event.preventDefault();
	addon.port.emit("git-link-click", event.target.toString());
});