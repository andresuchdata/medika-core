import { Shimmer } from './shimmer'

// Loading state for appointments page
export function AppointmentsLoadingState() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="space-y-4">
        <Shimmer width={256} height={32} className="rounded" />
        <Shimmer width={384} height={16} className="rounded" />
      </div>

      {/* Today's appointments skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4 mb-4">
          <Shimmer width="60%" height={24} className="rounded" />
          <Shimmer width="40%" height={16} className="rounded" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shimmer width={16} height={16} className="rounded" />
                <Shimmer width={60} height={16} className="rounded" />
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <Shimmer width={80} height={16} className="rounded" />
                  <Shimmer width={60} height={14} className="rounded" />
                </div>
                <Shimmer width={60} height={20} className="rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming appointments skeleton */}
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4 mb-4">
          <Shimmer width="50%" height={24} className="rounded" />
          <Shimmer width="35%" height={16} className="rounded" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shimmer width={16} height={16} className="rounded" />
                <div>
                  <Shimmer width={80} height={16} className="rounded" />
                  <Shimmer width={60} height={14} className="rounded" />
                </div>
              </div>
              <div className="text-right">
                <Shimmer width={80} height={16} className="rounded" />
                <Shimmer width={60} height={14} className="rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Loading state for doctors page
export function DoctorsLoadingState() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-4">
        <Shimmer width={256} height={32} className="rounded" />
        <Shimmer width={384} height={16} className="rounded" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="flex items-center space-x-4">
              <Shimmer width={48} height={48} className="rounded-lg" />
              <div className="space-y-2">
                <Shimmer width={80} height={16} className="rounded" />
                <Shimmer width={64} height={24} className="rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-4 p-4 border rounded-lg">
        <Shimmer width={128} height={40} className="rounded" />
        <Shimmer width={160} height={40} className="rounded" />
        <Shimmer width={96} height={40} className="rounded" />
      </div>

      {/* Doctors grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <Shimmer width="60%" height={24} className="rounded" />
              <div className="space-y-2">
                <Shimmer width="100%" height={16} className="rounded" />
                <Shimmer width="75%" height={16} className="rounded" />
                <Shimmer width="50%" height={16} className="rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Loading state for queue page
export function QueueLoadingState() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-4">
        <Shimmer width={192} height={32} className="rounded" />
        <Shimmer width={320} height={16} className="rounded" />
      </div>

      {/* Queue stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="flex items-center space-x-4">
              <Shimmer width={48} height={48} className="rounded-lg" />
              <div className="space-y-2">
                <Shimmer width={80} height={16} className="rounded" />
                <Shimmer width={64} height={24} className="rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Queue list */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4">
            <Shimmer width={48} height={48} className="rounded-full" />
            <div className="space-y-2 flex-1">
              <Shimmer width="33%" height={16} className="rounded" />
              <Shimmer width="50%" height={12} className="rounded" />
            </div>
            <Shimmer width={80} height={32} className="rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Loading state for patients page
export function PatientsLoadingState() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-4">
        <Shimmer width={224} height={32} className="rounded" />
        <Shimmer width={352} height={16} className="rounded" />
      </div>

      {/* Patient stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="flex items-center space-x-4">
              <Shimmer width={48} height={48} className="rounded-lg" />
              <div className="space-y-2">
                <Shimmer width={80} height={16} className="rounded" />
                <Shimmer width={64} height={24} className="rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-4 p-4 border rounded-lg">
        <Shimmer width={128} height={40} className="rounded" />
        <Shimmer width={160} height={40} className="rounded" />
        <Shimmer width={112} height={40} className="rounded" />
        <Shimmer width={144} height={40} className="rounded" />
      </div>

      {/* Patients table */}
      <div className="space-y-3">
        {/* Header */}
        <div className="flex space-x-4 p-4 border-b">
          <Shimmer width={96} height={16} className="rounded" />
          <Shimmer width={128} height={16} className="rounded" />
          <Shimmer width={112} height={16} className="rounded" />
          <Shimmer width={80} height={16} className="rounded" />
        </div>
        {/* Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex space-x-4 p-4">
            <Shimmer width={96} height={16} className="rounded" />
            <Shimmer width={128} height={16} className="rounded" />
            <Shimmer width={112} height={16} className="rounded" />
            <Shimmer width={80} height={16} className="rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Loading state for medical records page
export function MedicalRecordsLoadingState() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-4">
        <Shimmer width={288} height={32} className="rounded" />
        <Shimmer width={384} height={16} className="rounded" />
      </div>

      {/* Records stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="flex items-center space-x-4">
              <Shimmer width={48} height={48} className="rounded-lg" />
              <div className="space-y-2">
                <Shimmer width={80} height={16} className="rounded" />
                <Shimmer width={64} height={24} className="rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-4 p-4 border rounded-lg">
        <Shimmer width={128} height={40} className="rounded" />
        <Shimmer width={160} height={40} className="rounded" />
        <Shimmer width={144} height={40} className="rounded" />
        <Shimmer width={112} height={40} className="rounded" />
      </div>

      {/* Records list */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <Shimmer width="33%" height={24} className="rounded" />
              <div className="space-y-2">
                <Shimmer width="100%" height={16} className="rounded" />
                <Shimmer width="75%" height={16} className="rounded" />
                <Shimmer width="50%" height={16} className="rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Loading state for organizations page
export function OrganizationsLoadingState() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-4">
        <Shimmer width={256} height={32} className="rounded" />
        <Shimmer width={352} height={16} className="rounded" />
      </div>

      {/* Organization stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="flex items-center space-x-4">
              <Shimmer width={48} height={48} className="rounded-lg" />
              <div className="space-y-2">
                <Shimmer width={80} height={16} className="rounded" />
                <Shimmer width={64} height={24} className="rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-4 p-4 border rounded-lg">
        <Shimmer width={128} height={40} className="rounded" />
        <Shimmer width={160} height={40} className="rounded" />
        <Shimmer width={112} height={40} className="rounded" />
      </div>

      {/* Organizations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <Shimmer width="33%" height={24} className="rounded" />
              <div className="space-y-2">
                <Shimmer width="100%" height={16} className="rounded" />
                <Shimmer width="75%" height={16} className="rounded" />
                <Shimmer width="50%" height={16} className="rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Loading state for profile page
export function ProfileLoadingState() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Shimmer width={128} height={128} className="rounded-full mx-auto mb-4" />
        <Shimmer width={192} height={32} className="rounded mx-auto mb-2" />
        <Shimmer width={128} height={16} className="rounded mx-auto" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <Shimmer width="33%" height={24} className="rounded" />
              <div className="space-y-2">
                <Shimmer width="100%" height={16} className="rounded" />
                <Shimmer width="75%" height={16} className="rounded" />
                <Shimmer width="50%" height={16} className="rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Generic loading state for any page
export function GenericLoadingState() {
  return (
    <div className="space-y-6">
      <Shimmer width={192} height={32} className="rounded" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <Shimmer width="33%" height={24} className="rounded" />
              <div className="space-y-2">
                <Shimmer width="100%" height={16} className="rounded" />
                <Shimmer width="75%" height={16} className="rounded" />
                <Shimmer width="50%" height={16} className="rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Loading state for mobile patients page
export function MobilePatientsLoadingState() {
  return (
    <div className="space-y-4 pb-20">
      {/* Page header skeleton */}
      <div className="text-center mb-6">
        <Shimmer width={192} height={32} className="rounded mx-auto mb-2" />
        <Shimmer width={256} height={16} className="rounded mx-auto" />
      </div>

      {/* Search bar skeleton */}
      <div className="rounded-lg border bg-card p-4">
        <Shimmer width="100%" height={40} className="rounded" />
      </div>

      {/* Add new patient button skeleton */}
      <div className="mb-6">
        <Shimmer width="100%" height={48} className="rounded" />
      </div>

      {/* Patient list skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shimmer width={40} height={40} className="rounded-full" />
                <div>
                  <Shimmer width={80} height={16} className="rounded" />
                  <Shimmer width={60} height={14} className="rounded" />
                </div>
              </div>
              <div className="text-right">
                <Shimmer width={60} height={12} className="rounded" />
                <Shimmer width={80} height={14} className="rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Loading state for mobile notifications page
export function MobileNotificationsLoadingState() {
  return (
    <div className="space-y-4 pb-20">
      {/* Page header skeleton */}
      <div className="text-center mb-6">
        <Shimmer width={192} height={32} className="rounded mx-auto mb-2" />
        <Shimmer width={256} height={16} className="rounded mx-auto" />
      </div>

      {/* Filter buttons skeleton */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex gap-2">
          <Shimmer width="100%" height={32} className="rounded" />
          <Shimmer width="100%" height={32} className="rounded" />
          <Shimmer width="100%" height={32} className="rounded" />
        </div>
      </div>

      {/* Notifications list skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4">
            <div className="space-y-3">
              {/* Notification header skeleton */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Shimmer width={40} height={40} className="rounded-full" />
                  <div className="flex-1">
                    <Shimmer width={180} height={16} className="rounded mb-2" />
                    <Shimmer width={240} height={14} className="rounded" />
                  </div>
                </div>
                <Shimmer width={12} height={12} className="rounded-full" />
              </div>

              {/* Notification meta skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shimmer width={16} height={16} className="rounded" />
                  <Shimmer width={80} height={14} className="rounded" />
                </div>
                <Shimmer width={60} height={20} className="rounded" />
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

      {/* Mark all as read skeleton */}
      <div className="rounded-lg border bg-card p-4">
        <Shimmer width="100%" height={40} className="rounded" />
      </div>
    </div>
  )
}

// Loading state for dashboard notifications page
export function NotificationsLoadingState() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Shimmer width={200} height={32} className="rounded mb-2" />
          <Shimmer width={300} height={16} className="rounded" />
        </div>
        <div className="flex space-x-3">
          <Shimmer width={100} height={36} className="rounded" />
          <Shimmer width={120} height={36} className="rounded" />
        </div>
      </div>

      {/* Search and filters skeleton */}
      <div className="flex items-center space-x-4">
        <Shimmer width="100%" height={40} className="rounded" />
        <Shimmer width={120} height={40} className="rounded" />
        <Shimmer width={120} height={40} className="rounded" />
        <Shimmer width={120} height={40} className="rounded" />
      </div>

      {/* Notifications list skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4">
            <div className="flex items-start space-x-4">
              {/* Icon skeleton */}
              <div className="relative">
                <Shimmer width={40} height={40} className="rounded-full" />
                <Shimmer width={12} height={12} className="rounded-full absolute -top-1 -right-1" />
              </div>

              {/* Content skeleton */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Shimmer width={200} height={16} className="rounded" />
                      <Shimmer width={12} height={12} className="rounded-full" />
                      <Shimmer width={80} height={20} className="rounded" />
                    </div>
                    <Shimmer width={300} height={14} className="rounded mb-2" />
                    <div className="flex items-center space-x-4">
                      <Shimmer width={100} height={12} className="rounded" />
                      <Shimmer width={60} height={20} className="rounded" />
                      <Shimmer width={60} height={20} className="rounded" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Shimmer width={80} height={32} className="rounded" />
                    <Shimmer width={32} height={32} className="rounded" />
                    <Shimmer width={32} height={32} className="rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Shimmer width={32} height={32} className="rounded" />
            </div>
            <Shimmer width={40} height={32} className="rounded mx-auto mb-2" />
            <Shimmer width={120} height={16} className="rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
