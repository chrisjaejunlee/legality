'use client'

import { useState } from 'react'
import { Star, MapPin, Phone, Mail, ExternalLink, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import type { Lawyer } from '@/types'

interface LawyerCardProps {
  lawyer: Lawyer
  onConnect?: (lawyerId: string) => void
}

export function LawyerCard({ lawyer, onConnect }: LawyerCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const specialties = lawyer.specialties.split(',')

  const handleConnect = async () => {
    setIsConnecting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onConnect?.(lawyer.id)
    setIsConnecting(false)
    setShowModal(false)
  }

  return (
    <>
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-semibold">
              {lawyer.avatarUrl ? (
                <img
                  src={lawyer.avatarUrl}
                  alt={lawyer.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-primary truncate">{lawyer.name}</h3>
              <p className="text-sm text-slate-600 truncate">{lawyer.firm}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium ml-1">{lawyer.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-slate-500">({lawyer.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {specialties.map((specialty) => (
              <Badge key={specialty} variant="default" className="bg-primary-50 text-primary-700">
                {specialty.trim()}
              </Badge>
            ))}
          </div>

          <div className="space-y-2 mb-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{lawyer.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{lawyer.yearsExperience} years</span>
              <span>of experience</span>
            </div>
          </div>

          {lawyer.bio && (
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{lawyer.bio}</p>
          )}

          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => setShowModal(true)}
            >
              Connect
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={lawyer.name} size="md">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-semibold">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{lawyer.name}</h3>
              <p className="text-slate-600">{lawyer.firm}</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium">{lawyer.rating.toFixed(1)}</span>
                <span className="text-slate-500">({lawyer.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty) => (
              <Badge key={specialty} variant="default" className="bg-primary-50 text-primary-700">
                {specialty.trim()}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4" />
              <span>{lawyer.location}</span>
            </div>
            <div className="text-slate-600">
              <strong>{lawyer.yearsExperience}</strong> years experience
            </div>
          </div>

          {lawyer.bio && (
            <div>
              <h4 className="font-medium text-slate-800 mb-2">About</h4>
              <p className="text-sm text-slate-600">{lawyer.bio}</p>
            </div>
          )}

          <div className="border-t border-slate-200 pt-4">
            <h4 className="font-medium text-slate-800 mb-3">Contact Information</h4>
            <div className="space-y-2">
              {lawyer.phone && (
                <a
                  href={`tel:${lawyer.phone}`}
                  className="flex items-center gap-2 text-sm text-secondary hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  {lawyer.phone}
                </a>
              )}
              {lawyer.email && (
                <a
                  href={`mailto:${lawyer.email}`}
                  className="flex items-center gap-2 text-sm text-secondary hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  {lawyer.email}
                </a>
              )}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Connecting with a lawyer through Legality does not create an
              attorney-client relationship. This is an introduction service only.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="primary" className="flex-1" onClick={handleConnect} isLoading={isConnecting}>
              Connect with {lawyer.name.split(' ')[0]}
            </Button>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
