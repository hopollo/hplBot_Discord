import fs from 'fs';

export class DataWriter {
  replaceTo(filePath: string, data: string) {
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
      if (err) return console.error(err)
    });
  }

  async appendTo(filePath: string, data: object) {
    fs.readFile(filePath, (err, json) => {
      if (err) return console.error;
      if (!json) return console.error(new Error(`${filePath} : No data inside`));
      
      let array = JSON.parse(json.toString());
      array.push(data);

      fs.writeFile(filePath, JSON.stringify(array), (err) => {
        if (err) return console.error(err);
      });
    });
  }
  
  removeTo(filePath: string, data: string) {
    fs.readFile(filePath, (err, json) => {
      if (err) return console.error;
      if (!json) return console.error(new Error(`${filePath} : No data inside`));
      
      let array = JSON.parse(json.toString());
      const index = array.indexOf(data);
      if (index > -1 ) array.splice(index, 1);

      fs.writeFile(filePath, JSON.stringify(array), (err) => {
        if (err) return console.error(err);
      });
    });
  }
}