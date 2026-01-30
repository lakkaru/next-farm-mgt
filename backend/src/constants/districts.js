// Sri Lankan districts and their cultivation zones
const SRI_LANKAN_DISTRICTS = [
  { name: 'Colombo', zone: 'WL1', province: 'Western' },
  { name: 'Gampaha', zone: 'WL1', province: 'Western' },
  { name: 'Kalutara', zone: 'WL2', province: 'Western' },
  { name: 'Kandy', zone: 'WM1', province: 'Central' },
  { name: 'Matale', zone: 'WM2', province: 'Central' },
  { name: 'Nuwara Eliya', zone: 'WU1', province: 'Central' },
  { name: 'Galle', zone: 'WL3', province: 'Southern' },
  { name: 'Matara', zone: 'WL3', province: 'Southern' },
  { name: 'Hambantota', zone: 'DL1', province: 'Southern' },
  { name: 'Jaffna', zone: 'DL2', province: 'Northern' },
  { name: 'Kilinochchi', zone: 'DL2', province: 'Northern' },
  { name: 'Mannar', zone: 'DL2', province: 'Northern' },
  { name: 'Vavuniya', zone: 'DL3', province: 'Northern' },
  { name: 'Mullaitivu', zone: 'DL2', province: 'Northern' },
  { name: 'Batticaloa', zone: 'DL1', province: 'Eastern' },
  { name: 'Ampara', zone: 'DL1', province: 'Eastern' },
  { name: 'Trincomalee', zone: 'DL1', province: 'Eastern' },
  { name: 'Kurunegala', zone: 'WM3', province: 'North Western' },
  { name: 'Puttalam', zone: 'DL1', province: 'North Western' },
  { name: 'Anuradhapura', zone: 'DL1', province: 'North Central' },
  { name: 'Polonnaruwa', zone: 'DL1', province: 'North Central' },
  { name: 'Badulla', zone: 'WM2', province: 'Uva' },
  { name: 'Moneragala', zone: 'DL3', province: 'Uva' },
  { name: 'Ratnapura', zone: 'WM3', province: 'Sabaragamuwa' },
  { name: 'Kegalle', zone: 'WM2', province: 'Sabaragamuwa' },
];

