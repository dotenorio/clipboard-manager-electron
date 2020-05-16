const ipcRenderer = window.require("electron").ipcRenderer;

window.onload = function () {

  ipcRenderer.on("clipboardContents", (event, message) => {
    var clipDiv = document.getElementById("clipHistory");
    var clipList = message['copied'];

    var docFrag = document.createDocumentFragment();
    for (var i = 0; i < clipList.length; i++) {
      docFrag.appendChild(this.createDiv(clipList[i], i));
    }
    clipDiv.appendChild(docFrag);
  });
}

function createDiv(text, index) {
  var div = document.createElement("div");
  div.id = "clip_" + index;
  div.className = 'item';
  div.nodeValue = text;
  div.onclick = function () {
    ipcRenderer.invoke("setClipboard", text);
  }
  div.appendChild(document.createTextNode(text));
  return div;
}
