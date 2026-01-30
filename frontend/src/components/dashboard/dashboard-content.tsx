'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useI18n } from '@/contexts/i18n-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { farmAPI, seasonPlanAPI, paddyVarietyAPI, machineryAPI } from '@/lib/api'
import {
  Tractor,
  Leaf,
  Calendar,
  Plus,
  Bug,
  Wrench,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'

interface Stats {
  farms: number
  seasonPlans: number
  paddyVarieties: number
  activeSeasons: number
  machinery: number
  totalRequests: number
  pendingRequests: number
  completedServices: number
  activeRequests: number
}

interface Activity {
  icon: React.ReactNode
  text: string
  time: string
}

export function DashboardContent() {
  const { user } = useAuth()
  const { t } = useI18n()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats>({
    farms: 0,
    seasonPlans: 0,
    paddyVarieties: 0,
    activeSeasons: 0,
    machinery: 0,
    totalRequests: 0,
    pendingRequests: 0,
    completedServices: 0,
    activeRequests: 0,
  })
  const [activities, setActivities] = useState<Activity[]>([])

  const hasRole = (role: string) => {
    if (!user) return false
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.includes(role)
    }
    return user.role === role
  }

  const isFarmer =
    hasRole('farm_owner') || hasRole('farm_manager') || hasRole('worker')
  const isMachineryOperator = hasRole('machinery_operator')

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const apiCalls = [
        farmAPI.getFarms(),
        seasonPlanAPI.getSeasonPlans(),
        paddyVarietyAPI.getPaddyVarieties(),
      ]

      if (isMachineryOperator) {
        apiCalls.push(machineryAPI.getMyMachinery())
        apiCalls.push(machineryAPI.getMyRequests())
      }

      const results = await Promise.allSettled(apiCalls)

      const farms =
        results[0]?.status === 'fulfilled' ? results[0].value.data.data || [] : []
      const seasonPlans =
        results[1]?.status === 'fulfilled' ? results[1].value.data.data || [] : []
      const paddyVarieties =
        results[2]?.status === 'fulfilled' ? results[2].value.data.data || [] : []

      let machinery: unknown[] = []
      let requests: { status: string }[] = []
      if (isMachineryOperator) {
        machinery =
          results[3]?.status === 'fulfilled' ? results[3].value.data.data || [] : []
        requests =
          results[4]?.status === 'fulfilled' ? results[4].value.data.data || [] : []
      }

      const activeSeasons = seasonPlans.filter(
        (plan: { status: string }) => plan.status === 'active'
      )

      const pendingRequests = requests.filter(
        (r) => r.status === 'Pending'
      ).length
      const completedServices = requests.filter(
        (r) => r.status === 'Completed'
      ).length
      const activeRequests = requests.filter((r) =>
        ['Accepted', 'In Progress'].includes(r.status)
      ).length

      setStats({
        farms: farms.length,
        seasonPlans: seasonPlans.length,
        paddyVarieties: paddyVarieties.length,
        activeSeasons: activeSeasons.length,
        machinery: machinery.length,
        totalRequests: requests.length,
        pendingRequests,
        completedServices,
        activeRequests,
      })

      const newActivities: Activity[] = []

      if (farms.length > 0) {
        newActivities.push({
          icon: <Tractor className="h-5 w-5 text-green-600" />,
          text: t('dashboard.farmsRegisteredActivity', { count: farms.length, plural: farms.length !== 1 ? 's' : '' }),
          time: 'Active',
        })
      }

      if (activeSeasons.length > 0) {
        newActivities.push({
          icon: <Leaf className="h-5 w-5 text-primary" />,
          text: t('dashboard.activeSeasonsActivity', { count: activeSeasons.length, plural: activeSeasons.length !== 1 ? 's' : '' }),
          time: 'Current Season',
        })
      }

      if (isMachineryOperator && machinery.length > 0) {
        newActivities.push({
          icon: <Wrench className="h-5 w-5 text-blue-600" />,
          text: `${machinery.length} machinery listing${machinery.length !== 1 ? 's' : ''}`,
          time: 'Active',
        })
      }

      if (isMachineryOperator && pendingRequests > 0) {
        newActivities.push({
          icon: <Clock className="h-5 w-5 text-yellow-600" />,
          text: `${pendingRequests} pending service request${pendingRequests !== 1 ? 's' : ''}`,
          time: 'Needs attention',
        })
      }

      // Add welcome message if no activities
      if (newActivities.length === 0) {
        newActivities.push(
          {
            icon: <Leaf className="h-5 w-5 text-primary" />,
            text: t('dashboard.welcomeMessage'),
            time: t('dashboard.gettingStarted'),
          },
          {
            icon: <Plus className="h-5 w-5 text-muted-foreground" />,
            text: 'Start by creating a farm or listing your machinery',
            time: 'Get Started',
          }
        )
      }

      setActivities(newActivities)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load dashboard data. Some features may be limited.')
      
      // Set default values on error
      setStats({
        farms: 0,
        seasonPlans: 0,
        paddyVarieties: 0,
        activeSeasons: 0,
        machinery: 0,
        totalRequests: 0,
        pendingRequests: 0,
        completedServices: 0,
        activeRequests: 0,
      })
      setActivities([
        {
          icon: <Leaf className="h-5 w-5 text-primary" />,
          text: t('dashboard.welcomeMessage'),
          time: t('dashboard.gettingStarted'),
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [isMachineryOperator, t])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const handleCardClick = (cardType: string) => {
    switch (cardType) {
      case 'farms':
        router.push('/farms')
        break
      case 'seasonPlans':
        router.push('/paddy/season-plans')
        break
      case 'activeSeasons':
        router.push('/paddy/season-plans?status=active')
        break
      case 'paddyVarieties':
        router.push('/paddy/varieties')
        break
      case 'machinery':
        router.push('/machinery/my-machinery')
        break
      case 'pendingRequests':
      case 'activeRequests':
      case 'completedServices':
        router.push('/machinery/my-requests')
        break
      default:
        break
    }
  }

  const userName = user?.profile
    ? `${user.profile.firstName} ${user.profile.lastName}`
    : 'User'

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold">{t('auth.welcome')}, {userName}!</h1>
        <p className="text-muted-foreground">
          {t('dashboard.paddyCultivationOverview')}
        </p>
      </div>

      {/* Phase Notification */}
      {/* <Alert variant="info">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>🌾 Phase 1 Implementation - Paddy Cultivation Focus</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            This system is currently optimized for <strong>Paddy Cultivation</strong> management. 
            We&apos;re building features progressively to ensure the best user experience.
          </p>
          <p className="mb-2">
            <strong>Currently Available:</strong>
          </p>
          <ul className="list-disc list-inside mb-2 ml-2">
            <li>Farm Management</li>
            <li>Paddy Variety Database</li>
            <li>Season Planning</li>
            <li>Fertilizer Recommendations</li>
            <li>Growth Stage Tracking</li>
            <li>Disease Detection</li>
            <li>Machinery Management</li>
          </ul>
          <p>
            <strong>Coming Soon:</strong> Other Crops, Livestock Management, Inventory Tracking, Advanced Reports
          </p>
        </AlertDescription>
      </Alert> */}

      {/* Error Alert */}
      {error && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isFarmer && (
          <>
            <Card 
              className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
              onClick={() => handleCardClick('farms')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t('dashboard.totalFarms')}</CardTitle>
                <Tractor className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.farms}</div>
                <p className="text-xs text-muted-foreground">Registered farms</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
              onClick={() => handleCardClick('activeSeasons')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t('dashboard.activeSeasons')}</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeSeasons}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
              onClick={() => handleCardClick('seasonPlans')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t('dashboard.activeSeasonPlans')}</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.seasonPlans}</div>
                <p className="text-xs text-muted-foreground">Total plans</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
              onClick={() => handleCardClick('paddyVarieties')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t('dashboard.paddyVarieties')}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.paddyVarieties}</div>
                <p className="text-xs text-muted-foreground">Available varieties</p>
              </CardContent>
            </Card>
          </>
        )}

        {isMachineryOperator && (
          <>
            <Card 
              className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
              onClick={() => handleCardClick('machinery')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">My Machinery</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.machinery}</div>
                <p className="text-xs text-muted-foreground">Your listings</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
              onClick={() => handleCardClick('pendingRequests')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingRequests}</div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
              onClick={() => handleCardClick('activeRequests')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeRequests}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
              onClick={() => handleCardClick('completedServices')}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedServices}</div>
                <p className="text-xs text-muted-foreground">Successfully done</p>
              </CardContent>
            </Card>
          </>
        )}

        {!isFarmer && !isMachineryOperator && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{t('dashboard.totalFarms')}</CardTitle>
                <Tractor className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Get started</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">My Machinery</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">List machinery</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Quick Actions and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.noRecentActivity')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isFarmer && (
              <>
                <Link href="/farms/create" className="block">
                  <Button variant="default" className="w-full justify-start gap-2">
                    <Tractor className="h-4 w-4" />
                    {t('dashboard.createFarm')}
                  </Button>
                </Link>
                <Link href="/paddy/season-plans/create" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {t('dashboard.planPaddySeason')}
                  </Button>
                </Link>
                <Link href="/paddy/disease-detection" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50">
                    <Bug className="h-4 w-4" />
                    Rice Plant Diseases
                  </Button>
                </Link>
              </>
            )}

            {isMachineryOperator && (
              <>
                <Link href="/machinery/my-machinery" className="block">
                  <Button 
                    variant={isFarmer ? "outline" : "default"} 
                    className="w-full justify-start gap-2"
                  >
                    <Wrench className="h-4 w-4" />
                    Manage Machinery
                  </Button>
                </Link>
                <Link href="/machinery/my-requests" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Clock className="h-4 w-4" />
                    View Service Requests
                  </Button>
                </Link>
              </>
            )}

            {!isFarmer && !isMachineryOperator && (
              <Alert variant="info">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Welcome! Start by creating a farm or listing your machinery.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
