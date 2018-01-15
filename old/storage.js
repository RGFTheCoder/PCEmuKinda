var PC = require("./PC");
var fs = require('fs');
var SD = require('./sd')



function STRG(bios) {

    this.BIOS = bios;

    this.data = new Uint8Array(PC.storage.capacity * 1024 * 1024);
    this.data.fill(0x00);
    //this.data = eval("SD." + PC.storage.port);
}

STRG.prototype.saveTo = function(port) {
    var hexdata = new Array(PC.storage.capacity * 1024 * 1024)
    for (i = 0; i < PC.storage.capacity * 1024 * 1024; i++) {
        hexdata[i] = String.fromCharCode(this.data)
    }
    fs.writeFileSync('sd.hex', hexdata.join(" "));
}

module.exports = STRG;