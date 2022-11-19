const childProcess = require('child_process');
const util = require('node:util');
const { default: _ } = require('./src/lib/fp');
const { default: L } = require('./src/lib/fp/lazy');

const asyncExec = util.promisify(childProcess.exec);

const customExec = async command => {
  const runCommand = `LC_ALL="en_US.UTF-8";LANG="en_US.UTF-8";LANGUAGE="en_US:en"; ${command}`;

  const { stdout, stderr } = await asyncExec(runCommand);

  if (stderr) {
    throw new Error(stderr);
  }

  return stdout;
};

const getMemoryDetail = async () => {
  const stdout = await customExec('vm_stat');

  const info = _.go(
    stdout,
    str => str.split('\n'),
    _.map(str => str.split(':')),
    _.map(_.pipe(
      L.getIndex,
      _.map(([str, idx]) => (idx
        ? str.replace(/[\s\n\r\\.]+/g, '')
        : str.replace(/[\s\n\r]+/g, '_'))),
    )),
  );

  return info;
};

getMemoryDetail();
