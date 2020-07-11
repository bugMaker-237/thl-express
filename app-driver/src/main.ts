// this import should be first in order to load some required settings (like globals and reflect-metadata)
// import './local-storage.js';
// require('nativescript-localstorage');
import { platformNativeScriptDynamic } from 'nativescript-angular/platform';

import { AppModule } from './app/app.module';
import {
  on as applicationOn,
  launchEvent,
  suspendEvent,
  resumeEvent,
  exitEvent,
  lowMemoryEvent,
  uncaughtErrorEvent,
  ApplicationEventData,
  android,
} from 'tns-core-modules/application';
import { enableProdMode } from '@angular/core';
import { getOneSignalInstance } from './one-signal';

applicationOn(launchEvent, (args: ApplicationEventData) => {
  if (args.android) {
    // For Android applications, args.android is an android.content.Intent class.
    console.log(
      'Launched Android application with the following intent: ' +
        args.android +
        '.'
    );
  } else if (args.ios !== undefined) {
    // For iOS applications, args.ios is NSDictionary (launchOptions).
    console.log('Launched iOS application with options: ' + args.ios);
  }
});

applicationOn(suspendEvent, (args: ApplicationEventData) => {
  if (args.android) {
    // For Android applications, args.android is an android activity class.
    console.log('suspendEvent Activity: ' + args.android);
  } else if (args.ios) {
    // For iOS applications, args.ios is UIApplication.
    console.log('suspendEvent UIApplication: ' + args.ios);
  }
});

applicationOn(resumeEvent, (args: ApplicationEventData) => {
  if (args.android) {
    // For Android applications, args.android is an android activity class.
    console.log('resumeEvent Activity: ' + args.android);
  } else if (args.ios) {
    // For iOS applications, args.ios is UIApplication.
    console.log('resumeEvent UIApplication: ' + args.ios);
  }
});

applicationOn(exitEvent, (args: ApplicationEventData) => {
  if (args.android) {
    // For Android applications, args.android is an android activity class.
    console.log('exitEvent Activity: ' + args.android);
    if (args.android.isFinishing()) {
      console.log('exitEvent Activity: ' + args.android + ' is exiting');
    } else {
      console.log('exitEvent Activity: ' + args.android + ' is restarting');
    }
  } else if (args.ios) {
    // For iOS applications, args.ios is UIApplication.
    console.log('exitEvent UIApplication: ' + args.ios);
  }
});

applicationOn(lowMemoryEvent, (args: ApplicationEventData) => {
  if (args.android) {
    // For Android applications, args.android is an android activity class.
    console.log('exitEvent Activity: ' + args.android);
  } else if (args.ios) {
    // For iOS applications, args.ios is UIApplication.
    console.log('exitEvent UIApplication: ' + args.ios);
  }
});

applicationOn(uncaughtErrorEvent, (args: ApplicationEventData) => {
  if (args.android) {
    // For Android applications, args.android is an NativeScriptError.
    console.log('exitEvent NativeScriptError: ' + args.android);
  } else if (args.ios) {
    // For iOS applications, args.ios is NativeScriptError.
    console.log('exitEvent NativeScriptError: ' + args.ios);
  }
});
// A traditional NativeScript application starts by initializing global objects,
// setting up global CSS rules, creating, and navigating to the main page.
// Angular applications need to take care of their own initialization:
// modules, components, directives, routes, DI providers.
// A NativeScript Angular app needs to make both paradigms work together,
// so we provide a wrapper platform object, platformNativeScriptDynamic,
// that sets up a NativeScript application and can bootstrap the Angular framework.
platformNativeScriptDynamic().bootstrapModule(AppModule);
enableProdMode();
