import Deviceconsole from "./console/index";
const consoleStartButton = document.getElementById("consoleStartButton");
const consoleStopButton = document.getElementById("consoleStopButton");
const programDiv = document.getElementById("program");
const lblConsoleFor = document.getElementById("lblConsoleFor");
const resetButton = document.getElementById("resetButton");
const deviceConsole = new Deviceconsole('terminal', 'inputCommand');
function connect() {
    lblConsoleFor.style.display = "block";
    lblConsoleFor.innerHTML = "连接成功：" + deviceConsole.deviceInfo;
    consoleStartButton.style.display = "none";
    consoleStopButton.style.display = "initial";
    programDiv.style.display = "none";
}
consoleStartButton.onclick = () => {
  deviceConsole.startConnection(connect);
};

consoleStopButton.onclick = () => {
  deviceConsole.stopConnection();
  console.log("stop");
};
resetButton.onclick = () => {
  deviceConsole.resetDevice();
};