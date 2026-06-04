async function test() {
  try {
    const res = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/AAPL');
    const data = await res.json();
    console.log("PRICE:", data.chart.result[0].meta.regularMarketPrice);
  } catch(e) {
    console.error("ERROR:", e);
  }
}
test();
