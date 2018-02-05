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

const parseImport = (body) => {
  const parsed = body.split('\n');
  let entry = {};
  let pointer = 0;
  let queries = [];
  let query = '';
  let sql = '';
  let keys = {};

  console.log(k, i);
  parsed.forEach((line) => {
    pointer = 0
    recordType = line.substr(pointer,2);
    entry = {}

    if(knownFormats.indexOf('bol_' + recordType) >= 0) {
      keys['bol_' + recordType] = [];
      formats['bol_' + recordType].forEach((format) => {
        keys['bol_' + recordType].push(convertName(format.name));

        entry[convertName(format.name)] = String(line.substr(pointer, format.length)).trim();
        pointer += format.length;
      });
      //console.log(entry);
      entries['bol_' + recordType].push(entry);
    } else {
      console.log('SKIPPING RECORD', recordType);
    }
    i += 1;
  });

  connection.connect();

  knownFormats.forEach((table) => {
    a = 0;
    queries = [];
    entries[table].forEach((entry) => {
      values = [];
      a += 1;
      keys[table].forEach((key) => {
        values.push(connection.escape(entry[key]));
      });
      queries.push('(' + values.join(',') + ')');

      if(a % 1000 === 0 || a >= entries[table].length) {
        sql = 'INSERT INTO `' + table + '` (`' + keys[table].join('`,`') + '`) VALUES ' + queries.join(',') + ';';
        connection.query(sql,  (error, results, fields) => {

        });
        queries = [];
      }
    });

  });
}

const testmode = process.argv[2];

let entries = {};
let formats = {};
let i = 0;
let k = 0;
let a = 0;
let recordType;

knownFormats.forEach((file) => {
  formats[file] = JSON.parse(fs.readFileSync(file + '.json', 'utf8'));
  entries[file] = [];
});

imports.handler = function(event, context, callback) {

    // Retrieve the bucket & key for the uploaded S3 object that
    // caused this Lambda function to be triggered
    var src_bkt = event.Records[0].s3.bucket.name;
    var src_key = event.Records[0].s3.object.key;

    // Retrieve the object
    s3.getObject({
        Bucket: src_bkt,
        Key: src_key
    }, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(err);
        } else {
            parseImport(data.Body.toString('ascii'));
            callback(null, null);
        }
    });
};
if(testmode == 'true') {
  fs.readFile('ACEFOI.20160201 copy.txt', 'utf8', (err, data) => {
    if (err) throw err;

    parseImport(data);
  });
}
