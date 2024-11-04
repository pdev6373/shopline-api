import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Danberkidz API Documentation',
      version,
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:3500',
        description: 'Documentation',
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['dist/src/routes/*.js', 'src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app: Express) =>
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
