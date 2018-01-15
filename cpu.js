var PC = require("./PC");
var CORE = require("./cpucore")

function CPU(bios) {
    this.BIOS = bios;
    this.cores = [];
    for (i = 0; i < PC.cpu.cores; i++) {
        this.cores[i] = new CORE(bios, i);
    }
}

CPU.prototype.newCore = function() {
    if (PC.cpu.digitalcores) {
        return this.cores.push(new CORE(this.BIOS, this.cores.length));
    }
}

CPU.prototype.run = function(code) {
    this.cores.forEach(core => {
        if (core.errCode == 0) {
            return core.run(code, this);
        }
    });
}

CPU.prototype.getFreeCore = function() {
    this.cores.forEach(core => {
        if (core.errCode == 0) {
            return core;
        }
    });
}
module.exports = CPU;