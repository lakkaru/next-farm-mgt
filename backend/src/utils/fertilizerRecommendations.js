/**
 * Fertilizer recommendation tables based on official Sri Lanka guidelines
 * Structure: recommendations[zoneType][conditionType][plantingMethod][ageGroup] -> { total, schedule }
 * Units: kg/ha. schedule entries use week offsets relative to planting/transplanting date.
 * Note: Zinc sulfate is applied only once per year (Maha season only)
 */
const recommendations = {
  wet_zone: {
    rainfed: {
      direct_seeding: {
        '3_month': {
          total: { urea: 110, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 25, tsp: 0, mop: 25, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 45, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '3_5_month': {
          total: { urea: 110, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 3, stage: '3 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 },
            { week: 5, stage: '5 Weeks', urea: 25, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 45, tsp: 0, mop: 25, zinc: 0 },
            { week: 8, stage: '8 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '4_month': {
          total: { urea: 110, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 3, stage: '3 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 },
            { week: 5, stage: '5 Weeks', urea: 25, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 45, tsp: 0, mop: 25, zinc: 0 },
            { week: 8, stage: '8 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        }
      },
      transplanting: {
        '3_month': {
          total: { urea: 110, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 },
            { week: 3, stage: '3 Weeks', urea: 25, tsp: 0, mop: 25, zinc: 0 },
            { week: 5, stage: '5 Weeks', urea: 45, tsp: 0, mop: 25, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '3_5_month': {
          total: { urea: 110, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 25, tsp: 0, mop: 25, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 45, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '4_month': {
          total: { urea: 110, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 },
            { week: 5, stage: '5 Weeks', urea: 25, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 45, tsp: 0, mop: 25, zinc: 0 },
            { week: 8, stage: '8 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        }
      }
    },
    irrigated: {
      direct_seeding: {
        '3_month': {
          total: { urea: 100, tsp: 55, mop: 110, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 25, tsp: 0, mop: 35, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 30, tsp: 0, mop: 45, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 25, tsp: 0, mop: 30, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '3_5_month': {
          total: { urea: 100, tsp: 55, mop: 110, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 3, stage: '3 Weeks', urea: 25, tsp: 0, mop: 35, zinc: 0 },
            { week: 5, stage: '5 Weeks', urea: 30, tsp: 0, mop: 45, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 25, tsp: 0, mop: 30, zinc: 0 },
            { week: 8, stage: '8 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '4_month': {
          total: { urea: 100, tsp: 55, mop: 110, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 3, stage: '3 Weeks', urea: 25, tsp: 0, mop: 35, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 30, tsp: 0, mop: 45, zinc: 0 },
            { week: 8, stage: '8 Weeks', urea: 25, tsp: 0, mop: 30, zinc: 0 },
            { week: 9, stage: '9 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        }
      },
      transplanting: {
        '3_month': {
          total: { urea: 100, tsp: 55, mop: 110, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 25, tsp: 0, mop: 35, zinc: 0 },
            { week: 3, stage: '3 Weeks', urea: 30, tsp: 0, mop: 45, zinc: 0 },
            { week: 5, stage: '5 Weeks', urea: 25, tsp: 0, mop: 30, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '3_5_month': {
          total: { urea: 100, tsp: 55, mop: 110, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 25, tsp: 0, mop: 35, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 30, tsp: 0, mop: 45, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 25, tsp: 0, mop: 30, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '4_month': {
          total: { urea: 100, tsp: 55, mop: 110, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 25, tsp: 0, mop: 35, zinc: 0 },
            { week: 5, stage: '5 Weeks', urea: 30, tsp: 0, mop: 45, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 25, tsp: 0, mop: 30, zinc: 0 },
            { week: 8, stage: '8 Weeks', urea: 20, tsp: 0, mop: 0, zinc: 0 }
          ]
        }
      }
    }
  },

  intermediate_dry_zone: {
    rainfed: {
      direct_seeding: {
        '3_month': {
          total: { urea: 175, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 65, tsp: 0, mop: 25, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 50, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '3_5_month': {
          total: { urea: 175, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 3, stage: '3 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 },
            { week: 5, stage: '5 Weeks', urea: 65, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 50, tsp: 0, mop: 25, zinc: 0 },
            { week: 8, stage: '8 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '4_month': {
          total: { urea: 175, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 3, stage: '3 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 },
            { week: 5, stage: '5 Weeks', urea: 65, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 50, tsp: 0, mop: 25, zinc: 0 },
            { week: 8, stage: '8 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 }
          ]
        }
      },
      transplanting: {
        '3_month': {
          total: { urea: 175, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 },
            { week: 3, stage: '3 Weeks', urea: 65, tsp: 0, mop: 25, zinc: 0 },
            { week: 5, stage: '5 Weeks', urea: 50, tsp: 0, mop: 25, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '3_5_month': {
          total: { urea: 175, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 65, tsp: 0, mop: 25, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 50, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '4_month': {
          total: { urea: 175, tsp: 35, mop: 50, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 35, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 },
            { week: 5, stage: '5 Weeks', urea: 65, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 50, tsp: 0, mop: 25, zinc: 0 },
            { week: 8, stage: '8 Weeks', urea: 30, tsp: 0, mop: 0, zinc: 0 }
          ]
        }
      }
    },
    irrigated: {
      direct_seeding: {
        '3_month': {
          total: { urea: 225, tsp: 55, mop: 60, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 50, tsp: 0, mop: 0, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 75, tsp: 0, mop: 25, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 65, tsp: 0, mop: 35, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 35, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '3_5_month': {
          total: { urea: 225, tsp: 55, mop: 60, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 3, stage: '3 Weeks', urea: 50, tsp: 0, mop: 0, zinc: 0 },
            { week: 5, stage: '5 Weeks', urea: 75, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 65, tsp: 0, mop: 35, zinc: 0 },
            { week: 8, stage: '8 Weeks', urea: 35, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '4_month': {
          total: { urea: 225, tsp: 55, mop: 60, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 3, stage: '3 Weeks', urea: 50, tsp: 0, mop: 0, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 75, tsp: 0, mop: 25, zinc: 0 },
            { week: 8, stage: '8 Weeks', urea: 65, tsp: 0, mop: 35, zinc: 0 },
            { week: 9, stage: '9 Weeks', urea: 35, tsp: 0, mop: 0, zinc: 0 }
          ]
        }
      },
      transplanting: {
        '3_month': {
          total: { urea: 225, tsp: 55, mop: 60, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 50, tsp: 0, mop: 0, zinc: 0 },
            { week: 3, stage: '3 Weeks', urea: 75, tsp: 0, mop: 25, zinc: 0 },
            { week: 5, stage: '5 Weeks', urea: 65, tsp: 0, mop: 35, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 35, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '3_5_month': {
          total: { urea: 225, tsp: 55, mop: 60, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 50, tsp: 0, mop: 0, zinc: 0 },
            { week: 4, stage: '4 Weeks', urea: 75, tsp: 0, mop: 25, zinc: 0 },
            { week: 6, stage: '6 Weeks', urea: 65, tsp: 0, mop: 35, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 35, tsp: 0, mop: 0, zinc: 0 }
          ]
        },
        '4_month': {
          total: { urea: 225, tsp: 55, mop: 60, zinc: 5 },
          schedule: [
            { week: 0, stage: 'Basic Application', urea: 0, tsp: 55, mop: 0, zinc: 5 },
            { week: 2, stage: '2 Weeks', urea: 50, tsp: 0, mop: 0, zinc: 0 },
            { week: 5, stage: '5 Weeks', urea: 75, tsp: 0, mop: 25, zinc: 0 },
            { week: 7, stage: '7 Weeks', urea: 65, tsp: 0, mop: 35, zinc: 0 },
            { week: 8, stage: '8 Weeks', urea: 35, tsp: 0, mop: 0, zinc: 0 }
          ]
        }
      }
    }
  }
};

module.exports = {
  recommendations
};
