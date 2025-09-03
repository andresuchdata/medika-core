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
