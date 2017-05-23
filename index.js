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

    p(this).nextQueue = {};

    p(this).createPromise = config.createPromise || ((cb) => (new Promise(cb)));
  }


  /**
   *
   */
  trigger(eventName, error, payload, config) {
    config = config || {};

    const nextQueue = p(this).nextQueue[eventName] || [];
    const handler = nextQueue.shift();
    if (handler) invoke(handler);
    if (!nextQueue.length) delete p(this).nextQueue[eventName];

    const handlers = p(this).handlers[eventName] || [];
    handlers.forEach((meta, handler) => {
      if (++meta.invocationCount === config.removeAfter) this.off(eventName, handler);
      invoke(handler, meta);
    });

    function invoke(handler, meta) {
      return handler(error, payload, Object.assign({eventName}, meta || {}));
    }
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
    return p(this).createPromise((resolve, reject) => {
      this.on(eventName, (error, payload, meta) => {
        if (error) return reject(error);
        resolve(payload);
      }, Object.assign(config || {}, {removeAfter: 1}));
    });
  }


  /**
   *
   */
  next(eventName, config) {
    return p(this).createPromise((resolve, reject) => {
      const nextQueue = p(this).nextQueue[eventName] = p(this).nextQueue[eventName] || [];
      nextQueue.push((error, payload, meta) => {
        if (error) return reject(error);
        resolve(payload);
      });
    });
  }
}


module.exports = Emittie;
