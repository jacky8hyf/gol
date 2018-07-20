$(function() {

const _DEBUG = true;
var _board;
var _wrap;
var _displayfps;
var _updatefps;

function debugPrint() {
    if (_DEBUG) console.log.apply(console, arguments);
}

function makeArray(length, func) {
    var arr = new Array(length);
    for (var i = 0; i < length; i++) arr[i] = func(i);
    return arr;
}

class Board {
    constructor(width, height, seed) {
        if (seed != null) {
            Math.seedrandom(seed);
        }
        this.width = width;
        this.height = height;
        this.data = makeArray(height, function() {
            return makeArray(width, index => Math.random() > 0.5);
        });
    }

    toString() {
        return this.data.map(function(row) {
            return row.map(function(item) {
                return item ? 1 : 0;
            }).join("");
        }).join("\n");
    }

    display() {
        debugPrint(this.toString());
    }
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
    setTimeout(displayLoop, 1000.0 / _updatefps);
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
    _wrap = ["true","1"].includes(params.get("wrap"));
    _displayfps = parseFloat(params.get("displayfps")) || 
                               parseFloat(params.get("fps")) || 1;
    _updatefps = parseFloat(params.get("updatefps")) || 
                              parseFloat(params.get("fps")) || 1;

    _board = new Board(width, height, seed);

    debugPrint({
        width: width,
        height: height,
        seed: seed,
        wrap: _wrap,
        displayfps: _displayfps,
        updatefps: _updatefps,
    });

    startLoop();
}

main();

}); // document.ready()