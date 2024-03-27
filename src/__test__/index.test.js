const request = require('supertest')
const app = require('../index')

const result = {
  responses: [
    {
	  questions: [
	    {
		  id: 'nameId',
		  name: "What's your name?",
		  type: 'ShortAnswer',
		  value: 'Robert'
        },
        {
		  id: 'birthdayId',
		  name: 'What is your birthday?',
		  type: 'DatePicker',
		  value: '1990-03-15T05:01:47.691Z'
        },
        {
		  id: 'employeesId',
		  name: 'How many employees work under you?',
	      type: 'number',
	      value: 2
        }
	  ],
	  submissionId: 'abc',
      submissionTime: '2024-03-27T22:20:05.324Z'
    },
    {
      questions: [
        {
          id: 'nameId',
    	  name: "What's your name?",
          type: 'ShortAnswer',
          value: 'Justin'
    	},
    	{
    	  id: 'birthdayId',
    	  name: 'What is your birthday?',
    	  type: 'DatePicker',
    	  value: '1993-09-25T05:01:47.691Z'
    	}
      ],
      submissionId: '123',
      submissionTime: '2024-03-27T23:20:05.324Z'
    }
  ],
  totalResponses: 2,
  pageCount: 1
}

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(result)
  })
)

beforeEach(() => {
  fetch.mockClear()
})

describe('filteredResponses endpoint', () => {
  const formId = 'testId'

  test('should return 200', async () => {
    const res = await request(app)
      .get(`/${formId}/filteredResponses`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(result)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  test('should return 500', async () => {
    fetch.mockImplementationOnce(() => Promise.reject())
    const res = await request(app)
      .get(`/${formId}/filteredResponses`)

    expect(res.statusCode).toEqual(500)
    expect(res.text).toEqual('server error')
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  test('equals filter', async () => {
    const filters = [
      {
        id: 'nameId',
        condition: 'equals',
        value: 'Robert'
      }
    ]
    const res = await request(app)
      .get(`/${formId}/filteredResponses?filters=` + JSON.stringify(filters))

    expect(res.body).toEqual({
      responses: [
        {
    	  questions: [
    	    {
    		  id: 'nameId',
    		  name: "What's your name?",
    		  type: 'ShortAnswer',
    		  value: 'Robert'
    		},
    		{
    		  id: 'birthdayId',
    		  name: 'What is your birthday?',
    		  type: 'DatePicker',
    		  value: '1990-03-15T05:01:47.691Z'
    		},
    		{
    		  id: 'employeesId',
    		  name: 'How many employees work under you?',
    	      type: 'number',
    	      value: 2
    		}
    	  ],
    	  submissionId: 'abc',
          submissionTime: '2024-03-27T22:20:05.324Z'
    	}
      ],
      totalResponses: 1,
      pageCount: 1
    })
  })

  test('does not equal filter', async () => {
    const filters = [
      {
        id: 'employeesId',
        condition: 'does_not_equal',
        value: 3
      }
    ]
    const res = await request(app)
      .get(`/${formId}/filteredResponses?filters=` + JSON.stringify(filters))

    expect(res.body).toEqual({
      responses: [
        {
    	  questions: [
    	    {
    		  id: 'nameId',
    		  name: "What's your name?",
    		  type: 'ShortAnswer',
    		  value: 'Robert'
    		},
    		{
    		  id: 'birthdayId',
    		  name: 'What is your birthday?',
    		  type: 'DatePicker',
    		  value: '1990-03-15T05:01:47.691Z'
    		},
    		{
    		  id: 'employeesId',
    		  name: 'How many employees work under you?',
    	      type: 'number',
    	      value: 2
    		}
    	  ],
    	  submissionId: 'abc',
          submissionTime: '2024-03-27T22:20:05.324Z'
    	}
      ],
      totalResponses: 1,
      pageCount: 1
    })
  })

  test('greater than filter', async () => {
    const filters = [
      {
        id: 'birthdayId',
        condition: 'greater_than',
        value: '1991-01-01'
      }
    ]
    const res = await request(app)
      .get(`/${formId}/filteredResponses?filters=` + JSON.stringify(filters))

    expect(res.body).toEqual({
      responses: [
    	{
          questions: [
            {
              id: 'nameId',
        	  name: "What's your name?",
              type: 'ShortAnswer',
              value: 'Justin'
        	},
        	{
        	  id: 'birthdayId',
        	  name: 'What is your birthday?',
        	  type: 'DatePicker',
        	  value: '1993-09-25T05:01:47.691Z'
        	}
          ],
          submissionId: '123',
          submissionTime: '2024-03-27T23:20:05.324Z'
        }
      ],
      totalResponses: 1,
      pageCount: 1
    })
  })

  test('less than filter', async () => {
    const filters = [
      {
        id: 'birthdayId',
        condition: 'less_than',
        value: '2024-01-01'
      }
    ]
    const res = await request(app)
      .get(`/${formId}/filteredResponses?filters=` + JSON.stringify(filters))

    expect(res.body).toEqual(result)
  })

  test('invalid filter name returns nothing', async () => {
    const filters = [
      {
        id: 'nameId',
        condition: 'equal_to',
        value: 'Robert'
      }
    ]
    const res = await request(app)
      .get(`/${formId}/filteredResponses?filters=` + JSON.stringify(filters))

    expect(res.body).toEqual({
      responses: [],
      totalResponses: 0,
      pageCount: 0
    })
  })
})
