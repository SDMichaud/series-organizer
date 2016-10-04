$("#addButton").click(function(){
	self.port.emit("add-button-click");
});

// Bind a listener to the table to check for click actions on it's children
// Specifically to its tr -> button children
$("#showTable").on("click", "tr button", function(){
	var opSelected = $(this).text();
	// Get an array holding the values in the row selected
	let rowArr = [];
	$(this).parent().siblings().each(function(){
		rowArr.push($(this).text());
	});
	switch(opSelected){
		case "Change":
		    //self.port.emit("change-button-click", rowArr);
			self.port.emit("change-entry", rowArr);
	        break;
		case "Delete":
		    let ok = window.confirm("Delete record for " + $(this).parent().siblings(":first").text() + "?");
			if(ok){
				self.port.emit("delete-button-click", rowArr);
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

self.port.on("panel-show", function(epiList){
	CreateTable(epiList);
});

// Flag checking if table has recently been updated with new data
var isTableUpToDate = false;

// Flag used in the createTable loop defineing number of columns
var totalTableSlots = 3;

function CreateTable(showObjectArr){
	if(!isTableUpToDate){
		var tbody = $("#tableBody");
		// One loop for every item in the saved shows list
	    for (var ii = 0; ii < showObjectArr.length; ii++){
			// Create a row for this show and save a reference to it
		    var tr = $("<tr/>").appendTo(tbody);
			var appendString = "<td>" + showObjectArr[ii].name + "</td>" +
			               "<td> S:" + showObjectArr[ii].series + ", E:" + showObjectArr[ii].episode + "</td>" +
						   "<td><button>Change</button><br><button>Delete</button></td>";
			tr.append(appendString);
		}
		
		isTableUpToDate = true;
	}	
}

self.port.on("epiList-change", function(){
	// Reset html
	$("#tableBody").html("<tr class='headings'><th>Series</th><th>Current Episode</th><th>Options</th>");
	isTableUpToDate = false;
});

self.port.on("savedEntries-modified", function(){
	// Reset html to default headers
	$("#tableBody").html("<tr class='headings'><th>Series</th><th>Current Episode</th><th>Options</th>");
	isTableUpToDate = false;
});