import { getConfig } from '../config';

// This interface defines the structure of the log event we send to the backend.
// It should match the FrontendLogEvent C# class.
interface LogPayload {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  category: string;
  data?: Record<string, unknown>;
}

class Logger {
  // Get the API URL using the same pattern as your other services
  private getApiUrl(): string {
    const config = getConfig();
    return `${config.API_BASE_URL}/logs`;
  }

  // This method sends the log to our .NET API.
  public async log(payload: LogPayload): Promise<void> {
    try {
      const fullUrl = this.getApiUrl();

      console.log('📝 Logger - Sending log to:', fullUrl);
      console.log('📝 Logger - Payload:', payload);

      const requestBody = {
        ...payload,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      console.log('📝 Logger - Full request body:', requestBody);

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📝 Logger - Response status:', response.status);
      console.log('📝 Logger - Response ok:', response.ok);

      if (!response.ok) {
        console.error(
          '📝 Logger - API returned error:',
          response.status,
          response.statusText,
        );
        // Optionally get response text for more details
        const errorText = await response.text();
        console.error('📝 Logger - Error response body:', errorText);
      } else {
        console.log('📝 Logger - Log sent successfully');
      }
    } catch (error) {
      // If the logger fails, we just log it to the console to avoid a crash loop.
      console.error('📝 Logger - Failed to send log to server:', error);
      console.error('📝 Logger - Target URL was:', this.getApiUrl());
    }
  }

  // Convenience method for logging informational messages.
  public info(
    message: string,
    category = 'General',
    data?: Record<string, unknown>,
  ): void {
    console.log(`📝 Logger.info - ${category}: ${message}`, data);
    this.log({ level: 'info', message, category, data });
  }

  // Convenience method for logging warnings.
  public warn(
    message: string,
    category = 'General',
    data?: Record<string, unknown>,
  ): void {
    console.log(`📝 Logger.warn - ${category}: ${message}`, data);
    this.log({ level: 'warn', message, category, data });
  }

  // Convenience method for logging errors.
  public error(
    message: string,
    category = 'General',
    data?: Record<string, unknown>,
  ): void {
    console.log(`📝 Logger.error - ${category}: ${message}`, data);
    this.log({ level: 'error', message, category, data });
  }
}

// Create and export a single instance of the logger for the entire application to use.
export const logger = new Logger();
