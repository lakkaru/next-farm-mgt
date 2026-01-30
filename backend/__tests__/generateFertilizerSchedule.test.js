const { generateFertilizerSchedule } = require('../src/controllers/seasonPlanController');

describe('generateFertilizerSchedule', () => {
  test('generates schedule for wet zone irrigated, direct seeding, 3_month', () => {
    const cultivationDate = new Date('2025-10-01');
    const areaInAcres = 1; // 1 acre -> 0.404686 ha
    const irrigationMethod = 'Under irrigation';
    const district = 'Colombo';
    const durationString = '90-95';

    const schedule = generateFertilizerSchedule(cultivationDate, areaInAcres, irrigationMethod, district, durationString, 'direct_seeding', null);
    expect(Array.isArray(schedule)).toBe(true);
    // Expect first entry to have recommendedPerHa and perFieldKg
    expect(schedule[0].fertilizers.recommendedPerHa).toBeDefined();
    expect(schedule[0].fertilizers.perFieldKg).toBeDefined();
    // For 1 acre, per-field urea value should be > 0 for some entries
    const totalUrea = schedule.reduce((s, app) => s + (app.fertilizers.perFieldKg.urea || 0), 0);
    expect(totalUrea).toBeGreaterThanOrEqual(0);
  });

  test('skips TSP when soilP > 10', () => {
    const cultivationDate = new Date('2025-10-01');
    const areaInAcres = 0.5; // smaller area
    const irrigationMethod = 'Rain fed';
    const district = 'Kurunegala';
    const durationString = '90-95';

    const schedule = generateFertilizerSchedule(cultivationDate, areaInAcres, irrigationMethod, district, durationString, 'direct_seeding', 12);
    // verify tsp perFieldKg is zero for all entries
    const anyTsp = schedule.some(app => (app.fertilizers.perFieldKg.tsp || 0) > 0);
    expect(anyTsp).toBe(false);
  });

  test('parachute seeding uses cultivationDate as anchor (same as direct seeding)', () => {
    const cultivationDate = new Date('2025-10-01');
    const areaInAcres = 1;
    const irrigationMethod = 'Under irrigation';
    const district = 'Colombo';
    const durationString = '90-95';

    const direct = generateFertilizerSchedule(cultivationDate, areaInAcres, irrigationMethod, district, durationString, 'direct_seeding', null);
    const parachute = generateFertilizerSchedule(cultivationDate, areaInAcres, irrigationMethod, district, durationString, 'parachute_seeding', null);

    expect(direct.length).toBeGreaterThan(0);
    expect(parachute.length).toBeGreaterThan(0);

    // First scheduled application date should be identical (anchored to cultivationDate)
    expect(new Date(direct[0].date).getTime()).toBe(new Date(parachute[0].date).getTime());
  });

  test('transplanting uses transplantingDate as anchor when provided', () => {
    const cultivationDate = new Date('2025-10-01');
    const transplantingDate = new Date('2025-10-20'); // later than cultivation
    const areaInAcres = 1;
    const irrigationMethod = 'Under irrigation';
    const district = 'Colombo';
    const durationString = '90-95';

    const direct = generateFertilizerSchedule(cultivationDate, areaInAcres, irrigationMethod, district, durationString, 'direct_seeding', null);
    const transplanting = generateFertilizerSchedule(cultivationDate, areaInAcres, irrigationMethod, district, durationString, 'transplanting', null, transplantingDate);

    expect(direct.length).toBeGreaterThan(0);
    expect(transplanting.length).toBeGreaterThan(0);

    // When transplantingDate is provided, the first transplanting application should not equal the direct seeding anchor
    expect(new Date(direct[0].date).getTime()).not.toBe(new Date(transplanting[0].date).getTime());
    // And it should be at or after the transplanting date
    expect(new Date(transplanting[0].date).getTime()).toBeGreaterThanOrEqual(new Date(transplantingDate).getTime());
  });
});