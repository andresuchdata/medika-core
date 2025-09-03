'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Stethoscope, Plus, Mail, Phone, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { Shimmer } from '@/components/ui/shimmer'
import { useDoctors } from '@/lib/hooks/use-data-fetching'
import type { Doctor } from '@/lib/api'

export default function MobileDoctorsPage() {
  const { data, loading, error, refetch } = useDoctors()

  if (loading) {
    return (
      <div className="space-y-4 pb-20">
        {/* Page header skeleton */}
        <div className="text-center mb-6">
          <Shimmer width={192} height={32} className="rounded mx-auto mb-2" />
          <Shimmer width={256} height={16} className="rounded mx-auto" />
        </div>

        {/* Add new doctor button skeleton */}
        <div className="mb-6">
          <Shimmer width="100%" height={48} className="rounded" />
        </div>

        {/* Doctors list skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-4">
              <div className="space-y-3">
                {/* Doctor header skeleton */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Shimmer width={48} height={48} className="rounded-full" />
                    <div>
                      <Shimmer width={120} height={16} className="rounded" />
                      <Shimmer width={80} height={14} className="rounded" />
                    </div>
                  </div>
                  <Shimmer width={60} height={20} className="rounded" />
                </div>

                {/* Contact info skeleton */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Shimmer width={16} height={16} className="rounded" />
                    <Shimmer width={160} height={14} className="rounded" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shimmer width={16} height={16} className="rounded" />
                    <Shimmer width={120} height={14} className="rounded" />
                  </div>
                </div>

                {/* Availability skeleton */}
                <div className="flex items-center space-x-2">
                  <Shimmer width={16} height={16} className="rounded" />
                  <Shimmer width={140} height={14} className="rounded" />
                </div>

                {/* Actions skeleton */}
                <div className="flex gap-2 pt-2">
                  <Shimmer width="50%" height={32} className="rounded" />
                  <Shimmer width="50%" height={32} className="rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4 pb-20">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctors</h1>
          <p className="text-gray-600">Manage medical staff</p>
        </div>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-red-600 mb-4">Error loading doctors: {error}</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const doctors: Doctor[] = data?.data?.doctors || []

  return (
    <div className="space-y-4 pb-20">
      {/* Page header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctors</h1>
        <p className="text-gray-600">Manage medical staff</p>
      </div>

      {/* Add new doctor button */}
      <div className="mb-6">
        <Link href="/mobile/doctors/new">
          <Button className="w-full h-12 text-base">
            <Plus className="mr-2 h-5 w-5" />
            Add New Doctor
          </Button>
        </Link>
      </div>

      {/* Doctors list */}
      <div className="space-y-3">
        {doctors.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Stethoscope className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p className="text-gray-500 mb-2">No doctors found</p>
              <p className="text-sm text-gray-400">Add your first doctor to get started</p>
            </CardContent>
          </Card>
        ) : (
          doctors.map((doctor) => (
            <Card key={doctor.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Doctor header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      </div>
                    </div>
                    <Badge variant={doctor.status === 'active' ? 'default' : 'secondary'}>
                      {doctor.status === 'active' ? 'Active' : doctor.status === 'on-leave' ? 'On Leave' : 'Inactive'}
                    </Badge>
                  </div>

                  {/* Contact info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{doctor.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{doctor.phone}</span>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Next available: {doctor.nextAvailable || 'Not specified'}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
