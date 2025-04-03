export const swaggerSchemas = {
  Location: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the location',
      },
      type: {
        type: 'string',
        enum: ['Público', 'Privado'],
        description: 'Type of location',
      },
      description: {
        type: 'string',
        description: 'Description of the location',
      },
      category: {
        type: 'string',
        enum: ['Urbano', 'Rural', 'Natural'],
        description: 'Category of the location',
      },
      subCategory: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Subcategories of the location',
      },
      province: {
        type: 'string',
        enum: [
          'Azuay',
          'Bolívar',
          'Cañar',
          'Carchi',
          'Chimborazo',
          'Cotopaxi',
          'El Oro',
          'Esmeraldas',
          'Galápagos',
          'Guayas',
          'Imbabura',
          'Loja',
          'Los Ríos',
          'Manabí',
          'Morona Santiago',
          'Napo',
          'Orellana',
          'Pastaza',
          'Pichincha',
          'Santa Elena',
          'Santo Domingo',
          'Sucumbíos',
          'Tungurahua',
          'Zamora',
        ],
        description: 'Province where the location is located',
      },
      city: {
        type: 'string',
        description: 'City where the location is located',
      },
      weather: {
        type: 'string',
        enum: [
          'Cálido',
          'Húmedo',
          'Seco',
          'Semiseco',
          'Frío',
          'Templado',
          'Tropical',
          'Polar',
        ],
        description: 'Weather type of the location',
      },
      contactName: {
        type: 'string',
        description: 'Contact person name',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Contact email',
      },
      phone: {
        type: 'string',
        description: 'Contact phone number',
      },
    },
    required: [
      'name',
      'type',
      'description',
      'category',
      'subCategory',
      'province',
      'city',
      'weather',
      'contactName',
      'email',
      'phone',
    ],
  },
  User: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'User full name',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'User email address',
      },
      password: {
        type: 'string',
        format: 'password',
        description: 'User password',
      },
      role: {
        type: 'string',
        enum: ['user', 'admin'],
        description: 'User role',
      },
    },
    required: ['name', 'email', 'password'],
  },
  Company: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Company name',
      },
      description: {
        type: 'string',
        description: 'Company description',
      },
      type: {
        type: 'string',
        enum: ['Producción', 'Servicios', 'Distribución'],
        description: 'Company type',
      },
      contactName: {
        type: 'string',
        description: 'Contact person name',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Contact email',
      },
      phone: {
        type: 'string',
        description: 'Contact phone number',
      },
      website: {
        type: 'string',
        format: 'uri',
        description: 'Company website URL',
      },
    },
    required: ['name', 'description', 'type', 'contactName', 'email', 'phone'],
  },
  AudiovisualProject: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Project title',
      },
      description: {
        type: 'string',
        description: 'Project description',
      },
      type: {
        type: 'string',
        enum: ['Película', 'Serie', 'Documental', 'Corto', 'Publicidad'],
        description: 'Project type',
      },
      status: {
        type: 'string',
        enum: [
          'En desarrollo',
          'En producción',
          'Post-producción',
          'Completado',
        ],
        description: 'Project status',
      },
      startDate: {
        type: 'string',
        format: 'date',
        description: 'Project start date',
      },
      endDate: {
        type: 'string',
        format: 'date',
        description: 'Project end date',
      },
      location: {
        type: 'string',
        description: 'Project location',
      },
      company: {
        type: 'string',
        description: 'Company ID associated with the project',
      },
    },
    required: ['title', 'description', 'type', 'status', 'startDate'],
  },
  Profile: {
    type: 'object',
    properties: {
      bio: {
        type: 'string',
        description: 'User biography',
      },
      profession: {
        type: 'string',
        description: 'User profession',
      },
      experience: {
        type: 'string',
        description: 'User experience',
      },
      skills: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'User skills',
      },
    },
  },
}
