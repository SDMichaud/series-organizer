$("#addButton").click(function(){
	self.port.emit("add-button-click");
});

// Bind a listener to the table to check for click actions on it's children
// Specifically to its tr -> button children
// ALL buttons in the rows fall under this catagory, regardless of their <td>
// This could cause issues when it comes to buttons with text vs buttons without text (just an image)
// TODO? refactor code so buttons use "classes" instead of text for identification
$("#showTable").on("click", "tr button", function(){
	var opSelected = $(this).text();
	let showName = $(this).parent().siblings(":first").text();
	switch(opSelected){
		case "Change":
		    self.port.emit("change-button-click", showName);
	        break;
		case "Delete":
		    let ok = window.confirm("Delete record for " + showName + "?");
			if(ok){
				self.port.emit("delete-button-click", showName);
			}
			break;
		default:
		    console.log("Default Switch: Error");
		}
	// Stop the click event for the row from being activated
	event.stopPropagation();
});

$("#showTable").on("click", "tr", function(){
	// Grab the show name and send it to the main code for lookup in storage array
	let showName = $(this).children(":first").text();
	if(showName != "Series"){
		self.port.emit("row-clicked", showName);
	}
});

self.port.on("panel-show", function(savedEntries){
	CreateTable(savedEntries);
});

// Flag checking if table has recently been updated with new data
var isTableUpToDate = false;

// Code that dynamically draws the table
function CreateTable(savedEntries){
	if(!isTableUpToDate){
		var tbody = $("#tableBody");
		// One loop for every item in the saved shows list
	    for (var ii = 0; ii < savedEntries.length; ii++){
			// Create a row for this show and save a reference to it
		    var tr = $("<tr/>").appendTo(tbody);
			// This string holds the html for a table row
			var appendString = "<td>" + savedEntries[ii].name + "</td>" +
			               "<td> S:" + savedEntries[ii].series + ", E:" + savedEntries[ii].episode + "</td>" +
						   "<td><button>Change</button><br><button>Delete</button></td>";
			tr.append(appendString);
		}
		
		isTableUpToDate = true;
	}	
}

self.port.on("savedEntries-modified", function(){
	// Reset html to default headers
	$("#tableBody").html("<tr class='headings'><th>Series</th><th>Current Episode</th><th>Options</th>");
	isTableUpToDate = false;
});