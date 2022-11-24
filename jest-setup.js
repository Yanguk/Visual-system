import '@testing-library/jest-dom';

document.body.innerHTML = `
  <nav class="side-nav-bar">
    <ul class="side-nav-bar-wrapper">
      <li id="home">Home</li>
      <li id="cpu">CPU</li>
      <li id="memory">Memory</li>
      <li id="process">Process</li>
      <li id="disk">Disk</li>
      <li id="stats">Stats</li>
    </ul>
  </nav>
  <main id="root"></main>
`;

Object.defineProperty(window, 'connect', {
  value: {
    on: () => () => () => {},
  },
});

Object.defineProperty(window, 'api', {
  value: {
    cpu: async () => [
      {
        model: 'Intel(R) Core(TM) i5-7267U CPU @ 3.10GHz',
        speed: 3100,
        times: {
          user: 19427170,
          nice: 0,
          sys: 10524700,
          idle: 36884880,
          irq: 0,
        },
      },
      {
        model: 'Intel(R) Core(TM) i5-7267U CPU @ 3.10GHz',
        speed: 3100,
        times: {
          user: 4669490,
          nice: 0,
          sys: 2432590,
          idle: 59689600,
          irq: 0,
        },
      },
      {
        model: 'Intel(R) Core(TM) i5-7267U CPU @ 3.10GHz',
        speed: 3100,
        times: {
          user: 19093290,
          nice: 0,
          sys: 8671260,
          idle: 39063340,
          irq: 0,
        },
      },
      {
        model: 'Intel(R) Core(TM) i5-7267U CPU @ 3.10GHz',
        speed: 3100,
        times: {
          user: 4398780,
          nice: 0,
          sys: 2282520,
          idle: 60122190,
          irq: 0,
        },
      },
    ],
    memory: async () => ({
      totalMemMb: 16384,
      usedMemMb: 12171.97,
      freeMemMb: 4212.03,
      usedMemPercentage: 74.29,
      freeMemPercentage: 25.71,
      compressedMb: 2435.88,
      wiredMb: 2681.7,
      appMb: 7054.39,
    }),
    userInfo: async () => ({
      name: 'Yanguks-MacBook-Pro.local',
      ip: '192.168.0.8',
      cpu: 'Apple m2',
      memory: 16,
      platform: 'darwin',
      arch: 'x64',
    }),
    disk: async () => ({
      dir: '/',
      total: 233,
      used: 103,
      free: 130,
    }),
    diskAll: async () => {},
    memoryDetail: async () => {},
    processList: async () => [
      ['COMM', 'PID', '%CPU', '%MEM', 'RSS', 'TIME'],
      ['node', '90565', '42.3', '1.3', '219624', '0:26.88'],
      ['powerd', '113', '0.1', '0.0', '7588', '1:30.06'],
      ['Code Helper (Renderer)', '937', '0.1', '0.3', '46140', '0:57.26'],
      ['logd', '100', '0.1', '0.2', '29004', '4:57.42'],
      ['node', '87369', '0.1', '0.7', '125360', '0:20.03'],
      ['Rectangle', '523', '0.1', '0.1', '21896', '0:54.12'],
      ['npm test', '87368', '0.0', '0.2', '36828', '0:03.44'],
      ['-zsh', '87264', '0.0', '0.0', '364', '0:00.00'],
      ['-zsh', '87263', '0.0', '0.0', '696', '0:00.00'],
      ['-zsh', '86909', '0.0', '0.0', '2832', '0:00.34'],
      ['stable', '86908', '0.0', '1.0', '164604', '0:38.33'],
      ['MTLCompilerService', '78129', '0.0', '0.1', '13804', '0:00.19'],
      ['RunCat', '26391', '0.0', '0.1', '22324', '1:50.43'],
      ['Family', '7588', '0.0', '0.1', '13400', '0:03.35'],
      ['Slack Helper (Renderer)', '7564', '0.0', '1.9', '317472', '3:26.59'],
      ['VTDecoderXPCService', '7563', '0.0', '0.0', '4720', '0:00.12'],
      ['Slack Helper', '7561', '0.0', '0.1', '21944', '0:04.49'],
      ['Slack Helper (GPU)', '7560', '0.0', '0.6', '96380', '1:24.32'],
      ['Slack', '7559', '0.0', '0.7', '110536', '0:49.72'],
      ['-zsh', '86909', '0.0', '0.0', '2832', '0:00.34'],
      ['stable', '86908', '0.0', '1.0', '164604', '0:38.33'],
      ['MTLCompilerService', '78129', '0.0', '0.1', '13804', '0:00.19'],
      ['RunCat', '26391', '0.0', '0.1', '22324', '1:50.43'],
      ['Family', '7588', '0.0', '0.1', '13400', '0:03.35'],
      ['Slack Helper (Renderer)', '7564', '0.0', '1.9', '317472', '3:26.59'],
      ['VTDecoderXPCService', '7563', '0.0', '0.0', '4720', '0:00.12'],
      ['Slack Helper', '7561', '0.0', '0.1', '21944', '0:04.49'],
      ['Slack Helper (GPU)', '7560', '0.0', '0.6', '96380', '1:24.32'],
      ['Slack', '7559', '0.0', '0.7', '110536', '0:49.72'],
      ['-zsh', '86909', '0.0', '0.0', '2832', '0:00.34'],
      ['stable', '86908', '0.0', '1.0', '164604', '0:38.33'],
      ['MTLCompilerService', '78129', '0.0', '0.1', '13804', '0:00.19'],
      ['RunCat', '26391', '0.0', '0.1', '22324', '1:50.43'],
      ['Family', '7588', '0.0', '0.1', '13400', '0:03.35'],
      ['Slack Helper (Renderer)', '7564', '0.0', '1.9', '317472', '3:26.59'],
      ['VTDecoderXPCService', '7563', '0.0', '0.0', '4720', '0:00.12'],
      ['Slack Helper', '7561', '0.0', '0.1', '21944', '0:04.49'],
      ['Slack Helper (GPU)', '7560', '0.0', '0.6', '96380', '1:24.32'],
      ['Slack', '7559', '0.0', '0.7', '110536', '0:49.72'],
    ],
    processKill: async () => ({
      ok: false,
      message:
        'Command failed: LC_ALL="en_US.UTF-8";LANG="en_US.UTF-8";LANGUAGE="en_US:en"; kill process 170\n/bin/sh: line 0: kill: process: arguments must be process or job IDs\n/bin/sh: line 0: kill: (170) - Operation not permitted\n',
    }),
    getStats: async () => ({
      cpu: {
        time: 1004500,
        average: 42.5250920856146,
      },
      memory: {
        time: 1004500,
        average: 71.54839223494255,
      },
    }),
  },
  configurable: true,
});
