import FFT from "fft.js";

export function computeFFT (signal, fs, N) {
  // FFT works best with power of 2 sized arrays
  const fftSize = N; // Choose appropriate power of 2
  const fft = new FFT(fftSize);

  // Prepare input array (zero-padded if needed)
  const input = new Array(fftSize).fill(0);
  for (let i = 0; i < Math.min(signal.length, fftSize); i++) {
    input[i] = signal[i];
  }

  // Create complex array and perform FFT
  const complexInput = fft.toComplexArray(input);
  const output = fft.createComplexArray();
  fft.transform(output, complexInput);

  // Calculate magnitude spectrum
  const magnitudes = new Array(fftSize / 2);
  for (let i = 0; i < fftSize / 2; i++) {
    // Real and imaginary parts
    const real = output[2 * i];
    const imag = output[2 * i + 1];
    // Magnitude calculation
    magnitudes[i] = Math.sqrt(real * real + imag * imag);
  }

  // Create frequency array
  const frequencies = new Array(fftSize / 2);
  for (let i = 0; i < fftSize / 2; i++) {
    frequencies[i] = (i * fs) / fftSize; // fs is sampling frequency
  }

  return { frequencies, magnitudes };
};