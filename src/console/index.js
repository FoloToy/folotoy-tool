const consoleStartButton = document.getElementById("consoleStartButton");
const consoleStopButton = document.getElementById("consoleStopButton");
const programDiv = document.getElementById("program");
const lblConsoleFor = document.getElementById("lblConsoleFor");
const resetButton = document.getElementById("resetButton");
import { Transport } from "esptool-js";
let device = null;
let transport;
let isConsoleClosed = false;
import { setTerm, writeTerm, disposeTerm, prompt } from "../xterm/index";
consoleStopButton.style.display = "none";
consoleStartButton.onclick = async () => {
  if (device === null) {
    device = await navigator.serial.requestPort({});
    transport = new Transport(device);
  }
  lblConsoleFor.style.display = "block";
  consoleStartButton.style.display = "none";
  consoleStopButton.style.display = "initial";
  programDiv.style.display = "none";
  await transport.connect();
  isConsoleClosed = false;
  setTerm(transport);
  while (true && !isConsoleClosed) {
    const val = await transport.rawRead();
    if (typeof val !== "undefined") {
      writeTerm(val);
      prompt();
    } else {
      break;
    }
  }
  console.log("quitting console");
};

consoleStopButton.onclick = async () => {
  console.log("stop");
  disposeTerm();
  isConsoleClosed = true;
  await transport.disconnect();
  await transport.waitForUnlock(1500);
  consoleStartButton.style.display = "initial";
  consoleStopButton.style.display = "none";
  lblConsoleFor.style.display = "none";
  programDiv.style.display = "initial";
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