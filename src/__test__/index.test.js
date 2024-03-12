const request = require('supertest');
const app = require('../index');

describe('filtererdResponses endpoint', () => {
  test('should return 200', async () => {
    const res = await request(app)
      .get('/cLZojxk94ous/filteredResponses');
    expect(res.statusCode).toEqual(200);
  });
});