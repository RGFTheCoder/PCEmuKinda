var PC = require("./PC")

function CORE(bios, id) {
    /*errCodes:
    Continue:0
    Terminated:1
    Error:2
    InUse:3

    */

    this.id = id;

    this.BIOS = bios;

    this.errCode = 0x00;

    this.programID = 0x00;

    this.temp = 0x00;

    this.dx = 0x00;
    this.dy = 0x00;
    this.hx = 0x00;
    this.hy = 0x00;
    this.lx = 0x00;
    this.ly = 0x00;
    this.currentLine = [];
    this.pointer = 0x00;

}

CORE.prototype.run = function(code, cpu) {
    this.errCode = 0x03;
    cpu.cores[this.id].errCode = 0x03;
    console.log("Core #" + this.id + " is now running!");
    console.log("ERROR")

    var args = code.split(" ");

    if (args[0] == "fst") {
        args = args.slice(1);
        console.log("fst");
        console.log(args)
    } else {

    }

    switch (args[0]) {
        case "tst":
            console.log(this);
            console.log(cpu.cores[1]);
            break;
        case "var":
            eval("this.BIOS.ram.mem[" + this.programID + "]." + args[1] + " = this.temp;");
            break;
        case "add":
            if (isNaN(args[1]) && !isNaN(args[2])) { //first is var
                eval("this.temp = this." + args[1] + "+" + args[2] + ";");
            } else if (!isNaN(args[1]) && isNaN(args[2])) { //second is var
                eval("this.temp = " + args[1] + "+ this." + args[2] + ";");
            } else if (isNaN(args[1]) && isNaN(args[2])) { //both are vars
                eval("this.temp = this." + args[1] + "+ this." + args[2] + ";");
            } else if (!isNaN(args[1]) && !isNaN(args[2])) { //no vars
                this.temp = parseInt(args[1]) + parseInt(args[2]);
            };
            break;
        case "sub":
            if (isNaN(args[1]) && !isNaN(args[2])) { //first is var
                eval("this.temp = this." + args[1] + "-" + args[2] + ";");
            } else if (!isNaN(args[1]) && isNaN(args[2])) { //second is var
                eval("this.temp = " + args[1] + "- this." + args[2] + ";");
            } else if (isNaN(args[1]) && isNaN(args[2])) { //both are vars
                eval("this.temp = this." + args[1] + "- this." + args[2] + ";");
            } else if (!isNaN(args[1]) && !isNaN(args[2])) { //no vars
                this.temp = parseInt(args[1]) - parseInt(args[2]);
            };
            break;
        case "mul":
            if (isNaN(args[1]) && !isNaN(args[2])) { //first is var
                eval("this.temp = this." + args[1] + "*" + args[2] + ";");
            } else if (!isNaN(args[1]) && isNaN(args[2])) { //second is var
                eval("this.temp = " + args[1] + "* this." + args[2] + ";");
            } else if (isNaN(args[1]) && isNaN(args[2])) { //both are vars
                eval("this.temp = this." + args[1] + "* this." + args[2] + ";");
            } else if (!isNaN(args[1]) && !isNaN(args[2])) { //no vars
                this.temp = parseInt(args[1]) * parseInt(args[2]);
            };
            break;
        case "div":
            if (isNaN(args[1]) && !isNaN(args[2])) { //first is var
                eval("this.temp = this." + args[1] + "/" + args[2] + ";");
            } else if (!isNaN(args[1]) && isNaN(args[2])) { //second is var
                eval("this.temp = " + args[1] + "/ this." + args[2] + ";");
            } else if (isNaN(args[1]) && isNaN(args[2])) { //both are vars
                eval("this.temp = this." + args[1] + "/ this." + args[2] + ";");
            } else if (!isNaN(args[1]) && !isNaN(args[2])) { //no vars
                this.temp = parseInt(args[1]) / parseInt(args[2]);
            };
            break;
        case "prt":
            eval("this.currentLine.push(String.fromCharCode(this." + args[1] + "));");
            console.log(this.currentLine)
            break;
        case "jmp":
            this.pointer = args[1];
            break;
        case "mov":
            eval("this." + args[1] + " = this." + args[2] + ";")
            break;
        case "db":
            eval("this.temp = this.BIOS.ram.mem[" + this.programID + "]." + args[1] + ";");
            break;
        case "dbc":
            eval("this.temp = this.BIOS.ram.cnst." + args[1] + ";");
            break;
        case "mem":
            eval("this.BIOS.ram.cnst." + args[1] + " = this.temp;");
            break;
        case "num":
            eval("this.currentLine.push(parseInt(this." + args[1] + ").toString());");
            break;
        case "pln":
            console.log("ERROR")
            var out = this.BIOS.gpu.print(this.currentLine.join(""));
            this.currentLine = [];
            console.log(this.BIOS.gpu)
            break;
        case "prg":
            this.BIOS.ram.mem[this.programID].cpustate = {};

            this.BIOS.ram.mem[this.programID].cpustate.temp = this.temp;

            this.BIOS.ram.mem[this.programID].cpustate.dx = this.dx;
            this.BIOS.ram.mem[this.programID].cpustate.dy = this.dy;
            this.BIOS.ram.mem[this.programID].cpustate.hx = this.hx;
            this.BIOS.ram.mem[this.programID].cpustate.hy = this.hy;
            this.BIOS.ram.mem[this.programID].cpustate.lx = this.lx;
            this.BIOS.ram.mem[this.programID].cpustate.ly = this.ly;
            this.BIOS.ram.mem[this.programID].cpustate.currentLine = this.currentLine;
            this.BIOS.ram.mem[this.programID].cpustate.pointer = this.pointer;

            this.programID = parseInt(args[1]);
            this.BIOS.ram.openProgram(this.programID);

            if (this.BIOS.ram.mem[this.programID].cpustate !== undefined) {

                this.temp = this.BIOS.ram.mem[this.programID].cpustate.temp;

                this.dx = this.BIOS.ram.mem[this.programID].cpustate.dx;
                this.dy = this.BIOS.ram.mem[this.programID].cpustate.dy;
                this.hx = this.BIOS.ram.mem[this.programID].cpustate.hx;
                this.hy = this.BIOS.ram.mem[this.programID].cpustate.hy;
                this.lx = this.BIOS.ram.mem[this.programID].cpustate.lx;
                this.ly = this.BIOS.ram.mem[this.programID].cpustate.ly;
                this.currentLine = this.BIOS.ram.mem[this.programID].cpustate.currentLine;
                this.pointer = this.BIOS.ram.mem[this.programID].cpustate.pointer;
            } else {
                this.temp = 0x00;

                this.dx = 0x00;
                this.dy = 0x00;
                this.hx = 0x00;
                this.hy = 0x00;
                this.lx = 0x00;
                this.ly = 0x00;
                this.currentLine = [];
                this.pointer = 0x00;
            }
            break;
        case "gpu":
            console.log("gpu!")
            this.BIOS.gpu.run(args.slice(1).join(" "), this);
            break;
        case "for":
            var core = cpu.cores[this.id];
            eval("var i = core." + args[2] + ";")
            eval("for (core." + args[2] + " = 0; core." + args[2] + " < args[1]; core." + args[2] + "++) {core.run(\"fst \" + args.slice(3).join(\" \"), cpu);}");
            break;
        case "eval":
            eval(args.slice(1).join(" "));
            break;
        case "cpu":
            cpu.cores[args[1]].run(args.slice(2).join(" "), cpu);
            break;
    }
    if (PC.gpu.autorefresh) {
        this.BIOS.gpu.updateScreen();
    }
    this.errCode = 0x00;
    cpu.cores[this.id].errCode = 0x00;
    console.log("ERROR")
    return true;
}

module.exports = CORE;