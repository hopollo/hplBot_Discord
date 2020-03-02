"use_strict";

const fs = require('fs');

exports.replaceTo = (filePath, data) => {
  fs.writeFile(filePath, JSON.stringify(data), (err) => {
    if (err) return console.error(err)
  });
}

exports.appendTo = async (filePath, data) => {
  fs.readFile(filePath, (err, json) => {
    if (err) return console.error;
    if (!json) return console.error(new Error(`${filePath} : No data inside`));
    
    let array = JSON.parse(json);
    array.push(data);

    fs.writeFile(filePath, JSON.stringify(array), (err) => {
      if (err) return console.error(err);
    });
  });
}

exports.removeTo = (filePath, data) => {
  fs.readFile(filePath, (err, json) => {
    if (err) return console.error;
    if (!json) return console.error(new Error(`${filePath} : No data inside`));
    
    let array = JSON.parse(json);
    const index = array.indexOf(data);
    if (index > -1 ) array.splice(index, 1);

    fs.writeFile(filePath, JSON.stringify(array), (err) => {
      if (err) return console.error(err);
    });
  });
}