// src/lib/amdemodulation.js
import Float64Array from '@stdlib/array/float64';
import sqrt from '@stdlib/math/base/special/sqrt';
import TWO_PI from '@stdlib/constants/float64/two-pi';
import mmean from '@stdlib/stats/incr/mmean';

export function computeAMDemodulation(modulated, fs = 500000, fc = 10000, fm = 500) {
  const N = modulated.length;

  // Step 1: Half-wave rectification (clip negative portions)
  const rectified = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    rectified[i] = modulated[i] > 0 ? modulated[i] : 0;
  }

  // Step 2: Use mmean to calculate envelope
  // Calculate appropriate window size based on carrier frequency
  const windowSize = Math.floor(fs / (2 * fc));
  const envelope = new Float64Array(N);
  const envDetector = mmean(windowSize);

  // Prime the mmean with zeros
  for (let i = 0; i < windowSize; i++) {
    envDetector(0);
  }

  // Calculate envelope using mmean
  for (let i = 0; i < N; i++) {
    envelope[i] = envDetector(rectified[i]);
  }

  // Step 3: Apply 2nd order Butterworth filter to smooth the envelope
  // Calculate normalized cutoff frequency (1.3 times message frequency)
  const cutoff_freq = 1.3 * fm;
  const nyquist = fs / 2;
  const normalized_cutoff = cutoff_freq / nyquist;

  // Calculate Butterworth filter coefficients
  const omega_c = TWO_PI * normalized_cutoff;
  const sqrt2 = sqrt(2);

  // Calculate coefficients using the formula
  const denominator = 1 + sqrt2 * omega_c + omega_c * omega_c;
  const b0 = (omega_c * omega_c) / denominator;
  const b1 = (2 * omega_c * omega_c) / denominator;
  const b2 = (omega_c * omega_c) / denominator;
  const a1 = (2 * (omega_c * omega_c - 1)) / denominator;
  const a2 = (1 - sqrt2 * omega_c + omega_c * omega_c) / denominator;

  // Apply the filter
  const filtered = new Float64Array(N);
  filtered[0] = b0 * envelope[0];
  filtered[1] = b0 * envelope[1] + b1 * envelope[0] - a1 * filtered[0];

  for (let i = 2; i < N; i++) {
    filtered[i] = b0 * envelope[i] + b1 * envelope[i - 1] + b2 * envelope[i - 2]
      - a1 * filtered[i - 1] - a2 * filtered[i - 2];
  }

  // Step 4: Remove DC component
  const demodulated = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    demodulated[i] = filtered[i] - 1.0;
  }

  return demodulated;
}
