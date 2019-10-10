[![Build Status](https://travis-ci.org/dotenorio/clipboard-manager-electron.svg?branch=master)](https://travis-ci.org/dotenorio/clipboard-manager-electron)

# Clipboard Manager Electron
A clipboard manager built with Electron

_Preview Windows_

![Preview Windows](https://i.imgur.com/2i26dTv.png)

_Preview Linux Ubuntu 18.10_

![Preview Linux Ubuntu 18.10](https://i.imgur.com/gXMOIXe.png)

_Preview MacOS_

![Preview MacOS](https://i.imgur.com/CSLIxl2.png)

## Windows

### How to do a Windown build

```
$ git clone https://github.com/dotenorio/clipboard-manager-electron.git
$ cd clipboard-manager-electron
$ yarn install
$ yarn build-windows
```

Go to folder `dist/clipboard-manager-electron-win32-ia32` and execute the `clipboard-manager-electron.exe` and be happy.

### Create Windows installer

First, you need a build (see how to do above).

After, dowload and install the [InnoSetup 5](http://www.jrsoftware.org/isdl.php).

Last, open the `clipboard-manager-electron-win32-ia32.iss` with InnoSetup change the constant RepositoryDir and click 'Run' and be happy again.

## Linux

### How to do a Linux build

```
$ git clone https://github.com/dotenorio/clipboard-manager-electron.git
$ cd clipboard-manager-electron
$ yarn
$ yarn build-linux
```

Go to folder `dist/clipboard-manager-electron-linux-x64` and execute the `clipboard-manager-electron` and be happy.

### How to install a Linux snap

```
$ git clone https://github.com/dotenorio/clipboard-manager-electron.git
$ cd clipboard-manager-electron
$ yarn install
$ yarn build-snap
$ cd dist
$ sudo snap install --dangerous dist/clipboard-manager-electron_*.snap 
```

## Mac

### How to do a Mac build

```
$ git clone https://github.com/dotenorio/clipboard-manager-electron.git
$ cd clipboard-manager-electron
$ yarn install
$ yarn build-max
```

Go to folder `dist/clipboard-manager-electron-darwin-x64` and execute the `clipboard-manager-electron` and be happy.

## Releases

### Download latest release

If don´t want do a build, you can download the [latest release](https://github.com/dotenorio/clipboard-manager-electron/releases/latest)!

In **Windows** you need run the setup only.. In **Linux** or **Mac**, after download, you need do unzip to any folder, execute the `clipboard-manager-electron` and be happy too. 
