// TODO Add code to
// Intercept entry button press and open dialogue box?
// Load saved data
// Save after entries added or changed
// Note, maybe all this goes into the main code? (maybe port.emit the data to here?)
$("#addButton").click(function(){
	self.port.emit("add-button-click");
});

self.port.on("panel-show", function(epiList){
	//console.log(epiList);
	CreateTable(epiList);
});

// Flag checking if table has recently been updated with new data
var isTableUpToDate = false;

// Flag used in the createTable loop defineing number of columns
var totalTableSlots = 3;

function CreateTable(dataArr){
	//console.log(dataArr);
	if(!isTableUpToDate){
		var tbody = $("#tableBody");
		// One loop for every item in the saved shows list
	    for (var ii = 0; ii < dataArr.length; ii++){
			// Create a row for this show and save a reference to it
		    var tr = $("<tr/>").appendTo(tbody);
			// Loop through the data for the current show and add <td>s for them
		    for (var jj = 0; jj < totalTableSlots; jj++){
				// The last column holds buttons for changing and deleting show data,
				// so the last loop will be handled differently
				if(jj != 2){
					tr.append("<td>" + dataArr[ii][jj] + "</td>");
				}else{
					tr.append("<td><button>Change</button><br><button>Delete</button></td>")
				}
			    
			}
		}
		// After dynamically adding buttons to the table we have to add listeners to them
		/*
		$("button").not("#addButton").on("click", function(){
			// Don't add a listener to the "add show" button, all other buttons are fine
			// TODO: ensure buttons with listeners don't get multiple ones (remove listeners first then add them again?)
			console.log("working!");
		});
		*/
		$("button").not("#addButton").click(function(){
			//console.log("working!");
			// Find the row for the button that was clicked and find out what the button is labled as
			// this = button clicked, parent = td, siblings = all tds in row, ":first" = first td in row
			//console.log("Row selected: " + $(this).parent().siblings(":first").text() + ", Option: " + $(this).text());
			var opSelected = $(this).text();
			switch(opSelected){
				case "Change":
				    console.log("Change selected");
				    break;
				case "Delete":
				    let ok = window.confirm("Delete record for " + $(this).parent().siblings(":first").text() + "?");
					//console.log(t);
					if(ok){
						let rowArr = [];
						$(this).parent().siblings().each(function(){
							rowArr.push($(this).text());
						});
						self.port.emit("delete-button-click", rowArr);
						//DeleteEntry(rowArr);
					}
					break;
				default:
				    console.log("Default Switch: Error");
			}
			// TODO using this data, allow the saved data array to be modified (send data back to main code and do it there)
			// self.port.emit("table-option-clicked", [above_data_here]);
		});
		
		isTableUpToDate = true;
	}	
}

function DeleteEntry(entryArr){
	console.log("delete code goes here: " + entryArr.length);
}

self.port.on("epiList-change", function(){
	$("#tableBody").html("");
	isTableUpToDate = false;
});