import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  provideZonelessChangeDetection,
} from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withHashLocation } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor';
import { APP_CONFIG, AppConfig } from './models/app-config.interface';

const appConfigData: AppConfig = { apiUrl: '' };

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),

    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark',
        },
      },
    }),
    provideHttpClient(withInterceptors([authInterceptor])),
    MessageService,
    { provide: APP_CONFIG, useFactory: () => appConfigData },
    provideAppInitializer(() => {
      const http = inject(HttpClient);
      return firstValueFrom(http.get<AppConfig>('assets/config.json')).then(config => {
        Object.assign(appConfigData, config);
      });
    }),
  ],
};
