const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.get('/:formId/filteredResponses', async (req, res) => {
  const url = "https://api.fillout.com/v1/api/forms/" + req.params.formId + "/submissions?";

  try {
    const response = await fetch(url + new URLSearchParams({ ...req.query }), {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_KEY}`
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).send('server error');
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});