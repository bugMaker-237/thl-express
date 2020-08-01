import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NgModule, Inject, SkipSelf } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// Uncomment and add to NgModule imports if you need to use two-way binding
import { NativeScriptFormsModule } from 'nativescript-angular/forms';

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';
import { CoreComponentsModule } from '@root/components/mobile/core-components.module';
import { CommonProviders, CacheStorageProvider } from '../providers.common';
// import { BaseCommonModule } from '../common-base.module';
import { CoreDirectivesModule } from '@root/directives/mobile/core-directives.module';
import { Providers } from './providers';
import { cleanCache } from '../common-base.module';
import { APP_CONFIG, IAppConfig } from '@root/config';
import { GenericSubjects } from '@root/services';
import { ICacheStorageService } from '@root/services/storage/interfaces';

@NgModule({
  providers: [...CommonProviders, ...Providers],
  imports: [
    NativeScriptCommonModule,
    // NativeScriptModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    NativeScriptHttpClientModule,
    CoreComponentsModule,
    CoreDirectivesModule
  ],
  exports: [
    NativeScriptCommonModule,
    // NativeScriptModule,
    NativeScriptFormsModule,
    ReactiveFormsModule,
    NativeScriptHttpClientModule,
    CoreComponentsModule,
    CoreDirectivesModule
  ],
  schemas: []
})
export class CommonModule {
  constructor(
    @Inject(APP_CONFIG) config: IAppConfig,
    @Inject(CacheStorageProvider) cacheService: ICacheStorageService,
    genericSubjects: GenericSubjects
  ) {
    genericSubjects.registerCommonSubjects();
    cleanCache(config, cacheService);
  }
}
