'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Plus,
    Edit,
    Trash2,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Database,
    FolderTree,
    FileText,
    Key,
} from 'lucide-react'
import { DiseaseCategory, DiseaseInfo } from '@/sanity/lib/queries'

export function SanityAdminContent() {
    const [sanityToken, setSanityToken] = useState('')
    const [tokenSaved, setTokenSaved] = useState(false)
    const [categories, setCategories] = useState<DiseaseCategory[]>([])
    const [diseases, setDiseases] = useState<DiseaseInfo[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Category form state
    const [categoryDialog, setCategoryDialog] = useState(false)
    const [editingCategory, setEditingCategory] = useState<DiseaseCategory | null>(null)
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        slug: '',
        description: '',
        icon: 'Leaf',
        order: 0,
        isActive: true,
    })

    // Disease form state
    const [diseaseDialog, setDiseaseDialog] = useState(false)
    const [editingDisease, setEditingDisease] = useState<DiseaseInfo | null>(null)
    const [diseaseForm, setDiseaseForm] = useState({
        name: '',
        scientificName: '',
        categoryId: '',
        severity: 'medium' as 'high' | 'medium' | 'low',
        description: '',
        symptoms: [''],
        visualSigns: [''],
        causes: [''],
        treatment: [''],
        prevention: [''],
        timing: '',
        criticalStages: '',
        commonRegions: [''],
        seasonality: '',
        economicImpact: '',
        expertNotes: '',
        order: 0,
        isActive: true,
        mainImage: null as File | null,
        mainImagePreview: '',
        additionalImages: [] as File[],
        additionalImagesPreview: [] as string[],
    })

    // Load token from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('sanity-token')
        if (saved) {
            setSanityToken(saved)
            setTokenSaved(true)
        }
    }, [])

    // Fetch data
    useEffect(() => {
        if (tokenSaved) {
            fetchData()
        }
    }, [tokenSaved])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [categoriesRes, diseasesRes] = await Promise.all([
                fetch('/api/sanity/categories'),
                fetch('/api/sanity/diseases'),
            ])
            const categoriesData = await categoriesRes.json()
            const diseasesData = await diseasesRes.json()
            setCategories(categoriesData)
            setDiseases(diseasesData)
            
        } catch (_err) { // eslint-disable-line @typescript-eslint/no-unused-vars
            setError('Failed to fetch data')
        } finally {
            setLoading(false)
        }
    }

    const saveToken = () => {
        if (!sanityToken.trim()) {
            setError('Please enter a valid token')
            return
        }
        localStorage.setItem('sanity-token', sanityToken)
        setTokenSaved(true)
        setSuccess('Token saved successfully!')
        setTimeout(() => setSuccess(null), 3000)
    }

    const clearToken = () => {
        localStorage.removeItem('sanity-token')
        setSanityToken('')
        setTokenSaved(false)
    }

    // Category CRUD operations
    const handleCreateCategory = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/sanity/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-sanity-token': sanityToken,
                },
                body: JSON.stringify(categoryForm),
            })

            if (!response.ok) throw new Error('Failed to create category')

            setSuccess('Category created successfully!')
            setCategoryDialog(false)
            resetCategoryForm()
            fetchData()
        } catch (_err) { // eslint-disable-line @typescript-eslint/no-unused-vars
            setError('Failed to create category')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateCategory = async () => {
        if (!editingCategory) return

        try {
            setLoading(true)
            const response = await fetch(`/api/sanity/categories/${editingCategory._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-sanity-token': sanityToken,
                },
                body: JSON.stringify(categoryForm),
            })

            if (!response.ok) throw new Error('Failed to update category')

            setSuccess('Category updated successfully!')
            setCategoryDialog(false)
            setEditingCategory(null)
            resetCategoryForm()
            fetchData()
        } catch (_err) { // eslint-disable-line @typescript-eslint/no-unused-vars
            setError('Failed to update category')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return

        try {
            setLoading(true)
            const response = await fetch(`/api/sanity/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-sanity-token': sanityToken,
                },
            })

            if (!response.ok) throw new Error('Failed to delete category')

            setSuccess('Category deleted successfully!')
            fetchData()
        } catch (_err) { // eslint-disable-line @typescript-eslint/no-unused-vars
            setError('Failed to delete category')
        } finally {
            setLoading(false)
        }
    }

    const resetCategoryForm = () => {
        setCategoryForm({
            name: '',
            slug: '',
            description: '',
            icon: 'Leaf',
            order: 0,
            isActive: true,
        })
    }

    const openEditCategory = (category: DiseaseCategory) => {
        setEditingCategory(category)
        setCategoryForm({
            name: category.name,
            slug: category.slug.current,
            description: category.description || '',
            icon: category.icon || 'Leaf',
            order: category.order,
            isActive: category.isActive,
        })
        setCategoryDialog(true)
    }

    // Image upload handler
    const uploadImageToSanity = async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch('/api/sanity/upload', {
                method: 'POST',
                headers: {
                    'x-sanity-token': sanityToken,
                },
                body: formData,
            })

            if (!response.ok) throw new Error('Failed to upload image')

            const data = await response.json()
            return data.assetId || data.asset._id
        } catch (err) {
            console.error('Image upload error:', err)
            throw new Error('Failed to upload image to Sanity')
        }
    }

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const preview = URL.createObjectURL(file)
            setDiseaseForm({
                ...diseaseForm,
                mainImage: file,
                mainImagePreview: preview,
            })
        }
    }

    const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const newFiles = Array.from(files)
            const newPreviews = newFiles.map(file => URL.createObjectURL(file))
            setDiseaseForm({
                ...diseaseForm,
                additionalImages: [...diseaseForm.additionalImages, ...newFiles],
                additionalImagesPreview: [...diseaseForm.additionalImagesPreview, ...newPreviews],
            })
        }
    }

    // Disease CRUD operations
    const handleCreateDisease = async () => {
        try {
            setLoading(true)

            // Upload images first
            let mainImageAssetId: string | undefined
            let additionalImageAssetIds: string[] = []

            if (diseaseForm.mainImage) {
                mainImageAssetId = await uploadImageToSanity(diseaseForm.mainImage)
            }

            if (diseaseForm.additionalImages.length > 0) {
                additionalImageAssetIds = await Promise.all(
                    diseaseForm.additionalImages.map(img => uploadImageToSanity(img))
                )
            }

            const response = await fetch('/api/sanity/diseases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-sanity-token': sanityToken,
                },
                body: JSON.stringify({
                    ...diseaseForm,
                    mainImageAssetId,
                    additionalImageAssetIds,
                    symptoms: diseaseForm.symptoms.filter(s => s.trim()),
                    visualSigns: diseaseForm.visualSigns.filter(s => s.trim()),
                    causes: diseaseForm.causes.filter(s => s.trim()),
                    treatment: diseaseForm.treatment.filter(s => s.trim()),
                    prevention: diseaseForm.prevention.filter(s => s.trim()),
                    commonRegions: diseaseForm.commonRegions.filter(s => s.trim()),
                }),
            })

            if (!response.ok) throw new Error('Failed to create disease')

            setSuccess('Disease created successfully!')
            setDiseaseDialog(false)
            resetDiseaseForm()
            fetchData()
        } catch (_err) { // eslint-disable-line @typescript-eslint/no-unused-vars
            setError('Failed to create disease')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateDisease = async () => {
        if (!editingDisease) return

        try {
            setLoading(true)

            // Upload new images if any
            let mainImageAssetId: string | undefined
            let additionalImageAssetIds: string[] = []

            if (diseaseForm.mainImage) {
                mainImageAssetId = await uploadImageToSanity(diseaseForm.mainImage)
            }

            if (diseaseForm.additionalImages.length > 0) {
                additionalImageAssetIds = await Promise.all(
                    diseaseForm.additionalImages.map(img => uploadImageToSanity(img))
                )
            }

            const response = await fetch(`/api/sanity/diseases/${editingDisease._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-sanity-token': sanityToken,
                },
                body: JSON.stringify({
                    ...diseaseForm,
                    mainImageAssetId,
                    additionalImageAssetIds,
                    symptoms: diseaseForm.symptoms.filter(s => s.trim()),
                    visualSigns: diseaseForm.visualSigns.filter(s => s.trim()),
                    causes: diseaseForm.causes.filter(s => s.trim()),
                    treatment: diseaseForm.treatment.filter(s => s.trim()),
                    prevention: diseaseForm.prevention.filter(s => s.trim()),
                    commonRegions: diseaseForm.commonRegions.filter(s => s.trim()),
                }),
            })

            if (!response.ok) throw new Error('Failed to update disease')

            setSuccess('Disease updated successfully!')
            setDiseaseDialog(false)
            setEditingDisease(null)
            resetDiseaseForm()
            fetchData()
        } catch (_err) { // eslint-disable-line @typescript-eslint/no-unused-vars
            setError('Failed to update disease')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteDisease = async (id: string) => {
        if (!confirm('Are you sure you want to delete this disease?')) return

        try {
            setLoading(true)
            const response = await fetch(`/api/sanity/diseases/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-sanity-token': sanityToken,
                },
            })

            if (!response.ok) throw new Error('Failed to delete disease')

            setSuccess('Disease deleted successfully!')
            fetchData()
        } catch (_err) { // eslint-disable-line @typescript-eslint/no-unused-vars
            setError('Failed to delete disease')
        } finally {
            setLoading(false)
        }
    }

    const resetDiseaseForm = () => {
        setDiseaseForm({
            name: '',
            scientificName: '',
            categoryId: '',
            severity: 'medium',
            description: '',
            symptoms: [''],
            visualSigns: [''],
            causes: [''],
            treatment: [''],
            prevention: [''],
            timing: '',
            criticalStages: '',
            commonRegions: [''],
            seasonality: '',
            economicImpact: '',
            expertNotes: '',
            order: 0,
            isActive: true,
            mainImage: null,
            mainImagePreview: '',
            additionalImages: [],
            additionalImagesPreview: [],
        })
    }

    const openEditDisease = (disease: DiseaseInfo) => {
        setEditingDisease(disease)
        setDiseaseForm({
            name: disease.name,
            scientificName: disease.scientificName || '',
            categoryId: disease.category._ref,
            severity: disease.severity,
            description: disease.description,
            symptoms: disease.symptoms.length > 0 ? disease.symptoms : [''],
            visualSigns: disease.visualSigns && disease.visualSigns.length > 0 ? disease.visualSigns : [''],
            causes: disease.causes && disease.causes.length > 0 ? disease.causes : [''],
            treatment: disease.treatment.length > 0 ? disease.treatment : [''],
            prevention: disease.prevention && disease.prevention.length > 0 ? disease.prevention : [''],
            timing: disease.timing || '',
            criticalStages: disease.criticalStages || '',
            commonRegions: disease.commonRegions && disease.commonRegions.length > 0 ? disease.commonRegions : [''],
            seasonality: disease.seasonality || '',
            economicImpact: disease.economicImpact || '',
            expertNotes: disease.expertNotes || '',
            order: disease.order,
            isActive: disease.isActive,
            mainImage: null,
            mainImagePreview: disease.mainImage?.asset?.url || '',
            additionalImages: [],
            additionalImagesPreview: disease.additionalImages?.map(img => img.asset?.url || '') || [],
        })
        setDiseaseDialog(true)
    }

    // Helper to add/remove array items
    const updateArrayField = (
        field: keyof typeof diseaseForm,
        index: number,
        value: string
    ) => {
        const arr = diseaseForm[field] as string[]
        const newArr = [...arr]
        newArr[index] = value
        setDiseaseForm({ ...diseaseForm, [field]: newArr })
    }

    const addArrayItem = (field: keyof typeof diseaseForm) => {
        const arr = diseaseForm[field] as string[]
        setDiseaseForm({ ...diseaseForm, [field]: [...arr, ''] })
    }

    const removeArrayItem = (field: keyof typeof diseaseForm, index: number) => {
        const arr = diseaseForm[field] as string[]
        setDiseaseForm({ ...diseaseForm, [field]: arr.filter((_, i) => i !== index) })
    }

    if (!tokenSaved) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5" />
                            Sanity API Token Required
                        </CardTitle>
                        <CardDescription>
                            Enter your Sanity API token with write permissions to manage documents
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                <strong>How to get your token:</strong>
                                <ol className="list-decimal ml-4 mt-2 space-y-1">
                                    <li>Go to <a href="https://sanity.io/manage" target="_blank" rel="noopener noreferrer" className="text-primary underline">sanity.io/manage</a></li>
                                    <li>Select your project</li>
                                    <li>Go to &quot;API&quot; → &quot;Tokens&quot;</li>
                                    <li>Create a new token with &quot;Editor&quot; permissions</li>
                                    <li>Copy and paste it below</li>
                                </ol>
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                            <Label htmlFor="token">Sanity API Token</Label>
                            <Input
                                id="token"
                                type="password"
                                placeholder="sk..."
                                value={sanityToken}
                                onChange={(e) => setSanityToken(e.target.value)}
                            />
                        </div>

                        <Button onClick={saveToken} className="w-full">
                            Save Token
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Database className="h-8 w-8" />
                        Sanity Content Manager
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage disease categories and information directly from your frontend
                    </p>
                </div>
                <Button variant="outline" onClick={clearToken}>
                    Change Token
                </Button>
            </div>

            {/* Alerts */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {success && (
                <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            {/* Main Content */}
            <Tabs defaultValue="diseases" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="diseases" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Diseases ({diseases.length})
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="gap-2">
                        <FolderTree className="h-4 w-4" />
                        Categories ({categories.length})
                    </TabsTrigger>
                </TabsList>

                {/* Diseases Tab */}
                <TabsContent value="diseases" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Disease Information</h2>
                        <Button
                            onClick={() => {
                                setEditingDisease(null)
                                resetDiseaseForm()
                                setDiseaseDialog(true)
                            }}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Disease
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {diseases.map((disease) => (
                                <Card key={disease._id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg">{disease.name}</CardTitle>
                                                {disease.scientificName && (
                                                    <p className="text-sm italic text-muted-foreground">
                                                        {disease.scientificName}
                                                    </p>
                                                )}
                                                <div className="flex gap-2 mt-2">
                                                    <Badge variant={disease.severity === 'high' ? 'destructive' : disease.severity === 'medium' ? 'secondary' : 'default'}>
                                                        {disease.severity}
                                                    </Badge>
                                                    <Badge variant="outline">{disease.category.name}</Badge>
                                                    <Badge variant={disease.isActive ? 'default' : 'secondary'}>
                                                        {disease.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openEditDisease(disease)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDeleteDisease(disease._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {disease.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Categories Tab */}
                <TabsContent value="categories" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Disease Categories</h2>
                        <Button
                            onClick={() => {
                                setEditingCategory(null)
                                resetCategoryForm()
                                setCategoryDialog(true)
                            }}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {categories.map((category) => (
                                <Card key={category._id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg">
                                                    {category.order}. {category.name}
                                                </CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    {category.slug.current}
                                                </p>
                                                <div className="flex gap-2 mt-2">
                                                    <Badge variant="outline">{category.icon || 'Leaf'}</Badge>
                                                    <Badge variant={category.isActive ? 'default' : 'secondary'}>
                                                        {category.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openEditCategory(category)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleDeleteCategory(category._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    {category.description && (
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">
                                                {category.description}
                                            </p>
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Category Dialog */}
            <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? 'Edit Category' : 'Create Category'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory ? 'Update category information' : 'Add a new disease category'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cat-name">Name *</Label>
                            <Input
                                id="cat-name"
                                value={categoryForm.name}
                                onChange={(e) => {
                                    setCategoryForm({ ...categoryForm, name: e.target.value })
                                    // Auto-generate slug
                                    if (!editingCategory) {
                                        setCategoryForm({
                                            ...categoryForm,
                                            name: e.target.value,
                                            slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                                        })
                                    }
                                }}
                                placeholder="e.g., Nutrition Deficiencies"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cat-slug">Slug *</Label>
                            <Input
                                id="cat-slug"
                                value={categoryForm.slug}
                                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                                placeholder="e.g., nutrition-deficiencies"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cat-desc">Description</Label>
                            <Textarea
                                id="cat-desc"
                                value={categoryForm.description}
                                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                placeholder="Brief description of this category"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cat-icon">Icon</Label>
                                <Select
                                    value={categoryForm.icon}
                                    onValueChange={(value) => setCategoryForm({ ...categoryForm, icon: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Leaf">Leaf</SelectItem>
                                        <SelectItem value="Bug">Bug</SelectItem>
                                        <SelectItem value="Droplets">Droplets</SelectItem>
                                        <SelectItem value="AlertCircle">AlertCircle</SelectItem>
                                        <SelectItem value="Shield">Shield</SelectItem>
                                        <SelectItem value="Zap">Zap</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cat-order">Order *</Label>
                                <Input
                                    id="cat-order"
                                    type="number"
                                    value={categoryForm.order}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="cat-active"
                                checked={categoryForm.isActive}
                                onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                                className="rounded"
                            />
                            <Label htmlFor="cat-active">Active (show on website)</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCategoryDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                            disabled={loading || !categoryForm.name || !categoryForm.slug}
                        >
                            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {editingCategory ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Disease Dialog - Simplified version, full implementation would be very long */}
            <Dialog open={diseaseDialog} onOpenChange={setDiseaseDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingDisease ? 'Edit Disease' : 'Create Disease'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingDisease ? 'Update disease information' : 'Add new disease information'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dis-name">Name *</Label>
                                <Input
                                    id="dis-name"
                                    value={diseaseForm.name}
                                    onChange={(e) => setDiseaseForm({ ...diseaseForm, name: e.target.value })}
                                    placeholder="e.g., Nitrogen Deficiency"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dis-scientific">Scientific Name</Label>
                                <Input
                                    id="dis-scientific"
                                    value={diseaseForm.scientificName}
                                    onChange={(e) => setDiseaseForm({ ...diseaseForm, scientificName: e.target.value })}
                                    placeholder="e.g., N"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dis-category">Category *</Label>
                                <Select
                                    value={diseaseForm.categoryId}
                                    onValueChange={(value) => setDiseaseForm({ ...diseaseForm, categoryId: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dis-severity">Severity *</Label>
                                <Select
                                    value={diseaseForm.severity}
                                    onValueChange={(value: 'high' | 'medium' | 'low') => setDiseaseForm({ ...diseaseForm, severity: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high">High Impact</SelectItem>
                                        <SelectItem value="medium">Medium Impact</SelectItem>
                                        <SelectItem value="low">Low Impact</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dis-desc">Description *</Label>
                            <Textarea
                                id="dis-desc"
                                value={diseaseForm.description}
                                onChange={(e) => setDiseaseForm({ ...diseaseForm, description: e.target.value })}
                                placeholder="Brief overview of the disease/deficiency"
                                rows={3}
                            />
                        </div>

                        {/* Main Image */}
                        <div className="space-y-3">
                            <Label htmlFor="dis-main-image">Main Reference Image *</Label>
                            <div className="flex flex-col gap-2">
                                <input
                                    id="dis-main-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMainImageChange}
                                    className="p-2 border rounded cursor-pointer"
                                />
                                {(diseaseForm.mainImagePreview || diseaseForm.mainImage) && (
                                    <div className="relative w-32 h-32 border rounded overflow-hidden bg-gray-100">
                                        <img
                                            src={diseaseForm.mainImagePreview}
                                            alt="Main preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDiseaseForm({
                                                    ...diseaseForm,
                                                    mainImage: null,
                                                    mainImagePreview: '',
                                                })
                                            }
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Images */}
                        <div className="space-y-3">
                            <Label>Additional Images</Label>
                            <div className="flex flex-col gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleAdditionalImagesChange}
                                    className="p-2 border rounded cursor-pointer"
                                />
                                {diseaseForm.additionalImagesPreview.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {diseaseForm.additionalImagesPreview.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="relative w-24 h-24 border rounded overflow-hidden bg-gray-100"
                                            >
                                                <img
                                                    src={preview}
                                                    alt={`Additional ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newPreviews = diseaseForm.additionalImagesPreview.filter(
                                                            (_, i) => i !== index
                                                        )
                                                        const newFiles = diseaseForm.additionalImages.filter(
                                                            (_, i) => i !== index
                                                        )
                                                        setDiseaseForm({
                                                            ...diseaseForm,
                                                            additionalImages: newFiles,
                                                            additionalImagesPreview: newPreviews,
                                                        })
                                                    }}
                                                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded text-xs hover:bg-red-600"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Symptoms */}
                        <div className="space-y-2">
                            <Label>Symptoms * (at least one)</Label>
                            {diseaseForm.symptoms.map((symptom, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={symptom}
                                        onChange={(e) => updateArrayField('symptoms', index, e.target.value)}
                                        placeholder="Enter symptom"
                                    />
                                    {diseaseForm.symptoms.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeArrayItem('symptoms', index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addArrayItem('symptoms')}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Symptom
                            </Button>
                        </div>

                        {/* Visual Signs */}
                        <div className="space-y-2">
                            <Label>Visual Signs</Label>
                            {diseaseForm.visualSigns.map((sign, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={sign}
                                        onChange={(e) => updateArrayField('visualSigns', index, e.target.value)}
                                        placeholder="Enter visual sign"
                                    />
                                    {diseaseForm.visualSigns.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeArrayItem('visualSigns', index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addArrayItem('visualSigns')}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Visual Sign
                            </Button>
                        </div>

                        {/* Common Causes */}
                        <div className="space-y-2">
                            <Label>Common Causes</Label>
                            {diseaseForm.causes.map((cause, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={cause}
                                        onChange={(e) => updateArrayField('causes', index, e.target.value)}
                                        placeholder="Enter cause"
                                    />
                                    {diseaseForm.causes.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeArrayItem('causes', index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addArrayItem('causes')}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Cause
                            </Button>
                        </div>

                        {/* Treatment */}
                        <div className="space-y-2">
                            <Label>Treatment * (at least one)</Label>
                            {diseaseForm.treatment.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={item}
                                        onChange={(e) => updateArrayField('treatment', index, e.target.value)}
                                        placeholder="Enter treatment step"
                                    />
                                    {diseaseForm.treatment.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeArrayItem('treatment', index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addArrayItem('treatment')}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Treatment Step
                            </Button>
                        </div>

                        {/* Prevention Measures */}
                        <div className="space-y-2">
                            <Label>Prevention Measures</Label>
                            {diseaseForm.prevention.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={item}
                                        onChange={(e) => updateArrayField('prevention', index, e.target.value)}
                                        placeholder="Enter prevention measure"
                                    />
                                    {diseaseForm.prevention.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeArrayItem('prevention', index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addArrayItem('prevention')}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Prevention Measure
                            </Button>
                        </div>

                        {/* Treatment Timing */}
                        <div className="space-y-2">
                            <Label htmlFor="dis-timing">Treatment Timing</Label>
                            <Input
                                id="dis-timing"
                                value={diseaseForm.timing}
                                onChange={(e) => setDiseaseForm({ ...diseaseForm, timing: e.target.value })}
                                placeholder="When to apply treatment"
                            />
                        </div>

                        {/* Critical Growth Stages */}
                        <div className="space-y-2">
                            <Label htmlFor="dis-critical">Critical Growth Stages</Label>
                            <Input
                                id="dis-critical"
                                value={diseaseForm.criticalStages}
                                onChange={(e) => setDiseaseForm({ ...diseaseForm, criticalStages: e.target.value })}
                                placeholder="Which growth stages are most vulnerable"
                            />
                        </div>

                        {/* Common Regions */}
                        <div className="space-y-2">
                            <Label>Common Regions</Label>
                            {diseaseForm.commonRegions.map((region, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={region}
                                        onChange={(e) => updateArrayField('commonRegions', index, e.target.value)}
                                        placeholder="Enter region"
                                    />
                                    {diseaseForm.commonRegions.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeArrayItem('commonRegions', index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addArrayItem('commonRegions')}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Region
                            </Button>
                        </div>

                        {/* Seasonality */}
                        <div className="space-y-2">
                            <Label htmlFor="dis-seasonality">Seasonality</Label>
                            <Input
                                id="dis-seasonality"
                                value={diseaseForm.seasonality}
                                onChange={(e) => setDiseaseForm({ ...diseaseForm, seasonality: e.target.value })}
                                placeholder="When this condition is most common"
                            />
                        </div>

                        {/* Economic Impact */}
                        <div className="space-y-2">
                            <Label htmlFor="dis-impact">Economic Impact</Label>
                            <Textarea
                                id="dis-impact"
                                value={diseaseForm.economicImpact}
                                onChange={(e) => setDiseaseForm({ ...diseaseForm, economicImpact: e.target.value })}
                                placeholder="Potential yield loss or economic impact"
                                rows={2}
                            />
                        </div>

                        {/* Expert Notes */}
                        <div className="space-y-2">
                            <Label htmlFor="dis-notes">Expert Notes</Label>
                            <Textarea
                                id="dis-notes"
                                value={diseaseForm.expertNotes}
                                onChange={(e) => setDiseaseForm({ ...diseaseForm, expertNotes: e.target.value })}
                                placeholder="Additional notes from agricultural experts"
                                rows={2}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dis-order">Display Order</Label>
                                <Input
                                    id="dis-order"
                                    type="number"
                                    value={diseaseForm.order}
                                    onChange={(e) => setDiseaseForm({ ...diseaseForm, order: parseInt(e.target.value) || 0 })}
                                />
                            </div>

                            <div className="flex items-center space-x-2 pt-8">
                                <input
                                    type="checkbox"
                                    id="dis-active"
                                    checked={diseaseForm.isActive}
                                    onChange={(e) => setDiseaseForm({ ...diseaseForm, isActive: e.target.checked })}
                                    className="rounded"
                                />
                                <Label htmlFor="dis-active">Active (show on website)</Label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDiseaseDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={editingDisease ? handleUpdateDisease : handleCreateDisease}
                            disabled={loading || !diseaseForm.name || !diseaseForm.categoryId || !diseaseForm.description}
                        >
                            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            {editingDisease ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
