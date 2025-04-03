import swaggerJsdoc from 'swagger-jsdoc'
import { swaggerSchemas } from './swaggerSchemas'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Film Commission API Documentation',
      version: '1.0.0',
      description: 'API documentation for Film Commission backend services',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Profile',
        description: 'User profile management endpoints',
      },
      {
        name: 'Companies',
        description: 'Company management endpoints',
      },
      {
        name: 'Locations',
        description: 'Location management endpoints',
      },
      {
        name: 'Projects',
        description: 'Audiovisual project management endpoints',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: swaggerSchemas,
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
}

export const swaggerSpec = swaggerJsdoc(options)
