
function makeArray(length, func) {
    var arr = new Array(length);
    for (var i = 0; i < length; i++) arr[i] = func(i);
    return arr;
}

function make2dArray(width, height, val) {
    return makeArray(height, function(i) {
        return makeArray(width, function (j) {
            return typeof val === "function" ? val(i, j) : val;
        });
    });
}

function sum(x, y) { return x + y; }

class Board {
    constructor(width, height, seed, wrap) {
        if (seed != null) {
            Math.seedrandom(seed);
        }
        this.width = width;
        this.height = height;
        this.wrap = wrap;
        this.bothData = [
            make2dArray(width, height, function() {
                return Math.random() > 0.5;
            }), 
            make2dArray(width, height)];
        this.currentDataIndex = 0;
    }

    get data() {
        return this.bothData[this.currentDataIndex];
    }
    get alternativeData() {
        return this.bothData[1 - this.currentDataIndex];
    }

    toString(trueValue, falseValue, linebreak) {
        if (trueValue == null) trueValue = 1;
        if (falseValue == null) falseValue = 0;
        return this.data.map(function(row) {
            return row.map(function(item) {
                return item ? trueValue : falseValue;
            }).join("");
        }).join(linebreak || "\n");
    }

    display() {
        $("p").html(this.toString("M", "_", "<br />"));
    }

    update() {
        var cur = this.data;
        var alt = this.alternativeData;

        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {

                var neighbors = [-1, 0, 1].map(function(di) {
                    return [-1, 0, 1].map(function(dj) {
                        return (cur[i + di] && cur[i + di][j + dj]) << 0;
                    }).reduce(sum);
                }).reduce(sum) - cur[i][j];
                alt[i][j] = neighbors == 3 || (cur[i][j] && neighbors == 2);
            }
        }

        this.currentDataIndex = 1 - this.currentDataIndex;
    }
}