import express from 'express';
import axios from 'axios';
import CircuitBreaker from 'opossum';

const app = express();
const port = 3000;

// Configure the circuit breaker
const circuitBreakerOptions = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, open the circuit
  resetTimeout: 3000, // After 3 seconds, try again.
};

// Create a function to call the external API
async function callExternalAPI() {
  const response = await axios.get('http://localhost:3001/api/external');
  return response.data;
}

// Create a circuit breaker for our API call
const breaker = new CircuitBreaker(callExternalAPI, circuitBreakerOptions);

// Set up event listeners for the circuit breaker
breaker.on('open', () => console.log('Circuit Breaker is now OPEN'));
breaker.on('close', () => console.log('Circuit Breaker is now CLOSED'));
breaker.on('halfOpen', () => console.log('Circuit Breaker is now HALF-OPEN'));

// Create an endpoint that uses the circuit breaker
app.get('/api/data', async (req, res) => {
  try {
    const result = await breaker.fire();
    // const result = await callExternalAPI();
    res.json(result);
  } catch (error) {
    if (breaker.opened) {
      res.status(503).json({
        error: 'Service is currently unavailable. Please try again later.',
      });
    } else {
      res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
