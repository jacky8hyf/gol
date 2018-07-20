
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
    constructor(width, height, wrap, seed, density, initData) {
        if (seed != null) {
            Math.seedrandom(seed);
        }
        this.width = width;
        this.height = height;
        this.wrap = wrap;
        this.currentDataIndex = 0;

        var data;
        if (initData == null) {
            data = make2dArray(width, height, function() {
                return Math.random() < density;
            });
        } else {
            var buffer = Uint8Array.from(atob(initData), c => c.charCodeAt(0));
            var byteIndex = 0;
            var bitIndex = 0;

            data = make2dArray(width, height, function(i, j) {
                var retVal = buffer[byteIndex] & (1 << bitIndex) ? true : false;

                bitIndex = (bitIndex + 1) % 8;
                if (bitIndex == 0) byteIndex++;

                return retVal;
            });
        }

        this.bothData = [data, make2dArray(width, height)];
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

    toBase64String() {
        var numBytes = Math.ceil(this.width * this.height / 8);
        var buffer = new Uint8Array(numBytes);
        var bitIndex = 0;
        var currentByte = 0;
        var byteIndex = 0;
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                currentByte |= (this.data[i][j] << bitIndex);

                if (bitIndex == 7) {
                    buffer[byteIndex] = currentByte;
                    byteIndex++;
                    currentByte = 0;
                }

                bitIndex = (bitIndex + 1) % 8;
            }
        }
        // store last byte
        if (bitIndex != 0) {
            view.setUint8(byteIndex, currentByte);
        }

        return btoa(String.fromCharCode.apply(null, buffer));
    }

    update() {
        var cur = this.data;
        var alt = this.alternativeData;

        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {

                var neighbors = [-1, 0, 1].map(function(di) {
                    return [-1, 0, 1].map(function(dj) {
                        if (!this.wrap) {
                            return (cur[i + di] && cur[i + di][j + dj]) << 0;
                        } else {
                            return cur[(i + di + this.height) % this.height]
                                      [(j + dj + this.width) % this.width] << 0;
                        }
                    }, this).reduce(sum);
                }, this).reduce(sum) - cur[i][j];
                alt[i][j] = neighbors == 3 || (cur[i][j] && neighbors == 2);
            }
        }

        this.currentDataIndex = 1 - this.currentDataIndex;
    }
}