// src/lib/fmmodulation.js
import linspace from '@stdlib/array/linspace';
import sin from '@stdlib/math/base/special/sin';
import cos from '@stdlib/math/base/special/cos';
import TWO_PI from '@stdlib/constants/float64/two-pi';
import map from '@stdlib/utils/map';


// --- Helpers ---

function mul(a, b) {
  const out = new Float64Array(a.length);
  for (let i = 0; i < a.length; i++) {
    out[i] = a[i] * (Array.isArray(b) ? b[i] : b);
  }
  return out;
}

function add(a, b) {
  const out = new Float64Array(a.length);
  for (let i = 0; i < a.length; i++) {
    out[i] = a[i] + b[i];
  }
  return out;
}

function cumulativeSum(arr) {
  const out = new Float64Array(arr.length);
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    out[i] = sum;
  }
  return out;
}

export function computeFMModulation(
  fs = 500000,
  duration = 0.02,
  fc = 10000,
  fm = 500,
  beta = 5
) {
  const N = Math.floor(fs * duration);
  const t = linspace(0, duration, N);
  const kf = TWO_PI * beta * fm;

  // // 1. Generate square wave: sign(sin(2π * fm * t))
  // const messageSignal = new Float64Array(N);
  // for (let i = 0; i < N; i++) {
  //   messageSignal[i] = sin(TWO_PI * fm * t[i]) >= 0 ? 1 : -1;
  // }

  // 1. messageSignal = sin(2π * fm * t)
  const messageSignal = map(t, (ti) => sin(TWO_PI * fm * ti));

  // 2. Integrate message signal
  const integral = mul(cumulativeSum(messageSignal), 1 / fs);

  // 3. Carrier component
  const carrierComponent = mul(t, TWO_PI * fc);

  // 4. Phase deviation
  const phaseDeviation = mul(integral, kf);

  // 5. Total phase
  const phase = add(carrierComponent, phaseDeviation);

  // 6. Modulated FM signal
  const modulatedSignal = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    modulatedSignal[i] = cos(phase[i]);
  }

  return {
    t,
    message: messageSignal,
    modulated: modulatedSignal,
  };
}
