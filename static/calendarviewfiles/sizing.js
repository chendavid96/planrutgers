$(document).ready(function() {
	console.log("document loaded");
	addTimeObj();
	plannerContResize();

	$( window ).resize(function() {
	console.log("document resized.");
	plannerContResize();

	});
});

function plannerContResize() {
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	var plannercontainerHeight = windowHeight;
	var plannercontainerWidth = windowHeight*1.5; // container width calculated using 1.294 ratio (11:8.5 letter size)
	var timesObjWidth = plannercontainerWidth*(.5/11);
	var daysObjWidth = plannercontainerWidth*(1.5/11);
	var titleObjHeight = timesObjWidth*.5;
	var numHourObjs = $('.hourObj').length;
	var maxHourTextSize = 18;

	$("#plannercontainer").css("height", plannercontainerHeight);
	$("#plannercontainer").css("width", plannercontainerWidth);

	$("#timescontainer").css("height", plannercontainerHeight);
	$("#timescontainer").css("width", timesObjWidth);

	$(".dayObj").css("height", plannercontainerHeight);
	$(".dayObj").css("width", daysObjWidth);

	$(".titleObj").css("height", titleObjHeight);
	$(".titleObj").css("width", daysObjWidth);

	$(".titleText").css("line-height", timesObjWidth*.5 + "px");
	$(".titleText").css("font-size", timesObjWidth/3 + "px");

	$(".hourObj").css("height", (plannercontainerHeight-(timesObjWidth*.5))/(numHourObjs-1));
	$(".hourObj").css("width", timesObjWidth);

	$("#blankhourObj").css("height", titleObjHeight);

	$(".hourText").css("line-height", ((plannercontainerHeight-timesObjWidth)/(numHourObjs-1)) + "px");
	$(".hourText").css("font-size", timesObjWidth/4 + "px");

	$(".classObj").css("height", timesObjWidth*2);
	$(".classObj").css("width", daysObjWidth);

	// $(".classText").css("width", daysObjWidth*.95);
	$(".classText").css("line-height", timesObjWidth/2.5 + "px");
	$(".classText").css("font-size", timesObjWidth/3.5 + "px");
	$(".classText").css("padding-top", timesObjWidth/5 + "px");

}

function addTimeObj() {
	var timeObjDivString = '<div class="hourObj"><p class="hourText">00:00</p></div>';
/*	$("#timescontainer").append(timeObjDivString);*/
}