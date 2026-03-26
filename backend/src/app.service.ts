import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async testDatabaseConnection(email: string) {
    // Test if database connection works
    // We'll return a simple message to test if the endpoint works
    return { 
      success: true, 
      message: 'AppService is working',
      receivedEmail: email,
    };
  }
}