// Cultivation zones with detailed descriptions
const CULTIVATION_ZONES = {
  WL1: {
    code: 'WL1',
    name: 'Wet Zone Low Country 1',
    description: 'Coastal wet zone areas with high rainfall',
    rainfall: '2500-3500mm',
    elevation: '0-300m',
    mainSeasons: ['Maha', 'Yala'],
    suitableCrops: ['Rice', 'Coconut', 'Rubber', 'Tea (low grown)']
  },
  WL2: {
    code: 'WL2',
    name: 'Wet Zone Low Country 2',
    description: 'Inland wet zone areas with moderate to high rainfall',
    rainfall: '2000-2500mm',
    elevation: '0-300m',
    mainSeasons: ['Maha', 'Yala'],
    suitableCrops: ['Rice', 'Coconut', 'Cinnamon', 'Pepper']
  },
  WL3: {
    code: 'WL3',
    name: 'Wet Zone Low Country 3',
    description: 'Southern coastal wet zone areas',
    rainfall: '2000-3000mm',
    elevation: '0-300m',
    mainSeasons: ['Maha', 'Yala'],
    suitableCrops: ['Rice', 'Coconut', 'Tea (low grown)', 'Cinnamon']
  },
  WM1: {
    code: 'WM1',
    name: 'Wet Zone Mid Country 1',
    description: 'Central highlands wet zone',
    rainfall: '1500-2500mm',
    elevation: '300-900m',
    mainSeasons: ['Maha', 'Yala'],
    suitableCrops: ['Tea', 'Vegetables', 'Coffee', 'Cardamom']
  },
  WM2: {
    code: 'WM2',
    name: 'Wet Zone Mid Country 2',
    description: 'Mid-elevation wet zone areas',
    rainfall: '1500-2000mm',
    elevation: '300-900m',
    mainSeasons: ['Maha', 'Yala'],
    suitableCrops: ['Tea', 'Vegetables', 'Fruits', 'Spices']
  },
  WM3: {
    code: 'WM3',
    name: 'Wet Zone Mid Country 3',
    description: 'Western slope mid-country areas',
    rainfall: '1500-2000mm',
    elevation: '300-900m',
    mainSeasons: ['Maha', 'Yala'],
    suitableCrops: ['Tea', 'Rubber', 'Vegetables', 'Fruits']
  },
  WU1: {
    code: 'WU1',
    name: 'Wet Zone Up Country',
    description: 'High elevation wet zone areas',
    rainfall: '1500-2500mm',
    elevation: '900m+',
    mainSeasons: ['Maha', 'Yala'],
    suitableCrops: ['Tea (high grown)', 'Vegetables', 'Potato', 'Flowers']
  },
  DL1: {
    code: 'DL1',
    name: 'Dry Zone Low Country 1',
    description: 'Coastal and eastern dry zone areas',
    rainfall: '1000-1500mm',
    elevation: '0-300m',
    mainSeasons: ['Maha', 'Yala'],
    suitableCrops: ['Rice', 'Coconut', 'Onion', 'Chili']
  },
  DL2: {
    code: 'DL2',
    name: 'Dry Zone Low Country 2',
    description: 'Northern dry zone areas',
    rainfall: '800-1200mm',
    elevation: '0-300m',
    mainSeasons: ['Maha', 'Yala'],
    suitableCrops: ['Rice', 'Onion', 'Chili', 'Groundnut']
  },
  DL3: {
    code: 'DL3',
    name: 'Dry Zone Low Country 3',
    description: 'Interior dry zone areas',
    rainfall: '1000-1500mm',
    elevation: '0-300m',
    mainSeasons: ['Maha', 'Yala'],
    suitableCrops: ['Rice', 'Sugarcane', 'Fruits', 'Vegetables']
  },
  IL1: {
    code: 'IL1',
    name: 'Intermediate Zone Low Country',
    description: 'Transitional zone between wet and dry areas',
    rainfall: '1500-2000mm',
    elevation: '0-300m',
    mainSeasons: ['Maha', 'Yala'],
    suitableCrops: ['Rice', 'Coconut', 'Fruits', 'Vegetables']
  },
  IM1: {
    code: 'IM1',
    name: 'Intermediate Zone Mid Country',
    description: 'Mid-elevation transitional areas',
    rainfall: '1500-2000mm',
    elevation: '300-900m',
    mainSeasons: ['Maha', 'Yala'],
    suitableCrops: ['Tea', 'Coffee', 'Vegetables', 'Fruits']
  }
};

// Utility functions
const getDistrictByName = (districtName) => {
  return SRI_LANKAN_DISTRICTS.find(district => 
    district.name.toLowerCase() === districtName.toLowerCase()
  );
};

const getDistrictsByZone = (zoneCode) => {
  return SRI_LANKAN_DISTRICTS.filter(district => district.zone === zoneCode);
};

const getDistrictsByProvince = (provinceName) => {
  return SRI_LANKAN_DISTRICTS.filter(district => 
    district.province.toLowerCase() === provinceName.toLowerCase()
  );
};

const getCultivationZoneInfo = (zoneCode) => {
  return CULTIVATION_ZONES[zoneCode] || null;
};

const validateDistrict = (districtName) => {
  return SRI_LANKAN_DISTRICTS.some(district => 
    district.name.toLowerCase() === districtName.toLowerCase()
  );
};

const validateCultivationZone = (zoneCode) => {
  return Object.keys(CULTIVATION_ZONES).includes(zoneCode);
};

const getZoneForDistrict = (districtName) => {
  const district = getDistrictByName(districtName);
  return district ? district.zone : null;
};

module.exports = {
  SRI_LANKAN_DISTRICTS,
  CULTIVATION_ZONES,
  getDistrictByName,
  getDistrictsByZone,
  getDistrictsByProvince,
  getCultivationZoneInfo,
  validateDistrict,
  validateCultivationZone,
  getZoneForDistrict
};
