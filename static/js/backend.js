var windowHeight = $(window).height();
var windowWidth = $(window).width();

var courseInputCount;
var buttondivtop;
var response;
var finalInfo;
var c;
var urlstr;

var submitCount = 0;
var maxAllottedCourses = 10;


$(document).ready(function() {
	$("#addclassbutton").hover(
		function() {
			$("#addclassbutton").animate({backgroundColor: "#e93631"}, {duration: 500, queue: false});
		},
		function() {
			$("#addclassbutton").animate({backgroundColor: "#d74844"}, {duration: 500, queue: false});
		});

	// resizing();

	// $( window ).resize(function() {
	// 	console.log("Document Resized.");
	// 	resizing();
	// });
});

// function resizing() {

// }

function showClassInputAreas() {

	$("#addclassbutton").attr("disabled", true); // disable the "Add Your Classes" button after click to prevent mis-trigger
	$("#addclassbutton").unbind("mouseenter mouseleave");
	buttondivtop = parseInt($("#buttondiv").css("top").replace(/[^-\d\.]/g, ''), 10); // gets "Add Your Classes" top value after load
	$("#buttondiv").animate({"top": (buttondivtop + 480).toString() + "px", "height": "75px", 
		"margin-bottom": "75px"}, {duration: 700, queue: false}); // animates the "Add Your Classes" button smoothly downward
	$(".courseinputdiv").animate({"margin-bottom": "20px"}, {duration: 1200, queue: false}); // spaces out the input areas
	$(".courseinputdiv input").animate({backgroundColor: "white"}, 1000); // resets all backgrounds to white in case they're not

	$("#addclassbutton").animate({color: "#d74844", backgroundColor: "white", "width": "388px", 
		"margin-right": "20px"}, {duration: 1000, queue: false}); // makes the "Add Your Classes" button sized to "Add Another Class" button
	
	$("#submitbutton").show(); // shows "Submit" button
	$("#submitbutton").animate({"width": "300px"}, {duration: 1000, queue: false}); // sizes the "Submit" button
	$("#submitbutton").hover(
		function() {
			$("#submitbutton").animate({backgroundColor: "#e93631"}, {duration: 500, queue: false});
		},
		function() {
			$("#submitbutton").animate({backgroundColor: "#d74844"}, {duration: 500, queue: false});
		});
	courseInputCount = 4; // keeps track of how many course input areas are displayed


	$("#addclassbutton").attr("onclick", "addAnotherClass()"); // changes behavior of onclick to match replaced button
	$("#addclassbutton").text("Add Another Class");
	$("html, body").animate({ scrollTop: $(document).height() }, "slow"); // scrolls down after inputs become visible
	$("#addclassbutton").promise().done(function(){
		$("#addclassbutton").attr("disabled", false); // once all is done, re-activate the button
	});

}

// function hideClassInputAreas() {
// 	var buttondivtop = parseInt($("#buttondiv").css("top").replace(/[^-\d\.]/g, ''), 10);
// 	$("#buttondiv").animate({"top": (buttondivtop - 430).toString() + "px"}, {duration: 1000, queue: false});
// 	$("#buttondiv").animate({"height": "300px"}, {duration: 1000, queue: false});
// 	$("#addclassbutton").animate({backgroundColor: "#C12E2A"}, 300);
// 	$(".courseinputdiv").animate({"margin-bottom": "0px"}, {duration: 1000, queue: false});
// 	$("#addclassbutton").attr("onclick", "showClassInputAreas()");
// }


function addAnotherClass() {

	if (courseInputCount < maxAllottedCourses) { // maximum allotted courses
		buttondivtop = parseInt($("#buttondiv").css("top").replace(/[^-\d\.]/g, ''), 10);
		c = $(".courseinputdiv").first().clone(); // makes a copy of the first input area
		c.find("input").val(""); // makes all values blank
		// c.addClass("extra"); // adds extra class 
		c.find("input").css("background-color","white"); // changes background color to original
		c.find("input").css("color","#d74844"); // changes text color to original

		$("#buttondiv").animate({"top": (buttondivtop + 95).toString() + "px", "margin-bottom": "125px"}, {duration: 100, queue: false}); // button has to move down for new input space
		$("#inputarea").append(c); // add new input into input area
		courseInputCount++;
		$("html, body").animate({ scrollTop: $(document).height() }, "fast"); // scrolls down after input add
	}

	else {
		$("#addclassbutton").animate({backgroundColor: "#d74844", color: "white"}, {duration: 700, queue: false});
		$("#addclassbutton").text("Maxed Out (" + maxAllottedCourses + ")");
		$("#addclassbutton").attr("disabled", true);
	}
}

