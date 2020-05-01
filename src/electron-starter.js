// Modules to control application life and create native browser window
const {app, BrowserWindow, dialog} = require('electron');
const path = require('path');
const url = require('url');
const {ipcMain} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      preload: __dirname + '/preload.js'
    }
  });

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html');
  // const startUrl = process.env.ELECTRON_START_URL || url.format({
  //   pathname: path.join(__dirname, '/../build/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // });
  // mainWindow.loadURL(startUrl);
  mainWindow.loadURL('http://localhost:3000');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  // mainWindow.setMenu(null);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const { exec } = require('child_process');

ipcMain.on('get-containers', (event, arg) => {
  exec('docker ps -a --no-trunc --format "table {{.ID}},{{.Names}},{{.Image}},{{.Status}},{{.Command}}"', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      // const msg = stdout.toString() || stderr.toString() || error.toString();
      // event.sender.send('error', msg);
      return;
    }
    let result = stdout.toString();
    result = result.split('\n');
    result = result.slice(1, result.length - 1);
    const containersInfo = [];
    for (let e of result) {
      let bar = e.split(',');
      const foo = {
        id: bar[0],
        name: bar[1],
        image: bar[2],
        status: bar[3],
        command: bar[4],
        running: bar[3].slice(0, 3).includes('Up '),
      };
      containersInfo.push(foo);
    }
    containersInfo.sort((a, b) => {
      if (a.running && (!b.running)) {
        return -1;
      } else if (a.running && b.running) {
        return 0;
      } else {
        return 1;
      }
    });
    event.sender.send('get-containers', containersInfo);
  });

});

ipcMain.on('container-info', (event, arg) => {
  exec(`docker inspect ${arg}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      // const msg = stdout.toString() || stderr.toString() || error.toString();
      // event.sender.send('error', msg);
      return;
    }
    event.sender.send('container-info', JSON.parse(stdout.toString())[0]);
  });
});

ipcMain.on('launch-shell', (event, container) => {
  let openTerminalCommand = '';
  if (process.platform === 'linux') {
    openTerminalCommand = `gnome-terminal -- sh -c 'docker exec -it ${container} /bin/bash'`;
  } else {
    openTerminalCommand = `osascript -e 'tell app "Terminal" to do script "docker exec -it ${container} /bin/bash"'`;
  }
  exec(openTerminalCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      const msg = stdout.toString() || stderr.toString() || error.toString();
      event.sender.send('error', msg);

    }
  });
});

ipcMain.on('stop-container', (event, container) => {
  exec(`docker stop ${container} -t 0`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      const msg = stdout.toString() || stderr.toString() || error.toString();
      event.sender.send('error', msg);

    }
  });
});

ipcMain.on('restart-container', (event, container) => {
  exec(`docker restart ${container} -t 0`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      const msg = stdout.toString() || stderr.toString() || error.toString();
      event.sender.send('error', msg);

    }
  });
});

ipcMain.on('pause-container', (event, container) => {
  exec(`docker pause ${container}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      const msg = stdout.toString() || stderr.toString() || error.toString();
      event.sender.send('error', msg);

    }
  });
});

ipcMain.on('resume-container', (event, container) => {
  exec(`docker unpause ${container}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      const msg = stdout.toString() || stderr.toString() || error.toString();
      event.sender.send('error', msg);

    }
  });
});

ipcMain.on('kill-container', (event, container) => {
  exec(`docker kill ${container}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      const msg = stdout.toString() || stderr.toString() || error.toString();
      event.sender.send('error', msg);

    }
  });
});

ipcMain.on('start-container', (event, container) => {
  exec(`docker start ${container}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      const msg = stdout.toString() || stderr.toString() || error.toString();
      event.sender.send('error', msg);

    }
  });
});

ipcMain.on('remove-container', (event, container) => {
  exec(`docker rm ${container}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      const msg = stdout.toString() || stderr.toString() || error.toString();
      event.sender.send('error', msg);

    }
  });
});

