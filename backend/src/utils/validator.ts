// import { CreateUserDTO, UpdateUserDTO } from '../models/User';

// export class ValidationError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = 'ValidationError';
//   }
// }

// export const validateCreateUser = (data: CreateUserDTO): void => {
//   if (!data.name || data.name.trim().length === 0) {
//     throw new ValidationError('Name is required');
//   }
  
//   if (!data.email || !isValidEmail(data.email)) {
//     throw new ValidationError('Valid email is required');
//   }
  
//   if (!data.age || data.age < 0 || data.age > 150) {
//     throw new ValidationError('Age must be between 0 and 150');
//   }
// };

// export const validateUpdateUser = (data: UpdateUserDTO): void => {
//   if (data.email && !isValidEmail(data.email)) {
//     throw new ValidationError('Invalid email format');
//   }
  
//   if (data.age !== undefined && (data.age < 0 || data.age > 150)) {
//     throw new ValidationError('Age must be between 0 and 150');
//   }
// };

// const isValidEmail = (email: string): boolean => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };
