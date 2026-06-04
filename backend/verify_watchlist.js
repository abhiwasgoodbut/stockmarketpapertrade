import { getWatchlist } from './controllers/marketController.js';

const req = {
  body: {
    symbols: ['^NSEI', 'RELIANCE.NS', 'AAPL']
  }
};

const res = {
  json: (data) => {
    console.log("RESPONSE SUCCESS:", data.success);
    console.log("SOURCE:", data.source);
    if (data.results && data.results.length > 0) {
      console.log("FIRST ITEM:", data.results[0].symbol, "LTP:", data.results[0].ltp);
    }
  },
  status: (code) => ({
    json: (data) => console.log("STATUS", code, data)
  })
};

await getWatchlist(req, res);
console.log("TEST FINISHED");

