import { Loader } from '@root/services';
import { PartialObserver } from 'rxjs';
import {
  LoadingIndicator,
  Mode,
  OptionsCommon,
} from '@nstudio/nativescript-loading-indicator';

export interface IloaderOptions {
  message?: string;
  details?: string;
  indicatorColor?: string;
  backgroudColor?: string;
  mode?: Mode;
}

function createIndicator(
  loaderOptions: IloaderOptions = {}
): { indicator: LoadingIndicator; options: OptionsCommon } {
  const indicator = new LoadingIndicator();

  const options: OptionsCommon = {
    message: loaderOptions.message,
    details: loaderOptions.details,
    progress: 0.65,
    margin: 10,
    dimBackground: true,
    color: loaderOptions.indicatorColor, // color of indicator and labels
    // background box around indicator
    // hideBezel will override this if true
    backgroundColor: loaderOptions.backgroudColor,
    userInteractionEnabled: true, // default true. Set false so that the touches will fall through it.
    hideBezel: false, // default false, can hide the surrounding bezel
    mode: Mode.Indeterminate, // see options below
  };

  return { indicator, options };
}

export function setDefaultLoader(loaderOptions: IloaderOptions = {}) {
  Loader.default = new Loader(
    '$$default',
    createLoaderWithObserver(loaderOptions)
  );
}

export function createLoaderWithObserver(
  loaderOptions: IloaderOptions = {}
): PartialObserver<boolean> {
  const { indicator, options } = createIndicator(loaderOptions);
  console.log('loader created');
  return {
    next(val: boolean) {
      console.log('loading: ' + val);
      val
        ? indicator.show(options)
        : setTimeout(() => {
            indicator.hide();
          }, 300);
    },
  };
}
