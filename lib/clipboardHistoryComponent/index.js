const ipcRenderer = window.require('electron').ipcRenderer

function createDiv (text, label, index) {
  var div = document.createElement('div')
  div.id = 'clip_' + index
  div.className = 'item'
  div.nodeValue = text
  if(!text.trim()){
    div.style.height = "15px";
  }
  div.onclick = function () {
    ipcRenderer.invoke('setClipboard', text)
  }
  div.appendChild(document.createTextNode(label))
  return div
}

window.onload = function () {
  ipcRenderer.on('clipboardContents', (event, message) => {
    var clipDiv = document.getElementById('clipHistory')
    var clipList = message.copied

    var docFrag = document.createDocumentFragment()
    for (var i = clipList.length - 1; i >= 0; i--) {
      docFrag.appendChild(createDiv(clipList[i].text, clipList[i].label, i))
    }
    clipDiv.appendChild(docFrag)
  })
}
