import { readFile, writeFile } from "node:fs";

export class DataWriter {
  read(filePath: string) {
    return new Promise<unknown>((resolve, reject) => {
      readFile(filePath, "utf8", (err, data) => {
        if (err) reject(err);

        resolve(JSON.parse(data));
      });
    })
      .then((data) => {
        return data;
      })
      .catch(console.error);
  }

  findInto(filePath: string, data: string) {
    return new Promise<string>((resolve, reject) => {
      readFile(filePath, "utf8", (err, commands) => {
        if (err) reject(err);
        const json = JSON.parse(commands);
        resolve(json[data]);
      });
    })
      .then((data) => {
        return data;
      })
      .catch(console.error);
  }

  appendTo(filePath: string, data: object) {
    readFile(filePath, "utf8", (err, oldData) => {
      if (err) return console.error;

      const json: object = JSON.parse(oldData);
      const newJSON: object = Object.assign(json, data);

      writeFile(filePath, JSON.stringify(newJSON), (err) => {
        if (err) return console.error;
      });
    });
  }

  removeTo(filePath: string, data: string) {
    readFile(filePath, "utf8", (err, oldJSON) => {
      if (err) return console.error;
      if (!oldJSON) {
        return console.error(new Error(`${filePath} : No data inside`));
      }

      const json = JSON.parse(oldJSON);
      delete json[data.toString()];

      writeFile(filePath, JSON.stringify(json), (err) => {
        if (err) return console.error;
      });
    });
  }
}
