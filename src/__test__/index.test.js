const request = require('supertest');
const app = require('../index');

describe('filtererdResponses endpoint', () => {
  let formId = "cLZojxk94ous";

  test.skip('should return 200', async () => {
    const res = await request(app)
      .get(`/${formId}/filteredResponses`);
    expect(res.statusCode).toEqual(200);
  });
});