function submit(){
	if (checkInputComplete()) {
		submitCount++;
		if (submitCount > 20){
			alert("You've submitted input more than 15 times. Please refresh the page and enter info again to make sure you're not a bot.");
			return;
		}

		buttondivtop = parseInt($("#buttondiv").css("top").replace(/[^-\d\.]/g, ''), 10);
		var extraboxes = $(".extra").length;

		$(".courseinputdiv input").attr("disabled", true);
		$("#addclassbutton").attr("disabled", true);
		$("#submitbutton").attr("disabled", true);


		// $("#addclassbutton").animate({"width": "110px"}, {duration: 700, queue: false});
		// $("#addclassbutton").animate({"margin-right": "-10px"}, {duration: 700, queue: false});
		// $("#addclassbutton").text(":)");
		// $("#addclassbutton").animate({backgroundColor: "#4BB652"}, {duration: 700, queue: false});
		// $("#submitbutton").animate({"width": "608px"}, {duration: 700, queue: false});
		

		
		// $("#addclassbutton").animate({"height": "0px"}, {duration: 400, queue: false});
		

		
		// $("#buttondiv").animate({"top": (buttondivtop - 430 - (95*extraboxes)).toString() + "px"}, {duration: 1000, queue: false});
		// $(".extra input").animate({"height": "0", "margin-bottom": "0px", "border": "5px"}, {duration: 1000, queue: false});
		// $(".extra").animate({"height": "0", "margin-bottom": "0px"}, {duration: 1000, queue: false});
		// $("#inputarea").animate({"height": "300px"}, {duration: 1000, queue: false});
		// $("#buttondiv").animate({"height": "500px"}, {duration: 1000, queue: false});
		
		$("#submitbutton").text("Checking...");
		$("#loadingscreen").show();

		sendForm(parseAllInput());
		
		
		return;

	}

}

function checkInputComplete() {
	var inputs, i, j;
	var inputcompletecount;
	var inputtotalcount = 0;

	inputs = document.getElementsByClassName("courseinputdiv");

	for (i = 0; i < inputs.length; i++) { 
		$(".courseinputdiv input").animate({backgroundColor: "white", color: "#d74844"}, {duration: 700, queue: false});
		// console.log("COURSE #" + (i+1) + " INFORMATION:\n");
		inputcompletecount = 0;
		for (j = 0; j < inputs[i].children.length; j++) {
			if (inputs[i].children[j].value != "") {
				inputcompletecount++;
				inputtotalcount++;
			}
			if (inputs[i].children[j].value.length == 1) {
				inputs[i].children[j].value = "0" + inputs[i].children[j].value;
			}
		}

		if ((inputcompletecount != 3) && (inputcompletecount != 0)) {
			$(".courseinputdiv:eq(" + i + ") input").animate({backgroundColor: "#d74844", color: "white"}, {duration: 700, queue: false});
			$("#submitbutton").text("Missing Input(s)!");
			return false;
		}

	}

	if (inputtotalcount < 1) {
		$("#submitbutton").text("Enter One!");
		return false;
	}

	return true;
}

function parseAllInput() {
	var allCoursesArray = [];
	var CourseInputArray = [];
	var x, y, z;
	var allCoursesObjects;

	allCoursesObjects = document.getElementsByClassName("courseinputdiv");

	outer:
	for (x = 0; x < allCoursesObjects.length; x++) {
		// console.log("course input #" + (x+1) + "-------");
		CourseInputArray = [];
		for (y = 0; y < allCoursesObjects[x].children.length; y++) {
			if (allCoursesObjects[x].children[y].value == "") {
				// console.log("course input #" + (x+1) + " is empty. skipping.");
				continue outer;
			}
			else {
				CourseInputArray.push(allCoursesObjects[x].children[y].value.toUpperCase());
			}
		}
		if (CourseInputArray.length == 3) {
			allCoursesArray.push(CourseInputArray);
		}
	}

	return allCoursesArray;
}


