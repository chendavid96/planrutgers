function loadCalendar(data) {
	$(document).ready(function() {
		
		var jsdata = $.parseJSON($.parseJSON(data));
		makeCalendarObjects(jsdata);
	});
}

function makeCalendarObjects(jsdata) {
	console.log("COMMENCE CALENDAR MAKING!");
	console.log("DATA EXTRACTED FOR URL:")
	console.log(jsdata);
	console.log("CALENDAR MADE!");
}