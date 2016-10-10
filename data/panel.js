$("#addButton").click(function(){
	self.port.emit("add-button-click");
});

// Bind a listener to the table to check for click actions on it's children
// Specifically to its tr -> button children
// ALL buttons in the rows fall under this catagory, regardless of their <td>
// This could cause issues when it comes to buttons with text vs buttons without text (just an image)
// TODO? refactor code so buttons use "classes" instead of text for identification
$("#showTable").on("click", "tr input", function(){
	var buttonClassSelected = $(this).attr("class");
	//console.log(buttonClassSelected)
	let showName = $(this).parent().siblings(":first").text();
	// get the show name starting from the inner table, must break out of inner table first.
	let quickShowName = $(this).closest("table").parent().siblings(":first").text();
	switch(buttonClassSelected){
		case "change":
		    self.port.emit("change-button-click", showName);
	        break;
		case "delete":
		    let ok = window.confirm("Delete record for " + showName + "?");
			if(ok){
				self.port.emit("delete-button-click", showName);
			}
			break;
		case "sPlus":
		case "sMinus":
		case "ePlus":
		case "eMinus":
		    self.port.emit("quick-button-click", {showName: quickShowName, buttonClass: buttonClassSelected});
			break;
		default:
		    console.log("Default Switch: Error");
		}
	// Stop the click event for the row from being activated
	event.stopPropagation();
});

$("#showTable").on("click", "tr.outter", function(){
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

/* Structure: Table within table
<table>
  <tr>
    <td>Show Name</td>
	<td>
	  <table>
        <tr>
          <td>
	        <button>+</button>
          </td>
	      <td>
	        <button>+</button>
	      </td>
        </tr>
        <tr>
          <td>S:1</td>
	      <td>E:1</td>
        </tr>
        <tr>
          <td>
	        <button>-</button>
	      </td>
	      <td>
	        <button>-</button>
	      </td>
        </tr>
      </table>
	</td>
	<td>Option Buttons</td>
  </tr>
  
</table>
*/

// Code that dynamically draws the table
function CreateTable(savedEntries){
	if(!isTableUpToDate){
		var tbody = $("#tableBody");
		// One loop for every item in the saved shows list
	    for (var ii = 0; ii < savedEntries.length; ii++){
			// Create a row for this show and save a reference to it
		    var tr = $("<tr class='outter'/>").appendTo(tbody);
			// This string holds the html for a table row, it is very complicated and I don't think there is any way around it
			// There is a table within a table for the +/- buttons on the series and episode counts
			var appendString = "<td>" + savedEntries[ii].name + "</td>" +
			               "<td>" + "<table><tr><td class='inner'><input type='image' src='/data/plus.png' class='sPlus'></input></td><td class='inner'><input type='image' src='/data/plus.png' class='ePlus'></input>" + "</td>" +
			               "</tr><tr><td class='inner'>" + "S: " + savedEntries[ii].series + "</td><td class='inner'> E: " + savedEntries[ii].episode + "</td>" +
						   "</tr><tr><td class='inner'>" + "<input type='image' src='/data/minus.png' class='sMinus'></input></td><td class='inner'><input type='image' src='minus.png' class='eMinus'></input>" + "</td></tr></table>" +
						   "<td><input type='image' src='/data/pencil.png' class='change'></input><input type='image' src='/data/garbage.png' class='delete'></input></td>";
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

self.port.on("redraw-table", function(savedEntries){
	CreateTable(savedEntries);
});