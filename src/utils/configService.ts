export interface AppSettings {
  ui: {
    showOnScreenKeyboard: boolean;
    enableAnimations: boolean;
    showDebugInfo: boolean;
  };
  game: {
    enableApiValidation: boolean;
    cacheValidationResults: boolean;
    defaultWordLength: number;
    maxGuesses: {
      5: number;
      6: number;
      7: number;
    };
  };
  api: {
    dataMuse: {
      enabled: boolean;
      baseUrl: string;
    };
    dictionary: {
      enabled: boolean;
      baseUrl: string;
    };
  };
}

// Default settings - can be overridden by appsettings.json
const defaultSettings: AppSettings = {
  ui: {
    showOnScreenKeyboard: true,
    enableAnimations: true,
    showDebugInfo: false
  },
  game: {
    enableApiValidation: true,
    cacheValidationResults: true,
    defaultWordLength: 5,
    maxGuesses: {
      5: 6,
      6: 6,
      7: 7
    }
  },
  api: {
    dataMuse: {
      enabled: true,
      baseUrl: "https://api.datamuse.com"
    },
    dictionary: {
      enabled: true,
      baseUrl: "https://api.dictionaryapi.dev/api/v2/entries/en"
    }
  }
};

export class ConfigService {
  private static settings: AppSettings = defaultSettings;

  static async loadSettings(): Promise<void> {
    try {
      const response = await fetch('/appsettings.json');
      if (response.ok) {
        const loadedSettings = await response.json();
        this.settings = { ...defaultSettings, ...loadedSettings };
        console.log('Settings loaded from appsettings.json');
      } else {
        console.warn('Could not load appsettings.json, using defaults');
      }
    } catch (error) {
      console.warn('Error loading appsettings.json, using defaults:', error);
    }
  }

  static getSettings(): AppSettings {
    return this.settings;
  }

  static getUiSettings() {
    return this.settings.ui;
  }

  static getGameSettings() {
    return this.settings.game;
  }

  static getApiSettings() {
    return this.settings.api;
  }

  static isOnScreenKeyboardEnabled(): boolean {
    return this.settings.ui.showOnScreenKeyboard;
  }

  static isApiValidationEnabled(): boolean {
    return this.settings.game.enableApiValidation;
  }

  static isDebugMode(): boolean {
    return this.settings.ui.showDebugInfo;
  }

  static getDefaultWordLength(): number {
    return this.settings.game.defaultWordLength;
  }

  // Allow runtime configuration changes for testing
  static updateSetting(path: string, value: any) {
    const keys = path.split('.');
    let current: any = this.settings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (current[keys[i]]) {
        current = current[keys[i]];
      } else {
        console.warn(`Configuration path ${path} not found`);
        return;
      }
    }
    
    const lastKey = keys[keys.length - 1];
    if (current.hasOwnProperty(lastKey)) {
      current[lastKey] = value;
      console.log(`Configuration updated: ${path} = ${value}`);
    } else {
      console.warn(`Configuration key ${lastKey} not found in path ${path}`);
    }
  }
}

export default ConfigService;
