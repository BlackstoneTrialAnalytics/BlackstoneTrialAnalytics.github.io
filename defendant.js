$(document).ready(pageLoad());

function pageLoad() {
	// Create our graph from the data table and specify a container to put the graph in
	var json;
	var json2;
	loadDoc();
	loadDoc2();

	function loadDoc() {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				json = JSON.parse(xhttp.responseText);
				updateValues();
				createGraph('#data-table', '.chart');
			}
		};
		xhttp.open("GET", "/Lawyers_Analytics.json", true);
		xhttp.send();
	}
	
	function loadDoc2() {
		var xhttp2 = new XMLHttpRequest();
		xhttp2.onreadystatechange = function () {
			if (xhttp2.readyState == 4 && xhttp2.status == 200) {
				json2 = JSON.parse(xhttp2.responseText);
				updateValues2();
				createGraph2('#data-table2', '.chart2');
			}
		};
		xhttp2.open("GET", "/Police_Analytics.json", true);
		xhttp2.send();
	}

	function updateValues() {
		var gender = document.getElementById("gender");
		gender = gender.options[gender.selectedIndex].value;
		var crime = document.getElementById("crime");
		crime = crime.options[crime.selectedIndex].value;
		var place = document.getElementById("place");
		place = place.options[place.selectedIndex].value;

		//Update the Lawyer Stats
		//Wins
		document.getElementById("PDW").innerHTML = String(json.VA[place][crime][gender]["WIN"].PD).substring(0, 4);
		document.getElementById("Q1W").innerHTML = String(json.VA[place][crime][gender]["WIN"].Q1).substring(0, 4);
		document.getElementById("Q2W").innerHTML = String(json.VA[place][crime][gender]["WIN"].Q2).substring(0, 4);
		document.getElementById("Q3W").innerHTML = String(json.VA[place][crime][gender]["WIN"].Q3).substring(0, 4);
		document.getElementById("Q4W").innerHTML = String(json.VA[place][crime][gender]["WIN"].Q4).substring(0, 4);
		document.getElementById("Q5W").innerHTML = String(json.VA[place][crime][gender]["WIN"].Q5).substring(0, 4);
		
		//Pleas
		document.getElementById("PDP").innerHTML = String(json.VA[place][crime][gender]["PLEA"].PD).substring(0, 4);
		document.getElementById("Q1P").innerHTML = String(json.VA[place][crime][gender]["PLEA"].Q1).substring(0, 4);
		document.getElementById("Q2P").innerHTML = String(json.VA[place][crime][gender]["PLEA"].Q2).substring(0, 4);
		document.getElementById("Q3P").innerHTML = String(json.VA[place][crime][gender]["PLEA"].Q3).substring(0, 4);
		document.getElementById("Q4P").innerHTML = String(json.VA[place][crime][gender]["PLEA"].Q4).substring(0, 4);
		document.getElementById("Q5P").innerHTML = String(json.VA[place][crime][gender]["PLEA"].Q5).substring(0, 4);
	}
	
	function updateValues2() {
		var gender = document.getElementById("gender");
		gender = gender.options[gender.selectedIndex].value;
		var crime = document.getElementById("crime");
		crime = crime.options[crime.selectedIndex].value;
		var place = document.getElementById("place");
		place = place.options[place.selectedIndex].value;

		//Update the Police Stats
		//Wins
		document.getElementById("P1W").innerHTML = String(json2.VA[place][crime][gender]["LOSS"].Q1).substring(0, 4);
		document.getElementById("P2W").innerHTML = String(json2.VA[place][crime][gender]["LOSS"].Q2).substring(0, 4);
		document.getElementById("P3W").innerHTML = String(json2.VA[place][crime][gender]["LOSS"].Q3).substring(0, 4);
		document.getElementById("P4W").innerHTML = String(json2.VA[place][crime][gender]["LOSS"].Q4).substring(0, 4);
		document.getElementById("P5W").innerHTML = String(json2.VA[place][crime][gender]["LOSS"].Q5).substring(0, 4);
		
		//Pleas
		document.getElementById("P1P").innerHTML = String(json2.VA[place][crime][gender]["PLEA"].Q1).substring(0, 4);
		document.getElementById("P2P").innerHTML = String(json2.VA[place][crime][gender]["PLEA"].Q2).substring(0, 4);
		document.getElementById("P3P").innerHTML = String(json2.VA[place][crime][gender]["PLEA"].Q3).substring(0, 4);
		document.getElementById("P4P").innerHTML = String(json2.VA[place][crime][gender]["PLEA"].Q4).substring(0, 4);
		document.getElementById("P5P").innerHTML = String(json2.VA[place][crime][gender]["PLEA"].Q5).substring(0, 4);
	}
	
	// Here be graphs
	function createGraph(data, container) {
		// Declare some common variables and container elements	
		var bars = [];
		var figureContainer = $('<div id="figure"></div>');
		var graphContainer = $('<div class="graph"></div>');
		var barContainer = $('<div class="bars"></div>');
		var data = $(data);
		var container = $(container);
		var chartData;		
		var chartYMax;
		var columnGroups;
		
		// Timer variables
		var barTimer;
		var graphTimer;
		
		// Create table data object
		var tableData = {
			// Get numerical data from table cells
			chartData: function() {
				var chartData = [];
				data.find('tbody td').each(function() {
					chartData.push($(this).text());
				});
				return chartData;
			},
			// Get heading data from table caption
			chartHeading: function() {
				var chartHeading = data.find('caption').text();
				return chartHeading;
			},
			// Get legend data from table body
			chartLegend: function() {
				var chartLegend = [];
				// Find th elements in table body - that will tell us what items go in the main legend
				data.find('tbody th').each(function() {
					chartLegend.push($(this).text());
				});
				return chartLegend;
			},
			// Get highest value for y-axis scale
			chartYMax: function() {
				var chartData = this.chartData();
				// Round off the value
				var chartYMax = 1;
				return chartYMax;
			},
			// Get y-axis data from table cells
			yLegend: function() {
				var chartYMax = this.chartYMax();
				var yLegend = [];
				// Number of divisions on the y-axis
				var yAxisMarkings = 5;						
				// Add required number of y-axis markings in order from 0 - max
				for (var i = 0; i < yAxisMarkings; i++) {
					yLegend.unshift(((chartYMax * i) / (yAxisMarkings - 1)) );
				}
				return yLegend;
			},
			// Get x-axis data from table header
			xLegend: function() {
				var xLegend = [];
				// Find th elements in table header - that will tell us what items go in the x-axis legend
				data.find('thead th').each(function() {
					xLegend.push($(this).text());
				});
				return xLegend;
			},
			// Sort data into groups based on number of columns
			columnGroups: function() {
				var columnGroups = [];
				// Get number of columns from first row of table body
				var columns = data.find('tbody tr:eq(0) td').length;
				for (var i = 0; i < columns; i++) {
					columnGroups[i] = [];
					data.find('tbody tr').each(function() {
						columnGroups[i].push($(this).find('td').eq(i).text());
					});
				}
				return columnGroups;
			}
		}
		
		// Useful variables for accessing table data		
		chartData = tableData.chartData();		
		chartYMax = tableData.chartYMax();
		columnGroups = tableData.columnGroups();
		
		// Construct the graph
		
		// Loop through column groups, adding bars as we go
		$.each(columnGroups, function(i) {
			// Create bar group container
			var barGroup = $('<div class="bar-group"></div>');
			// Add bars inside each column
			for (var j = 0, k = columnGroups[i].length; j < k; j++) {
				// Create bar object to store properties (label, height, code etc.) and add it to array
				// Set the height later in displayGraph() to allow for left-to-right sequential display
				var barObj = {};
				barObj.label = this[j];
				barObj.height = Math.floor(barObj.label / chartYMax * 100) + '%';
				barObj.bar = $('<div class="bar fig' + j + '"><span>' + barObj.label + '</span></div>')
					.appendTo(barGroup);
				bars.push(barObj);
			}
			// Add bar groups to graph
			barGroup.appendTo(barContainer);			
		});
		
		// Add heading to graph
		var chartHeading = tableData.chartHeading();
		var heading = $('<h4>' + chartHeading + '</h4>');
		heading.appendTo(figureContainer);
		
		// Add x-axis to graph
		var xLegend	= tableData.xLegend();		
		var xAxisList	= $('<ul class="x-axis"></ul>');
		$.each(xLegend, function(i) {			
			var listItem = $('<li><span>' + this + '</span></li>')
				.appendTo(xAxisList);
		});
		xAxisList.appendTo(graphContainer);
		
		// Add y-axis to graph	
		var yLegend	= tableData.yLegend();
		var yAxisList	= $('<ul class="y-axis"></ul>');
		$.each(yLegend, function(i) {			
			var listItem = $('<li><span>' + this + '</span></li>')
				.appendTo(yAxisList);
		});
		yAxisList.appendTo(graphContainer);		
		
		// Add bars to graph
		barContainer.appendTo(graphContainer);		
		
		// Add graph to graph container		
		graphContainer.appendTo(figureContainer);
		
		// Add graph container to main container
		var x = $('#figure');
		if(x.length != 0){
			$('#figure').remove();
		}
		
		figureContainer.appendTo(container);

		// Add legend to graph
		var chartLegend	= tableData.chartLegend();
		var legendList	= $('<ul class="legend"></ul>');
		$.each(chartLegend, function(i) {			
			var listItem = $('<li><span class="icon fig' + i + '"></span>' + this + '</li>')
				.appendTo(legendList);
		});
		legendList.appendTo(figureContainer);
		
		// Set individual height of bars
		function displayGraph(bars, i) {		
			// Changed the way we loop because of issues with $.each not resetting properly
			if (i < bars.length) {
				// Animate height using jQuery animate() function
				$(bars[i].bar).animate({
					height: bars[i].height
				}, 800);
				// Wait the specified time then run the displayGraph() function again for the next bar
				barTimer = setTimeout(function() {
					i++;				
					displayGraph(bars, i);
				}, 100);
			}
		}
		
		// Reset graph settings and prepare for display
		function resetGraph() {
			// Stop all animations and set bar height to 0
			$.each(bars, function(i) {
				$(bars[i].bar).stop().css('height', 0);
			});
			
			// Clear timers
			clearTimeout(barTimer);
			clearTimeout(graphTimer);
			
			// Restart timer		
			graphTimer = setTimeout(function() {		
				displayGraph(bars, 0);
			}, 200);
		}
		
		// Finally, display graph via reset function
		resetGraph();
	}	
	
	function createGraph2(data, container) {
		// Declare some common variables and container elements	
		var bars = [];
		var figureContainer = $('<div id="figure2"></div>');
		var graphContainer = $('<div class="graph"></div>');
		var barContainer = $('<div class="bars"></div>');
		var data = $(data);
		var container = $(container);
		var chartData;		
		var chartYMax;
		var columnGroups;
		
		// Timer variables
		var barTimer;
		var graphTimer;
		
		// Create table data object
		var tableData = {
			// Get numerical data from table cells
			chartData: function() {
				var chartData = [];
				data.find('tbody td').each(function() {
					chartData.push($(this).text());
				});
				return chartData;
			},
			// Get heading data from table caption
			chartHeading: function() {
				var chartHeading = data.find('caption').text();
				return chartHeading;
			},
			// Get legend data from table body
			chartLegend: function() {
				var chartLegend = [];
				// Find th elements in table body - that will tell us what items go in the main legend
				data.find('tbody th').each(function() {
					chartLegend.push($(this).text());
				});
				return chartLegend;
			},
			// Get highest value for y-axis scale
			chartYMax: function() {
				var chartData = this.chartData();
				// Round off the value
				var chartYMax = 1;
				return chartYMax;
			},
			// Get y-axis data from table cells
			yLegend: function() {
				var chartYMax = this.chartYMax();
				var yLegend = [];
				// Number of divisions on the y-axis
				var yAxisMarkings = 5;						
				// Add required number of y-axis markings in order from 0 - max
				for (var i = 0; i < yAxisMarkings; i++) {
					yLegend.unshift(((chartYMax * i) / (yAxisMarkings - 1)) );
				}
				return yLegend;
			},
			// Get x-axis data from table header
			xLegend: function() {
				var xLegend = [];
				// Find th elements in table header - that will tell us what items go in the x-axis legend
				data.find('thead th').each(function() {
					xLegend.push($(this).text());
				});
				return xLegend;
			},
			// Sort data into groups based on number of columns
			columnGroups: function() {
				var columnGroups = [];
				// Get number of columns from first row of table body
				var columns = data.find('tbody tr:eq(0) td').length;
				for (var i = 0; i < columns; i++) {
					columnGroups[i] = [];
					data.find('tbody tr').each(function() {
						columnGroups[i].push($(this).find('td').eq(i).text());
					});
				}
				return columnGroups;
			}
		}
		
		// Useful variables for accessing table data		
		chartData = tableData.chartData();		
		chartYMax = tableData.chartYMax();
		columnGroups = tableData.columnGroups();
		
		// Construct the graph
		
		// Loop through column groups, adding bars as we go
		$.each(columnGroups, function(i) {
			// Create bar group container
			var barGroup = $('<div class="bar-group"></div>');
			// Add bars inside each column
			for (var j = 0, k = columnGroups[i].length; j < k; j++) {
				// Create bar object to store properties (label, height, code etc.) and add it to array
				// Set the height later in displayGraph() to allow for left-to-right sequential display
				var barObj = {};
				barObj.label = this[j];
				barObj.height = Math.floor(barObj.label / chartYMax * 100) + '%';
				barObj.bar = $('<div class="bar fig' + j + '"><span>' + barObj.label + '</span></div>')
					.appendTo(barGroup);
				bars.push(barObj);
			}
			// Add bar groups to graph
			barGroup.appendTo(barContainer);			
		});
		
		// Add heading to graph
		var chartHeading = tableData.chartHeading();
		var heading = $('<h4>' + chartHeading + '</h4>');
		heading.appendTo(figureContainer);
		
		// Add x-axis to graph
		var xLegend	= tableData.xLegend();		
		var xAxisList	= $('<ul class="x-axis"></ul>');
		$.each(xLegend, function(i) {			
			var listItem = $('<li><span>' + this + '</span></li>')
				.appendTo(xAxisList);
		});
		xAxisList.appendTo(graphContainer);
		
		// Add y-axis to graph	
		var yLegend	= tableData.yLegend();
		var yAxisList	= $('<ul class="y-axis"></ul>');
		$.each(yLegend, function(i) {			
			var listItem = $('<li><span>' + this + '</span></li>')
				.appendTo(yAxisList);
		});
		yAxisList.appendTo(graphContainer);		
		
		// Add bars to graph
		barContainer.appendTo(graphContainer);		
		
		// Add graph to graph container		
		graphContainer.appendTo(figureContainer);
		
		// Add graph container to main container
		var x = $('#figure2');
		if(x.length != 0){
			$('#figure2').remove();
		}
		
		figureContainer.appendTo(container);

		// Add legend to graph
		var chartLegend	= tableData.chartLegend();
		var legendList	= $('<ul class="legend"></ul>');
		$.each(chartLegend, function(i) {			
			var listItem = $('<li><span class="icon fig' + i + '"></span>' + this + '</li>')
				.appendTo(legendList);
		});
		legendList.appendTo(figureContainer);
		
		// Set individual height of bars
		function displayGraph(bars, i) {		
			// Changed the way we loop because of issues with $.each not resetting properly
			if (i < bars.length) {
				// Animate height using jQuery animate() function
				$(bars[i].bar).animate({
					height: bars[i].height
				}, 800);
				// Wait the specified time then run the displayGraph() function again for the next bar
				barTimer = setTimeout(function() {
					i++;				
					displayGraph(bars, i);
				}, 100);
			}
		}
		
		// Reset graph settings and prepare for display
		function resetGraph() {
			// Stop all animations and set bar height to 0
			$.each(bars, function(i) {
				$(bars[i].bar).stop().css('height', 0);
			});
			
			// Clear timers
			clearTimeout(barTimer);
			clearTimeout(graphTimer);
			
			// Restart timer		
			graphTimer = setTimeout(function() {		
				displayGraph(bars, 0);
			}, 200);
		}
		
		// Finally, display graph via reset function
		resetGraph();
	}	
}

$(document).ready(function() {

  $("#place").change(function() {

    var place = $(this) ;
	var crime = $("#crime option:last-child").val() ;
	
    if(place.val() !== "FAIRFAX CITY" ) {
		if(crime !== "FELONY")
			$("#crime").append("<option value=\"FELONY\">Felony</option>");
    }
      else if(place.val() === "FAIRFAX CITY" ) {
        $("#crime option:last-child").remove() ; }
  });

});
