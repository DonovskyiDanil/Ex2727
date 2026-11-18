// Polyfill for SlowBuffer (Node.js v25 compatibility)
if (typeof Buffer.SlowBuffer === 'undefined') {
  Buffer.SlowBuffer = function SlowBuffer(size) {
    return Buffer.allocUnsafe(size);
  };
}

// Also ensure it has the prototype methods
if (Buffer.SlowBuffer.prototype === undefined) {
  Buffer.SlowBuffer.prototype = Object.create(Buffer.prototype);
}
