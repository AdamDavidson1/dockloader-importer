const fs = require('fs');
const mysql = require('mysql');

const knownFormats = [
  'bol_00',
  'bol_10',
  'bol_20',
  'bol_30',
  'bol_40',
  'bol_50',
  'bol_60',
  'bol_61',
  'bol_62',
  'bol_70',
  'bol_71',
  'bol_80'
];

const convertName = (name) => {
  return name.toLowerCase().replace(/\s/g, '_');
};

const connection = mysql.createConnection({
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DB
})

let entries = {};
let formats = {};
let i = 0;
let k = 0;
let recordType;

knownFormats.forEach((file) => {
  formats[file] = JSON.parse(fs.readFileSync(file + '.json', 'utf8'));
  entries[file] = [];
});

fs.readFile('ACEFOI.20160201 copy.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const parsed = data.split('\n');
  let entry = {};
  let pointer = 0;

  console.log(k, i);
  parsed.forEach((line) => {
    pointer = 0
    recordType = line.substr(pointer,2);
    entry = {}

    if(knownFormats.indexOf('bol_' + recordType) >= 0) {
      formats['bol_' + recordType].forEach((format) => {
        entry[convertName(format.name)] = String(line.substr(pointer, format.length)).trim();
        pointer += format.length;
      });
      console.log(entry);
      entries['bol_' + recordType].push(entry);
    } else {
      console.log('SKIPPING RECORD', recordType);
    }
    i += 1;
  });

  connection.connect();

  knownFormats.forEach((table) => {

  });
});
