// src/lib/ammodulation.js
import linspace from '@stdlib/array/linspace';
import sin from '@stdlib/math/base/special/sin';
import TWO_PI from '@stdlib/constants/float64/two-pi';
import Float64Array from '@stdlib/array/float64';

export function computeAMModulation(fs = 500000, duration = 0.02, fc = 10000, fm = 500, Am = 0.8, Ac = 1.0, messageType = 'sine') {
  const N = Math.floor(fs * duration);
  const t = linspace(0, duration, N);

  // Calculate modulation index for reference
  const modulationIndex = Am / Ac;

  // Generate message signal based on type
  const message = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    if (messageType === 'triangle') {
      const phase = (fm * t[i]) % 1;
      message[i] = Am * (phase < 0.5 ? 4 * phase - 1 : 3 - 4 * phase);
    } else if (messageType === 'square') {
      message[i] = Am * (sin(TWO_PI * fm * t[i]) >= 0 ? 1 : -1);
    } else {
      // Default sine wave
      message[i] = Am * sin(TWO_PI * fm * t[i]);
    }
  }

  // Generate AM modulated signal using Am and Ac directly
  const modulated = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    modulated[i] = (Ac + message[i]) * sin(TWO_PI * fc * t[i]);
  }

  return {
    t,
    message,
    modulated,
    modulationIndex
  };
}
