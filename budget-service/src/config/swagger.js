const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Budget Envelope API',
      version: '1.0.0',
      description: 'A personal budgeting application using the envelope budgeting method',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Envelopes',
        description: 'Budget envelope management endpoints'
      },
      {
        name: 'Transactions',
        description: 'Transaction management and transfer endpoints'
      }
    ],
    components: {
      schemas: {
        Envelope: {
          type: 'object',
          required: ['title', 'budget'],
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated envelope ID',
              example: 1
            },
            title: {
              type: 'string',
              description: 'Envelope title/name',
              example: 'Groceries'
            },
            budget: {
              type: 'integer',
              description: 'Budget amount in cents',
              example: 50000
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Envelope creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Transaction: {
          type: 'object',
          required: ['envelopeId', 'amount'],
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated transaction ID',
              example: 1
            },
            envelopeId: {
              type: 'integer',
              description: 'Associated envelope ID',
              example: 1
            },
            amount: {
              type: 'integer',
              description: 'Transaction amount in cents',
              example: 2500
            },
            description: {
              type: 'string',
              description: 'Transaction description',
              example: 'Weekly grocery shopping'
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Transaction date'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Transaction creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Envelope not found'
              }
            }
          }
        },
        BadRequest: {
          description: 'Invalid request data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Title and budget are required'
              }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Internal server error'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
