import childProcess from 'child_process';
import util from 'node:util';

const asyncExec = util.promisify(childProcess.exec);

const customExec = async command => {
  const runCommand = `LC_ALL="en_US.UTF-8";LANG="en_US.UTF-8";LANGUAGE="en_US:en"; ${command}`;

  const { stdout, stderr } = await asyncExec(runCommand);

  if (stderr) {
    throw new Error(stderr);
  }

  return stdout;
};

export default customExec;
