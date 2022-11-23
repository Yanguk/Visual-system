const path = require('path');
const {
  app, Menu, nativeImage, shell,
} = require('electron');

const menuInit = () => {
  const image = nativeImage.createFromPath(
    path.join(__dirname, '/images/icon.png'),
  );

  app.dock.setIcon(image);

  const template = [
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { role: 'quit' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Contact',
      submenu: [
        {
          label: 'Github',
          click: async () => {
            await shell.openExternal('https://github.com/Yanguk/Visual-system');
          },
        },
      ],
    },
  ];

  app.setAboutPanelOptions({
    applicationName: 'Visual System',
    applicationVersion: 'Version',
    version: '1.0.0',
    copyright: 'Copyright @ 2022 Yanguk',
  });

  app.dock.bounce();

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

export default menuInit;
