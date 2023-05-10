// const fs = require('fs');
// const csv = require('csv-parser');

// const filePath = 'C:/Users/rahul/Downloads/HINDUNILVR.NS.csv';
// // "C:\Users\rahul\Downloads\HINDUNILVR.NS.csv"
// const stockData = [];

// fs.createReadStream(filePath)
//   .pipe(csv(['Date', 'Open', 'High', 'Low', 'Close', 'Adj Close', 'Volume']))
//   .on('data', row => {
//     stockData.push(row);
//   })
//   .on('end', () => {
//     console.log('CSV file successfully processed.');
//     console.log(stockData);
//     // Perform further operations or backtesting on the stockData array here
//   });

const fs = require('fs');
const csvParser = require('csv-parser');

const filePath = 'C:/Users/rahul/Downloads/HINDUNILVR.NS.csv';
const stockData = [];

async function readCSV() {
  try {
    // prettier-ignore
    const stream = fs.createReadStream(filePath).pipe(csvParser(['Date', 'Open', 'High', 'Low', 'Close', 'Adj_Close', 'Volume']));
    //
    for await (const row of stream) {
      stockData.push(row);
    }
    //
    stockData.splice(0, 1);
  } catch (error) {
    console.error('An error occurred while processing the CSV file:', error);
  }
}

function getBacktestingDates(acceptedDeviation) {
  // my processing here

  console.log(`💎 stockData.at(0): `, stockData.at(0));
  // console.log(`💎 stockData.at(1): `, stockData.at(1));
  // console.log(`💎 stockData.at(-1): `, stockData.at(-1));
  // console.log(`💎 stockData: `, stockData);

  // const firstData = stockData.at(0);
  // console.log(`💎 firstData: `, firstData);

  const possibleBtstDates = [];

  stockData.forEach(day => {
    const dayRange = day.High - day.Low;
    const dayOpenAndHighDiff = Math.abs(day.Open - day.High);
    const dayOpenAndLowDiff = Math.abs(day.Open - day.Low);

    if ((dayOpenAndHighDiff / dayRange) * 100 < acceptedDeviation) {
      possibleBtstDates.push({
        date: day.Date,
        candle: 'bearish next day',
      });
    }

    if ((dayOpenAndLowDiff / dayRange) * 100 < acceptedDeviation) {
      possibleBtstDates.push({
        date: day.Date,
        candle: 'bullish next day',
      });
    }
  });

  return possibleBtstDates;
}

(async () => {
  await readCSV();
  const requiredDates = getBacktestingDates(1);
  // console.log(`💎 stockData.length: `, stockData.length);
  // console.log(`💎 requiredDates.length: `, requiredDates.length);
})();

// console.log(`💎 stockData: `, stockData);
// console.log('stockData[0]:', stockData[0]);
// console.log('stockData.length:', stockData.length);
