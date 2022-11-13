import getCPUInfo from './getCPUInfo';

const CPU_INTERVAL_TIME = 1000;

const cpuInfo = getCPUInfo();

cpuInfo.startInterval(CPU_INTERVAL_TIME);
