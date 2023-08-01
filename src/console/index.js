const consoleStartButton = document.getElementById("consoleStartButton");
const consoleStopButton = document.getElementById("consoleStopButton");
const programDiv = document.getElementById("program");
const lblConsoleFor = document.getElementById("lblConsoleFor");
const resetButton = document.getElementById("resetButton");
import { Transport } from "esptool-js";
import { setTerm, writeTerm, disposeTerm, prompt } from "../xterm/index";
// 初始化
let device = null;
let transport;
let isConsoleClosed = true;
consoleStopButton.style.display = "none";
// 连接按钮
consoleStartButton.onclick = async () => {
  // 避免重复点击
  if (device === null) {
    device = await navigator.serial.requestPort({});
    transport = new Transport(device);
  }
  await transport.connect();
  const deviceInfo = transport.get_info();
  lblConsoleFor.style.display = "block";
  lblConsoleFor.innerHTML = "连接成功：" + deviceInfo;
  consoleStartButton.style.display = "none";
  consoleStopButton.style.display = "initial";
  programDiv.style.display = "none";
  isConsoleClosed = false;
  setTerm(transport);
  writeTerm('connected success: ' + deviceInfo)
  prompt()
  while (!isConsoleClosed) {
    let val = await transport.rawRead();
    if (typeof val !== "undefined") {
      writeTerm(val);
    } else {
      break;
    }
  }
  console.log("quitting console");
};

consoleStopButton.onclick = async () => {
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
resetButton.onclick = async () => {
  if (device === null) {
    device = await navigator.serial.requestPort({});
    transport = new Transport(device);
  }
  await transport.setDTR(false);
  await new Promise((resolve) => setTimeout(resolve, 100));
  await transport.setDTR(true);
};
