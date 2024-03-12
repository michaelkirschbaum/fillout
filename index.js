const express = require('express');
const app = express();
const port = 3000;

app.get('/:formId/filteredResponses', async (req, res) => {
  try {
    const response = await fetch("https://api.fillout.com", {
      method: "GET",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json"
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).send('server error');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});