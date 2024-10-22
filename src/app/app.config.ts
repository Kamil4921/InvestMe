import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideStore } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { provideEffects } from '@ngrx/effects';
import { CryptoEffects } from './effects/crypto.effects';
import { PreciousMetalEffects } from './effects/precious-metal.effects';
import { DashboardEffects } from './effects/dashboard.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideCharts(withDefaultRegisterables()),
    provideStore(reducers, { metaReducers }),
    provideEffects([CryptoEffects, PreciousMetalEffects, DashboardEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: isDevMode(),
      autoPause: false,
      trace: true,
      traceLimit: 75,
      connectInZone: true,
    }),
  ],
};
