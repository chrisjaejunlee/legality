'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User, CreditCard, Shield, Bell, Check, Crown } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DisclaimerBanner } from '@/components/ui/disclaimer'
import { useToast } from '@/components/ui/toast'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addToast } = useToast()

  const [profile, setProfile] = useState({
    name: '',
    email: '',
  })
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      setProfile({
        name: (session.user as any)?.name || '',
        email: session.user?.email || '',
      })
    }
  }, [session])

  const handleUpdateProfile = async () => {
    setIsUpdating(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    addToast('success', 'Profile updated successfully')
    setIsUpdating(false)
  }

  if (status === 'loading') {
    return (
      <>
        <DisclaimerBanner />
        <Sidebar>
          <div className="max-w-2xl mx-auto">
            <div className="h-8 w-32 bg-slate-200 rounded animate-pulse mb-8" />
            <div className="h-64 bg-slate-200 rounded animate-pulse" />
          </div>
        </Sidebar>
      </>
    )
  }

  if (!session) {
    return null
  }

  const isPremium = (session.user as any)?.subscription === 'PREMIUM'

  return (
    <>
      <DisclaimerBanner />
      <Sidebar>
        <div className="max-w-2xl mx-auto pb-20 lg:pb-0">
          <h1 className="text-2xl font-bold text-primary mb-8">Settings</h1>

          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Profile</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Full Name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled
                />
                <Button onClick={handleUpdateProfile} isLoading={isUpdating}>
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Subscription</h2>
                {isPremium && <Badge variant="info">Premium</Badge>}
              </CardHeader>
              <CardContent>
                {isPremium ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-secondary-50 to-accent-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg">
                        <Crown className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">Premium Plan Active</p>
                        <p className="text-sm text-slate-500">$19.99/month</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium text-slate-800">Your Premium Benefits</h3>
                      <ul className="space-y-2">
                        {[
                          'Faster AI response times',
                          'Cross-region case access',
                          'Premium lawyer prioritization',
                          'Unlimited saved cases',
                          'Priority emergency mode',
                          'Export case summaries',
                        ].map((benefit, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                            <Check className="w-4 h-4 text-accent-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button variant="outline">Manage Subscription</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-slate-600 mb-2">Current Plan: <strong>Free</strong></p>
                      <p className="text-sm text-slate-500">
                        Limited to county-level cases, standard response times, and basic lawyer matching.
                      </p>
                    </div>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                      <Crown className="w-8 h-8 text-secondary mx-auto mb-2" />
                      <h3 className="font-medium text-slate-800 mb-1">Upgrade to Premium</h3>
                      <p className="text-sm text-slate-500 mb-4">
                        Get faster responses, cross-region access, and priority lawyer matching.
                      </p>
                      <div className="text-2xl font-bold text-primary mb-1">$19.99/month</div>
                      <p className="text-sm text-slate-500 mb-4">Cancel anytime</p>
                      <Button>Upgrade Now</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Privacy & Security</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-slate-800">Disclaimer Acknowledgment</p>
                    <p className="text-sm text-slate-500">You've accepted our legal disclaimer</p>
                  </div>
                  <Badge variant="success">Accepted</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-slate-800">Password</p>
                    <p className="text-sm text-slate-500">Last changed 30 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Notifications</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-slate-800">Email Notifications</p>
                    <p className="text-sm text-slate-500">Receive updates about your queries</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-slate-800">Lawyer Connection Updates</p>
                    <p className="text-sm text-slate-500">When lawyers respond to your requests</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-slate-800">Marketing Emails</p>
                    <p className="text-sm text-slate-500">Tips and legal news updates</p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </label>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader className="flex flex-row items-center gap-2">
                <h2 className="font-semibold text-red-600">Danger Zone</h2>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">Delete Account</p>
                    <p className="text-sm text-slate-500">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="danger" size="sm">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Sidebar>
    </>
  )
}
