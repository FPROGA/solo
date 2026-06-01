import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const isDev = process.env.NODE_ENV !== 'production';

  app.enableCors({
    origin: isDev
      ? (
          origin: string | undefined,
          callback: (err: Error | null, allow?: boolean) => void,
        ) => {
          if (!origin) {
            callback(null, true);
            return;
          }
          try {
            const { hostname } = new URL(origin);
            const allowed =
              hostname === 'localhost' ||
              hostname === '127.0.0.1' ||
              /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
              /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);
            callback(null, allowed);
          } catch {
            callback(null, false);
          }
        }
      : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  app.use(cookieParser('mySecretKey123'));
  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`API: http://0.0.0.0:${port}`);
}
bootstrap();
