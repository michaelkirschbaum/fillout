const request = require('supertest');
const app = require('../index');

const responses = {};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(responses),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

describe('filteredResponses endpoint', () => {
  let formId = "cLZojxk94ous";

  test('should return 200', async () => {
    const res = await request(app)
      .get(`/${formId}/filteredResponses`);

    expect(res.statusCode).toEqual(200);
    expect(fetch).toHaveBeenCalledTimes(1);
    // expect(res).toEqual(responses);
  });
});