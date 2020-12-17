import { platformNativeScriptDynamic } from 'nativescript-angular/platform';

import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';

platformNativeScriptDynamic().bootstrapModule(AppModule);
enableProdMode();
