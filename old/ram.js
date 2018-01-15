var PC = require("./PC");

function RAM(bios) {

    this.BIOS = bios;

    this.mem = new Uint8Array(PC.ram.capacity * 1024);
    this.mem.fill(0x00);
}

module.exports = RAM;