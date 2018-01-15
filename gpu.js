var PC = require("./PC");

function GPU(bios) {
    this.BIOS = bios;
    this.log = document.getElementById("log");
    this.c = document.getElementById("screen");
    this.ctx = this.c.getContext("2d");
}

GPU.prototype.print = function(text) {
    console.log("ERROR")
    this.log.innerHTML = this.log.innerHTML + "<p>" + text + "</p>";
    return console.log(text);
}

GPU.prototype.updateScreen = function() {
    for (x = 0; x < 64; x++) {
        for (y = 0; y < 36; y++) {
            this.drawPixel(x, y);
        }
    }
}

GPU.prototype.drawPixel = function(x, y) {
    //this.BIOS.ram.cnst.screen[x + (y * 64)]
    // var r = this.BIOS.ram.cnst.screen[x + (y * 64)][0].toString(16);
    // if (r.length < 2) {
    //     r = "0" + r;
    // };
    // var g = this.BIOS.ram.cnst.screen[x + (y * 64)][1].toString(16);
    // if (g.length < 2) {
    //     g = "0" + g;
    // };
    // var b = this.BIOS.ram.cnst.screen[x + (y * 64)][2].toString(16);
    // if (b.length < 2) {
    //     b = "0" + b;
    // };
    var rgb = this.parseRGB(this.BIOS.ram.cnst.screen[x + (y * 64)][0], this.BIOS.ram.cnst.screen[x + (y * 64)][1], this.BIOS.ram.cnst.screen[x + (y * 64)][2])
    this.ctx.fillStyle = rgb;
    this.ctx.fillRect(x * 10, y * 10, 10, 10)

}

GPU.prototype.parseRGB = function(r, g, b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length < 2) {
        r = "0" + r;
    };
    if (g.length < 2) {
        g = "0" + g;
    };
    if (b.length < 2) {
        b = "0" + b;
    };
    return "#" + r + g + b;
}

GPU.prototype.setPixel = function(x, y, rgb) {
    //this.BIOS.ram.cnst.screen[x + (y * 64)][0]
    var splitchr = rgb.split("");

    var rhex = splitchr[1] + splitchr[2];
    var ghex = splitchr[3] + splitchr[4];
    var bhex = splitchr[5] + splitchr[6];

    var r = parseInt(rhex, 16);
    var g = parseInt(ghex, 16);
    var b = parseInt(bhex, 16);

    this.BIOS.ram.cnst.screen[x + (y * 64)][0] = r;
    this.BIOS.ram.cnst.screen[x + (y * 64)][1] = g;
    this.BIOS.ram.cnst.screen[x + (y * 64)][2] = b;


}

GPU.prototype.run = function(code, core) {
    var args = code.split(" ");
    switch (args[0]) {
        case "pixel":
            switch (args[1]) {
                case "set":
                    if (!isNaN(parseInt(args[4]))) {
                        args[4]
                    }
                    if (isNaN(parseInt(args[2])) && !isNaN(parseInt(args[3]))) { //first is var
                        eval("this.setPixel(core." + args[2] + ", parseInt(" + args[3] + "), \"" + args[4] + "\");");
                    } else if (!isNaN(parseInt(args[2])) && isNaN(parseInt(args[3]))) { //second is var
                        eval("this.setPixel(parseInt(" + args[2] + "), core." + args[3] + ", \"" + args[4] + "\");");
                    } else if (isNaN(parseInt(args[2])) && isNaN(parseInt(args[3]))) { //both are vars
                        eval("this.setPixel(core." + args[2] + ", core." + args[3] + ", \"" + args[4] + "\");");
                    } else if (!isNaN(parseInt(args[2])) && !isNaN(parseInt(args[3]))) { //no vars
                        this.setPixel(parseInt(args[3]), parseInt(args[3]), args[4]);
                    };
                    break;
                case "draw":
                    this.drawPixel(parseInt(args[3]), parseInt(args[3]));
                    if (isNaN(parseInt(args[2])) && !isNaN(parseInt(args[3]))) { //first is var
                        eval("this.drawPixel(core." + args[2] + "), parseInt(" + args[3] + "))");
                    } else if (!isNaN(parseInt(args[2])) && !isNaN(parseInt(args[3]))) { //second is var
                        eval("this.drawPixel(parseInt(" + args[2] + "), core." + args[3] + ")");
                    } else if (isNaN(parseInt(args[2])) && isNaN(parseInt(args[3]))) { //both are vars
                        eval("this.drawPixel(core." + args[2] + ", core." + args[3] + ")");
                    } else if (!isNaN(parseInt(args[2])) && !isNaN(parseInt(args[3]))) { //no vars
                        this.drawPixel(parseInt(args[3]), parseInt(args[3]))
                    };
                    break;
            }
            break;
        case "screen":
            this.updateScreen();
            break;
        case "rgb":
            if (isNaN(parseInt(args[1]))) { //r
                eval("args[1] = this." + args[1] + ";");
            }
            if (isNaN(parseInt(args[2]))) { //g
                eval("args[2] = this." + args[2] + ";");
            }
            if (isNaN(parseInt(args[3]))) { //b
                eval("args[3] = this." + args[3] + ";");
            }

            return this.parseRGB(parseInt(args[1]), parseInt(args[3]), parseInt(args[3]));
            break;
    }
}

module.exports = GPU;