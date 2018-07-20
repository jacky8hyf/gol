

const _DEBUG = true;
var _board;
var _displayDelay;
var _updateDelay;
var _params;

function debugPrint() {
    if (_DEBUG) console.log.apply(console, arguments);
}

function display() {
    $("#textcvs").html(_board.toString("M", "_", "<br />"));
    var base64 = _board.toBase64String();
    _params.set("data", base64)
    $("#export").attr("href", "?" + _params.toString());
}

function updateLoop() {
    _board.update();
    setTimeout(updateLoop, _updateDelay);
}

function displayLoop() {
    display();
    setTimeout(displayLoop, _displayDelay);
}

function updateDisplayLoop() {
    _board.update();
    display();
    setTimeout(updateDisplayLoop, _updateDelay);
}

function startLoop() {
    display();
    if (_displayDelay == _updateDelay) {
        // Synchronous update + display
        setTimeout(updateDisplayLoop, _updateDelay)
    } else {
        // Async
        setTimeout(updateLoop, _updateDelay);
        setTimeout(displayLoop, _displayDelay);
    }
}

function main() {
    // parse params
    _params = new URLSearchParams(window.location.search);
    var width = parseInt(_params.get("width")) || 300;
    var height = parseInt(_params.get("height")) || 300;
    var seed = _params.get("seed");
    var density = parseFloat(_params.get("density")) || 0.5;
    var data = _params.get("data");
    var wrap = ["true","1"].includes(_params.get("wrap"));
    var displayfps = parseFloat(_params.get("displayfps")) || 
                                parseFloat(_params.get("fps")) || 1;
    var updatefps = parseFloat(_params.get("updatefps")) || 
                               parseFloat(_params.get("fps")) || 1;
    _displayDelay = 1000 / displayfps;
    _updateDelay = 1000 / updatefps;

    _board = new Board(width, height, wrap, seed, density, data);

    debugPrint({
        width: width,
        height: height,
        seed: seed,
        wrap: wrap,
        density: density,
        displayfps: displayfps,
        updatefps: updatefps,
    });
    startLoop();
}
$(function() {
main();

}); // document.ready()