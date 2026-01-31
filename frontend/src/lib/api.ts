import axios from 'axios'
import { toast } from 'sonner'

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes('/users/login') ||
      error.config?.url?.includes('/users/register')

    if (error.response?.status === 401) {
      if (!isAuthEndpoint) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        toast.error('Session expired. Please login again.')
      }
    } else if (error.response?.status === 403) {
      if (!isAuthEndpoint) {
        toast.error('You do not have permission to perform this action.')
      }
    } else if (error.response?.status >= 500) {
      if (!isAuthEndpoint) {
        toast.error('Server error. Please try again later.')
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials: { phone: string; password: string }) =>
    api.post('/users/login', credentials),
  register: (userData: Record<string, unknown>) =>
    api.post('/users/register', userData),
  logout: () => api.post('/users/logout'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: Record<string, unknown>) =>
    api.put('/users/profile', userData),
  uploadAvatar: (avatarFile: File) => {
    const formData = new FormData()
    formData.append('avatar', avatarFile)
    return api.post('/users/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getAvatarUrl: (filename: string | null) =>
    filename
      ? `${api.defaults.baseURL}/users/avatar/${filename.split('/').pop()}`
      : null,
  changePassword: (passwordData: {
    currentPassword: string
    newPassword: string
  }) => api.put('/users/change-password', passwordData),
  forgotPassword: (email: string) =>
    api.post('/users/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.put(`/users/reset-password/${token}`, { password }),
}

// Farm API
export const farmAPI = {
  getFarms: (params?: Record<string, unknown>) =>
    api.get('/farms', { params }),
  getFarm: (id: string) => api.get(`/farms/${id}`),
  createFarm: (farmData: Record<string, unknown>) =>
    api.post('/farms', farmData),
  updateFarm: (id: string, farmData: Record<string, unknown>) =>
    api.put(`/farms/${id}`, farmData),
  deleteFarm: (id: string) => api.delete(`/farms/${id}`),
  addManager: (id: string, managerId: string) =>
    api.post(`/farms/${id}/managers`, { managerId }),
  removeManager: (id: string, managerId: string) =>
    api.delete(`/farms/${id}/managers/${managerId}`),
  getFarmsInRadius: (
    zipcode: string,
    distance: number,
    params?: Record<string, unknown>
  ) => api.get(`/farms/radius/${zipcode}/${distance}`, { params }),
  getDistricts: () => api.get('/farms/districts'),
  getCultivationZoneDetails: (zoneCode: string) =>
    api.get(`/farms/cultivation-zones/${zoneCode}`),
  getFarmsByDistrict: (district: string, params?: Record<string, unknown>) =>
    api.get(`/farms/by-district/${district}`, { params }),
  getFarmsByZone: (zoneCode: string, params?: Record<string, unknown>) =>
    api.get(`/farms/by-zone/${zoneCode}`, { params }),
}

// Crop API
export const cropAPI = {
  getCrops: (params?: Record<string, unknown>) =>
    api.get('/crops', { params }),
  getCrop: (id: string) => api.get(`/crops/${id}`),
  createCrop: (cropData: Record<string, unknown>) =>
    api.post('/crops', cropData),
  updateCrop: (id: string, cropData: Record<string, unknown>) =>
    api.put(`/crops/${id}`, cropData),
  deleteCrop: (id: string) => api.delete(`/crops/${id}`),
  updateCropStatus: (id: string, status: string) =>
    api.patch(`/crops/${id}/status`, { status }),
  addGrowthStage: (id: string, stageData: Record<string, unknown>) =>
    api.post(`/crops/${id}/growth-stages`, stageData),
  addIrrigationRecord: (id: string, irrigationData: Record<string, unknown>) =>
    api.post(`/crops/${id}/irrigation`, irrigationData),
  getCropStats: (params?: Record<string, unknown>) =>
    api.get('/crops/stats', { params }),
}

// Livestock API
export const livestockAPI = {
  getLivestock: (params?: Record<string, unknown>) =>
    api.get('/livestock', { params }),
  getLivestockById: (id: string) => api.get(`/livestock/${id}`),
  createLivestock: (livestockData: Record<string, unknown>) =>
    api.post('/livestock', livestockData),
  updateLivestock: (id: string, livestockData: Record<string, unknown>) =>
    api.put(`/livestock/${id}`, livestockData),
  deleteLivestock: (id: string) => api.delete(`/livestock/${id}`),
  addHealthRecord: (id: string, healthData: Record<string, unknown>) =>
    api.post(`/livestock/${id}/health-records`, healthData),
  addProductionRecord: (id: string, productionData: Record<string, unknown>) =>
    api.post(`/livestock/${id}/production`, productionData),
  getLivestockStats: (params?: Record<string, unknown>) =>
    api.get('/livestock/stats', { params }),
}

// Paddy Variety API
export const paddyVarietyAPI = {
  getPaddyVarieties: (params?: Record<string, unknown>) =>
    api.get('/paddy-varieties', { params }),
  getPaddyVariety: (id: string) => api.get(`/paddy-varieties/${id}`),
  createPaddyVariety: (varietyData: Record<string, unknown>) =>
    api.post('/paddy-varieties', varietyData),
  updatePaddyVariety: (id: string, varietyData: Record<string, unknown>) =>
    api.put(`/paddy-varieties/${id}`, varietyData),
  deletePaddyVariety: (id: string) => api.delete(`/paddy-varieties/${id}`),
}

// Season Plan API
export const seasonPlanAPI = {
  getSeasonPlans: (params?: Record<string, unknown>) =>
    api.get('/season-plans', { params }),
  getSeasonPlan: (id: string) => api.get(`/season-plans/${id}`),
  createSeasonPlan: (planData: Record<string, unknown>) =>
    api.post('/season-plans', planData),
  updateSeasonPlan: (id: string, planData: Record<string, unknown>) =>
    api.put(`/season-plans/${id}`, planData),
  deleteSeasonPlan: (id: string) => api.delete(`/season-plans/${id}`),
  updateFertilizerImplementation: (
    id: string,
    applicationIndex: number,
    data: Record<string, unknown>
  ) => api.put(`/season-plans/${id}/fertilizer/${applicationIndex}`, data),
  updateStageImplementation: (
    id: string,
    stageIndex: number,
    data: Record<string, unknown>
  ) => api.put(`/season-plans/${id}/stage/${stageIndex}`, data),
  updateHarvest: (id: string, harvestData: Record<string, unknown>) =>
    api.put(`/season-plans/${id}/harvest`, harvestData),
  addLCCFertilizerApplication: (id: string, lccData: Record<string, unknown>) =>
    api.post(`/season-plans/${id}/lcc-fertilizer`, lccData),
  deleteFertilizerApplication: (id: string, applicationIndex: number) =>
    api.delete(`/season-plans/${id}/fertilizer/${applicationIndex}`),
  addDailyRemark: (id: string, formData: FormData) =>
    api.post(`/season-plans/${id}/daily-remarks`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    }),
  updateDailyRemark: (id: string, remarkId: string, formData: FormData) =>
    api.put(`/season-plans/${id}/daily-remarks/${remarkId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    }),
  deleteDailyRemark: (id: string, remarkId: string) =>
    api.delete(`/season-plans/${id}/daily-remarks/${remarkId}`),
  removeRemarkImage: (id: string, remarkId: string, imageFilename: string) =>
    api.delete(`/season-plans/${id}/daily-remarks/${remarkId}/remove-image`, {
      data: { imageFilename },
    }),
  addExpense: (id: string, expenseData: Record<string, unknown>) =>
    api.post(`/season-plans/${id}/expenses`, expenseData),
  updateExpense: (
    id: string,
    expenseId: string,
    expenseData: Record<string, unknown>
  ) => api.put(`/season-plans/${id}/expenses/${expenseId}`, expenseData),
  deleteExpense: (id: string, expenseId: string) =>
    api.delete(`/season-plans/${id}/expenses/${expenseId}`),
  getExpenseSummary: (id: string) =>
    api.get(`/season-plans/${id}/expenses/summary`),
}

// Disease Detection API
export const diseaseDetectionAPI = {
  analyzeImage: (imageFile: File) => {
    const formData = new FormData()
    formData.append('image', imageFile)
    return api.post('/disease-detection/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    })
  },
  getDiseases: () => api.get('/disease-detection/diseases'),
  getDiseaseDetails: (id: string) =>
    api.get(`/disease-detection/diseases/${id}`),
  getAnalysisHistory: () => api.get('/disease-detection/history'),
  getImageUrl: (filename: string) =>
    `${api.defaults.baseURL}/disease-detection/image/${filename}`,
}

// Admin Disease Reference API
export const adminDiseaseAPI = {
  getReferences: () => api.get('/admin/diseases/references'),
  getDiseaseReferences: (diseaseId: string) =>
    api.get(`/admin/diseases/references/${diseaseId}`),
  uploadReferenceImages: (
    diseaseId: string,
    diseaseName: string,
    files: File[],
    metadata: {
      descriptions: string[]
      severities: string[]
      stages: string[]
      affectedAreas: string[]
    }
  ) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))
    formData.append('diseaseId', diseaseId)
    formData.append('diseaseName', diseaseName)
    formData.append('descriptions', JSON.stringify(metadata.descriptions))
    formData.append('severities', JSON.stringify(metadata.severities))
    formData.append('stages', JSON.stringify(metadata.stages))
    formData.append('affectedAreas', JSON.stringify(metadata.affectedAreas))
    return api.post('/admin/diseases/references', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    })
  },
  deleteReferenceImage: (diseaseId: string, imageId: string) =>
    api.delete(`/admin/diseases/references/${diseaseId}/images/${imageId}`),
  compareWithDisease: (diseaseId: string, imagePath: string) =>
    api.post(`/admin/diseases/compare/${diseaseId}`, { imagePath }),
  compareWithAllDiseases: (imagePath: string) =>
    api.post('/admin/diseases/compare-all', { imagePath }),
  getReferenceImageUrl: (filename: string) =>
    `${api.defaults.baseURL}/admin/diseases/reference-image/${filename}`,
}

// Admin API (users management)
export const adminAPI = {
  getFarmers: (params?: Record<string, unknown>) =>
    api.get('/admin/farmers', { params }),
  deleteFarmer: (id: string) => api.delete(`/admin/farmers/${id}`),
  updateFarmer: (id: string, data: Record<string, unknown>) =>
    api.put(`/admin/farmers/${id}`, data),
}

// Machinery API
export const machineryAPI = {
  searchMachinery: (filters?: Record<string, unknown>) =>
    api.get('/machinery', { params: filters }),
  getNearbyMachinery: (params?: Record<string, unknown>) =>
    api.get('/machinery/nearby', { params }),
  getMachinery: (id: string) => api.get(`/machinery/${id}`),
  createMachinery: (data: Record<string, unknown>) =>
    api.post('/machinery', data),
  updateMachinery: (id: string, data: Record<string, unknown>) =>
    api.put(`/machinery/${id}`, data),
  deleteMachinery: (id: string) => api.delete(`/machinery/${id}`),
  getMyMachinery: () => api.get('/machinery/my/listings'),
  searchByFarm: (farmId: string) =>
    api.get(`/machinery/search-by-farm/${farmId}`),
  createRequest: (data: Record<string, unknown>) =>
    api.post('/machinery/requests', data),
  getMyRequests: () => api.get('/machinery/requests/my'),
  getMachineryRequests: (machineryId: string) =>
    api.get(`/machinery/${machineryId}/requests`),
  updateRequestStatus: (requestId: string, data: Record<string, unknown>) =>
    api.put(`/machinery/requests/${requestId}/status`, data),
  rateService: (requestId: string, data: Record<string, unknown>) =>
    api.post(`/machinery/requests/${requestId}/rate`, data),
}

// Location API
export const locationAPI = {
  getProvinces: () => api.get('/locations/provinces'),
  getDistricts: (provinceId?: string) =>
    api.get('/locations/districts', { params: { provinceId } }),
  getDivisionalSecretariats: (district: string) =>
    api.get(`/locations/divisional-secretariats/${encodeURIComponent(district)}`),
  getGramaNiladariDivisions: (district: string, ds: string) =>
    api.get(`/locations/gn-divisions/${encodeURIComponent(district)}/${encodeURIComponent(ds)}`),
}

export default api
