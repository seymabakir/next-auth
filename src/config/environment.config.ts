export interface EnvironmentConfig {
  AUTH0_CLIENT_ID: string;
  AUTH0_CLIENT_SECRET: string;
  AUTH0_ISSUER: string;
  
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
  
  NODE_ENV: string;
  PORT: string;
  
  DATABASE_URL?: string;
  
  API_BASE_URL: string;
}

class EnvironmentConfigService {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): EnvironmentConfig {
    const requiredEnvVars = [
      'AUTH0_CLIENT_ID',
      'AUTH0_CLIENT_SECRET', 
      'AUTH0_ISSUER',
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET'
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }

    return {
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID!,
      AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET!,
      AUTH0_ISSUER: process.env.AUTH0_ISSUER!,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: process.env.PORT || '3000',
      DATABASE_URL: process.env.DATABASE_URL,
      API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
    };
  }

  get(): EnvironmentConfig {
    return this.config;
  }

  isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  isTest(): boolean {
    return this.config.NODE_ENV === 'test';
  }
}

export const environmentConfig = new EnvironmentConfigService(); 