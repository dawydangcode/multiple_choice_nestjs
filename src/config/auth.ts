import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    signOptions: {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    },
  },
}));
