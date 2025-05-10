const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors()); // ✅ Allow cross-origin requests
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Backend up');
});

// Analyze endpoint
app.post('/analyze', (req, res) => {
  const { Data, Secret } = req.body;
  if (!Data || !Secret) {
    return res.status(400).json({ error: 'Missing Data or Secret' });
  }

  let nums;
  try {
    nums = JSON.parse(Data);
    if (!Array.isArray(nums)) throw 0;
  } catch {
    return res.status(400).json({ error: 'Invalid Data format' });
  }

  nums = nums.map(Number).sort((a, b) => a - b);
  const size = nums.length;
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = parseFloat((sum / size).toFixed(2));
  const median = size % 2
    ? nums[(size - 1) / 2]
    : parseFloat(((nums[size/2 - 1] + nums[size/2]) / 2).toFixed(2));
  
  // Mode calculation
  const freq = {};
  nums.forEach(n => freq[n] = (freq[n] || 0) + 1);
  const maxCount = Math.max(...Object.values(freq));
  const modes = Object.keys(freq).filter(k => freq[k] === maxCount).map(Number);
  const mode = modes.length === 1 ? modes[0] : modes;

  const min = nums[0];
  const max = nums[size - 1];

  return res.json({ Size: size, Mean: mean, Median: median, Mode: mode, Min: min, Max: max, Secret });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Backend listening on http://localhost:${PORT}`));