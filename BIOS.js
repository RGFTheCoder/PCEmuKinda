(function() {



    var CPU = require("./cpu")
    var GPU = require("./gpu")
    var RAM = require("./ram")
    var PRTS = require("./ports")

    function BIOS() {
        this.ram = new RAM(this);
        this.ports = new PRTS(this);
        this.gpu = new GPU(this);
        this.cpu = new CPU(this);
    }

    module.exports = BIOS;

})();