const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
/*
type FilterClauseType = {
  id: string;
  condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than';
  value: number | string;
}

type ResponseFiltersType = ResponseFilter[];
*/

function passesFilters(response) {
  response.questions.forEach((e) => {});

  return true;
}

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
    const filteredData = {
      ...data,
      responses: data.responses.filter(passesFilters)
    };

    res.json(filteredData);
  } catch (err) {
    res.status(500).send('server error');
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});