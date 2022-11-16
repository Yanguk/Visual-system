export const graphEnum = {
  MARGIN: 'margin',
  COLOR: 'color',
  INTERVAL: 'INTERVAL',
};

export const colorInfo = {
  darkGray: '#383C48',
  defaultBack: '#35363A',
  innerNavy: '#272A3C',
  bgColor: '#1B1C27',
  blue: '#4192EA',
  green: '#69b3a2',
};

export const channelEnum = {
  CPU: {
    USAGE: 'cpu-usage',
    ALL_USAGE: 'target-usage'
  },
  MEMORY: {
    USAGE: 'memory-usage',
  }
};

export const INTERVAL_TIME = 500;

export const COMMAND = {
  DISK: 'df -k',
  PROCESS_LIST: {
    SORT_CPU: 'sort_cpu',
    SORT_MEMORY: 'sort_memory',
  },
};

export const GRAPH_COLOR = colorInfo.green;

export const DATA_LENGTH = 200;

export const DOMAIN_TIME_DIFF = (120 * INTERVAL_TIME);
