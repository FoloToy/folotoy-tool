
import { ESPLoader, Transport } from "esptool-js";
import { disposeTerm, setTerm, MyTerm } from "../xterm/index";
import CryptoJS from "crypto-js";

export default class DeviceBin {
  espLoaderTerminal
  chip;
  transport;
  esploader;
  device;
  term;
  deviceInfo;
  constructor(baudrates, terminal, inputCommand) {
    this.baudrates = baudrates
    this.term = new MyTerm(terminal, inputCommand)
  }
  connectDevice = async () => {
    if (!this.device) {
      this.device = await navigator.serial.requestPort({
        usbVendorId: '',
        usbProductId: ''
      });
      this.transport = new Transport(this.device);
      this.deviceInfo = this.transport.get_info();
    }
    this.term.setTerm(this.transport);
    console.log(this.term)
    this.espLoaderTerminal = {
      clean: () => {
        this.term && this.term.term.clear();
      },
      writeLine: (data) => {
        this.term && this.term.term.writeln(data);
      },
      write: (data) => {
        this.term && this.term.term.write(data);
      },
    };
    try {
      const flashOptions = {
        transport: this.transport,
        baudrate: parseInt(this.baudrates),
        terminal: this.espLoaderTerminal,
      };
      this.esploader = new ESPLoader(flashOptions);
      this.chip = await this.esploader.main_fn();
      // Temporarily broken
      // await esploader.flash_id();
    } catch (e) {
      console.error(e);
      this.term.writeln(`Error: ${e.message}`);
    }
  }
  eraseDevice = () =>{
    const promise = new Promise(async (resolve, reject) => {
      try {
        await this.esploader.erase_flash();
        resolve()
      } catch (e) {
        reject()
        this.term.writeln(`Error: ${e.message}`);
      }
    })
    return promise
  }
  disConnectDevice =  async () => {
    if (this.transport) {
      await this.transport.disconnect();
    }
    this.device = null;
    this.transport = null;
    this.term.disposeTerm();
  }
  program = (fileArray, progressCallback) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const flashOptions = {
          fileArray: fileArray,
          flashSize: "keep",
          eraseAll: false,
          compress: true,
          reportProgress: (fileIndex, written, total) => {
            progressCallback(fileIndex, written, total)
            // progressBars[fileIndex].value = (written / total) * 100;
          },
          calculateMD5Hash: (image) =>
            CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)),
        };
        await this.esploader.write_flash(flashOptions);
        resolve()
      } catch (e) {
        console.error(e);
        this.term.writeln(`Error: ${e.message}`);
        reject()
      } 
    })
    return promise
  }
}


