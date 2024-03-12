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

app.get('/:formId/filteredResponses', async (req, res) => {
  const url = "https://api.fillout.com/v1/api/forms/" + req.params.formId + "/submissions?";
  const filters = JSON.parse(req.query.filters ? req.query.filters : null);

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
      responses: data.responses.filter((response) => {
        response.questions.forEach((e) => null);

        return true;
      })
    };

    res.json(filteredData);
  } catch (err) {
    res.status(500).send('server error');
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});