const fs = require('fs');

if (process.argv.length >= 3) {


  fs.readFile(process.argv[2], 'utf8', (err, data) => {
    if (err) throw err;

    let k = 1;
    const parsed = data.split("\n");
    let json = [];
    let entry = {};
    const jsonFilename = process.argv[2].replace(/\.txt$/, '.json');

    parsed.forEach((line) => {
      if(k === 1) {
        entry['name'] = String(line.trim());
      } else {
        entry['length'] = parseInt(line.match(/([0-9]+)/)[0]);
      }
      k += 1;
      if(k > 2) {
        k = 1;
        json.push(entry);
        entry = {};
      }
    });

    fs.writeFileSync(jsonFilename, JSON.stringify(json));

    console.log(jsonFilename);
  });
} else {
  console.log('Please provide a file');
}
