import Joi from 'joi';
import { AppError } from './errorHandler.js';

export { 
  validateSchema,
  schemas
};

const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const messages = error.details.map(detail => detail.message);
      return next(new AppError(messages.join('. '), 400));
    }
    
    next();
  };
};

// Esquemas de validación
export const schemas = {
  usuario: {
    registro: Joi.object({
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      cell: Joi.string().pattern(/^[0-9]{10}$/).messages({
        'string.pattern.base': 'El teléfono debe tener 10 dígitos'
      })
    }),
    login: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    })
  },
  producto: {
    crear: Joi.object({
      nombre: Joi.string().required(),
      precio: Joi.number().min(0).required(),
      descripcion: Joi.string().required()
    })
  }
};