ipcMain.on('rename-container', (event, [container, name]) => {
  exec(`docker rename ${container} "${name}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      const msg = stdout.toString() || stderr.toString() || error.toString();
      event.sender.send('error', msg);

    }
  });
});


ipcMain.on('get-images', (event, arg) => {
  exec('docker images --no-trunc --format "table {{.ID}},{{.Repository}},{{.Tag}}"', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      const msg = stdout.toString() || stderr.toString() || error.toString();
      event.sender.send('error', msg);
      return;
    }
    let result = stdout.toString();
    result = result.split('\n');
    result = result.slice(1, result.length - 1);
    const imagesInfo = [];
    for (let e of result) {
      let bar = e.split(',');
      const foo = {
        id: bar[0],
        repository: bar[1],
        tag: bar[2],
      };
      imagesInfo.push(foo);
    }
    imagesInfo.sort();
    event.sender.send('get-images', imagesInfo);
  });

});

ipcMain.on('get-image-containers', (event, arg) => {
  exec(`docker ps -a -f ancestor=${arg} --format "table {{.ID}},{{.Names}},{{.Status}}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      // const msg = stdout.toString() || stderr.toString() || error.toString();
      // event.sender.send('error', msg);
      return;
    }
    let result = stdout.toString();
    result = result.split('\n');
    result = result.slice(1, result.length - 1);
    const containerInfo = [];
    for (let e of result) {
      let bar = e.split(',');
      const foo = {
        id: bar[0],
        name: bar[1],
        status: bar[2],
      };
      containerInfo.push(foo);
    }
    containerInfo.sort();
    event.sender.send('get-image-containers', containerInfo);
  });
});

ipcMain.on('image-info', (event, arg) => {
  exec(`docker inspect ${arg}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      // const msg = stdout.toString() || stderr.toString() || error.toString();
      // event.sender.send('error', msg);
      return;
    }
    event.sender.send('image-info', JSON.parse(stdout.toString())[0]);
  });
});

ipcMain.on('remove-image', (event, arg) => {
  exec(`docker rmi ${arg}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      const msg = stdout.toString() || stderr.toString() || error.toString();
      event.sender.send('error', msg);

    }
  });
});

ipcMain.on('remove-stopped-image-containers', (event, arg) => {
  exec(`docker ps -a --filter ancestor=${arg} | grep Exit | awk '{print $1 }' | xargs docker rm`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      const msg = stdout.toString() || stderr.toString() || error.toString();
      event.sender.send('error', msg);

    }
  });
});

ipcMain.on('remove-all-image-containers', (event, arg) => {
  exec(`docker ps -q --filter ancestor=${arg} | xargs docker stop -t 0`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      const msg = stdout.toString() || stderr.toString() || error.toString();
      event.sender.send('error', msg);
      return;
    }

    exec(`docker ps -a -q --filter ancestor=${arg} | xargs docker rm`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        const msg = stdout.toString() || stderr.toString() || error.toString();
        event.sender.send('error', msg);

      }
    });

  });
});

ipcMain.on('create-container', (event, arg) => {
  let portOptions = '';
  let volumeOptions = '';
  let nameOption = '';
  if (!!arg.hostPort && !!arg.containerPort) {
    portOptions = `-p ${arg.hostPort}:${arg.containerPort} `;
  }
  if (!!arg.hostDir && !!arg.containerDir) {
    volumeOptions = `-v ${arg.hostDir}:${arg.containerDir} `;
  }
  if (!!arg.name) {
    nameOption = `--name ${arg.name} `;
  }
  exec(`docker run -d ${nameOption}${portOptions}${volumeOptions}${arg.image}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      const msg = stdout.toString() || stderr.toString() || error.toString();
      event.sender.send('error', msg);

    }
  });
});

ipcMain.on('select-folder', (event, arg) => {
  dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  }, (selectedFolder) => {
    if (selectedFolder && selectedFolder.length > 0) {
      event.sender.send('select-folder', selectedFolder[0]);
    }
  });
});
