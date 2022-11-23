import path from 'path';
import {
  mkdir, writeFile, readFile, appendFile,
} from 'node:fs/promises';
import fs from 'fs';
import { SAVE_INTERVAL_TIME_MS } from '../../lib/constant';

const dirName = 'vsData';

export default class FileSystem {
  constructor(fileName, titleIter) {
    this.path = path.join(__dirname, dirName);
    this.fileName = fileName;
    this.titleIter = titleIter;
  }

  async write(content) {
    if (!fs.existsSync(this.path)) {
      await mkdir(this.path);
      const initText = this.titleIter.join(',');
      await writeFile(path.join(this.path, `${this.fileName}.text`), initText);
    }

    await appendFile(path.join(this.path, `${this.fileName}.text`), `\n${content.join(',')}`);

    this.readFile('cpu');
  }

  async readFile() {
    const template = await readFile(
      path.join(this.path, `${this.fileName}.text`), 'utf8',
    );

    const dataIter = template.split('\n').map(item => item.split(','));
    return dataIter;
  }

  intervalSave(msTime, value) {
    const second = msTime / 1000;
    const saveIntervalTime = SAVE_INTERVAL_TIME_MS / 1000;
    const isSaveInterval = !(second % saveIntervalTime);

    if (isSaveInterval) {
      const data = [new Date().toString(), value];

      this.write(data);
    }
  }
}
