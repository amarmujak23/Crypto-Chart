let labels = [];
let prices = [];
let exchangeLabels = [];
let exchangePrices = [];
let chart = null;

const coinsURL = 'https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0';
const exchangeCoinsURL = 'https://coinranking1.p.rapidapi.com/exchange/-zdvbieRdZ/coins?referenceCurrencyUuid=yhjMzLPhuIDl&limit=50&offset=0&orderBy=24hVolume&orderDirection=desc';
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '74de32a9dcmsh4afef5204fe181fp157e0bjsnd5e682ec9b51',
    'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
  }
};

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function() {
  const searchTerm = searchInput.value.toLowerCase();

  const filteredLabels = labels.filter(label => label.toLowerCase().includes(searchTerm));
  const filteredPrices = filteredLabels.map(label => prices[labels.indexOf(label)]);

  const filteredExchangeLabels = exchangeLabels.filter(label => label.toLowerCase().includes(searchTerm));
  const filteredExchangePrices = filteredExchangeLabels.map(label => exchangePrices[exchangeLabels.indexOf(label)]);

  displayFilteredChart(filteredLabels, filteredPrices, filteredExchangeLabels, filteredExchangePrices);
});

const filterSelect = document.getElementById('filterSelect');
filterSelect.addEventListener('change', function() {
  const filterValue = filterSelect.value;
  updateChart(filterValue);
});

async function fetchCryptoData(url) {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const coins = result.data.coins || [];
    
    labels = coins.map(coin => coin.name);
    prices = coins.map(coin => coin.price);
    
    return coins;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchHistoricalData() {
  const url = 'https://coinranking1.p.rapidapi.com/coin/Qwsogvtv82FCd/history?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '74de32a9dcmsh4afef5204fe181fp157e0bjsnd5e682ec9b51',
      'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.data.history || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function displayCryptoChart() {
  const coinsData = await fetchCryptoData(coinsURL);
  const exchangeCoinsData = await fetchCryptoData(exchangeCoinsURL);
  const historicalData = await fetchHistoricalData(); // Fetch historical data

  exchangeLabels = exchangeCoinsData.map(coin => coin.name);
  exchangePrices = exchangeCoinsData.map(coin => coin.price);

  const historicalPrices = historicalData.map(item => item.price);
  const historicalTimestamps = historicalData.map(item => item.timestamp);

  const ctx = document.getElementById('cryptoChart').getContext('2d');
  ctx.canvas.width = 900;
  ctx.canvas.height = 700;

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Crypto Prices',
          data: prices,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderWidth: 2,
          barThickness: 30,
        },
        {
          label: 'Exchange Crypto Prices',
          data: exchangePrices,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderWidth: 2,
          barThickness: 30,
        },
        {
          label: 'Historical Crypto Prices',
          data: historicalPrices,
          borderColor: 'rgba(75, 192, 192, 1)', // Green color for historical line
          fill: false, // Do not fill area under the line
          borderWidth: 2,
          type: 'line', // Set as a line graph
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      elements: {
        line: {
          borderWidth: 3,
        },
      },
    },
  });

  return chart;
}

async function updateChart(filterValue) {
  if (filterValue === 'price') {
    labels.sort((a, b) => prices[labels.indexOf(a)] - prices[labels.indexOf(b)]);
    exchangeLabels.sort((a, b) => exchangePrices[exchangeLabels.indexOf(a)] - exchangePrices[exchangeLabels.indexOf(b)]);
  } else if (filterValue === 'marketCap') {
    // Implement sorting logic by market cap
    // ...
  }
  
  if (chart) {
    chart.destroy();
  }
  
  chart = displayCryptoChart();
}

async function displayFilteredChart(filteredLabels, filteredPrices, filteredExchangeLabels, filteredExchangePrices) {
  const ctx = document.getElementById('cryptoChart').getContext('2d');

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: filteredLabels,
      datasets: [
        {
          label: 'Crypto Prices',
          data: filteredPrices,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderWidth: 2,
          barThickness: 30,
        },
        {
          label: 'Exchange Crypto Prices',
          data: filteredExchangePrices,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderWidth: 2,
          barThickness: 30,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      elements: {
        line: {
          borderWidth: 3,
        },
      },
    },
  });
}

chart = displayCryptoChart();


