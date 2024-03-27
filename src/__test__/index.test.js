const request = require('supertest');
const app = require('../index');

const result = {
  responses: [
    {
	  questions: [
	    {
		  id: "nameId",
		  name: "What's your name?",
		  type: "ShortAnswer",
		  value: "Timmy"
		},
		{
		  id: "birthdayId",
		  name: "What is your birthday?",
		  type: "DatePicker",
		  value: "2024-02-22T05:01:47.691Z"
		},
	  ],
	  submissionId: "abc",
      submissionTime: "2024-05-16T23:20:05.324Z"
	},
  ],
  totalResponses: 1,
  pageCount: 1
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
  let formId = "testId";

  test('should return 200', async () => {
    const res = await request(app)
      .get(`/${formId}/filteredResponses`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(result);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('should return 500', async () => {
    fetch.mockImplementationOnce(() => Promise.reject());
    const res = await request(app)
      .get(`/${formId}/filteredResponses`);

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual('server error');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('should filter response', async () => {
    const filters = [
      {
        id: "nameId",
        condition: "equals",
        value: "Timmy",
      },
      {
        id: "birthdayId",
        condition: "greater_than",
        value: "2024-02-23T05:01:47.691Z"
      }
    ];

    const res = await request(app)
      .get(`/${formId}/filteredResponses?filters=` + JSON.stringify(filters));

    expect(res.body).toEqual({
      responses: [],
      totalResponses: 0,
      pageCount: 0
    });
  });
});