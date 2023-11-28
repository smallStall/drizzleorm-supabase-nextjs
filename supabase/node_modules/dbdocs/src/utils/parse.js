const { Worker } = require('worker_threads');

const parse = (content) => {
  return new Promise((resolve, reject) => {
    const workerPath = `${__dirname}/parserWorker.js`;

    const worker = new Worker(workerPath, {
      workerData: { content },
    });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
};

module.exports = parse;
