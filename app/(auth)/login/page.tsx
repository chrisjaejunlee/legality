'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Scale, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEmergency = searchParams.get('emergency') === 'true'
  const { addToast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        addToast('error', result.error)
      } else {
        addToast('success', 'Welcome back!')
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      addToast('error', 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side containing the form */}
      <div className="w-full md:w-1/2 flex flex-col bg-white">
        <header className="p-6 md:p-8 shrink-0">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">Legality</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 md:p-8">
          <div className="w-full max-w-md">
            <div>
              <div className="text-center md:text-left mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">
                  {isEmergency ? 'Emergency Access' : 'Welcome Back'}
                </h1>
                <p className="text-slate-600">
                  {isEmergency
                    ? 'Get one query without creating an account'
                    : 'Sign in to continue to your dashboard'}
                </p>
              </div>

              {isEmergency && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Emergency Mode:</strong> You can submit one legal query without logging in. 
                    After that, you'll need to create an account to track your case history.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                  required
                />

                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-slate-300" />
                    <span className="text-slate-600">Remember me</span>
                  </label>
                  <Link href="#" className="text-secondary font-medium hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
                  Sign In
                </Button>
              </form>

              {isEmergency ? (
                <div className="mt-6 text-center md:text-left">
                  <p className="text-sm text-slate-600">
                    Want to track your cases?{' '}
                    <Link href="/signup" className="text-secondary font-medium hover:underline">
                      Create an account
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="mt-6 text-center md:text-left">
                  <p className="text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-secondary font-medium hover:underline">
                      Sign up
                    </Link>
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-sm text-slate-700 text-center">
                <strong>Demo Account:</strong> demo@legality.app / password123
              </p>
            </div>

            <p className="text-xs text-slate-500 text-center md:text-left mt-8">
              By signing in, you agree to our Terms of Service and acknowledge our{' '}
              <Link href="#" className="text-secondary hover:underline">
                Disclaimer
              </Link>
              .
            </p>
          </div>
        </main>
      </div>

      {/* Right side containing the full-bleed image to fill negative space */}
      <div className="hidden md:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden border-l border-slate-200">
        <div className="absolute inset-0">
          {/* We use standard img for direct object-cover ease */}
          <img 
             src="/images/library.png" 
             alt="Classic Legal Library" 
             className="w-full h-full object-cover opacity-60 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
        </div>

        <div className="relative z-10 p-12 text-center max-w-lg">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">A Foundation of Trust</h2>
          <p className="text-slate-300 text-lg">
            Drawing upon decades of legal precedent to provide you with the most accurate, reliable, and instantaneous guidance when you need it most.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-background flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
