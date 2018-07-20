$(function() {

const _DEBUG = true;
var _board;
var _displayfps;
var _updatefps;

function debugPrint() {
    if (_DEBUG) console.log.apply(console, arguments);
}

function updateLoop() {
    _board.update();
    setTimeout(updateLoop, 1000.0 / _updatefps);
}

function displayLoop() {
    _board.display();
    setTimeout(displayLoop, 1000.0 / _displayfps);
}

function updateDisplayLoop() {
    _board.update();
    _board.display();
    setTimeout(updateDisplayLoop, 1000.0 / _updatefps);
}

function startLoop() {
    if (_displayfps == _updatefps) {
        // Synchronous update + display
        updateDisplayLoop();
    } else {
        // Async
        updateLoop();
        displayLoop();
    }
}

function main() {
    // parse params
    var params = new URLSearchParams(window.location.search);
    var width = parseInt(params.get("width")) || 300;
    var height = parseInt(params.get("height")) || 300;
    var seed = params.get("seed");
    var wrap = ["true","1"].includes(params.get("wrap"));
    _displayfps = parseFloat(params.get("displayfps")) || 
                               parseFloat(params.get("fps")) || 1;
    _updatefps = parseFloat(params.get("updatefps")) || 
                              parseFloat(params.get("fps")) || 1;

    _board = new Board(width, height, seed, wrap);

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

main();

}); // document.ready()