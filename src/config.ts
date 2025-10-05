// File: src/config.ts

interface AppConfig {
  Environment: string;
  AppName: string;
  API_BASE_URL: string;
  ClientRequestWaitTimeMinutes: number;
  HttpSettings: {
    MaxRetryCountForApi: string;
    WaitTimeInSecsForApiRetry: string;
  };
}

let appConfig: AppConfig;

export async function loadConfig(): Promise<void> {
  try {
    const response = await fetch('/config.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch config.json: ${response.statusText}`);
    }
    appConfig = await response.json();
    console.log('✅ Runtime configuration loaded successfully:', appConfig);
  } catch (error) {
    console.error('CRITICAL: Could not load runtime configuration.', error);
    // Use fallback config on error
    appConfig = {
      Environment: 'Error - Fallback',
      AppName: 'Demand Planning Web',
      API_BASE_URL:
        'https://aarcwivdsq14182.ashleyfurniture.com/Integrations/api',
      ClientRequestWaitTimeMinutes: 1,
      HttpSettings: {
        MaxRetryCountForApi: '2',
        WaitTimeInSecsForApiRetry: '5',
      },
    };
  }
}

export function getConfig(): AppConfig {
  if (!appConfig) {
    throw new Error(
      'Configuration not loaded. Ensure loadConfig() is called and awaited before rendering the app.',
    );
  }
  return appConfig;
}
