const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');

const _cleanStr = (str) => {
  return str.replace(/[^\w\s.,;()]+/g, '').replace(/\s+/g, ' ');
};

const _readCsvFile = (filepath) => {
  // read csv file and return data
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filepath)
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          name: data.Name,
          url: data.URL,
          options: _cleanStr(data.Options).split(';').map((method) => {
            return {
              contributor: null,
              method: method,
              likers: [],
              dislikers: []
            }
          })
        })
      })
      // .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

const postCsv = async (filepath) => {
  const data = await _readCsvFile(filepath);

  // console.log(data.length, data[387]);

  // Loop through each object and post to API
  // Works but sample is already inserted
  // for (let i = 0; i < data.length; i++) {
  //   const item = data[i];
  //   try {
  //     const response = await axios.post('http://localhost:3001/api/items', item);
  //     console.log(`Item ${item.name} (${i}) was successfully posted with response ${response.status}`);
  //   } catch (err) {
  //     console.error(`Error posting item ${i}: ${err}`);
  //   }
  // }

  console.log(`All (${data.length}) have been processed!`);
};

// Run this using e.g.: npm run post-csv ../file/path.csv
const [, , filePath] = process.argv;
postCsv(filePath);

module.exports = postCsv;
