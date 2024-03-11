const express = require('express');
const app = express();
const port = 3000;

app.get('/:formId/filteredResponses', (req, res) => {
  res.json(null);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});