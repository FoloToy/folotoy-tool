import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit';
import { throttle, debouce } from '../utils/utils'
class MyTerm {
  term;
  inputTest = ""
  prefix = "$: ";
  timer;
  writeTermDebouce;
  writeTermThrottle
  constructor(terminal, input) {
    this.terminal = document.getElementById(terminal)
    this.input = document.getElementById(input)
  }
  prompt() {
    this.term && this.term.write('\r\n');
  };
  stringToUint8Array(str) {
    var arr = [];
    for (var i = 0, j = str.length; i < j; ++i) {
      arr.push(str.charCodeAt(i));
    }
    var tmpUint8Array = new Uint8Array(arr);
    return tmpUint8Array;
  }
  setTerm(transport) {
    this.term = new Terminal({
      cols: 120,
      rows: 40,
      cursorBlink: true,
      cursorStyle: "underline",
      theme: {
        foreground: "yellow",
        background: "#060101",
      },
    });
    const fitAddon = new FitAddon();
    this.term.loadAddon(fitAddon);
    this.term.open(this.terminal);
    this.setInputKey()
    this.writeTermDebouce = debouce(this.term.write, this)
    this.writeTermThrottle = throttle(transport.write, transport)
    this.input.parentNode.style.display = 'flex'
  }
  setKey(transport) {
    this.term.onKey((e) => {
      const printable =
        !e.domEvent.altKey &&
        !e.domEvent.altGraphKey &&
        !e.domEvent.ctrlKey &&
        !e.domEvent.metaKey;
      if (e.domEvent.keyCode === 13) {
        if (this.inputTest === 'clear') {
          this.inputTest = "";
          this.term.clear()
          this.term.write("\r\n");
          this.prompt()
        }
        else if (transport) {
          console.log('写入', inputTest)
          this.term.write("\r\n");
          this.inputTest && writeTermThrottle(this.stringToUint8Array(this.inputTest))
          if (!this.timer) {
            this.timer = setTimeout(() => {
              this.prompt()
              this.timer = null
            }, 2000);
          }
        }

      } else if (e.domEvent.keyCode === 8) {
        // back 删除的情况
        if (term._core.buffer.x > prefix.length - 2) {
          this.term.write("\b \b");
        }
        this.inputTest = inputTest.substring(
          0,
          this.inputTest.length - 1 > 0 ? this.inputTest.length - 1 : 0
        );
      } else if (printable) {
        this.term.write(e.key);
        this.inputTest += e.key;
      }
    });
    this.term.onData((key) => {
      console.log(key)
      // 粘贴的情况
      if (key.length > 1) {
        this.term.write(key);
        this.inputTest += key
      }
    });
  }
  writeTerm(data) {
    this.timer && clearTimeout(this.timer)
    this.timer = null
    this.writeTermDebouce(data)
  }
  disposeTerm() {
    // window.refresh()
    this.term.dispose()
    this.inputTest = "";
    this.input.parentNode.style.display = 'none'
  }
  setInputKey() {
    this.input.focus()
    this.input.addEventListener('keydown', (e) => {
      console.log(e)
      if (e.keyCode === 13) {
        if (this.input.value) {
          if (this.input.value === 'clear') {
            this.term.clear()
            // prompt()
          } else {
            this.writeTerm(this.prefix + this.input.value)
            this.prompt()
            this.writeTermThrottle(this.stringToUint8Array(this.input.value))
          }
        }
        this.input.value = ''
      }
    })
  }
}

export { MyTerm }