'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Plus, Users, MapPin, Phone, Mail } from 'lucide-react'
import Link from 'next/link'
import { Shimmer } from '@/components/ui/shimmer'
import { useOrganizations } from '@/lib/hooks/use-data-fetching'
import type { Organization } from '@/lib/api'

export default function MobileOrganizationsPage() {
  const { data, loading, error, refetch } = useOrganizations()

  if (loading) {
    return (
      <div className="space-y-4 pb-20">
        {/* Page header skeleton */}
        <div className="text-center mb-6">
          <Shimmer width={256} height={32} className="rounded mx-auto mb-2" />
          <Shimmer width={320} height={16} className="rounded mx-auto" />
        </div>

        {/* Add new organization button skeleton */}
        <div className="mb-6">
          <Shimmer width="100%" height={48} className="rounded" />
        </div>

        {/* Organizations list skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-4">
              <div className="space-y-3">
                {/* Organization header skeleton */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Shimmer width={48} height={48} className="rounded-full" />
                    <div>
                      <Shimmer width={140} height={16} className="rounded" />
                      <Shimmer width={80} height={14} className="rounded" />
                    </div>
                  </div>
                  <Shimmer width={60} height={20} className="rounded" />
                </div>

                {/* Contact info skeleton */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Shimmer width={16} height={16} className="rounded" />
                    <Shimmer width={120} height={14} className="rounded" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shimmer width={16} height={16} className="rounded" />
                    <Shimmer width={100} height={14} className="rounded" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shimmer width={16} height={16} className="rounded" />
                    <Shimmer width={140} height={14} className="rounded" />
                  </div>
                </div>

                {/* Staff count skeleton */}
                <div className="flex items-center space-x-2">
                  <Shimmer width={16} height={16} className="rounded" />
                  <Shimmer width={100} height={14} className="rounded" />
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Organizations</h1>
          <p className="text-gray-600">Manage hospitals, clinics, and facilities</p>
        </div>
        
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-red-600 mb-4">Error loading organizations: {error}</p>
            <Button onClick={() => refetch()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const organizations: Organization[] = data?.data?.organizations || []

  return (
    <div className="space-y-4 pb-20">
      {/* Page header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Organizations</h1>
        <p className="text-gray-600">Manage hospitals, clinics, and facilities</p>
      </div>

      {/* Add new organization button */}
      <div className="mb-6">
        <Link href="/mobile/organizations/new">
          <Button className="w-full h-12 text-base">
            <Plus className="mr-2 h-5 w-5" />
            Add Organization
          </Button>
        </Link>
      </div>

      {/* Organizations list */}
      <div className="space-y-3">
        {organizations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Building2 className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p className="text-gray-500 mb-2">No organizations found</p>
              <p className="text-sm text-gray-400">Add your first organization to get started</p>
            </CardContent>
          </Card>
        ) : (
          organizations.map((org) => (
            <Card key={org.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Organization header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{org.name}</h3>
                        <p className="text-sm text-gray-600">{org.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <Badge variant={org.status === 'active' ? 'default' : 'secondary'}>
                      {org.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  {/* Contact info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{org.address?.city}, {org.address?.state}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{org.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{org.email}</span>
                    </div>
                  </div>

                  {/* Staff count */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{org.staffCount} staff members</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Manage Staff
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
