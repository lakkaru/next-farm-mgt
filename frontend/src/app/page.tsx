import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Tractor, 
  TrendingUp, 
  Cloud, 
  BarChart3,
  UserPlus,
  Building2,
  Calendar,
  Leaf,
  LineChart,
  ArrowRight
} from 'lucide-react'
import { LanguageSwitcher } from '@/components/language-switcher'

const steps = [
  {
    icon: UserPlus,
    titleKey: 'Register Account',
    descriptionKey: 'Create your free account to get started with farm management.',
  },
  {
    icon: Building2,
    titleKey: 'Add Your Farm',
    descriptionKey: 'Register your farm details including location and size.',
  },
  {
    icon: Calendar,
    titleKey: 'Plan Seasons',
    descriptionKey: 'Create cultivation plans with schedules and targets.',
  },
  {
    icon: Leaf,
    titleKey: 'Select Varieties',
    descriptionKey: 'Choose paddy varieties suited for your conditions.',
  },
  {
    icon: LineChart,
    titleKey: 'Track Progress',
    descriptionKey: 'Monitor growth stages and manage your harvest.',
  },
]

const features = [
  {
    icon: Tractor,
    titleKey: 'Farm Management',
    descriptionKey: 'Manage multiple farms, track operations, and coordinate activities.',
  },
  {
    icon: Cloud,
    titleKey: 'Weather Integration',
    descriptionKey: 'Get weather forecasts and plan your farming activities accordingly.',
  },
  {
    icon: TrendingUp,
    titleKey: 'Yield Tracking',
    descriptionKey: 'Track your harvest yields and analyze production trends.',
  },
  {
    icon: BarChart3,
    titleKey: 'Analytics',
    descriptionKey: 'Get insights from your farming data with detailed reports.',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tractor className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">FarmMS</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/login?tab=register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Modern Farm Management
          <span className="text-primary block">Made Simple</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          A comprehensive system designed for Sri Lankan farmers to manage crops, 
          track seasons, detect diseases, and optimize yields.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login?tab=register">
            <Button size="lg" className="gap-2">
              Start Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="text-center relative">
              <CardHeader>
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{step.titleKey}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{step.descriptionKey}</CardDescription>
              </CardContent>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-muted-foreground/30" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 bg-muted/30 rounded-3xl">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardHeader>
                <div className="mb-2 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.titleKey}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.descriptionKey}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Join thousands of farmers who are already using Farm Management System 
          to improve their agricultural practices.
        </p>
        <Link href="/login?tab=register">
          <Button size="lg" className="gap-2">
            Create Free Account <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Farm Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
