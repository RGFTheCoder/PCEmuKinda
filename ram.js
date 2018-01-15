var PC = require("./PC");

function RAM(bios) {
    this.BIOS = bios;
    this.mem = new Array(PC.ram.capacity);
    this.cnst = {};
    this.cnst.alpha = setupAlpha();
    this.cnst.screen = setupScreen();
}

function setupScreen() {
    var screen = new Array(64 * 36);
    for (i = 0; i < 64 * 36; i++) {
        screen[i] = new Uint8Array(3).fill(0x00)
    }
    return screen;
}

function setupAlpha() {
    var alpha = {};
    for (i = 65; i <= 90; i++) {
        eval("alpha." + String.fromCharCode(i) + " = " + i + ";")
    }
    for (i = 97; i <= 122; i++) {
        eval("alpha." + String.fromCharCode(i) + " = " + i + ";")
    }

    alpha = setupSpecial(alpha)

    return alpha;
}

function setupSpecial(alpha) {
    //marks
    alpha.comma = 44; // ,
    alpha.period = 46; // .
    alpha.qmark = 63; // ?
    alpha.emark = 33; // !

    //signs
    alpha.pipe = 124; // |
    alpha.grave = 96; // `
    alpha.tilde = 126; // ~
    alpha.hash = 35; // #
    alpha.dollar = 36; // $
    alpha.percent = 37; // %

    //comparisons
    alpha.lt = 60; // <
    alpha.gt = 62; // >
    alpha.and = 38; // &

    //slashes
    alpha.fs = 47; // /
    alpha.bs = 92; // \

    //math
    alpha.plus = 43; // +
    alpha.ast = 42; // *
    alpha.dash = 45; // -
    alpha.equal = 61; // =
    alpha.power = 94; // ^

    //miscellaneous
    alpha.at = 64; // @
    alpha.opar = 40; // (
    alpha.cpar = 41; // )
    alpha.uscore = 95; // _

    return alpha;
}

RAM.prototype.openProgram = function(prgrmID) {
    this.mem[prgrmID] = this.mem[prgrmID] || { "ID": prgrmID };
    return this.mem[prgrmID];
}

RAM.prototype.closeProgram = function(prgrmID) {
    this.mem[prgrmID] = null;
    return true;
}

module.exports = RAM;