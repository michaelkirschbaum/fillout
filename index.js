const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

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

    // remove response if every filter condition is not met
    const filteredData = data.responses.filter(res => {
      return filters ? filters.every(filter => {
        // get matching question from the filter id
        const entry = res.questions.find(e => e.id === filter.id);

        // if entry does not exist or condition not met return false
        switch(filter.condition) {
          case 'equals':
            return entry?.value === filter.value ? true : false;
            break;
          case 'does_not_equal':
            return entry?.value !== filter.value ? true : false;
            break;
          case 'greater_than':
            return entry?.value > filter.value ? true : false;
            break;
          case 'less_than':
            return entry?.value < filter.value ? true : false;
            break;
          default:
            return false;
        }  // if filters are not defined return unfiltered responses
      }) : data.responses;
    });

    res.json({
      responses: filteredData,
      totalResponses: filteredData.length,
      pageCount: Math.ceil(filteredData.length / req.param.limit ? req.param.limit : 150)
    });
  } catch (err) {
    res.status(500).send('server error');
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});