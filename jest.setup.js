// Полифиллы для Node.js
// jest.setup.js
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Дополнительные полифиллы
if (typeof globalThis.URL === 'undefined') {
  const { URL } = require('url');
  globalThis.URL = URL;
}
