// src/lib/digitalFilters.js
import Float64Array from '@stdlib/array/float64';
import exp from '@stdlib/math/base/special/exp';
import TWO_PI from '@stdlib/constants/float64/two-pi';

/**
 * Digital Low-Pass Filter with configurable order
 * @param {Float64Array|Array} signal - Input signal
 * @param {number} fs - Sampling frequency
 * @param {number} cutoffHz - Cutoff frequency in Hz
 * @param {number} order - Filter order (default: 1)
 * @returns {Float64Array} Filtered signal
 */
export function LPFilter(signal, fs, cutoffHz, order = 1) {
  const alpha = 1 - exp(-TWO_PI * cutoffHz / fs);
  let output = new Float64Array(signal.length);
  output[0] = 0;

  for (let i = 1; i < signal.length; i++) {
    output[i] = alpha * signal[i] + (1 - alpha) * output[i - 1];
  }

  // Cascade the filter (order-1) times for higher order
  for (let stage = 1; stage < order; stage++) {
    const temp = new Float64Array(output.length);
    temp[0] = output[0];
    for (let i = 1; i < output.length; i++) {
      temp[i] = alpha * output[i] + (1 - alpha) * temp[i - 1];
    }
    output = temp;
  }

  return output;
}

/**
 * Digital High-Pass Filter with configurable order
 * @param {Float64Array|Array} signal - Input signal
 * @param {number} fs - Sampling frequency
 * @param {number} cutoffHz - Cutoff frequency in Hz
 * @param {number} order - Filter order (default: 1)
 * @returns {Float64Array} Filtered signal
 */
export function HPFilter(signal, fs, cutoffHz, order = 1) {
  const alpha = exp(-TWO_PI * cutoffHz / fs);
  let output = new Float64Array(signal.length);
  output[0] = 0;

  for (let i = 1; i < signal.length; i++) {
    output[i] = alpha * (output[i - 1] + signal[i] - signal[i - 1]);
  }

  // Cascade the filter (order-1) times for higher order
  for (let stage = 1; stage < order; stage++) {
    const temp = new Float64Array(output.length);
    temp[0] = output[0];
    for (let i = 1; i < output.length; i++) {
      temp[i] = alpha * (temp[i - 1] + output[i] - output[i - 1]);
    }
    output = temp;
  }

  return output;
}

/**
 * Digital Band-Pass Filter with configurable order
 * @param {Float64Array|Array} signal - Input signal
 * @param {number} fs - Sampling frequency
 * @param {number} lowHz - Lower cutoff frequency in Hz
 * @param {number} highHz - Upper cutoff frequency in Hz
 * @param {number} order - Filter order (default: 1)
 * @returns {Float64Array} Filtered signal
 */
export function BPFilter(signal, fs, lowHz, highHz, order = 1) {
  // Apply HPF followed by LPF, both with the specified order
  const hpFiltered = HPFilter(signal, fs, lowHz, order);
  return LPFilter(hpFiltered, fs, highHz, order);
}

/**
 * Digital Band-Stop (Notch) Filter with configurable order
 * @param {Float64Array|Array} signal - Input signal
 * @param {number} fs - Sampling frequency
 * @param {number} lowHz - Lower cutoff frequency in Hz
 * @param {number} highHz - Upper cutoff frequency in Hz
 * @param {number} order - Filter order (default: 1)
 * @returns {Float64Array} Filtered signal
 */
export function BSFilter(signal, fs, lowHz, highHz, order = 1) {
  const bpFiltered = BPFilter(signal, fs, lowHz, highHz, order);
  const output = new Float64Array(signal.length);

  for (let i = 0; i < signal.length; i++) {
    output[i] = signal[i] - bpFiltered[i];
  }

  return output;
}