function sendForm(info){
	response = $.ajax({
		type: "POST",
		url: "/submit",
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify(info),
		cache: false,
		success: function(result, status, XHR) {
			response = XHR;

			if (checkForValidity() == false) {
				$("#submitbutton").text("Check Input(s)!");
				$("#loadingscreen").hide();
				$(".courseinputdiv input").attr("disabled", false);
				$("#addclassbutton").attr("disabled", false);
				$("#submitbutton").attr("disabled", false);
			}

			else {
				urlstr = response.responseJSON["url"];
				$("#submitbutton").unbind("mouseenter mouseleave");
				$("#submitbutton").text("\u27A5");
				$("#addclassbutton").text("View My Schedule");
				$("#loadingscreen").hide();
				$("#submitbutton").css({"border": "1px #4BB652 dotted", "border-top-left-radius": "0px", "border-bottom-left-radius": "0px"});
				$("#submitbutton").animate({backgroundColor: "white", color: "#4BB652", "width": "100px"}, {duration: 500, queue: false});
				$("#addclassbutton").css({"border": "1px #4BB652 dotted"});
				$("#addclassbutton, #submitbutton").hover(
					function() {
						$("#submitbutton").animate({backgroundColor: "#4BB652", color: "white"}, {duration: 200, queue: false});
					},
					function() {
						$("#submitbutton").animate({backgroundColor: "white", color: "#4BB652"}, {duration: 200, queue: false});
					});
				$("#addclassbutton").animate({backgroundColor: "white", color: "#4BB652"}, {duration: 500, queue: false});
				$("#addclassbutton").animate({"width": "612px", "margin-right": "-7px"}, {duration: 500, queue: false});



				$("#addclassbutton").promise().done(function(){
					$("#addclassbutton").attr("disabled", false);
					$("#addclassbutton").attr("onclick", "redirectToCalendarPage()");
				});

				$("#submitbutton").promise().done(function(){
					$("#submitbutton").prop("type", "button");
					$("#submitbutton").attr("disabled", false);
					$("#submitbutton").attr("onclick", "redirectToCalendarPage()");
				});

				// printtheGoodies();

			}

		}
	});

return;
}

function printtheGoodies() {
	// console.log("RESPONSE CODE:\n");
	// console.log(response.status);
	// console.log("RESPONSE JSON OBJECT:\n");
	console.log(response.responseJSON);

	return;
}

function checkForValidity() {

	$(".courseinputdiv input").animate({backgroundColor: "white", color: "#d74844"}, 700);
	var jsonobj = response.responseJSON;
	var falseinputs = 0;

	for (var p in jsonobj) {
		if ((jsonobj[p].hasOwnProperty("Found")) && (jsonobj[p]["Found"] == false)) { // runs for each subject/course/section not found
			
			falseinputs++;

			if (jsonobj[p]["ErrMsg"] == "Subject Not Found") {
				markInvalidInputs(jsonobj[p], "Subject");
			}

			else if (jsonobj[p]["ErrMsg"] == "Course Not Found") {
				markInvalidInputs(jsonobj[p], "Course");
			}

			else if (jsonobj[p]["ErrMsg"] == "Section Not Found") {
				markInvalidInputs(jsonobj[p], "Section");
			}

			else {
				console.log("Something went wrong. Was looping through at current variable " + p);
			}

		}

	}

	if (falseinputs > 0) {
		return false;
	}

	return true;
}

function markInvalidInputs(invalidCourse, invalidInput) {

	var invalidCourseSubject = invalidCourse["Subject"];
	var invalidCourseCourse = invalidCourse["Course"];
	var invalidCourseSection = invalidCourse["Section"];

	// console.log(invalidCourseSubject + invalidCourseCourse + invalidCourseSection);
	// console.log(invalidInput);
	// console.log("\n");

	var x,y;
	var courseinputboxes = document.getElementsByClassName("courseinputdiv");

	for (x = 0; x < courseinputboxes.length; x++) {

		// console.log(courseinputboxes[x].children);

		if ((courseinputboxes[x].children[0].value == invalidCourseSubject) &&
			(courseinputboxes[x].children[1].value == invalidCourseCourse) &&
			(courseinputboxes[x].children[2].value.toUpperCase() == invalidCourseSection)) {

			// console.log("The " + invalidInput + " part of the course code is invalid.");

		$("." + invalidInput.toLowerCase() + ":eq(" + x + ")").animate(
			{backgroundColor: "#d74844", color: "white"}, {duration: 700, queue: false});
	}

}



}

function redirectToCalendarPage() {

	window.open("/" + urlstr, "_blank");
	return;
}