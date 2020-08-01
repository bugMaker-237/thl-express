declare global {
  interface Object {
    // throwIfNullOrUndefined(message: string): void;
    clone(): Object;
  }
}

Object.prototype.clone = function() {
  return Object.assign({}, this);
};


export {};
