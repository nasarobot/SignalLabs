# Modulation Visualizer

An interactive web application for visualizing and
understanding different modulation techniques in communication systems.
This project demonstrates both analog and digital modulation schemes
with interactive time-domain and frequency-domain visualizations.

## Features

* **Analog Modulation Techniques** :
* Amplitude Modulation (AM)
* Frequency Modulation (FM)
* Phase Modulation (PM)
* And so on...
* **Interactive Visualizations** :
* Time-domain signal representation
* Frequency-domain (FFT) analysis
* Modulation and demodulation process visualization
* Theoretical explanations with mathematical formulas

## Technologies Used

* **React** : Frontend framework for building the user interface
* **Vite** : Next-generation frontend tooling for faster development
* **Plotly.js** : For interactive and responsive data visualization
* **KaTeX** : For rendering mathematical equations
* **Tailwind CSS** : For styling the application
* **FFT.js** : For computing Fast Fourier Transforms

## stdlib.js Functions

This project extensively uses the stdlib.js library for mathematical operations and signal processing:

* `@stdlib/array/linspace`: Creates evenly spaced arrays for time domain representation
* `@stdlib/array/float64`: Creates typed arrays for efficient signal processing
* `@stdlib/math/base/special/sin`: Computes sine values for generating message and carrier signals
* `@stdlib/math/base/special/cos`: Computes cosine values for carrier signals
* `@stdlib/math/base/special/abs`: Calculates absolute values for signal rectification in demodulation
* `@stdlib/math/base/special/exp`: Computes exponential functions for filter coefficient calculations
* `@stdlib/math/base/special/sqrt`: Calculates square roots for Butterworth filter design
* `@stdlib/math/base/utils/absolute-difference`: Computes absolute differences between consecutive samples
* `@stdlib/constants/float64/two-pi`: Provides the 2π constant for frequency calculations
* `@stdlib/stat/incr/mmean`: Implements moving mean for envelope detection and DC removal
* `@stdlib/utils/map`: Maps functions over arrays for signal generation

## Implementation Details

## AM Modulation

The AM modulation implementation uses a sinusoidal
message signal modulated onto a carrier with configurable modulation
index. The demodulation process uses half-wave rectification followed by
 envelope detection with a moving mean and a 2nd-order Butterworth
filter.

## FM Modulation

The FM modulation varies the frequency of the carrier
signal proportionally to the message signal. The implementation includes
 integration of the message signal to calculate phase deviation.
Demodulation uses differentiation, bandpass filtering, and moving mean
for envelope detection.

## Signal Processing

* Modulation parameters (carrier frequency, message frequency, modulation index) are configurable
* Sampling rate and duration are optimized for clear visualization
* FFT analysis shows the frequency spectrum with appropriate scaling
