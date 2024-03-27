const request = require('supertest');
const app = require('../index');

const result = {
  responses: [],
  totalResponses: 0,
  pageCount: 0
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(result),
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

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(result);
  });

  test('should return 500', async () => {
    fetch.mockImplementationOnce(() => Promise.reject());
    const res = await request(app)
      .get(`/${formId}/filteredResponses`);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual('server error');
  });
});