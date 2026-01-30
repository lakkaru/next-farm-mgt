const { computeSeedTotals } = require('../utils/seedUtils');

describe('backend seed utils', () => {
  test('computeSeedTotals direct seeding long variety', () => {
    const res = computeSeedTotals({ area: 1, unit: 'hectares', plantingMethod: 'direct_seeding', variety: { type: 'Long Duration' } });
    expect(res.computed).toBe(true);
    expect(res.perHaLabel).toBe('100 kg/ha');
    expect(res.minTotalKg).toBeCloseTo(100);
  });

  test('computeSeedTotals parachute seeding short variety yields trayCount', () => {
    const res = computeSeedTotals({ area: 1, unit: 'acres', plantingMethod: 'parachute_seeding', variety: { type: 'Short Duration' } });
    expect(res.computed).toBe(true);
    // 1 acre ~= 0.404685642 ha -> trayCount ~ 405
    expect(res.trayCount).toBe(Math.round(0.404685642 * 1000));
    expect(res.traysPerHa).toBe(1000);
  });
});