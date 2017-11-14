/* set up some things for use later: */
var centreX = centreY = radius = 0;
var wheel, time, arrow;
var segmentAngleDeg = segmentAngleRad = textAngleDeg = textAngleRad = 0;
var segments = {}, texts = {}, colours = {};
var paper;
var spinning = false;


/* FUNCTIONS */
function getRandomColour() {
    function colour() {
        var john = Math.floor(Math.random() * 255);
        john = john < 100 ? (john + 100).toString() : john.toString();
        return john;
    }
    var c = "rgb(" + colour() + "," + colour() + "," + colour() + ")";
    return c;
}

function drawWheel(elementId, options, drawArrow) {
    var w = $(elementId).width();
    var h = $(elementId).height();
    paper = Raphael(elementId, w, h);
    wheel = paper.set();

    propX = w / (drawArrow ? 2.5 : 2);
    propY = h / 2;
    radius = (propX > propY) ? propY : propX;
    centreX = centreY = radius + 1;
    var number = 0;
    for (x in options) {
        number++;
    }
    segmentAngleDeg = 360 / number;
    segmentAngleRad = 2 * Math.PI / number;
    textAngleDeg = segmentAngleDeg / 2;
    textAngleRad = segmentAngleRad / 2;
    var angle = 0;
    for (x in options) {
        colours[x] = getRandomColour();
        segments[x] = paper.path("M" + centreX + "," + centreY + "L" + (centreX + radius * Math.cos(angle)) + "," + (centreY + radius * Math.sin(angle)) + "A" + radius + "," + radius + ",0,0,1," + (centreX + radius * Math.cos(angle + segmentAngleRad)) + "," + (centreY + radius * Math.sin(angle + segmentAngleRad)) + "L" + centreX + "," + centreY);
        segments[x].attr({ "fill": colours[x], "opacity": 1, "stroke-width": 0 });
        texts[x] = paper.text((centreX + radius * Math.cos(angle + textAngleRad)), (centreY + radius * Math.sin(angle + textAngleRad)), options[x] + "\u00a0" + "\u00a0" + "\u00a0" + "\u00a0").attr({ "text-anchor": "end", "font-size": 10 });
        texts[x].transform("R" + (360 * (angle + textAngleRad) / (2 * Math.PI)) + "," + (centreX + radius * Math.cos(angle + textAngleRad)) + "," + (centreY + radius * Math.sin(angle + textAngleRad)));
        wheel.push(segments[x], texts[x]);
        angle += segmentAngleRad;
    }
    if (drawArrow) {
        arrow = paper.path();
        arrow.attr({
            "path": "M" + (centreX + 1.5 * radius - 2) + "," + centreY +
            "L" + (centreX + 1.5 * radius - 2) + "," + (centreY - radius * 0.1) +
            "L" + (centreX + 1.25 * radius) + "," + (centreY - radius * 0.035) +
            "L" + (centreX + 1.25 * radius) + "," + (centreY - radius * 0.14) +
            "L" + (centreX + radius) + "," + centreY +
            "L" + (centreX + 1.25 * radius) + "," + (centreY + radius * 0.14) +
            "L" + (centreX + 1.25 * radius) + "," + (centreY + radius * 0.035) +
            "L" + (centreX + 1.5 * radius - 2) + "," + (centreY + radius * 0.1) +
            "L" + (centreX + 1.5 * radius - 2) + "," + centreY
        });
        arrow.attr({ "fill": "white", "stroke-width": 2, "stroke": "red" });
    }
    for (var x in texts) texts[x].toFront();
    time = 2160 + textAngleDeg;
}

var tempText;
var arrowText = "poop";
function spinWheel() {
    if (spinning) return false;
    console.log('spin!');
    spinning = true;
    if (arrowText != "poop") arrowText.remove();
    var length = Math.round(Math.random() * 10);
    time += (segmentAngleDeg) * Math.round(Math.random() * 10);
    wheel.animate({ "transform": ("...R" + (time) + "," + centreX + "," + centreY) }, time + 2000, "cubic-bezier(0,1.22,.59,.97)");
    setTimeout(function () {
        for (var x in segments) {
            if (segments[x].isPointInside((centreX + radius - 3), (centreY + 3)) == true) {
                tempText = texts[x].attr().text;
                tempColour = colours[x];
                arrow.attr({ "fill": tempColour });
                $("#result").html(tempText);
                $("#result").css({ "animation-duration": "1s", "visibility": "visible" });
                $("#linkToQuiz").css({ "visibility": "visible" });
            }
        }
        spinning = false;
    }, time + 2000);
    time = 2160;
}

function spinWheelConstantly() {
    var constantSpin = Raphael.animation({
        "transform": ("...R" + 360 + "," + centreX + "," + centreY),
    }, 2000);

    console.log(constantSpin);

    wheel.animate(constantSpin.repeat(Infinity));
}

