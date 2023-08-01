const terminal = document.getElementById("terminal");
const inputBox  = document.querySelector('.input-box')
const input = document.querySelector('#inputCommand')
import { Terminal } from "xterm";
import { FitAddon } from 'xterm-addon-fit';
import { throttle, debouce } from '../utils/utils'
let term;
let inputTest = "";
const prefix = "$: ";
let timer;
let writeTermDebouce;
let writeTermThrottle
function prompt() {
  term.write('\r\n');
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
    },
  });
  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);
  term.open(terminal);
  inputBox.style.display = 'flex'
  setInputKey()
  // setKey(transport)
  writeTermDebouce = debouce(term.write, term)
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
    console.log(key)
    // 粘贴的情况
    if (key.length > 1) {
      term.write(key);
      inputTest += key
    }
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
  inputBox.style.display = 'none'
    inputTest = "";
}
function setInputKey () {
  input.focus()
  inputBox.addEventListener('keydown', (e) => {
    console.log(e.key)
    if (e.key === 'Enter') {
      if (input.value) {
        if (input.value === 'clear') {
          term.clear()
          // prompt()
        } else {
          writeTerm(prefix + input.value)
          prompt()
          writeTermThrottle(stringToUint8Array(input.value))
        }
      }
      input.value = ''
      console.log(input.value)
    }
  })
}
export {setTerm, writeTerm, disposeTerm, prompt, stringToUint8Array, term}