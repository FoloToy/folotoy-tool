import { Transport } from "esptool-js";
import { MyTerm } from "../xterm/index";
// 连接按钮
export default class Deviceconsole {
  device = null
  transport = null
  isConsoleClosed = true;
  deviceInfo = null
  constructor(terminal, input) {
    this.term = new MyTerm(terminal, input)
  }
  startConnection  = async (fn) => {
    // 避免重复点击
    if (this.device === null) {
      this.device = await navigator.serial.requestPort({});
      this.transport = new Transport(this.device);
    }
    await this.transport.connect();
    this.deviceInfo = this.transport.get_info();
    this.isConsoleClosed = false;
    this.term.setTerm(this.transport);
    this.term.writeTerm(' success: ' + this.deviceInfo)
    this.term.prompt()
    fn.call(null)
    while (!this.isConsoleClosed) {
      let val = await this.transport.rawRead();
      if (typeof val !== "undefined") {
        this.term.writeTerm(val);
      } else {
        break;
      }
    }
    console.log("quitting console");
  };
  stopConnection = async () => {
    console.log("stop");
    location.reload();
       // 关闭有问题 TODO...
    // await transport.disconnect();
    // await transport.waitForUnlock(1500);
    // isConsoleClosed = true;
    // disposeTerm();
    // consoleStartButton.style.display = "initial";
    // consoleStopButton.style.display = "none";
    // lblConsoleFor.style.display = "none";
    // programDiv.style.display = "initial";
  };
  resetDevice = async () => {
    if (this.device === null) {
      this.device = await navigator.serial.requestPort({});
      this.transport = new Transport(device);
    }
    await this.transport.setDTR(false);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await this.transport.setDTR(true);
  };
}

