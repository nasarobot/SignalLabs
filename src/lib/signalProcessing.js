// src/lib/signalProcessing.js
import Float64Array from '@stdlib/array/float64';
import abs from '@stdlib/math/base/special/abs';
import mmean from '@stdlib/stats/incr/mmean';

/**
 * Half-wave rectifier - clips negative portions of the signal
 * @param {Float64Array|Array} signal - Input signal
 * @returns {Float64Array} Rectified signal (negative values set to 0)
 */
export function halfWaveRectifier(signal) {
  const output = new Float64Array(signal.length);
  for (let i = 0; i < signal.length; i++) {
    output[i] = signal[i] > 0 ? signal[i] : 0;
  }
  return output;
}

/**
 * Full-wave rectifier - takes absolute value of the signal
 * @param {Float64Array|Array} signal - Input signal
 * @returns {Float64Array} Rectified signal (all values positive)
 */
export function fullWaveRectifier(signal) {
  const output = new Float64Array(signal.length);
  for (let i = 0; i < signal.length; i++) {
    output[i] = abs(signal[i]);
  }
  return output;
}

/**
 * Envelope detector using moving mean
 * @param {Float64Array|Array} signal - Input signal (typically rectified)
 * @param {number} windowSize - Window size for moving mean
 * @param {boolean} primeWithZeros - Whether to prime with zeros or first value
 * @returns {Float64Array} Envelope of the signal
 */
export function envelopeDetector(signal, windowSize, primeWithZeros = true) {
  const output = new Float64Array(signal.length);
  const detector = mmean(windowSize);

  // Prime the detector
  const primeValue = primeWithZeros ? 0 : signal[0];
  for (let i = 0; i < windowSize; i++) {
    detector(primeValue);
  }

  // Apply envelope detection
  for (let i = 0; i < signal.length; i++) {
    output[i] = detector(signal[i]);
  }

  return output;
}

/**
 * DC component remover using moving mean estimation
 * @param {Float64Array|Array} signal - Input signal
 * @param {number} windowSize - Window size for DC estimation (should be large)
 * @returns {Float64Array} Signal with DC component removed
 */
export function dcRemover(signal, windowSize) {
  const output = new Float64Array(signal.length);
  const dcEstimator = mmean(windowSize);

  // Prime the DC estimator with first value
  for (let i = 0; i < windowSize; i++) {
    dcEstimator(signal[0]);
  }

  // Remove DC component
  for (let i = 0; i < signal.length; i++) {
    const dcLevel = dcEstimator(signal[i]);
    output[i] = signal[i] - dcLevel;
  }

  return output;
}

/**
 * Simple DC offset remover - subtracts a constant value
 * @param {Float64Array|Array} signal - Input signal
 * @param {number} dcOffset - DC offset to remove (default: 1.0 for AM)
 * @returns {Float64Array} Signal with DC offset removed
 */
export function dcOffsetRemover(signal, dcOffset = 1.0) {
  const output = new Float64Array(signal.length);
  for (let i = 0; i < signal.length; i++) {
    output[i] = signal[i] - dcOffset;
  }
  return output;
}

/**
 * Signal differentiator - calculates differences between consecutive samples
 * @param {Float64Array|Array} signal - Input signal
 * @returns {Float64Array} Differentiated signal (length N-1)
 */
export function differentiator(signal) {
  const output = new Float64Array(signal.length - 1);
  for (let i = 0; i < signal.length - 1; i++) {
    output[i] = signal[i + 1] - signal[i];
  }
  return output;
}

/**
 * Absolute differentiator - calculates absolute differences between consecutive samples
 * @param {Float64Array|Array} signal - Input signal
 * @returns {Float64Array} Absolute differentiated signal (length N-1)
 */
export function absoluteDifferentiator(signal) {
  const output = new Float64Array(signal.length - 1);
  for (let i = 0; i < signal.length - 1; i++) {
    output[i] = abs(signal[i + 1] - signal[i]);
  }
  return output;
}

/**
 * Signal integrator using cumulative sum
 * @param {Float64Array|Array} signal - Input signal
 * @param {number} fs - Sampling frequency (for proper scaling)
 * @returns {Float64Array} Integrated signal
 */
export function integrator(signal, fs) {
  const output = new Float64Array(signal.length);
  let sum = 0;
  for (let i = 0; i < signal.length; i++) {
    sum += signal[i];
    output[i] = sum / fs; // Scale by sampling frequency
  }
  return output;
}
