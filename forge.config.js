module.exports = {
  packagerConfig: {
    icon: './src/images/icon',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        options: {
          icon: './src/images/icon.png',
        },
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              name: 'main_window',
              html: './src/rendererProcess/index.html',
              js: './src/rendererProcess/index.js',
              preload: {
                js: './src/preload.js',
              },
            },
          ],
        },
      },
    },
  ],
  // config: {
  //   forge: {
  //     packagerConfig: {
  //       icon: '/path/to/icon',
  //     },
  //   },
  // },
};
