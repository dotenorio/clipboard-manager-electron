require("innosetup-compiler")("./clipboard-manager-electron-win32-ia32.iss", {
  gui: false,
  verbose: true
}, function(error) {
  console.log('The innosetup compiled with success!')
});