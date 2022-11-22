const { app, Menu, nativeImage } = require('electron');
const path = require('path');

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
