import 'hammerjs';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {
  NgModule,
  NO_ERRORS_SCHEMA,
  Inject,
  NgZone,
  Optional,
  SkipSelf
} from '@angular/core';
import { MaterialModule } from './material.module';
import { CommonProviders } from '../providers.common';
import { cleanCache } from '../common-base.module';
import { Providers } from '../mobile/providers';
import { APP_CONFIG, IAppConfig } from '@root/config';
import { CacheStorageProvider } from './providers';
import { GenericSubjects } from '@root/services';
import { ICacheStorageService } from '@root/services/storage/interfaces';

// import { CoreComponentsModule } from '../../components/mobile/core-components.module';

@NgModule({
  providers: [...CommonProviders, ...Providers],
  imports: [
    AngularCommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MaterialModule
  ],
  exports: [
    AngularCommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MaterialModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CommonModule {
  constructor(
    @SkipSelf() parentModule: CommonModule,
    @Inject(APP_CONFIG) config: IAppConfig,
    @Inject(CacheStorageProvider) cacheService: ICacheStorageService,
    genericSubjects: GenericSubjects
  ) {
    if (parentModule) {
      return;
    }
    genericSubjects.registerCommonSubjects();
    cleanCache(config, cacheService);
  }
}
