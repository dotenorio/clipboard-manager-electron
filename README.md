[![Build Status](https://travis-ci.org/dotenorio/clipboard-manager-electron.svg?branch=master)](https://travis-ci.org/dotenorio/clipboard-manager-electron)

# Clipboard Manager Electron
A clipboard manager built with Electron

**Preview Windows**

![Preview Windows](https://i.imgur.com/2i26dTv.png)

_needs update, view issue #17_

**Preview Linux Ubuntu 19.10**

![Preview Linux Ubuntu 19.10](https://i.imgur.com/ohLfBdf.png)

**Preview MacOS**

![Preview MacOS](https://i.imgur.com/CSLIxl2.png)

_needs update, view issue #17_

## Shortcuts (BETA)

Now we have some shortcuts, but it is on beta state. Test and give me a feedback, thanks!

* `CmdOrCtrl+Shift+0` ~ get copied item on position #1
* `CmdOrCtrl+Shift+1` ~ get copied item on position #2
* `CmdOrCtrl+Shift+2` ~ get copied item on position #3
* `CmdOrCtrl+Shift+3` ~ get copied item on position #4
* `CmdOrCtrl+Shift+4` ~ get copied item on position #5
* `CmdOrCtrl+Shift+5` ~ get copied item on position #6
* `CmdOrCtrl+Shift+6` ~ get copied item on position #7
* `CmdOrCtrl+Shift+7` ~ get copied item on position #8
* `CmdOrCtrl+Shift+8` ~ get copied item on position #9
* `CmdOrCtrl+Shift+9` ~ get copied item on position #10
* `CmdOrCtrl+Shift+Y` ~ focus clipboard-manager-electron _(only for windows)_

## Windows

### How to do a Windown build (You can go with either Yarn build or Npm build) 
#### Yarn Build

```
$ git clone https://github.com/dotenorio/clipboard-manager-electron.git
$ cd clipboard-manager-electron
$ yarn
$ yarn build --win
```
#### NPM build
```
$ git clone https://github.com/dotenorio/clipboard-manager-electron.git
$ cd clipboard-manager-electron
$ npm install
$ npm run build -- --win
```

Go to folder `dist` and execute the `clipboard-manager-electron X.X.X.exe` or `clipboard-manager-electron Setup X.X.X.exe` and be happy.

## Linux

### How to do a Linux build (You can go with either Yarn build or Npm build)
#### Yarn Build

```
$ git clone https://github.com/dotenorio/clipboard-manager-electron.git
$ cd clipboard-manager-electron
$ yarn
$ yarn build --linux
```

#### NPM build
```
$ git clone https://github.com/dotenorio/clipboard-manager-electron.git
$ cd clipboard-manager-electron
$ npm install
$ npm run build -- --linux
```

Go to folder `dist/` and execute the `clipboard-manager-electron_X.X.X_<arch>.deb` or `clipboard-manager-electron_X.X.X_<arch>.rpm` and be happy.

## Mac

### How to do a Mac build (You can go with either Yarn build or Npm build)
#### Yarn Build
```
$ git clone https://github.com/dotenorio/clipboard-manager-electron.git
$ cd clipboard-manager-electron
$ yarn
$ yarn build --mac
```

#### NPM build
```
$ git clone https://github.com/dotenorio/clipboard-manager-electron.git
$ cd clipboard-manager-electron
$ npm install
$ npm run build -- --mac
```

Go to folder `dist` and execute the `clipboard-manager-electron-X.X.X.dmg` and be happy.

## Releases

### Download latest release

If don´t want do a build, you can download the [latest release](https://github.com/dotenorio/clipboard-manager-electron/releases/latest)!
