

const _DEBUG = true;
var _board;
var _displayfps;
var _updatefps;
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

function updateLoop(isFirstFrame) {
    if(!isFirstFrame) _board.update();
    setTimeout(updateLoop, 1000.0 / _updatefps);
}

function displayLoop() {
    display();
    setTimeout(displayLoop, 1000.0 / _displayfps);
}

function updateDisplayLoop(isFirstFrame) {
    if (!isFirstFrame) _board.update();
    display();
    setTimeout(updateDisplayLoop, 1000.0 / _updatefps);
}

function startLoop() {
    if (_displayfps == _updatefps) {
        // Synchronous update + display
        updateDisplayLoop(true);
    } else {
        // Async
        updateLoop(true);
        displayLoop();
    }
}

function main() {
    // parse params
    _params = new URLSearchParams(window.location.search);
    var width = parseInt(_params.get("width")) || 300;
    var height = parseInt(_params.get("height")) || 300;
    var seed = _params.get("seed");
    var data = _params.get("data");
    var wrap = ["true","1"].includes(_params.get("wrap"));
    _displayfps = parseFloat(_params.get("displayfps")) || 
                               parseFloat(_params.get("fps")) || 1;
    _updatefps = parseFloat(_params.get("updatefps")) || 
                              parseFloat(_params.get("fps")) || 1;

    _board = new Board(width, height, seed, wrap, data);

    debugPrint({
        width: width,
        height: height,
        seed: seed,
        wrap: wrap,
        displayfps: _displayfps,
        updatefps: _updatefps,
    });
    startLoop();
}
$(function() {
main();

}); // document.ready()