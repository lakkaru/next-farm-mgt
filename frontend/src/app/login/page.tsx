import { LoginForm } from '@/components/auth/login-form'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Tractor } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Farm Management System account',
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Tractor className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">FarmMS</span>
          </Link>
          <LanguageSwitcher />
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <LoginForm />
        </main>
      </div>
    </Suspense>
  )
}
