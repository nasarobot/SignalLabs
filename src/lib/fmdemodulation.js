// src/lib/fmdemodulation.js
import Float64Array from '@stdlib/array/float64';
import mmean from '@stdlib/stats/incr/mmean';
import absdiff from '@stdlib/math/base/utils/absolute-difference';
import cos from '@stdlib/math/base/special/cos';
import TWO_PI from '@stdlib/constants/float64/two-pi';

export function computeFMDemodulation(modulatedSignal, fs = 500000, fc = 10000, fm = 500, beta = 5) {
  // Parameters for bandpass filter
  const bandwidth = 2 * (beta + 1) * fm; // Carson's rule for FM bandwidth
  const lowCutoff = fc - bandwidth / 2;
  const highCutoff = fc + bandwidth / 2;

  // Apply bandpass filter
  const filteredSignal = bandpassFilter(modulatedSignal, fs, lowCutoff, highCutoff);

  // Calculate window size based on sampling rate and message frequency
  const windowSize = Math.floor(fs / (2 * fm));

  // Create a new array for the demodulated signal
  const demodulated = new Float64Array(filteredSignal.length - 1);

  // Initialize the moving mean accumulator with the specified window size
  const avg = mmean(windowSize);

  // Prime the mmean with zeros to fill the window before processing actual data
  for (let i = 0; i < windowSize; i++) {
    avg(0);
  }

  // Calculate absolute differences between consecutive samples and apply moving mean
  for (let i = 0; i < filteredSignal.length - 1; i++) {
    // Use absolute-difference to get the magnitude of change between consecutive samples
    const value = absdiff(filteredSignal[i + 1], filteredSignal[i]);
    const smoothed = avg(value);
    demodulated[i] = smoothed;
  }

  // DC removal using a larger window moving mean
  // Use a window size that's several times larger than the original window
  const dcWindowSize = windowSize * 3;
  const dcRemoved = removeDCComponent(demodulated, dcWindowSize);

  // Apply low-pass filter to smooth the demodulated signal
  const lpfDemodulated = lowPassFilter(dcRemoved, fs, fm);

  return lpfDemodulated;
}

// Function to remove DC component using a large window moving mean
function removeDCComponent(signal, windowSize) {
  const output = new Float64Array(signal.length);
  const dcEstimator = mmean(windowSize);

  // Prime the DC estimator with the first value repeated
  for (let i = 0; i < windowSize; i++) {
    dcEstimator(signal[0]);
  }

  // Calculate the DC-removed signal
  for (let i = 0; i < signal.length; i++) {
    const dcLevel = dcEstimator(signal[i]);
    output[i] = signal[i] - dcLevel;
  }

  return output;
}

// Simple IIR bandpass filter implementation
function bandpassFilter(signal, fs, lowCutoff, highCutoff) {
  const output = new Float64Array(signal.length);

  // Normalize cutoff frequencies
  const lowNorm = 2 * lowCutoff / fs;
  const highNorm = 2 * highCutoff / fs;

  // Filter coefficients (simple 2nd order IIR)
  const a1 = -1.5 * cos(TWO_PI * (lowNorm + highNorm) / 2);
  const a2 = 0.5;
  const b0 = (highNorm - lowNorm) / 2;
  const b1 = 0;
  const b2 = -b0;

  // Apply filter
  output[0] = b0 * signal[0];
  output[1] = b0 * signal[1] + b1 * signal[0] - a1 * output[0];

  for (let i = 2; i < signal.length; i++) {
    output[i] = b0 * signal[i] + b1 * signal[i - 1] + b2 * signal[i - 2]
      - a1 * output[i - 1] - a2 * output[i - 2];
  }

  return output;
}

// Simple low-pass filter for smoothing
function lowPassFilter(signal, fs, fm) {
  const output = new Float64Array(signal.length);
  output[0] = signal[0];

  // a low-pass filter with a cutoff frequency of 2 * fm
  const cutoffFreq = 2 * fm;
  const alpha = TWO_PI * cutoffFreq / fs;
  for (let i = 1; i < signal.length; i++) {
    output[i] = alpha * signal[i] + (1 - alpha) * output[i - 1];
  }

  return output;
}
