import fs from 'fs';

export class DataWriter {

  async read(filePath: string) {
    return new Promise<any>((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) reject(err);
        
        resolve(JSON.parse(data));
      });
    })
    .then(data => { return data; })
    .catch(console.error);
  }

  async findInto(filePath: string, data: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, commands) => {
        if (err) reject(err);
        const json = JSON.parse(commands);
        resolve(json[data]);
      });
    })
    .then(data => { return data; })
    .catch(console.error);
  }
  
  async replaceTo(filePath: string, data: Object) {
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
      if (err) return console.error(err)
    });
  }
  
  async appendTo(filePath: any, data: any) {
    fs.readFile(filePath, 'utf8', (err, oldData) => {
      if (err) console.error;
      if (!oldData) return fs.appendFile(filePath, JSON.stringify(data), (err) => {
        if (err) console.error;
      });
  
      const json = JSON.parse(oldData);
      json.push(data);

      console.log(json);
  
      fs.writeFile(filePath, JSON.stringify(json), (err) => {
        if (err) return console.error;  
      });
    });
  }
  
  async removeTo(filePath: string, data: string) {
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