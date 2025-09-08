'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, AlertCircle, Calendar, RefreshCw } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { useQueue } from '@/lib/hooks/use-queue'
import { PatientQueueLoadingState, QueueLoadingState } from '@/components/ui/loading-states'

export default function QueuePage() {
  const { user } = useAuth()
  const isPatient = user?.role === 'patient'
  
  // Use the custom hook for queue data
  const {
    queueData,
    queueLoading,
    queueError,
    patientQueueData,
    patientQueueLoading,
    patientQueueError,
    refetchQueue,
    refetchPatientQueue,
  } = useQueue()

  // Handle refresh
  const handleRefresh = () => {
    if (isPatient) {
      refetchPatientQueue()
    } else {
      refetchQueue()
    }
  }

  if (isPatient) {
    // Loading state
    if (patientQueueLoading) {
      return <PatientQueueLoadingState />
    }

    // Error state
    if (patientQueueError) {
      return (
        <div className="space-y-4 sm:space-y-6">
          {/* Page header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Queue Status</h1>
            <p className="text-gray-600">Your current position and estimated wait time</p>
          </div>

          {/* Error state */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Error Loading Queue
              </CardTitle>
              <CardDescription>Unable to fetch your queue information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
                <p className="text-gray-600 mb-4">
                  {patientQueueError}
                </p>
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    // If patient has no appointment today, show appropriate message
    if (!patientQueueData) {
      return (
        <div className="space-y-4 sm:space-y-6">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Queue Status</h1>
              <p className="text-gray-600">Your current position and estimated wait time</p>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* No appointment today */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                No Appointment Today
              </CardTitle>
              <CardDescription>You don't have any appointments scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Queue Position</h3>
                <p className="text-gray-600 mb-4">
                  You don't have any appointments scheduled for today, so you're not in the queue.
                </p>
                <p className="text-sm text-gray-500">
                  Check your appointments page to see your upcoming scheduled visits.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Queue Status</h1>
            <p className="text-gray-600">Your current position and estimated wait time</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Patient's queue status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Your Queue Position
            </CardTitle>
            <CardDescription>Real-time queue information for your appointment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {patientQueueData.position}
              </div>
              <p className="text-lg text-gray-600">Position in queue</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{patientQueueData.estimatedWaitTime} min</div>
                  <div className="text-sm text-blue-600">Estimated Wait Time</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{patientQueueData.appointmentTime}</div>
                  <div className="text-sm text-green-600">Scheduled Time</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Doctor:</strong> {patientQueueData.doctorName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Type:</strong> {patientQueueData.appointmentType.replace('_', ' ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status indicator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-4">
              <Badge 
                variant={patientQueueData.status === 'waiting' ? 'secondary' : 'default'}
                className="text-lg px-6 py-2"
              >
                {patientQueueData.status === 'waiting' ? 'Waiting' : patientQueueData.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              {patientQueueData.status === 'waiting' 
                ? 'Please wait in the waiting area. You will be called when it\'s your turn.'
                : patientQueueData.status === 'in_progress'
                ? 'You are currently being seen by the doctor.'
                : 'You are being called. Please proceed to the consultation room.'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Staff view with loading and error states
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Patient Queue</h1>
          <p className="text-gray-600">Current patient queue and wait times</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Loading state */}
      {queueLoading && <QueueLoadingState />}

      {/* Error state */}
      {queueError && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Error Loading Queue
            </CardTitle>
            <CardDescription>Unable to fetch queue information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-gray-600 mb-4">
                {queueError}
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success state */}
      {queueData && !queueLoading && !queueError && (
        <>
          {/* Queue status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Current Queue Status
              </CardTitle>
              <CardDescription>Real-time queue information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{queueData.stats.waiting}</div>
                  <div className="text-sm text-blue-600">Patients Waiting</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{queueData.stats.averageWaitTime}</div>
                  <div className="text-sm text-green-600">Average Wait</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{queueData.stats.inProgress}</div>
                  <div className="text-sm text-orange-600">In Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current queue */}
          <Card>
            <CardHeader>
              <CardTitle>Current Queue</CardTitle>
              <CardDescription>Patients waiting to be seen</CardDescription>
            </CardHeader>
            <CardContent>
              {queueData.queues.length > 0 ? (
                <div className="space-y-3">
                  {queueData.queues.map((queueItem) => (
                    <div key={queueItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          queueItem.status === 'in_progress' ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {queueItem.position}
                        </div>
                        <div>
                          <p className="font-medium">{queueItem.patientName}</p>
                          <p className="text-sm text-gray-600">{queueItem.doctorName}</p>
                          <p className="text-xs text-gray-500">{queueItem.appointmentTime} - {queueItem.appointmentType.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Wait: {queueItem.estimatedWaitTime} min</p>
                        <Badge 
                          variant={queueItem.status === 'waiting' ? 'secondary' : 'default'}
                          className={queueItem.status === 'in_progress' ? 'bg-orange-500' : ''}
                        >
                          {queueItem.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No patients in queue</h3>
                  <p className="text-gray-600">
                    There are currently no patients waiting in the queue.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
