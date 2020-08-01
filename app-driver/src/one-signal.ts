/// <reference path="./OneSignal.android.d.ts"/>

export interface OneSignalReceivedNotification {
  title: string;
  body: string;
  data: any;
}

export interface OneSignalOpenedNotification {
  opened: boolean;
  data: any;
}

class OneSignalClass {
  public received: (notification: OneSignalReceivedNotification) => void;
  public opened: (notification: OneSignalOpenedNotification) => void;
  public idsHandler: (p1: string, p2: string) => void;

  private static parseJson(json: org.json.JSONObject) {
    return json ? JSON.parse(json.toString()) : json;
  }
  sendTag(key: string, value: string) {
    com.onesignal.OneSignal.sendTag(key, value);
  }
  init(nativeApp: android.app.Application) {
    com.onesignal.OneSignal.startInit(nativeApp)
      .autoPromptLocation(false)
      .inFocusDisplaying(com.onesignal.OneSignal.OSInFocusDisplayOption.None)

      .setNotificationReceivedHandler(
        new com.onesignal.OneSignal.NotificationReceivedHandler({
          notificationReceived: (
            notification: com.onesignal.OSNotification
          ) => {
            this.onReceived({
              title: notification.payload.title,
              body: notification.payload.body,
              data: OneSignalClass.parseJson(
                notification.payload.additionalData
              ),
            });
          },
        })
      )

      .setNotificationOpenedHandler(
        new com.onesignal.OneSignal.NotificationOpenedHandler({
          notificationOpened: (
            result: com.onesignal.OSNotificationOpenResult
          ) => {
            this.onOpened({
              opened:
                result.action.type ===
                com.onesignal.OSNotificationAction.ActionType.Opened,
              data: OneSignalClass.parseJson(
                result.notification.payload.additionalData
              ),
            });
          },
        })
      )

      .init();
    // console.log('init done');
    com.onesignal.OneSignal.idsAvailable(
      new com.onesignal.OneSignal.IdsAvailableHandler({
        idsAvailable: this.onIdsCalled,
      })
    );
    com.onesignal.OneSignal.setSubscription(true);
  }
  private onReceived(arg: OneSignalReceivedNotification) {
    if (this.received != null) {
      this.received(arg);
    }
  }
  private onOpened(arg: OneSignalOpenedNotification) {
    if (this.opened != null) {
      this.opened(arg);
    }
  }
  private onIdsCalled(arg1: string, arg2: string) {
    if (this.idsHandler != null) {
      this.idsHandler(arg1, arg2);
    }
  }
}

const onesignal = new OneSignalClass();
export function getOneSignalInstance({
  received = null,
  opened = null,
  idsHandler = null,
}: {
  received?: (notification: OneSignalReceivedNotification) => void;
  opened?: (notification: OneSignalOpenedNotification) => void;
  idsHandler?: (p1: string, p2: string) => void;
} = {}): OneSignalClass {
  onesignal.received = received || onesignal.received;
  onesignal.opened = opened || onesignal.opened;
  onesignal.idsHandler = idsHandler || onesignal.idsHandler;
  return onesignal;
}
