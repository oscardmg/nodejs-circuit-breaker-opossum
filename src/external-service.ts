import express from 'express';

const app = express();
const port = 3001;

let returnError = false;
const errorTimeout = 10000;
const okTimeout = 40000;
const responseDelay = 3000;

// Function to toggle returnError after 30 seconds
const toggleErrorAfterTimeout = () => {
  setTimeout(() => {
    returnError = true;
    console.log('External service now returning errors');
  }, errorTimeout);
};

const toggleOkAfterTimeout = () => {
  setTimeout(() => {
    returnError = false;
    console.log('External service now returning ok');
  }, okTimeout);
};

// Initial call to start the timeout
toggleErrorAfterTimeout();
toggleOkAfterTimeout();

app.get('/api/external', async (req, res) => {
  // console.log('External service received a request');
  if (!returnError) {
    res.status(200).json({ message: 'Success' });
  } else {
    await new Promise((resolve) => setTimeout(resolve, responseDelay));
    res.status(502).json({ error: 'Bad Gateway' });
  }
});

app.listen(port, () => {
  console.log(`External service is running on http://localhost:${port}`);
});
