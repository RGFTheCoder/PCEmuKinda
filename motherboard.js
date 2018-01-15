function motherboard() {
    this.bios = require("./bios");
    this.specs = require("./PC")
    this.bios = new this.bios();

    this.bios.ram.openProgram(0);
    this.bios.cpu.run("tst");
}

module.exports = motherboard;