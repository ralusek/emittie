'use strict';

// This establishes a private namespace.
const namespace = new WeakMap();
function p(object) {
  if (!namespace.has(object)) namespace.set(object, {});
  return namespace.get(object);
}


/**
 *
 */
class Emittie {
  constructor(config) {
    config = config || {};

    p(this).handlers = {};

    p(this).createPromise = config.createPromise || ((cb) => (new Promise(cb)));
  }


  /**
   *
   */
  trigger(eventName, payload, config) {
    config = config || {};
    const handlers = p(this).handlers[eventName];
    if (!handlers) {
      if (config.strict === true) throw new Error(`Attempted to trigger event: ${eventName}. Event does not exist.`);
      return;
    }

    handlers.forEach((meta, handler) => {
      if (++meta.invocationCount === config.removeAfter) this.off(eventName, handler);

      handler(payload, Object.assign({eventName}, meta));
    });
  }


  /**
   *
   */
  on(eventName, handler, config) {
    config = config || {};

    p(this).handlers[eventName] = p(this).handlers[eventName] || new Map();
    if (p(this).handlers[eventName].has(handler)) throw new Error(`Attempted to register the same handler for the same event: ${eventName}.`);

    return p(this).handlers[eventName].set(handler, {
      removeAfter: config.removeAfter || Infinity,
      invocationCount: 0
    });
  }


  /**
   *
   */
  off(eventName, handler) {
    if (!p(this).handlers[eventName]) return;
    if (handler) {
      p(this).handlers[eventName].delete(handler);
      if (!p(this).handlers[eventName].size) delete p(this).handlers[eventName];
    }
    else delete p(this).handlers[eventName];
  }


  /**
   *
   */
  once(eventName, config) {
    return p(this).createPromise((resolve) => {
      this.on(eventName, (payload, meta) => {
        resolve(payload);
      }, Object.assign(config || {}, {removeAfter: 1}));
    });
  }
}


module.exports = Emittie;
