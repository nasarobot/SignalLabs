// src/lib/amdemodulation.js
import Float64Array from '@stdlib/array/float64';
import { halfWaveRectifier, envelopeDetector, dcRemover } from './signalProcessing';
import { LPFilter } from './digitalRCFilters';

export function computeAMDemodulation(modulated, fs = 500000, fc = 10000, fm = 500, cutoffMultiplier = 1.5, order = 3) {
  // Step 1: Half-wave rectification
  const rectified = halfWaveRectifier(modulated);

  // Step 2: Envelope detection
  const windowSize = Math.floor(fs / (2 * fc));
  const envelope = envelopeDetector(rectified, windowSize, true); // Prime with zeros

  // Step 3: Apply digital low-pass filter for smoothing
  const filtered = LPFilter(envelope, fs, cutoffMultiplier * fm, order); // 3rd order

  // Step 4: Remove DC component
  const dcWindowSize = Math.floor(fs / fm); // Large window for DC estimation
  const demodulated = dcRemover(filtered, dcWindowSize);

  return demodulated;
}
