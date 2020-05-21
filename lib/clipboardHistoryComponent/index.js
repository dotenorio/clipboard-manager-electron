const ipcRenderer = window.require('electron').ipcRenderer

function createDiv (text, index) {
  var div = document.createElement('div')
  div.id = 'clip_' + index
  div.className = 'item'
  div.nodeValue = text
  div.onclick = function () {
    ipcRenderer.invoke('setClipboard', text)
  }
  div.appendChild(document.createTextNode(text))
  return div
}

window.onload = function () {
  ipcRenderer.on('clipboardContents', (event, message) => {
    var clipDiv = document.getElementById('clipHistory')
    var clipList = message.copied

    var docFrag = document.createDocumentFragment()
    for (var i = clipList.length - 1; i >= 0; i--) {
      docFrag.appendChild(createDiv(clipList[i], i))
    }
    clipDiv.appendChild(docFrag)
  })
}
