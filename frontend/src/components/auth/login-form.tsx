'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/hooks/use-auth'
import { Eye, EyeOff, Loader2, Phone, Lock, User, Mail } from 'lucide-react'

const loginSchema = Yup.object({
  phone: Yup.string()
    .matches(/^0\d{9}$/, 'Phone number must be 10 digits starting with 0')
    .required('Phone number is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

const registerSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.string()
    .matches(/^0\d{9}$/, 'Phone number must be 10 digits starting with 0')
    .required('Phone number is required'),
  email: Yup.string().email('Invalid email address'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string().required('Role is required'),
})

export function LoginForm() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login'
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { login, register, isLoading, error } = useAuth()

  const loginFormik = useFormik({
    initialValues: {
      phone: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      await login(values)
    },
  })

  const registerFormik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'farm_owner',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      await register({
        email: values.email || undefined,
        password: values.password,
        profile: {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          role: values.role,
        },
        roles: [values.role],
      })
    },
  })

  const formatPhone = (value: string) => {
    const numericOnly = value.replace(/\D/g, '')
    return numericOnly.slice(0, 10)
  }

  return (
    <Card className="w-full max-w-md">
      <Tabs defaultValue={defaultTab}>
        <CardHeader>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent>
          {/* Login Tab */}
          <TabsContent value="login">
            <CardTitle className="mb-2">Welcome back</CardTitle>
            <CardDescription className="mb-6">
              Enter your phone number to sign in to your account
            </CardDescription>

            <form onSubmit={loginFormik.handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-phone"
                    name="phone"
                    placeholder="0XXXXXXXXX"
                    className="pl-10"
                    value={loginFormik.values.phone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value)
                      loginFormik.setFieldValue('phone', formatted)
                    }}
                    onBlur={loginFormik.handleBlur}
                  />
                </div>
                {loginFormik.touched.phone && loginFormik.errors.phone && (
                  <p className="text-sm text-destructive">{loginFormik.errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    value={loginFormik.values.password}
                    onChange={loginFormik.handleChange}
                    onBlur={loginFormik.handleBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {loginFormik.touched.password && loginFormik.errors.password && (
                  <p className="text-sm text-destructive">{loginFormik.errors.password}</p>
                )}
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <CardTitle className="mb-2">Create an account</CardTitle>
            <CardDescription className="mb-6">
              Enter your details to get started
            </CardDescription>

            <form onSubmit={registerFormik.handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="First name"
                      className="pl-10"
                      value={registerFormik.values.firstName}
                      onChange={registerFormik.handleChange}
                      onBlur={registerFormik.handleBlur}
                    />
                  </div>
                  {registerFormik.touched.firstName && registerFormik.errors.firstName && (
                    <p className="text-sm text-destructive">{registerFormik.errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    value={registerFormik.values.lastName}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                  />
                  {registerFormik.touched.lastName && registerFormik.errors.lastName && (
                    <p className="text-sm text-destructive">{registerFormik.errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-phone"
                    name="phone"
                    placeholder="0XXXXXXXXX"
                    className="pl-10"
                    value={registerFormik.values.phone}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value)
                      registerFormik.setFieldValue('phone', formatted)
                    }}
                    onBlur={registerFormik.handleBlur}
                  />
                </div>
                {registerFormik.touched.phone && registerFormik.errors.phone && (
                  <p className="text-sm text-destructive">{registerFormik.errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={registerFormik.values.email}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                  />
                </div>
                {registerFormik.touched.email && registerFormik.errors.email && (
                  <p className="text-sm text-destructive">{registerFormik.errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={registerFormik.values.role}
                  onValueChange={(value) => registerFormik.setFieldValue('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farm_owner">Farm Owner</SelectItem>
                    <SelectItem value="farm_manager">Farm Manager</SelectItem>
                    <SelectItem value="worker">Worker</SelectItem>
                    <SelectItem value="machinery_operator">Machinery Operator</SelectItem>
                  </SelectContent>
                </Select>
                {registerFormik.touched.role && registerFormik.errors.role && (
                  <p className="text-sm text-destructive">{registerFormik.errors.role}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="pl-10 pr-10"
                    value={registerFormik.values.password}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {registerFormik.touched.password && registerFormik.errors.password && (
                  <p className="text-sm text-destructive">{registerFormik.errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                    value={registerFormik.values.confirmPassword}
                    onChange={registerFormik.handleChange}
                    onBlur={registerFormik.handleBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {registerFormik.touched.confirmPassword && registerFormik.errors.confirmPassword && (
                  <p className="text-sm text-destructive">{registerFormik.errors.confirmPassword}</p>
                )}
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  )
}
