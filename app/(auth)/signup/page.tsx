'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Scale, Mail, Lock, Eye, EyeOff, AlertCircle, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'

export default function SignupPage() {
  const router = useRouter()
  const { addToast } = useToast()

  const [step, setStep] = useState<'form' | 'disclaimer'>('form')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationId: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)

  const passwordRequirements = [
    { met: formData.password.length >= 8, text: 'At least 8 characters' },
    { met: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
    { met: /[0-9]/.test(formData.password), text: 'One number' },
    { met: /[^A-Za-z0-9]/.test(formData.password), text: 'One special character' },
  ]

  const isPasswordValid = passwordRequirements.every((req) => req.met)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return false
    }
    if (!isPasswordValid) {
      setError('Please meet all password requirements')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleContinue = () => {
    if (validateForm()) {
      setStep('disclaimer')
    }
  }

  const handleSignup = async () => {
    if (!disclaimerAccepted) {
      setError('You must accept the disclaimer to continue')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name || null,
          disclaimerAccepted: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'An error occurred')
        addToast('error', data.error || 'Signup failed')
        return
      }

      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.error) {
        router.push('/login')
      } else {
        addToast('success', 'Account created successfully!')
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
                <h1 className="text-3xl font-bold text-primary mb-2">Create Your Account</h1>
                <p className="text-slate-600">
                  {step === 'form'
                    ? 'Start your journey to legal clarity'
                    : 'Please read our important disclaimer'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {step === 'form' && (
                <div className="space-y-6">
                  <Input
                    type="text"
                    label="Full Name (optional)"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />

                  <Input
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    icon={<Mail className="w-4 h-4" />}
                    required
                  />

                  <div>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
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
                    
                    <div className="mt-3 space-y-2">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              req.met ? 'bg-accent-100' : 'bg-slate-100'
                            }`}
                          >
                            {req.met ? (
                              <Check className="w-3 h-3 text-accent-600" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-slate-300" />
                            )}
                          </div>
                          <span className={req.met ? 'text-accent-600' : 'text-slate-500'}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Input
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                    required
                    error={
                      formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'Passwords do not match'
                        : undefined
                    }
                  />

                  <Input
                    type="text"
                    label="ID Verification (last 4 digits)"
                    placeholder="****"
                    value={formData.verificationId}
                    onChange={(e) => handleChange('verificationId', e.target.value)}
                    maxLength={4}
                  />

                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleContinue}
                    disabled={!formData.email || !formData.password || formData.password !== formData.confirmPassword || !isPasswordValid}
                  >
                    Continue
                  </Button>
                </div>
              )}

              {step === 'disclaimer' && (
                <div className="space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Important Legal Notice</p>
                        <p className="text-sm text-amber-700 mt-1">
                          Please read this disclaimer carefully before creating your account.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-3 text-sm text-slate-600">
                    <p className="font-medium text-slate-800">Legality Does NOT Provide Legal Advice</p>
                    <p>
                      <strong>Legality</strong> is an educational and informational tool only. The information
                      provided through this application:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Is generated by artificial intelligence and should not be considered legal counsel</li>
                      <li>Does not create an attorney-client relationship</li>
                      <li>May not be accurate, complete, or applicable to your specific situation</li>
                      <li>Should never replace consultation with a licensed attorney</li>
                    </ul>
                    <p>
                      By using this service, you acknowledge that you understand the information provided is for
                      educational purposes only and is not a substitute for professional legal advice.
                    </p>
                    <p>
                      Laws vary significantly by jurisdiction, and legal matters are highly fact-specific. What
                      may seem similar to your situation could have very different legal implications.
                    </p>
                  </div>

                  <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={disclaimerAccepted}
                      onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-600">
                      I have read and understood this disclaimer. I acknowledge that Legality does not
                      provide legal advice and that I should consult with a licensed attorney for any legal
                      matter.
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1"
                      onClick={() => setStep('form')}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      className="flex-1"
                      onClick={handleSignup}
                      isLoading={isLoading}
                      disabled={!disclaimerAccepted}
                    >
                      Create Account
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-6 text-center md:text-left">
                <p className="text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-secondary font-medium hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center md:text-left mt-8">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </main>
      </div>

      <div className="hidden md:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden border-l border-slate-200">
        <div className="absolute inset-0">
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
