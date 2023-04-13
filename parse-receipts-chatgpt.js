const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const Papa = require('papaparse');
const Tesseract = require('tesseract.js');


const inputFolder = '/Users/jparsell/Documents/2022 Taxes/2022 receipts/';
const outputFile = './output.csv';

async function processFolder(folderPath) {
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });

  const results = [];
  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);

    if (entry.isDirectory()) {
      const subResults = await processFolder(fullPath);
      results.push(...subResults);
    } else if (entry.isFile() && /\.(jpe?g|png)$/i.test(entry.name)) {
      const result = await processReceiptImage(fullPath);
      results.push(result);
    }
  }

  return results;
}

// processReceiptImage function goes here
async function processReceiptImage(imagePath) {
  const ocrResult = await Tesseract.recognize(imagePath, 'eng', {
    logger: (m) => console.log(m),
  });

  const receiptText = ocrResult.data.text;
  const prompt = `Here is the text from a receipt:\n\n${receiptText}\n\nExtract the receipt amount and date from the text, and return them as a JSON object in the format: {"amount": "xx.xx", "date": "yyyy-mm-dd"}.`;

 const gptResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
    messages: [{"role": "user", content: prompt}],
    model: "gpt-3.5-turbo",
    max_tokens: 100,
    n: 1,
    stop: null,
    temperature: 0.5,
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  });
  console.log("DATA", gptResponse.data.choices);
  const gptCompletion = gptResponse.data.choices[0].message.content;

  // Parse the JSON response
  let parsedJson;
  try {
    parsedJson = JSON.parse(gptCompletion);
  } catch (err) {
    console.error('Failed to parse JSON from GPT:', gptCompletion);
    parsedJson = { amount: null, date: null };
  }

  const filename = path.basename(imagePath);
  const amount = parsedJson.amount ? parseFloat(parsedJson.amount) : null;
  const date = parsedJson.date || null;

  return { filename, amount, date };
}

async function writeCsv(data, filePath) {
  const csv = Papa.unparse(data);
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, csv, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}



(async () => {
  try {
    const results = await processFolder(inputFolder);
    await writeCsv(results, outputFile);
    console.log('CSV file created:', outputFile);
  } catch (err) {
    console.error('Error processing receipt images:', err);
  }
})();

