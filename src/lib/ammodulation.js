// src/lib/ammodulation.js
import linspace from '@stdlib/array/linspace';
import sin from '@stdlib/math/base/special/sin';
import cos from '@stdlib/math/base/special/cos';
import TWO_PI from '@stdlib/constants/float64/two-pi';
import Float64Array from '@stdlib/array/float64';

export function computeAMModulation(fs = 500000, duration = 0.02, fc = 10000, fm = 500, modulationIndex = 0.8) {
  // Calculate number of samples
  const N = Math.floor(fs * duration);

  // Create time array
  const t = linspace(0, duration, N);

  // Generate message signal (sinusoidal)
  const message = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    message[i] = sin(TWO_PI * fm * t[i]);
  }

  // Generate carrier signal
  const carrier = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    carrier[i] = cos(TWO_PI * fc * t[i]);
  }

  // Generate AM modulated signal
  const modulated = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    modulated[i] = (1 + modulationIndex * message[i]) * carrier[i];
  }

  return { t, message, modulated };
}
