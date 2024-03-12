const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

app.get('/:formId/filteredResponses', async (req, res) => {
  const url = "https://api.fillout.com/v1/api/forms/" + req.params.formId + "/submissions?";
  const filters = JSON.parse(req.query.filters);

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

    // apply filters
    filteredData = data.responses.filter((e) => e);

    res.json({ responses: filteredData, totalResponses: data.totalResponses, pageCount: data.pageCount });
  } catch (err) {
    res.status(500).send('server error');
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});