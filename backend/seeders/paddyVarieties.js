const mongoose = require("mongoose");
const PaddyVariety = require("../src/models/PaddyVariety");
require("dotenv").config();

const paddyVarieties = [
{
    "name": "H-4",
    "yearOfRelease": 1958,
    "parentage": "Murungakayan 302/Mas",
    "duration": "125 - 130 days",
    "type": "Long Duration",
    "culmHeight": "93 cm",
    "basalLeafSheathColour": "Dark green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "BL": "MR",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "3.5 t/ha",
      "resistance": [
        "BPH",
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "80%",
        "millingRecovery": "72.7%",
        "headRiceRecovery": "61.4%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High",
        "1000GrainWeight": "28.3 g",
        "grainShape": "Long Medium",
        "pericarpColour": "Red",
        "bushelWeight": "20.8 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "H 7",
    "yearOfRelease": 1964,
    "parentage": "Pachchaperumal/Mas//H 5",
    "duration": "105 days",
    "type": "Medium Duration",
    "culmHeight": "72 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BL": "R",
      "BLB": "HS"
    },
    "characteristics": {
      "averageYield": "3.6 t/ha",
      "resistance": [
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.4%",
        "millingRecovery": "72.3%",
        "headRiceRecovery": "60%",
        "amyloseContent": "Intermediate",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "23.6 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "White",
        "bushelWeight": "21.2 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "H 8",
    "yearOfRelease": 1966,
    "parentage": "H 4/Podiwee A8",
    "duration": "135 days",
    "type": "Long Duration",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BL": "MR",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": null,
      "resistance": [
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "gelatinizationTemperature": "High",
        "1000GrainWeight": "18.2 g",
        "grainShape": "Short Round",
        "pericarpColour": "White"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "H 9",
    "yearOfRelease": 1968,
    "parentage": "C104/Mas/Panduruwee",
    "duration": "155 days - Maha",
    "type": "Photoperiod Sensitive",
    "basalLeafSheathColour": "Green",
    "recommendation": "Mawee lands",
    "pestDiseaseReaction": {
      "BL": "S",
      "BLB": "HS"
    },
    "characteristics": {
      "averageYield": "3 t/ha",
      "resistance": [],
      "suitableZones": [
        "Mawee lands"
      ],
      "grainQuality": {
        "amyloseContent": "High",
        "gelatinizationTemperature": "High",
        "1000GrainWeight": "22.5 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "White"
      }
    },
    "description": "Photoperiod sensitive variety. Recommendation is Mawee lands.",
    "isActive": true
  },
  {
    "name": "H 10",
    "yearOfRelease": 1968,
    "parentage": "Pachchaperumal/Mas//H 5",
    "duration": "90 days",
    "type": "Short Duration",
    "culmHeight": "83 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BL": "S",
      "BLB": "HS"
    },
    "characteristics": {
      "averageYield": "3 t/ha",
      "resistance": [],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "76.61%",
        "millingRecovery": "73.4%",
        "headRiceRecovery": "52%",
        "gelatinizationTemperature": "High",
        "1000GrainWeight": "26 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "Red",
        "bushelWeight": "19.5 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "62 - 355",
    "yearOfRelease": 1968,
    "parentage": "Pachchaperumal/H 5",
    "duration": "90-95 days",
    "type": "Short Duration",
    "culmHeight": "90.4 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Rainfed / Manawari",
    "pestDiseaseReaction": {
      "BPH": "R/MR",
      "BL": "MR",
      "BLB": "S"
    },
    "characteristics": {
      "averageYield": "3.9 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Blast"
      ],
      "suitableZones": [
        "Rainfed / Manawari"
      ],
      "grainQuality": {
        "brownRiceRecovery": "75.6%",
        "millingRecovery": "72%",
        "headRiceRecovery": "57.5%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "29 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "Red",
        "bushelWeight": "20.8 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Rainfed / Manawari.",
    "isActive": true
  },
  {
    "name": "Bg 11-11",
    "yearOfRelease": 1970,
    "parentage": "Engkatek/2*H 8",
    "duration": "125 - 130 days",
    "type": "Long Duration",
    "culmHeight": "77.1cm",
    "basalLeafSheathColour": "Purple",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MS",
      "BL": "MS",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "4.5 t/ha",
      "resistance": [],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79%",
        "millingRecovery": "72.2%",
        "headRiceRecovery": "62.3%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "13.8 g",
        "grainShape": "Short Round",
        "pericarpColour": "White",
        "bushelWeight": "21.7 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 34 - 6",
    "yearOfRelease": 1971,
    "parentage": "IR 8-246///Pachchaperumal/Mas//H-501",
    "duration": "105 days",
    "type": "Medium Duration",
    "culmHeight": "48 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BL": "S",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "5.5 t/ha",
      "resistance": [],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.2%",
        "millingRecovery": "72.2%",
        "headRiceRecovery": "67.1%",
        "amyloseContent": "Low",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "25.5 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "Red",
        "bushelWeight": "21.3 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 34 - 8",
    "yearOfRelease": 1971,
    "parentage": "IR-246///Pachchaperumal/Mas//H-501",
    "duration": "96 days",
    "type": "Short Duration",
    "culmHeight": "61 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "S",
      "RGM": "S",
      "BL": "MR",
      "BLB": "HS"
    },
    "characteristics": {
      "averageYield": "6.1 t/ha",
      "resistance": [
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "80.4%",
        "millingRecovery": "74%",
        "headRiceRecovery": "70.7%",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "26 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "White",
        "bushelWeight": "21.7 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Ld 66",
    "yearOfRelease": 1971,
    "parentage": "H- 501/Dee-Geo-Woo-Gen",
    "duration": "135 days",
    "type": "Long Duration",
    "culmHeight": "77 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Iron toxic soil and acidic soil",
    "pestDiseaseReaction": {
      "BL": "S",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "3.5 t/ha",
      "resistance": [],
      "suitableZones": [
        "Iron toxic soil",
        "acidic soil"
      ],
      "grainQuality": {
        "gelatinizationTemperature": "High",
        "1000GrainWeight": "21.6 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "White"
      }
    },
    "description": "No specific description provided in source, recommendation is Iron toxic soil and acidic soil.",
    "isActive": true
  },
  {
    "name": "MI 273",
    "yearOfRelease": 1971,
    "parentage": "Gamma Irradiated H4",
    "duration": "135 days",
    "type": "Long Duration",
    "culmHeight": "58 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "BL": "MR",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": null,
      "resistance": [
        "Brown Planthopper",
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "1000GrainWeight": "28.4 g",
        "grainShape": "Long Medium",
        "pericarpColour": "Red"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 3 - 5",
    "yearOfRelease": 1973,
    "parentage": "Panduruwee/Mas//Engkatek",
    "duration": "165 days - Maha",
    "type": "Photoperiod Sensitive",
    "culmHeight": "67.4 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Mawee Land",
    "pestDiseaseReaction": {
      "BPH": "R/MR",
      "BL": "MR",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Blast"
      ],
      "suitableZones": [
        "Mawee Land"
      ],
      "grainQuality": {
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "21 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "White"
      }
    },
    "description": "Photoperiod sensitive variety. Recommendation is Mawee Land.",
    "isActive": true
  },
  {
    "name": "Bg 94-1",
    "yearOfRelease": 1975,
    "parentage": "IR 262/Ld 66",
    "duration": "105 days",
    "type": "Medium Duration",
    "culmHeight": "55 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MS",
      "RGM": "S",
      "BL": "S",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "4.1 t/ha",
      "resistance": [],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.3%",
        "millingRecovery": "72.9%",
        "headRiceRecovery": "63.8%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High-Intermediate",
        "1000GrainWeight": "28.3 g",
        "grainShape": "Long Medium",
        "pericarpColour": "White",
        "bushelWeight": "20.8 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 90-2",
    "yearOfRelease": 1975,
    "parentage": "IR 262/Remadja",
    "duration": "120 days",
    "type": "Medium Duration",
    "culmHeight": "60 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MS/S",
      "RGM": "S",
      "BL": "S",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "6.5 t/ha",
      "resistance": [],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.6%",
        "millingRecovery": "72.9%",
        "headRiceRecovery": "63.7%",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "29.3 g",
        "grainShape": "Long Medium",
        "pericarpColour": "White",
        "bushelWeight": "22.1 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "At 16",
    "yearOfRelease": 1977,
    "parentage": "IR 8/H4",
    "duration": "105 days",
    "type": "Medium Duration",
    "basalLeafSheathColour": "Green",
    "recommendation": "Southern province",
    "pestDiseaseReaction": {
      "BL": "MR",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "3.8 t/ha",
      "resistance": [
        "Blast"
      ],
      "suitableZones": [
        "Southern province"
      ],
      "grainQuality": {
        "gelatinizationTemperature": "High",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "Red"
      }
    },
    "description": "No specific description provided in source, recommendation is Southern province.",
    "isActive": true
  },
  {
    "name": "Bw 78",
    "yearOfRelease": 1974,
    "parentage": "H 501 // Podiwee A8 /2*H5",
    "duration": "135 days",
    "type": "Long Duration",
    "culmHeight": "78 cm",
    "basalLeafSheathColour": "Green with purple pigmentation",
    "recommendation": "Low Country Intermediate Zone",
    "pestDiseaseReaction": {
      "BPH": "S",
      "RGM": "MS",
      "BL": "R",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "3.5 t/ha",
      "resistance": [
        "Blast"
      ],
      "suitableZones": [
        "Low Country Intermediate Zone"
      ],
      "grainQuality": {
        "gelatinizationTemperature": "High",
        "1000GrainWeight": "20.2 g",
        "grainShape": "Short Round",
        "pericarpColour": "White",
        "bushelWeight": "22.2 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Low Country Intermediate Zone.",
    "isActive": true
  },
  {
    "name": "Bg 94 - 2",
    "yearOfRelease": 1978,
    "parentage": "IR 262/Ld 66",
    "duration": "105 days",
    "type": "Medium Duration",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "S",
      "BL": "R",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "5.9 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "amyloseContent": "High",
        "gelatinizationTemperature": "High",
        "1000GrainWeight": "25.6 g",
        "grainShape": "Long Medium",
        "pericarpColour": "Red"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 276 - 5",
    "yearOfRelease": 1979,
    "parentage": "Ob 678/ 2*Bg 34-8",
    "duration": "100 days",
    "type": "Medium Duration",
    "culmHeight": "53 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "S",
      "BL": "MS",
      "BLB": "HS"
    },
    "characteristics": {
      "averageYield": "4.3 t/ha",
      "resistance": [
        "Brown Planthopper"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.2%",
        "millingRecovery": "72.8%",
        "headRiceRecovery": "61.8%",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "29 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "White",
        "bushelWeight": "21.3 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bw 100",
    "yearOfRelease": 1979,
    "parentage": "2*H 501//Podiwee A8 /H5",
    "duration": "135 days",
    "type": "Long Duration",
    "culmHeight": "82 cm",
    "basalLeafSheathColour": "Dark green",
    "recommendation": "Low Country Wet Zone, Iron toxic soil",
    "pestDiseaseReaction": {
      "BPH": "S",
      "RGM": "MS",
      "BL": "R",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "4.5 t/ha",
      "resistance": [
        "Blast"
      ],
      "suitableZones": [
        "Low Country Wet Zone",
        "Iron toxic soil"
      ],
      "grainQuality": {
        "brownRiceRecovery": "77.2%",
        "millingRecovery": "71%",
        "headRiceRecovery": "65.2%",
        "gelatinizationTemperature": "Low-Intermediate",
        "1000GrainWeight": "19.3 g",
        "grainShape": "Short Round",
        "pericarpColour": "White",
        "bushelWeight": "21.8 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Low Country Wet Zone, Iron toxic soil.",
    "isActive": true
  },
  {
    "name": "Bg 379-2",
    "yearOfRelease": 1980,
    "parentage": "2*Bg 96-3/Ptb 33",
    "duration": "125 - 130 days",
    "type": "Long Duration",
    "culmHeight": "58 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MR",
      "BL": "MR",
      "BLB": "S"
    },
    "characteristics": {
      "averageYield": "6.1 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.4%",
        "millingRecovery": "64%",
        "headRiceRecovery": "73.7%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High-Intermediate",
        "1000GrainWeight": "24.4 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "White",
        "bushelWeight": "22.2 Kg"
      }
    },
    "description": "Popular Name: Yakadamaran. No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 400-1",
    "yearOfRelease": 1980,
    "parentage": "Ob 678//IR 20/H4",
    "duration": "135 days",
    "type": "Long Duration",
    "culmHeight": "73 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "S",
      "BL": "R",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "5.9 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.4%",
        "millingRecovery": "64%",
        "headRiceRecovery": "73.7%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High-Intermediate",
        "1000GrainWeight": "24.4 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "White",
        "bushelWeight": "22.2 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 750",
    "yearOfRelease": 1981,
    "parentage": "Ainantsao//75-1870/Pachchaperumal",
    "duration": "85 days",
    "type": "Short Duration",
    "culmHeight": "82 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Low Country Intermediate Zone",
    "pestDiseaseReaction": {
      "BPH": "MR/MS",
      "RGM": "R/MR",
      "BL": "MS",
      "BLB": "S"
    },
    "characteristics": {
      "averageYield": "3 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge"
      ],
      "suitableZones": [
        "Low Country Intermediate Zone"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.3%",
        "millingRecovery": "74.7%",
        "headRiceRecovery": "64.5%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "26 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "Red",
        "bushelWeight": "20.8 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Low Country Intermediate Zone.",
    "isActive": true
  },
  {
    "name": "Bw 266-7",
    "yearOfRelease": 1981,
    "parentage": "Bw 242-5-5//Ob 677/Bg 90-2",
    "duration": "105 days",
    "type": "Medium Duration",
    "culmHeight": "80.5 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Wet Zone",
    "pestDiseaseReaction": {
      "BPH": "S",
      "RGM": "S",
      "BL": "R",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "4.5 t/ha",
      "resistance": [
        "Blast"
      ],
      "suitableZones": [
        "Wet Zone"
      ],
      "grainQuality": {
        "1000GrainWeight": "24 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "White",
        "bushelWeight": "20.8 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Wet Zone.",
    "isActive": true
  },
  {
    "name": "Bw 267-3",
    "yearOfRelease": 1981,
    "parentage": "Ld 125/ Bw 248-1",
    "duration": "105 days",
    "type": "Medium Duration",
    "culmHeight": "82 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Low Country Wet Zone, Iron toxic soil",
    "pestDiseaseReaction": {
      "BPH": "MS/S",
      "RGM": "S",
      "BL": "MS",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "4 t/ha",
      "resistance": [],
      "suitableZones": [
        "Low Country Wet Zone",
        "Iron toxic soil"
      ],
      "grainQuality": {
        "brownRiceRecovery": "76.8%",
        "millingRecovery": "69.2%",
        "headRiceRecovery": "61.2%",
        "gelatinizationTemperature": "Low-Intermediate",
        "1000GrainWeight": "25.5 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "White"
      }
    },
    "description": "No specific description provided in source, recommendation is Low Country Wet Zone, Iron toxic soil.",
    "isActive": true
  },
  {
    "name": "Bw 272- 6b",
    "yearOfRelease": 1981,
    "parentage": "Bw 259-3 / Bw 242-5-5",
    "duration": "98 days",
    "type": "Short Duration",
    "culmHeight": "84 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Low Country Wet Zone - Suitable for      half bog and bog soil",
    "pestDiseaseReaction": {
      "BPH": "MS/S",
      "RGM": "S",
      "BL": "R",
      "BLB": "HS"
    },
    "characteristics": {
      "averageYield": "3.5 t/ha",
      "resistance": [
        "Blast"
      ],
      "suitableZones": [
        "Low Country Wet Zone",
        "half bog and bog soil"
      ],
      "grainQuality": {
        "brownRiceRecovery": "76%",
        "millingRecovery": "68.2%",
        "headRiceRecovery": "66.2%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Low",
        "1000GrainWeight": "16.7 g",
        "grainShape": "Short Round",
        "pericarpColour": "Red"
      }
    },
    "description": "No specific description provided in source, recommendation is Low Country Wet Zone - Suitable for half bog and bog soil.",
    "isActive": true
  },
  {
    "name": "Bg 38",
    "yearOfRelease": 1981,
    "parentage": "Engkatek//H 4/Podiwee A8",
    "duration": "155 days-Maha",
    "type": "Photoperiod Sensitive",
    "culmHeight": "84 cm",
    "basalLeafSheathColour": "Purple",
    "recommendation": "Mawee lands",
    "pestDiseaseReaction": {
      "BPH": "R/MR",
      "BL": "R",
      "BLB": "S"
    },
    "characteristics": {
      "averageYield": "6 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Blast"
      ],
      "suitableZones": [
        "Mawee lands"
      ],
      "grainQuality": {
        "brownRiceRecovery": "77.3%",
        "millingRecovery": "63.7%",
        "headRiceRecovery": "61.2%",
        "amyloseContent": "Intermediate",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "14 g",
        "grainShape": "Short Round",
        "pericarpColour": "White",
        "bushelWeight": "21.6 Kg"
      }
    },
    "description": "Popular Name: Matin Samba. Photoperiod sensitive variety. Recommendation is Mawee lands.",
    "isActive": true
  },
  {
    "name": "Bg 407",
    "yearOfRelease": 1981,
    "parentage": "IR 5/Panduruwee",
    "duration": "170 days - Maha",
    "type": "Photoperiod Sensitive",
    "culmHeight": "76 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Mawee lands",
    "pestDiseaseReaction": {
      "BL": "MR/MS",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "5.5 t/ha",
      "resistance": [
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "Mawee lands"
      ],
      "grainQuality": {
        "brownRiceRecovery": "80.2%",
        "millingRecovery": "73%",
        "headRiceRecovery": "51.2%",
        "amyloseContent": "Intermediate",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "21.5 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "White",
        "bushelWeight": "21.5 Kg"
      }
    },
    "description": "Photoperiod sensitive variety. Recommendation is Mawee lands.",
    "isActive": true
  },
  {
    "name": "Bg 745",
    "yearOfRelease": 1981,
    "parentage": "71-555/Podiwee A8",
    "duration": "150 days - Maha",
    "type": "Photoperiod Sensitive",
    "culmHeight": "79.6 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Mawee lands",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "BL": "MR",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "6 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "Mawee lands"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.5%",
        "millingRecovery": "73.2%",
        "headRiceRecovery": "59.4%",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "20 g",
        "grainShape": "Short Round",
        "pericarpColour": "White",
        "bushelWeight": "22.3 Kg"
      }
    },
    "description": "Photoperiod sensitive variety. Recommendation is Mawee lands.",
    "isActive": true
  },
  {
    "name": "Bg 380",
    "yearOfRelease": 1982,
    "parentage": "4*Bg 90-2/Ob 677",
    "duration": "115 days",
    "type": "Medium Duration",
    "culmHeight": "63 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Major irrigation in Dry Zone        and Intermediate Zone",
    "pestDiseaseReaction": {
      "BPH": "S",
      "RGM": "S",
      "BL": "S",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "6.5 t/ha",
      "resistance": [],
      "suitableZones": [
        "Major irrigation in Dry Zone",
        "Intermediate Zone"
      ],
      "grainQuality": {
        "brownRiceRecovery": "80.7%",
        "millingRecovery": "76.1%",
        "headRiceRecovery": "51.9%",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "25.8 g",
        "grainShape": "Long Medium",
        "pericarpColour": "White",
        "bushelWeight": "21.1 Kg"
      }
    },
    "description": "Popular Name: Hangimuththan, Padiliwee. No specific description provided in source, recommendation is Major irrigation in Dry Zone and Intermediate Zone.",
    "isActive": true
  },
  {
    "name": "Bg 450",
    "yearOfRelease": 1985,
    "parentage": "2*Bg 12-1/ IR 42",
    "duration": "125 - 130 days",
    "type": "Long Duration",
    "culmHeight": "64 cm",
    "basalLeafSheathColour": "Purple",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR/MS",
      "RGM": "MS",
      "BL": "S",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "5.3 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "80.7%",
        "millingRecovery": "73.3%",
        "headRiceRecovery": "66.4%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "14.2 g",
        "grainShape": "Short Round",
        "pericarpColour": "White",
        "bushelWeight": "21.2 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 350",
    "yearOfRelease": 1986,
    "parentage": "Bg 94-1///Bg 401-1/80-3717//Bg 94-1",
    "duration": "105 days",
    "type": "Medium Duration",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "RGM": "MR",
      "BL": "MS",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "8.5 t/ha",
      "resistance": [
        "Rice Gall Midge"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "77.9%",
        "millingRecovery": "70.4%",
        "headRiceRecovery": "66.2%",
        "amyloseContent": "Intermediate",
        "gelatinizationTemperature": "Low",
        "grainShape": "Long Medium",
        "pericarpColour": "Red"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bw 351",
    "yearOfRelease": 1986,
    "parentage": "Bg 90-1 / Bg 401-1",
    "duration": "108 days",
    "type": "Medium Duration",
    "culmHeight": "64 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "High potential areas in Low Country        Wet Zone (mineral soil)",
    "pestDiseaseReaction": {
      "BPH": "MS",
      "RGM": "S",
      "BL": "R",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "4.5 t/ha",
      "resistance": [
        "Blast"
      ],
      "suitableZones": [
        "High potential areas in Low Country Wet Zone (mineral soil)"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.5%",
        "millingRecovery": "71.6%",
        "headRiceRecovery": "65.7%",
        "amyloseContent": "Intermediate",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "28 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "Red",
        "bushelWeight": "20.5 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is High potential areas in Low Country Wet Zone (mineral soil).",
    "isActive": true
  },
  {
    "name": "Bg 300",
    "yearOfRelease": 1987,
    "parentage": "Bg 367-7//IR 841/Bg 276-5",
    "duration": "93 days",
    "type": "Short Duration",
    "culmHeight": "72.2 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "S",
      "BL": "MR",
      "BLB": "MR"
    },
    "characteristics": {
      "averageYield": "5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "80.3%",
        "millingRecovery": "74.5%",
        "headRiceRecovery": "62%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "26.8 kg",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "White",
        "bushelWeight": "21.9 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 301",
    "yearOfRelease": 1987,
    "parentage": "1280/H 4",
    "duration": "90-95 days",
    "type": "Short Duration",
    "culmHeight": "67 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Rainfed - Dry Zone and Intermediate       Zone",
    "pestDiseaseReaction": {
      "RGM": "MS",
      "BL": "R",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "6 t/ha",
      "resistance": [
        "Blast"
      ],
      "suitableZones": [
        "Rainfed - Dry Zone",
        "Intermediate Zone"
      ],
      "grainQuality": {
        "gelatinizationTemperature": "High-Intermediate",
        "1000GrainWeight": "23.9 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "Red",
        "bushelWeight": "20.5 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Rainfed - Dry Zone and Intermediate Zone.",
    "isActive": true
  },
  {
    "name": "Bw 302",
    "yearOfRelease": 1987,
    "parentage": "Bw 259-3 / Bw 242-5-5",
    "duration": "90 days",
    "type": "Short Duration",
    "culmHeight": "65 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Wet Zone",
    "pestDiseaseReaction": {
      "BPH": "S",
      "RGM": "MS",
      "BL": "R",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "3.2 t/ha",
      "resistance": [
        "Blast"
      ],
      "suitableZones": [
        "Wet Zone"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.5%",
        "millingRecovery": "71.8%",
        "headRiceRecovery": "65.7%",
        "1000GrainWeight": "21.3 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "White",
        "bushelWeight": "20.9 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Wet Zone.",
    "isActive": true
  },
  {
    "name": "Bw 400",
    "yearOfRelease": 1987,
    "parentage": "Bw 259-3/Bw 242-5-5",
    "duration": "120 days",
    "type": "Medium Duration",
    "culmHeight": "84 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Saline and acidic soil",
    "pestDiseaseReaction": {
      "BPH": "S",
      "RGM": "MS",
      "BL": "S"
    },
    "characteristics": {
      "averageYield": "5 t/ha",
      "resistance": [],
      "suitableZones": [
        "Saline soil",
        "acidic soil"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.1%",
        "millingRecovery": "73.8%",
        "headRiceRecovery": "57.1%",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "Red"
      }
    },
    "description": "No specific description provided in source, recommendation is Saline and acidic soil.",
    "isActive": true
  },
  {
    "name": "Bw 451",
    "yearOfRelease": 1987,
    "parentage": "Bg 400-1/Bg 11-11",
    "duration": "120 days",
    "type": "Medium Duration",
    "culmHeight": "66 cm",
    "basalLeafSheathColour": "Dark Green, Purple Pigments",
    "recommendation": "Low Country Wet Zone, Saline        soil",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "BL": "S",
      "BLB": "MR"
    },
    "characteristics": {
      "averageYield": "5.5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "Low Country Wet Zone",
        "Saline soil"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.9%",
        "millingRecovery": "75.1%",
        "headRiceRecovery": "70.6%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High",
        "1000GrainWeight": "15.3 g",
        "grainShape": "Short Round",
        "pericarpColour": "White"
      }
    },
    "description": "No specific description provided in source, recommendation is Low Country Wet Zone, Saline soil.",
    "isActive": true
  },
  {
    "name": "At 303",
    "yearOfRelease": 1990,
    "parentage": "At 66-2/Bg 276-5",
    "duration": "90 days",
    "type": "Short Duration",
    "culmHeight": "74 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MS",
      "RGM": "MR",
      "BL": "MR/MS",
      "BLB": "S"
    },
    "characteristics": {
      "averageYield": "5 t/ha",
      "resistance": [
        "Rice Gall Midge",
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.6%",
        "millingRecovery": "66.1%",
        "headRiceRecovery": "46.7%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High",
        "1000GrainWeight": "26 g",
        "grainShape": "Long Medium",
        "pericarpColour": "Red",
        "bushelWeight": "21.5 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 352",
    "yearOfRelease": 1992,
    "parentage": "Bg 380/Bg 367-4",
    "duration": "98 - 102 days",
    "type": "Medium Duration",
    "culmHeight": "67 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR/MS",
      "RGM": "MR",
      "BL": "MR",
      "BLB": "S"
    },
    "characteristics": {
      "averageYield": "4.9 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.1%",
        "millingRecovery": "73.1%",
        "headRiceRecovery": "67.9%",
        "amyloseContent": "Intermediate",
        "gelatinizationTemperature": "Low",
        "1000GrainWeight": "28 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "White",
        "bushelWeight": "21.7 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "At 353",
    "yearOfRelease": 1992,
    "parentage": "Bg 94-1(Red) /Bg 400-1//Bg 94-1",
    "duration": "105 days",
    "type": "Medium Duration",
    "culmHeight": "80 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General Cultivation",
    "pestDiseaseReaction": {
      "BPH": "MS",
      "RGM": "MR",
      "BL": "MS",
      "BLB": "S"
    },
    "characteristics": {
      "averageYield": "5.2 t/ha",
      "resistance": [
        "Rice Gall Midge"
      ],
      "suitableZones": [
        "General Cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.3%",
        "millingRecovery": "72.6%",
        "headRiceRecovery": "67.8%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Low",
        "1000GrainWeight": "24.1 g",
        "grainShape": "Long medium",
        "pericarpColour": "Red",
        "bushelWeight": "19.2 Kg"
      }
    },
    "description": "Popular Name: Rosa Kekulu. No specific description provided in source, recommendation is General Cultivation.",
    "isActive": true
  },
  {
    "name": "At 354",
    "yearOfRelease": 1992,
    "parentage": "Bg 94-1/Pokkali",
    "duration": "105 days",
    "type": "Medium Duration",
    "culmHeight": "67 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Saline areas",
    "pestDiseaseReaction": {
      "BPH": "MR/MS",
      "RGM": "MR/MS",
      "BL": "MS",
      "BLB": "S"
    },
    "characteristics": {
      "averageYield": "5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge"
      ],
      "suitableZones": [
        "Saline areas"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.5%",
        "millingRecovery": "72.4%",
        "headRiceRecovery": "63.1%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Low-Intermediate",
        "1000GrainWeight": "26.1 g",
        "grainShape": "Long medium",
        "pericarpColour": "White",
        "bushelWeight": "20.5 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Saline areas.",
    "isActive": true
  },
  {
    "name": "At 401",
    "yearOfRelease": 1992,
    "parentage": "Bg 94-1/Pokkali",
    "duration": "120 days",
    "type": "Medium Duration",
    "culmHeight": "85 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Costal saline areas",
    "pestDiseaseReaction": {
      "BPH": "MR/MS",
      "RGM": "R",
      "BL": "MS",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge"
      ],
      "suitableZones": [
        "Costal saline areas"
      ],
      "grainQuality": {
        "brownRiceRecovery": "80%",
        "millingRecovery": "72.4%",
        "headRiceRecovery": "55.6%",
        "amyloseContent": "Intermediate",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "25 g",
        "grainShape": "Long medium",
        "pericarpColour": "Red",
        "bushelWeight": "20 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Costal saline areas.",
    "isActive": true
  },
  {
    "name": "At 402",
    "yearOfRelease": 1992,
    "parentage": "IR 4432-52-6-4/Bg 90-2//76-3990/Ob 678",
    "duration": "115 - 120 days",
    "type": "Medium Duration",
    "culmHeight": "85 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Southern province",
    "pestDiseaseReaction": {
      "BPH": "R/MR",
      "RGM": "R",
      "BL": "S",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "6 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge"
      ],
      "suitableZones": [
        "Southern province"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.4%",
        "millingRecovery": "72.3%",
        "headRiceRecovery": "53.7%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "23.7 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "Red",
        "bushelWeight": "21.4 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Southern province.",
    "isActive": true
  },
  {
    "name": "Bw 452",
    "yearOfRelease": 1992,
    "parentage": "Hondarawala 502/C 104",
    "duration": "135 days",
    "type": "Long Duration",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MR/MS",
      "BL": "MR",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "1000GrainWeight": "26.8 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "Red"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bw 453",
    "yearOfRelease": 1992,
    "parentage": "IR 2071-586/Bg 400-1",
    "duration": "135 days",
    "type": "Long Duration",
    "culmHeight": "78 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Low Country Wet Zone",
    "pestDiseaseReaction": {
      "BPH": "R",
      "RGM": "MR",
      "BL": "MR/MS",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "5.5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "Low Country Wet Zone"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.8%",
        "millingRecovery": "72.5%",
        "headRiceRecovery": "60.8%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Low",
        "1000GrainWeight": "26.7 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "White"
      }
    },
    "description": "No specific description provided in source, recommendation is Low Country Wet Zone.",
    "isActive": true
  },
  {
    "name": "Bg 304",
    "yearOfRelease": 1993,
    "parentage": "Co 10/IR 50//84-1587/Bg 731-2",
    "duration": "90 days",
    "type": "Short Duration",
    "culmHeight": "68 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "R",
      "BL": "S",
      "BLB": "S"
    },
    "characteristics": {
      "averageYield": "4.7 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "77.7%",
        "millingRecovery": "74.1%",
        "headRiceRecovery": "64.9%",
        "amyloseContent": "High-Intermediate",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "23.5 g",
        "grainShape": "Long Medium",
        "pericarpColour": "White",
        "bushelWeight": "20.1 Kg"
      }
    },
    "description": "Popular Name: Niyan Kumari. No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 403",
    "yearOfRelease": 1993,
    "parentage": "83-1026/Bg 379-2",
    "duration": "118 days",
    "type": "Medium Duration",
    "culmHeight": "60 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR/MS",
      "RGM": "R/MR",
      "BL": "MR/MS",
      "BLB": "S"
    },
    "characteristics": {
      "averageYield": "5.8 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.3%",
        "millingRecovery": "72.2%",
        "headRiceRecovery": "66.9%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Low",
        "1000GrainWeight": "23.9 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "White",
        "bushelWeight": "22.3 Kg"
      }
    },
    "description": "Popular Name: Mahasen. No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Ld 355",
    "yearOfRelease": 1994,
    "parentage": "Bw 451/IR 50",
    "duration": "105 days",
    "type": "Medium Duration",
    "culmHeight": "70 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Southern Province",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MR",
      "BL": "MR",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "4.5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "Southern Province"
      ],
      "grainQuality": {
        "1000GrainWeight": "16.4 g",
        "grainShape": "Short Round",
        "pericarpColour": "White",
        "bushelWeight": "21 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Southern Province.",
    "isActive": true
  },
  {
    "name": "Ld 356",
    "yearOfRelease": 1994,
    "parentage": "Bw 451/Bw 351",
    "duration": "105 days",
    "type": "Medium Duration",
    "culmHeight": "66 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Kaluthara and Galle Districts",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MR",
      "BL": "S",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "4.5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "Kaluthara and Galle Districts"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.8%",
        "millingRecovery": "72.4%",
        "headRiceRecovery": "65.7%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "17.6 g",
        "grainShape": "Short Round",
        "pericarpColour": "Red",
        "bushelWeight": "22.6 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Kaluthara and Galle Districts.",
    "isActive": true
  },
  {
    "name": "Bg 357",
    "yearOfRelease": 1997,
    "parentage": "Bg 797/Bg 300//85-1580/Senerang M-17",
    "duration": "105 days",
    "type": "Medium Duration",
    "culmHeight": "56 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MR",
      "BL": "MR/MS",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "5.8 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79%",
        "millingRecovery": "71%",
        "headRiceRecovery": "59.1%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High-Intermediate",
        "1000GrainWeight": "22.6 g",
        "grainShape": "Long Medium",
        "pericarpColour": "White",
        "bushelWeight": "20.2 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "At 405",
    "yearOfRelease": 1997,
    "parentage": "At 402/Basmathi 442",
    "duration": "120 days",
    "type": "Medium Duration",
    "culmHeight": "67 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Dry Zone and Intermediate Zone with        assured supply of water",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MR",
      "BL": "S",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "4.7 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "Dry Zone",
        "Intermediate Zone with assured supply of water"
      ],
      "grainQuality": {
        "brownRiceRecovery": "76.5%",
        "millingRecovery": "68.4%",
        "headRiceRecovery": "59.4%",
        "amyloseContent": "Low",
        "gelatinizationTemperature": "Low",
        "1000GrainWeight": "22.5 g",
        "grainShape": "Long Slender",
        "pericarpColour": "White",
        "bushelWeight": "18.5 Kg"
      }
    },
    "description": "Popular Name: Lanka Samurdhi. Slightly sticky and aromatic rice. Recommendation is Dry Zone and Intermediate Zone with assured supply of water.",
    "isActive": true
  },
  {
    "name": "Bg 358",
    "yearOfRelease": 1999,
    "parentage": "Bg 12-1/Bg 1492",
    "duration": "108 days",
    "type": "Medium Duration",
    "culmHeight": "66 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "S",
      "RGM": "MR/MS",
      "BL": "S",
      "BLB": "MR"
    },
    "characteristics": {
      "averageYield": "4.8 t/ha",
      "resistance": [
        "Rice Gall Midge",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.6%",
        "millingRecovery": "72.3%",
        "headRiceRecovery": "71%",
        "amyloseContent": "High-Intermediate",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "16.4 g",
        "grainShape": "Short Round",
        "pericarpColour": "White",
        "bushelWeight": "22.7 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 359",
    "yearOfRelease": 1999,
    "parentage": "88-5089/Bg 379-2",
    "duration": "103 - 105 days",
    "type": "Medium Duration",
    "culmHeight": "64 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Wet Zone",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MR",
      "BL": "MR",
      "BLB": "MR"
    },
    "characteristics": {
      "averageYield": "5.9 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "Wet Zone"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.5%",
        "millingRecovery": "74.2%",
        "headRiceRecovery": "66%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High-Intermediate",
        "1000GrainWeight": "23.6 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "White",
        "bushelWeight": "21.6 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Wet Zone.",
    "isActive": true
  },
  {
    "name": "Bg 360",
    "yearOfRelease": 1999,
    "parentage": "84-3346/IR 36//Senerang",
    "duration": "103 - 106 days",
    "type": "Medium Duration",
    "culmHeight": "52 cm",
    "basalLeafSheathColour": "Purple",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MR",
      "BL": "S",
      "BLB": "MR"
    },
    "characteristics": {
      "averageYield": "4.2 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.5%",
        "millingRecovery": "73.7%",
        "headRiceRecovery": "72.4%",
        "amyloseContent": "Intermediate",
        "gelatinizationTemperature": "High-Intermediate",
        "1000GrainWeight": "13.6 g",
        "grainShape": "Short Oblong",
        "pericarpColour": "White",
        "bushelWeight": "20.6 Kg"
      }
    },
    "description": "Popular Name: Keeri samba. No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 305",
    "yearOfRelease": 1999,
    "parentage": "Bg 1203/Bg 1492",
    "duration": "93 days",
    "type": "Short Duration",
    "culmHeight": "70 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "R",
      "BL": "S",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "80.1%",
        "millingRecovery": "72.9%",
        "headRiceRecovery": "65.2%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "23.7 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "White",
        "bushelWeight": "21 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bw 361",
    "yearOfRelease": 2002,
    "parentage": "IR 36 / Bw 267-3-11M",
    "duration": "105 days",
    "type": "Medium Duration",
    "culmHeight": "80 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MS/S",
      "BL": "R",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "4.5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "81.3%",
        "millingRecovery": "74.4%",
        "headRiceRecovery": "64,1%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Low",
        "1000GrainWeight": "21.4 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "Red",
        "bushelWeight": "21 Kg"
      }
    },
    "description": "Tolerant to iron toxicity. Recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "At 362",
    "yearOfRelease": 2002,
    "parentage": "At 85-2/Bg 380",
    "duration": "110 days",
    "type": "Medium Duration",
    "culmHeight": "70 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "R/MR",
      "RGM": "R/MR",
      "BL": "MR/MS",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "6 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.3%",
        "millingRecovery": "68.6%",
        "headRiceRecovery": "54.2%",
        "amyloseContent": "Intermediate-High",
        "gelatinizationTemperature": "Low",
        "1000GrainWeight": "25.7 g",
        "grainShape": "Long Medium",
        "pericarpColour": "Red",
        "bushelWeight": "20.6 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bw 363",
    "yearOfRelease": 2004,
    "parentage": "IR 36/Bw 267-311M",
    "duration": "105 days",
    "type": "Medium Duration",
    "culmHeight": "58 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "R/MR",
      "BL": "MS",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "3.5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "80.9%",
        "millingRecovery": "73.1%",
        "headRiceRecovery": "63.6%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High",
        "1000GrainWeight": "23 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "White"
      }
    },
    "description": "Tolerant to iron toxicity. Recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "At 306",
    "yearOfRelease": 2004,
    "parentage": "IR 49517-41-1-2-3/At 405",
    "duration": "102 days",
    "type": "Medium Duration",
    "culmHeight": "63 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "R",
      "RGM": "MR",
      "BL": "MR",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "4.7 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.6%",
        "millingRecovery": "66.3%",
        "headRiceRecovery": "50.4%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Intermediate-High",
        "1000GrainWeight": "21.9 g",
        "grainShape": "Long Slender",
        "pericarpColour": "White",
        "bushelWeight": "19 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 250",
    "yearOfRelease": 2005,
    "parentage": "Farmer field selection",
    "duration": "85 days",
    "type": "Short Duration",
    "culmHeight": "75 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Rainfed, Drought escape variety      Re-establishment of flood damaged areas",
    "pestDiseaseReaction": {
      "BPH": "R",
      "RGM": "MR",
      "BL": "MR",
      "BLB": "S"
    },
    "characteristics": {
      "averageYield": "4.5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast"
      ],
      "suitableZones": [
        "Rainfed",
        "Drought escape variety",
        "Re-establishment of flood damaged areas"
      ],
      "grainQuality": {
        "brownRiceRecovery": "80.5%",
        "millingRecovery": "74.4%",
        "headRiceRecovery": "69.3%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "24 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "White",
        "bushelWeight": "19.9 kg"
      }
    },
    "description": "Drought escape variety. Re-establishment of flood damaged areas. Recommendation is Rainfed, Drought escape variety Re-establishment of flood damaged areas.",
    "isActive": true
  },
  {
    "name": "At 307",
    "yearOfRelease": 2005,
    "parentage": "Bg 2225-1/Bg 96-3298",
    "duration": "97 days",
    "type": "Short Duration",
    "culmHeight": "59 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "R",
      "RGM": "MR",
      "BL": "R",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.8%",
        "millingRecovery": "74.4%",
        "headRiceRecovery": "69%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High-Intermediate",
        "1000GrainWeight": "23.3 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "White",
        "bushelWeight": "22.5 kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 406",
    "yearOfRelease": 2005,
    "parentage": "Bg 73-797//Ptb 33/Ob 678",
    "duration": "120 days",
    "type": "Medium Duration",
    "culmHeight": "54 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Northern region",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "R",
      "BL": "MR/MS",
      "BLB": "R/MR"
    },
    "characteristics": {
      "averageYield": "5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "Northern region"
      ],
      "grainQuality": {
        "brownRiceRecovery": "80.9%",
        "millingRecovery": "74%",
        "headRiceRecovery": "62.5%",
        "amyloseContent": "Intermediate",
        "gelatinizationTemperature": "Low",
        "1000GrainWeight": "27 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "Red",
        "bushelWeight": "21.1 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Northern region.",
    "isActive": true
  },
  {
    "name": "Bg 407H",
    "yearOfRelease": 2005,
    "parentage": "Bg CMS 1A/IR 54742-22-19-3R",
    "duration": "118 days",
    "type": "Medium Duration",
    "culmHeight": "80.5 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "High potential area",
    "pestDiseaseReaction": {
      "RGM": "R",
      "BL": "R",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "8 t/ha",
      "resistance": [
        "Rice Gall Midge",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "High potential area"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.5%",
        "millingRecovery": "73.7%",
        "headRiceRecovery": "63.6 %",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Low",
        "1000GrainWeight": "29.8 g",
        "grainShape": "Long Slender",
        "pericarpColour": "White",
        "bushelWeight": "20.5 Kg"
      }
    },
    "description": "1st hybrid rice released by RRDI. Slightly sticky rice. Recommendation is High potential area.",
    "isActive": true
  },
  {
    "name": "Bg 454",
    "yearOfRelease": 2005,
    "parentage": "MR 1523/87-519",
    "duration": "133 days",
    "type": "Long Duration",
    "culmHeight": "54 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cult ivation with assured       supply of water",
    "pestDiseaseReaction": {
      "BPH": "R",
      "BL": "MR",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "4.2 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation with assured supply of water"
      ],
      "grainQuality": {
        "brownRiceRecovery": "80.1%",
        "millingRecovery": "73.9%",
        "headRiceRecovery": "59.2%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High-intermediate",
        "1000GrainWeight": "26 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "White",
        "bushelWeight": "21.1 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cult ivation with assured supply of water.",
    "isActive": true
  },
  {
    "name": "Bw 364",
    "yearOfRelease": 2006,
    "parentage": "Bw 400/Ob 2552 //Bg 352",
    "duration": "103 days",
    "type": "Medium Duration",
    "culmHeight": "80 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Wet Zone",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MR",
      "BL": "MR",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "4.5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast"
      ],
      "suitableZones": [
        "Wet Zone"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.5%",
        "millingRecovery": "75.5%",
        "headRiceRecovery": "61%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High",
        "1000GrainWeight": "23 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "Red"
      }
    },
    "description": "Tolerant to iron toxicity. Recommendation is Wet Zone.",
    "isActive": true
  },
  {
    "name": "Ld 365",
    "yearOfRelease": 2008,
    "parentage": "Selection from Ld 355",
    "duration": "102 days",
    "type": "Medium Duration",
    "culmHeight": "40 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Wet Zone",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MR",
      "BL": "MR",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "4.5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast"
      ],
      "suitableZones": [
        "Wet Zone"
      ],
      "grainQuality": {
        "brownRiceRecovery": "77.5%",
        "millingRecovery": "75%",
        "headRiceRecovery": "63.8%",
        "amyloseContent": "High-Intermediate",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "16 g",
        "grainShape": "Short Round",
        "pericarpColour": "Red",
        "bushelWeight": "22.6 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Wet Zone.",
    "isActive": true
  },
  {
    "name": "At 308",
    "yearOfRelease": 2008,
    "parentage": "Bg 2225-1/Bg 2426-2",
    "duration": "95 days",
    "type": "Short Duration",
    "culmHeight": "77 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MS",
      "RGM": "MR",
      "BL": "R",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "5.1 t/ha",
      "resistance": [
        "Rice Gall Midge",
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "81.5%",
        "millingRecovery": "70.6%",
        "headRiceRecovery": "60.7%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High",
        "1000GrainWeight": "17.5 g",
        "grainShape": "Short Round",
        "pericarpColour": "White",
        "bushelWeight": "21.8 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 366",
    "yearOfRelease": 2009,
    "parentage": "Bg 300/94-2236//Bg 300/Bg 304",
    "duration": "97-102 days",
    "type": "Medium Duration",
    "culmHeight": "73.6 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MR",
      "BL": "MR",
      "BLB": "S"
    },
    "characteristics": {
      "averageYield": "6 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.5%",
        "millingRecovery": "72.9%",
        "headRiceRecovery": "67.2%",
        "amyloseContent": "Intermediate-High",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "24.8 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "White",
        "bushelWeight": "21.7 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Ld 408",
    "yearOfRelease": 2010,
    "parentage": "At 01/Ld 98-152",
    "duration": "112 days",
    "type": "Medium Duration",
    "culmHeight": "62 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MS",
      "BL": "R/MR",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.2%",
        "millingRecovery": "72.6%",
        "headRiceRecovery": "66%",
        "amyloseContent": "Intermediate",
        "gelatinizationTemperature": "Low",
        "1000GrainWeight": "21.1 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "Red"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bw 367",
    "yearOfRelease": 2011,
    "parentage": "Bw 361/ Bg 358",
    "duration": "105 - 108 days",
    "type": "Medium Duration",
    "culmHeight": "97 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "R/MR",
      "RGM": "MR/MS",
      "BL": "MS",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "5.2 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.4%",
        "millingRecovery": "73.3%",
        "headRiceRecovery": "69.2%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "15 g",
        "grainShape": "Short Round",
        "pericarpColour": "White",
        "bushelWeight": "22 Kg"
      }
    },
    "description": "Tolerant to iron toxicity. Recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Ld 368",
    "yearOfRelease": 2011,
    "parentage": "Ld 99-14-11/Ld 365",
    "duration": "102 days",
    "type": "Medium Duration",
    "culmHeight": "83 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Wet Zone",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "R/MS",
      "BL": "MS",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "4.6 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "Wet Zone"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.8%",
        "millingRecovery": "74.5%",
        "headRiceRecovery": "70.6%",
        "amyloseContent": "High-Intermediate",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "16 g",
        "grainShape": "Short Round",
        "pericarpColour": "Red",
        "bushelWeight": "22.6 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Wet Zone.",
    "isActive": true
  },
  {
    "name": "Bg 369",
    "yearOfRelease": 2012,
    "parentage": "Bg 94-1/Nonabokra",
    "duration": "104 days",
    "type": "Medium Duration",
    "culmHeight": "59 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Saline areas",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MR",
      "BL": "MR",
      "BLB": "S"
    },
    "characteristics": {
      "averageYield": "5.5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast"
      ],
      "suitableZones": [
        "Saline areas"
      ],
      "grainQuality": {
        "brownRiceRecovery": "81.5%",
        "millingRecovery": "74.2%",
        "headRiceRecovery": "58.9%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "32.5 g",
        "grainShape": "Long Medium",
        "pericarpColour": "White",
        "bushelWeight": "21.2 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Saline areas.",
    "isActive": true
  },
  {
    "name": "Bg 370",
    "yearOfRelease": 2013,
    "parentage": "IR 555178/9-3R//IR 65515-47-2-1-91",
    "duration": "105 days",
    "type": "Medium Duration",
    "culmHeight": "85 cm",
    "basalLeafSheathColour": "Purple",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "R/MR",
      "RGM": "S",
      "BL": "MR",
      "BLB": "HS"
    },
    "characteristics": {
      "averageYield": "5.4 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.3%",
        "millingRecovery": "73.5%",
        "headRiceRecovery": "70.7%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "14.4 g",
        "grainShape": "Short Round",
        "pericarpColour": "White",
        "bushelWeight": "21.4 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Ld 371",
    "yearOfRelease": 2013,
    "parentage": "Ld 99-11-48/Bg 96-1520",
    "duration": "103 days",
    "type": "Medium Duration",
    "culmHeight": "59 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "WZ",
    "pestDiseaseReaction": {
      "BLB": "MR/MS",
      "RGM": "R/MS",
      "BL": "R/MR",
      "BPH": "R/MR"
    },
    "characteristics": {
      "averageYield": "4.6 t/ha",
      "resistance": [
        "Bacterial Leaf Blight",
        "Rice Gall Midge",
        "Blast",
        "Brown Planthopper"
      ],
      "suitableZones": [
        "Wet Zone"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.3%",
        "millingRecovery": "73%",
        "headRiceRecovery": "70.5%",
        "amyloseContent": "High-Intermediate",
        "gelatinizationTemperature": "High-Intermediate",
        "1000GrainWeight": "18.1 g",
        "grainShape": "Short Round",
        "pericarpColour": "White"
      }
    },
    "description": "No specific description provided in source, recommendation is WZ.",
    "isActive": true
  },
  {
    "name": "Bw 372",
    "yearOfRelease": 2013,
    "parentage": "Bg 359/Bw 267-3 (short mutant)",
    "duration": "104 days",
    "type": "Medium Duration",
    "culmHeight": "77.4 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Wet Zone",
    "pestDiseaseReaction": {
      "BPH": "MS/MR",
      "RGM": "MR",
      "BL": "MR",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "4.2 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "Wet Zone"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.1%",
        "millingRecovery": "73%",
        "headRiceRecovery": "72.1%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High",
        "1000GrainWeight": "21.4 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "Red",
        "bushelWeight": "22.5 Kg"
      }
    },
    "description": "Tolerant to iron toxicity. Recommendation is Wet Zone.",
    "isActive": true
  },
  {
    "name": "At 309",
    "yearOfRelease": 2013,
    "parentage": "IR 70422-66-5-2/Bg 98-2571",
    "duration": "95 days",
    "type": "Short Duration",
    "culmHeight": "52.8 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MR",
      "BL": "MR",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "4.2 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.6%",
        "millingRecovery": "71.1%",
        "headRiceRecovery": "47.1%",
        "amyloseContent": "Low",
        "gelatinizationTemperature": "Low",
        "1000GrainWeight": "22.6 g",
        "grainShape": "Long Slender",
        "pericarpColour": "White",
        "bushelWeight": "18.5 Kg"
      }
    },
    "description": "Aromatic Rice Variety. Recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 310",
    "yearOfRelease": 2014,
    "parentage": "Bg 300/Pokkali",
    "duration": "95 - 98 days",
    "type": "Short Duration",
    "culmHeight": "65 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Saline prone areas",
    "pestDiseaseReaction": {
      "BPH": "R/MR",
      "RGM": "S",
      "BL": "R/MR",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "5.6 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "Saline prone areas"
      ],
      "grainQuality": {
        "brownRiceRecovery": "81.4%",
        "millingRecovery": "76.7%",
        "headRiceRecovery": "71.1%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "27.5 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "White",
        "bushelWeight": "21.3 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Saline prone areas.",
    "isActive": true
  },
  {
    "name": "Bg 251 (GSR)",
    "yearOfRelease": 2014,
    "parentage": "ZX788 (Origin: China) (Introduction and Evaluation)",
    "duration": "80 days",
    "type": "Short Duration",
    "culmHeight": "67 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Rainfed and drought prone areas",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "R/MR",
      "BL": "R/MR",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "4.2 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast"
      ],
      "suitableZones": [
        "Rainfed areas",
        "drought prone areas"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79%",
        "millingRecovery": "73.5%",
        "headRiceRecovery": "73.5%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "21.5 g",
        "grainShape": "Long Medium",
        "pericarpColour": "White",
        "bushelWeight": "20.3 Kg"
      }
    },
    "description": "Parentage: ZX788 (Origin: China) (Introduction and Evaluation). Recommendation is Rainfed and drought prone areas.",
    "isActive": true
  },
  {
    "name": "At 373 (Ambalanthota Suwanda Samba)",
    "yearOfRelease": 2014,
    "parentage": "IR 70422-66-5-2/Bg 98-2571",
    "duration": "103 days",
    "type": "Medium Duration",
    "culmHeight": "76 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "R",
      "BL": "S",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "4.9 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "80.1%",
        "millingRecovery": "73.3%",
        "headRiceRecovery": "67.6%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High-Intermediate",
        "1000GrainWeight": "10.5 g",
        "grainShape": "Short Oblong",
        "pericarpColour": "White",
        "bushelWeight": "19.8 Kg"
      }
    },
    "description": "Aromatic Rice Variety. Recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 455",
    "yearOfRelease": 2014,
    "parentage": "Ob 2547/CR 9413//IR 46/Ob 2552",
    "duration": "130 days",
    "type": "Long Duration",
    "culmHeight": "77 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Suitable for water logging conditions",
    "pestDiseaseReaction": {
      "BPH": "MR/MS",
      "RGM": "R/MR",
      "BL": "R",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "6 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast"
      ],
      "suitableZones": [
        "water logging conditions"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.1%",
        "millingRecovery": "71.3%",
        "headRiceRecovery": "68%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High",
        "1000GrainWeight": "24.8 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "Red",
        "bushelWeight": "21.3 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Suitable for water logging conditions.",
    "isActive": true
  },
  {
    "name": "At 311 (Neeroga)",
    "yearOfRelease": 2015,
    "parentage": "At 306/At 03-105",
    "duration": "93 days",
    "type": "Short Duration",
    "culmHeight": "67 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "R/MR",
      "BL": "MR",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "4.8 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "75.3%",
        "millingRecovery": "66.2%",
        "headRiceRecovery": "64.3%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "High",
        "1000GrainWeight": "20.7 g",
        "grainShape": "Extra Long Slender",
        "pericarpColour": "Red",
        "bushelWeight": "17.3 Kg"
      }
    },
    "description": "Aromatic rice variety with low Glycemic Index (GI). Recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 252",
    "yearOfRelease": 2016,
    "parentage": "Selection from Bg 250",
    "duration": "85 days",
    "type": "Short Duration",
    "culmHeight": "62 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "Rainfed areas",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "R/MR",
      "BL": "R",
      "BLB": "MR/MS"
    },
    "characteristics": {
      "averageYield": "4.5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "Rainfed areas"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.2%",
        "millingRecovery": "72.2%",
        "headRiceRecovery": "71.1%",
        "amyloseContent": "Intermediate",
        "gelatinizationTemperature": "High-Intermediate",
        "1000GrainWeight": "17.8 g",
        "grainShape": "Short Round",
        "pericarpColour": "Red",
        "bushelWeight": "21.5 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is Rainfed areas.",
    "isActive": true
  },
  {
    "name": "Bg 374",
    "yearOfRelease": 2016,
    "parentage": "Ld 12-38-1/Bg 360",
    "duration": "105 - 108 days",
    "type": "Medium Duration",
    "culmHeight": "68 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MR",
      "BL": "MR",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "5.8 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "82.1%",
        "millingRecovery": "74%",
        "headRiceRecovery": "69.3%",
        "amyloseContent": "High-Intermediate",
        "gelatinizationTemperature": "High",
        "1000GrainWeight": "22.2 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "White",
        "bushelWeight": "21.2 Kg"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Ld 253",
    "yearOfRelease": 2016,
    "parentage": "Selection from At 04",
    "duration": "85 Days",
    "type": "Short Duration",
    "culmHeight": "49 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "R/MR",
      "RGM": "R/MR",
      "BL": "MR/MS",
      "BLB": "R/MR"
    },
    "characteristics": {
      "averageYield": "4.8 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "78.6%",
        "millingRecovery": "73.6%",
        "headRiceRecovery": "66%",
        "amyloseContent": "Intermediate",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "20.6 g",
        "grainShape": "Long Slender",
        "pericarpColour": "White"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bw 312",
    "yearOfRelease": 2019,
    "parentage": "Bg 250/IR 66-700-3-3-3",
    "duration": "90 Days",
    "type": "Short Duration",
    "culmHeight": "49 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MR",
      "BL": "MR",
      "BLB": "S/MS"
    },
    "characteristics": {
      "averageYield": "4.9 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "77.6%",
        "millingRecovery": "71.1%",
        "headRiceRecovery": "69.3%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Low",
        "1000GrainWeight": "21.6 g",
        "grainShape": "Intermediate Medium",
        "pericarpColour": "Red"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "Bg 409",
    "yearOfRelease": 2019,
    "parentage": "IR 72052-721-3/Bg 380",
    "duration": "110-115 days",
    "type": "Medium Duration",
    "culmHeight": "69 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "R/MR",
      "BL": "R",
      "BLB": "MR"
    },
    "characteristics": {
      "averageYield": "6 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast",
        "Bacterial Leaf Blight"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "81.9%",
        "millingRecovery": "74.4%",
        "headRiceRecovery": "66.2%",
        "amyloseContent": "High",
        "gelatinizationTemperature": "Intermediate",
        "1000GrainWeight": "25.2 g",
        "grainShape": "Intermediate Bold",
        "pericarpColour": "White"
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  },
  {
    "name": "At 313",
    "yearOfRelease": 2020,
    "parentage": "Selection from At 306",
    "duration": "91 - 95 days",
    "type": "Short Duration",
    "culmHeight": "63 cm",
    "basalLeafSheathColour": "Green",
    "recommendation": "General cultivation",
    "pestDiseaseReaction": {
      "BPH": "MR",
      "RGM": "MR",
      "BL": "MR",
      "BLB": "MS"
    },
    "characteristics": {
      "averageYield": "5.5 t/ha",
      "resistance": [
        "Brown Planthopper",
        "Rice Gall Midge",
        "Blast"
      ],
      "suitableZones": [
        "General cultivation"
      ],
      "grainQuality": {
        "brownRiceRecovery": "79.2%",
        "millingRecovery": "71.9%",
        "headRiceRecovery": "64.3%",
      }
    },
    "description": "No specific description provided in source, recommendation is General cultivation.",
    "isActive": true
  }
];

const seedPaddyVarieties = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Clear existing data
    await PaddyVariety.deleteMany();
    console.log("Cleared existing paddy varieties");

    // Map photoperiod sensitive varieties to correct enum value
    const mappedVarieties = paddyVarieties.map(variety => {
      if (variety.type === 'Photoperiod Sensitive') {
        return {
          ...variety,
          type: 'Long Duration (Photoperiod sensitive)'
        };
      }
      return variety;
    });

    // Insert seed data
    await PaddyVariety.insertMany(mappedVarieties);
    console.log("Paddy varieties seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedPaddyVarieties();
