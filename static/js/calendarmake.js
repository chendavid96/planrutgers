var urlpath = window.location.pathname;
var wrapperwidth;
var wrapperheight;
var timebarwidth;
var timebarheight;
var timebarspacerheight;
var columnwidth;
var newdivcount = 0;
var subject, course, section, index;

function loadCalendar(data) {
	$(document).ready(function() {
		var jsdata = $.parseJSON($.parseJSON(data));
		makeCalendarObjects(jsdata);
		var link = $("#customlinktext");
		link.text("planrutgers.com"+urlpath);
		$(window).resize(function() {
			sizeColumns();
		});
	});
}

function makeCalendarObjects(jsdata) {
	sizeColumns();
	insertClasses(jsdata);
}

function sizeColumns() {
	wrapperwidth = parseFloat($("#calendarwrapper").css("width"));
	wrapperheight = parseFloat($("#calendarwrapper").css("height"));
	timebarwidth = wrapperwidth*0.07;
	timebarspacerheight = wrapperheight/25;
	timebarheight = (wrapperheight-timebarspacerheight)/15;
	columnwidth = Math.floor((wrapperwidth-timebarwidth)/7);

	$(".column").css("width",columnwidth);
	$(".column").css("height",wrapperheight);
	$(".column.time").css("width",timebarwidth);
	$(".hour").css("width",timebarwidth);
	$(".hour").css("height",timebarheight);
	$(".hour.spacer").css("height",timebarspacerheight);
	$(".daytextdiv").css("width",columnwidth);
	$(".daytext").css("line-height",timebarspacerheight + "px");
	$(".hourtext").css("line-height",0 + "px");
	$(".hourseparator").css("width",wrapperwidth);
	$(".hourseparator").css("height",timebarheight);
	$(".hourseparator.spacer").css("height",timebarspacerheight);
	$("#legend").css({"right":$("#calendarwrapper").css("margin-right")});

}

function insertClasses(jsdata) {
	var x,y;
	for (x in jsdata) {
		// console.log(jsdata[x]);
		course = jsdata[x]["Course"];
		subject = jsdata[x]["Subject"];
		section = jsdata[x]["Section"];
		index = jsdata[x]["Index"];
		if (jsdata[x]["MeetingTimes"].length != 0){
			for (y in jsdata[x]["MeetingTimes"]){
				// console.log(jsdata[x]["MeetingTimes"][y]);
				makeBox(jsdata[x]["MeetingTimes"][y]);
			}
		}
	}

}

function makeBox(jsInfo){
	var day,campus,duration,building,start,end,room,ampmcode,campuscolorclass,title,tmpstart;

	day = jsInfo["DAY"];
	campus = jsInfo["CAMPUS"];
	duration = jsInfo["DURATION"];
	building = jsInfo["BUILDING"];
	start = parseInt(jsInfo["START TIME"]);
	end = parseInt(jsInfo["END TIME"]);
	room = jsInfo["ROOM"];
	ampmcode = jsInfo["MORN-EVE-CODE"];
	title = jsInfo["TITLE"];

	var heightofbox = (duration/900)*(wrapperheight-timebarspacerheight);
	var startposition;
	var begintimeminutes;

	if (ampmcode == "A"){
		begintimeminutes = (start%100) + (((start-start%100)/100)*60);
		// console.log("begintimeminutes:"+begintimeminutes);
		startposition = (((begintimeminutes-480)/900)*(wrapperheight-timebarspacerheight)) + timebarspacerheight;
		// console.log("startposition:"+startposition);
	}
	else if ((start >= 1200) && (start <= 1259)){
		begintimeminutes = (start%100) + (((start-start%100)/100)*60);
		// console.log("begintimeminutes:"+begintimeminutes);
		startposition = (((begintimeminutes-480)/900)*(wrapperheight-timebarspacerheight)) + timebarspacerheight;
		// console.log("startposition:"+startposition);
	}
	else {
		tmpstart = start + 1200;
		begintimeminutes = (tmpstart%100) + (((tmpstart-tmpstart%100)/100)*60);
		// console.log("begintimeminutes:"+begintimeminutes);
		startposition = (((begintimeminutes-480)/900)*(wrapperheight-timebarspacerheight)) + timebarspacerheight;
		// console.log("startposition:"+startposition);
	}

	if (campus=="LIVINGSTON") {
		campuscolorclass = "livingston";
	}
	else if (campus=="BUSCH") {
		campuscolorclass = "busch";
	}
	else if (campus=="DOUGLAS/COOK") {
		campuscolorclass = "cookdouglass";
	}
	else if (campus=="COLLEGE AVENUE") {
		campuscolorclass = "collegeave";
	}
	else {
		campuscolorclass = "unknowncampus";
	}

	jsInfo["START TIME"] = jsInfo["START TIME"].substring(0,2) + ":" + jsInfo["START TIME"].substring(2);
	jsInfo["END TIME"] = jsInfo["END TIME"].substring(0,2) + ":" + jsInfo["END TIME"].substring(2); 
	newdivcount++;
	var newdiv = "<div class='dynadiv "+campuscolorclass+" "+newdivcount+"' style='top:100px; width:"+(columnwidth-2)+"px;\
	height:0px;'>\
	<h2>"+title+"</h2>\
	<h2>"+subject+":"+course+" ["+section+"]</h2>\
	<h2>"+jsInfo["START TIME"]+"-"+jsInfo["END TIME"]+" ["+building+"-"+room+"]</h2>\
	</div>";


	switch(day){
		case "M":
		$(".column.monday").append(newdiv);
		break;

		case "T":
		$(".column.tuesday").append(newdiv);
		break;

		case "W":
		$(".column.wednesday").append(newdiv);
		break;

		case "TH":
		$(".column.thursday").append(newdiv);
		break;

		case "F":
		$(".column.friday").append(newdiv);
		break;

		case "S":
		$(".column.saturday").append(newdiv);
		break;

		case "SU":
		$(".column.sunday").append(newdiv);
		break;

	}

	$(".dynadiv."+campuscolorclass+"."+newdivcount).animate({"height":heightofbox, "top":startposition}, {duration: 1000, queue: false});

	// console.log(day);
	// console.log(campus);
	// console.log(duration);
	// console.log(building);
	// console.log(start);
	// console.log(end);
	// console.log(room);
}

function customlinking(){

}