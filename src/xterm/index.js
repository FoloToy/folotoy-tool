const terminal = document.getElementById("terminal");
import { Terminal } from "xterm";
import { throttle, debouce } from '../utils/utils'
let term;
let inputTest = "";
const prefix = "\r\n$: ";
let timer;
let writeTermDebouce;
let writeTermThrottle
function prompt() {
  term.write(prefix);
  inputTest = "";
};
function stringToUint8Array(str) {
    var arr = [];
    for (var i = 0, j = str.length; i < j; ++i) {
      arr.push(str.charCodeAt(i));
    }
  
    var tmpUint8Array = new Uint8Array(arr);
    return tmpUint8Array;
}

function setTerm(transport) {
  term = new Terminal({
    cols: 120,
    rows: 40,
    cursorBlink: true,
    cursorStyle: "underline",
    theme: {
      foreground: "yellow",
      background: "#060101",
      cursor: "help", //设置光标
    },
  });
  term.open(terminal);
  prompt();
  setKey(transport)
  writeTermDebouce = debouce(term.write, prompt, term)
  writeTermThrottle = throttle(transport.write, transport)
}
function setKey(transport) {
  term.onKey((e) => {
    const printable =
      !e.domEvent.altKey &&
      !e.domEvent.altGraphKey &&
      !e.domEvent.ctrlKey &&
      !e.domEvent.metaKey;
    if (e.domEvent.keyCode === 13) {
      if (inputTest === 'clear') {
        inputTest = "";
        term.clear()
        term.write("\r\n");
        prompt()
      }
      else if (transport) {
        console.log('写入', inputTest)
        term.write("\r\n");
        inputTest && writeTermThrottle(stringToUint8Array(inputTest))
        if (!timer) {
          timer = setTimeout(() => {
            prompt()
            timer = null
          }, 2000);
        }
      }
      
    } else if (e.domEvent.keyCode === 8) {
      // back 删除的情况
      if (term._core.buffer.x > prefix.length - 2) {
        term.write("\b \b");
      }
      inputTest = inputTest.substring(
        0,
        inputTest.length - 1 > 0 ? inputTest.length - 1 : 0
      );
    } else if (printable) {
      term.write(e.key);
      inputTest += e.key;
    }
  });
  term.onData((key) => {
    // 粘贴的情况
    if (key.length > 1) term.write(key);
  });
}
function writeTerm(data) {
    timer && clearTimeout(timer)
    timer = null
    writeTermDebouce(data)
}
function disposeTerm() {
  // window.refresh()
    term.dispose()
    inputTest = "";
}
export {setTerm, writeTerm, disposeTerm, prompt, stringToUint8Array, term}