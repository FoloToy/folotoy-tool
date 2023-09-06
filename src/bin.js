import DeviceBin from "./writeBin/index";
const baudrates = document.getElementById("baudrates");
const disconnectButton = document.getElementById("disconnectButton");
const connectButton = document.getElementById("connectButton");
const consoleDiv = document.getElementById("console");
const lblBaudrate = document.getElementById("lblBaudrate");
const lblConnTo = document.getElementById("lblConnTo");
const eraseButton = document.getElementById("eraseButton");
const filesDiv = document.getElementById("files");
const addFileButton = document.getElementById("addFile");
const table = document.getElementById("fileTable");
const alertDiv = document.getElementById("alertDiv");
const programButton = document.getElementById("programButton");


const deviceBin = new DeviceBin(baudrates.value, 'terminal', 'inputCommand');
connectButton.onclick =  async () => {
  await deviceBin.connectDevice();
  console.log('aaa')
  lblBaudrate.style.display = "none";
  lblConnTo.innerHTML = "Connected to device: " + deviceBin.chip;
  lblConnTo.style.display = "block";
  baudrates.style.display = "none";
  connectButton.style.display = "none";
  disconnectButton.style.display = "initial";
  eraseButton.style.display = "initial";
  filesDiv.style.display = "initial";
  consoleDiv.style.display = "none";
};
disconnectButton.onclick = async () => {
  await deviceBin.disConnectDevice()
  baudrates.style.display = "initial";
  connectButton.style.display = "initial";
  disconnectButton.style.display = "none";
  eraseButton.style.display = "none";
  lblConnTo.style.display = "none";
  filesDiv.style.display = "none";
  alertDiv.style.display = "none";
  consoleDiv.style.display = "initial";
};
eraseButton.onclick = async () => {
  eraseButton.disabled = true;
  const p = deviceBin.eraseDevice();
  p.finally(() => {
    eraseButton.disabled = false;
  });
};
function handleFileSelect(evt) {
  const file = evt.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (ev) => {
    evt.target.data = ev.target.result;
  };

  reader.readAsBinaryString(file);
}
function validate_program_inputs() {
  const offsetArr = [];
  const rowCount = table.rows.length;
  let row;
  let offset = 0;
  let fileData = null;

  // check for mandatory fields
  for (let index = 1; index < rowCount; index++) {
    row = table.rows[index];

    //offset fields checks
    const offSetObj = row.cells[0].childNodes[0];
    offset = parseInt(offSetObj.value);

    // Non-numeric or blank offset
    if (Number.isNaN(offset))
      return "Offset field in row " + index + " is not a valid address!";
    // Repeated offset used
    else if (offsetArr.includes(offset))
      return "Offset field in row " + index + " is already in use!";
    else offsetArr.push(offset);

    const fileObj = row.cells[1].childNodes[0];
    fileData = fileObj.data;
    if (fileData == null) return "No file selected for row " + index + "!";
  }
  return "success";
}

function removeRow(row) {
  const rowIndex = Array.from(table.rows).indexOf(row);
  table.deleteRow(rowIndex);
}

addFileButton.onclick = () => {
  const rowCount = table.rows.length;
  const row = table.insertRow(rowCount);

  //Column 1 - Offset
  const cell1 = row.insertCell(0);
  const element1 = document.createElement("input");
  element1.type = "text";
  element1.id = "offset" + rowCount;
  element1.value = "0x10000";
  cell1.appendChild(element1);

  // Column 2 - File selector
  const cell2 = row.insertCell(1);
  const element2 = document.createElement("input");
  element2.type = "file";
  element2.id = "selectFile" + rowCount;
  element2.name = "selected_File" + rowCount;
  element2.addEventListener("change", handleFileSelect, false);
  cell2.appendChild(element2);

  // Column 3  - Progress
  const cell3 = row.insertCell(2);
  cell3.classList.add("progress-cell");
//   cell3.style.display = "none";
  cell3.innerHTML = `<progress value="0" max="100"></progress>`;

  // Column 4  - Remove File
  const cell4 = row.insertCell(3);
  cell4.classList.add("action-cell");
  if (rowCount > 1) {
    const element4 = document.createElement("input");
    element4.type = "button";
    const btnName = "button" + rowCount;
    element4.name = btnName;
    element4.setAttribute("class", "btn");
    element4.setAttribute("value", "Remove"); // or element1.value = "button";
    element4.onclick = function () {
      removeRow(row);
    };
    cell4.appendChild(element4);
  }
};
programButton.onclick = () => {
  const alertMsg = document.getElementById("alertmsg");
  const err = validate_program_inputs();
  if (err != "success") {
    alertMsg.innerHTML = "<strong>" + err + "</strong>";
    alertDiv.style.display = "block";
    return;
  }
  // Hide error message
  alertDiv.style.display = "none";

  const fileArray = [];
  const progressBars = [];

  for (let index = 1; index < table.rows.length; index++) {
    const row = table.rows[index];

    const offSetObj = row.cells[0].childNodes[0];
    const offset = parseInt(offSetObj.value);

    const fileObj = row.cells[1].childNodes[0];
    const progressBar = row.cells[2].childNodes[0];

    progressBar.textContent = "0";
    progressBars.push(progressBar);

    row.cells[3].style.display = "none";
    fileArray.push({ data: fileObj.data, address: offset });
  }
  const p = deviceBin.program(fileArray, (fileIndex, written, total) => {
    progressBars[fileIndex].value = (written / total) * 100;
  });
  p.finally(() => {
    for (let index = 1; index < table.rows.length; index++) {
      table.rows[index].cells[2].style.display = "none";
      table.rows[index].cells[3].style.display = "initial";
    }
  });
};
