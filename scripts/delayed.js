// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';
// eslint-disable-next-line import/no-cycle
import { loadConsentManager } from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

await loadConsentManager();
