import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvFilePath = new URL('../../tasks.csv', import.meta.url);

async function importCSV() {
  const parser = fs
    .createReadStream(csvFilePath)
    .pipe(parse({ columns: true, delimiter: ',' }));

  for await (const task of parser) {
    fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
      }),
    });
  }
}

importCSV();
