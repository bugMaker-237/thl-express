export function throwIfNullOrUndefined(obj: any, message: string) {
  if (obj == null) {
    throw new Error(message);
  }
}
export function throwIfEmptyOrWhiteSpace(obj: string, message: string) {
  if (obj.trim() === '') {
    throw new Error(message);
  }
}
let onlineTrials = 0;
export async function isOnline(host?: string): Promise<boolean> {
  try {
    await fetch(host || 'http://www.google.com');
    return true;
  } catch (e) {
    onlineTrials++;
    if (onlineTrials <= 10) {
      return await isOnline(host);
    } else {
      return false;
    }
  }
}
export function isEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
export function stringWithVersion(version: string, value: string): string {
  return `${value}@${version}`;
}
