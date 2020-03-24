import fs from 'fs';
import { Bot_Config } from '../../config.json';

const serverDir = Bot_Config.Servers_Config.servers_path;

export class DataWriter {
  replaceTo(filePath: string, data: string) {
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
      if (err) return console.error(err)
    });
  }

  appendTo(filePath: string, data: Object) {
    // TODO: NOT FINISHED
    
    fs.readFile(filePath, (err, json) => {
      if (err) return console.error;
      //Generate default + adds data to it
      if (!json) return fs.appendFile(filePath, JSON.stringify(data), (err) => {
        if (err) console.error;
      });
      
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