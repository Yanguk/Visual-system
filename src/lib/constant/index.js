export const graphEnum = {
  MARGIN: 'margin',
  COLOR: 'color',
  INTERVAL: 'INTERVAL',
  FONT_SIZE: 'fontSize',
};

export const colorInfo = {
  darkGray: '#383C48',
  defaultBack: '#35363A',
  innerNavy: '#272A3C',
  bgColor: '#1B1C27',
  blue: '#4192EA',
  green: '#69b3a2',
  green2: '#05C270',
  red: '#FE3B3B',
  text1: '#8F91A6',
  text2: '#53596F',
  text3: '#DADAE1',
};

export const channelEnum = {
  CPU: {
    USAGE: 'cpu-usage',
    ALL_USAGE: 'target-usage'
  },
  MEMORY: {
    USAGE: 'memory-usage',
    DETAIL: 'memory-detail',
  },
  PROCESS: {
    TOP: 'top',
  }
};

export const INTERVAL_TIME = 500;
export const INTERVAL_TIME_TWO = 3000;

export const COMMAND = {
  DISK: 'df -k',
  DISK_GB: 'df -h',
  PROCESS_LIST: {
    SORT_CPU: 'sort_cpu',
    SORT_MEMORY: 'sort_memory',
  },
};

export const GRAPH_COLOR = colorInfo.green;

export const DATA_LENGTH = 200;

export const DOMAIN_TIME_DIFF = (120 * INTERVAL_TIME);

export const REGEX = {
  removeSpaceTow: /^\s+|\s{2,}/g,
  removeAllSpace: /[\s\n\r]+/g,
}

export const memoryInfoEnum = {
  TOTAL_MEM_MB: 'totalMemMb',
  USED_MEM_MB: 'usedMemMb',
  FREE_MEM_MB: 'freeMemMb',
  USED_MEM_PERCENTAGE: 'usedMemPercentage',
  FREE_MEM_PERCENTAGE: 'freeMemPercentage',
  COMPRESSED_MB: 'compressedMb',
  WIRED_MB: 'wiredMb',
  APP_MB: 'appMb',
};
