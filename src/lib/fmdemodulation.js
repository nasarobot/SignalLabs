// src/lib/fmdemodulation.js
import Float64Array from '@stdlib/array/float64';
import mmean from '@stdlib/stats/incr/mmean';
import { absoluteDifferentiator, envelopeDetector, dcRemover } from './signalProcessing';
import { BPFilter, LPFilter } from './digitalRCFilters';


export function computeFMDemodulation(
  modulatedSignal, fs, fc, fm, beta, bpLowCutoff, bpHighCutoff, filterCutoffMultiplier = 3, filterOrder = 2
) {
  // Step 1: Bandpass filter (cover Carson’s rule bandwidth)
  const bandwidth = 2 * (beta + 1) * fm;
  let bpLow = bpLowCutoff !== undefined ? bpLowCutoff : fc - bandwidth / 2;
  let bpHigh = bpHighCutoff !== undefined ? bpHighCutoff : fc + bandwidth / 2;
  if (bpHigh <= bpLow) [bpLow, bpHigh] = [fc - bandwidth / 2, fc + bandwidth / 2];

  const filteredSignal = BPFilter(modulatedSignal, fs, bpLow, bpHigh, filterOrder);

  // Step 2: Differentiate (absolute value is good)
  const diffSignal = absoluteDifferentiator(filteredSignal);

  // Step 3: Envelope detection (try fs/(5*fm) for smaller window, experiment if needed)
  const envelopeWindow = Math.floor(fs / (5 * fm));
  const envelope = envelopeDetector(diffSignal, envelopeWindow, true);

  // Step 4: DC removal (try not too large window)
  const dcWindow = envelopeWindow * 4;
  const dcRemoved = dcRemover(envelope, dcWindow);

  // Step 5: Final low-pass filter (cutoff usually: 1.5-3 x fm)
  const cutoffFreq = filterCutoffMultiplier * fm;
  const demodulated = LPFilter(dcRemoved, fs, cutoffFreq, filterOrder);

  return demodulated;
}

