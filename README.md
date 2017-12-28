![build-status](https://travis-ci.org/dotenorio/clipboard-manager-electron.png?branch=master)

# clipboard-manager-electron
A clipboard manager built with Electron

![Preview](https://i.imgur.com/2i26dTv.png)

## How to do a build

```
$ git clone https://github.com/dotenorio/clipboard-manager-electron.git
$ cd clipboard-manager-electron
$ npm install
$ npm run build-windows
```

Go to folder `dist/clipboard-manager-electron-win32-ia32` and execute the `clipboard-manager-electron.exe` and be happy.

## Download latest release

If don´t want do a build, you can download the [latest release](https://github.com/dotenorio/clipboard-manager-electron/releases/latest)!

After download, you need do unzip to any folder, execute the `clipboard-manager-electron.exe`  and be happy too. 

## Create Windows Installer

First, you need a build (see how to do above).
After, dowload and install the [InnoSetup 5](http://www.jrsoftware.org/isdl.php).
Last, open the `clipboard-manager-electron-win32-ia32.iss` with InnoSetup change the constant RepositoryDir and click 'Run' and be happy again.
