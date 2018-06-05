#define MyAppVersionInfo "v1.1.3"
#define RepositoryDir "Z:\home\travis\build\dotenorio\clipboard-manager-electron"
#define MyAppName "clipboard-manager-electron"
#define MyAppVerName "Clipboard Manager Electron " + MyAppVersionInfo
#define MyAppPublisher "Fernando M. Tenorio <dotenorio@gmail.com>"
#define MyAppURL "http://github.com/dotenorio/clipboard-manager-electron"

[Setup]
AppName={#MyAppName}
AppVerName={#MyAppVerName}
AppVersion={#MyAppVersionInfo}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}/issues
AppUpdatesURL={#MyAppURL}/releases
DefaultDirName={pf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
UninstallDisplayIcon={app}\clipboard-manager-electron.exe
OutputDir={#RepositoryDir}\dist
OutputBaseFilename=setup-clipboard-manager-electron-win32-ia32
SetupIconFile={#RepositoryDir}\icons\icon.ico
CloseApplications=force

[Dirs]
Name: "{app}"; 

[Files]
Source: "dist\clipboard-manager-electron-win32-ia32\*"; Excludes: "{#MyAppName}.lock"; DestDir: {app}; Flags: recursesubdirs

[Icons]
Name: "{commonprograms}\Clipboard Manager Electron"; Filename: "{app}\clipboard-manager-electron.exe"
Name: "{commondesktop}\Clipboard Manager Electron"; Filename: "{app}\clipboard-manager-electron.exe"

[Languages]
Name: "en"; MessagesFile: "compiler:Default.isl"

[Run]
Filename: "{app}\clipboard-manager-electron.exe"; Description: "Run after finishing"; Flags: postinstall shellexec skipifsilent