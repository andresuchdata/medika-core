'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, User, AlertCircle, CheckCircle, Calendar, RefreshCw } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { useQueue } from '@/lib/hooks/use-queue'
import { MobilePatientQueueLoadingState, MobileQueueLoadingState } from '@/components/ui/loading-states'

export default function MobileQueuePage() {
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
      return <MobilePatientQueueLoadingState />
    }

    // Error state
    if (patientQueueError) {
      return (
        <div className="space-y-4 pb-20">
          {/* Page header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Queue Status</h1>
            <p className="text-gray-600">Your current position and wait time</p>
          </div>

          {/* Error state */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                Error Loading Queue
              </CardTitle>
              <CardDescription>Unable to fetch your queue information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {patientQueueError}
                </p>
                <Button onClick={handleRefresh} variant="outline" size="sm">
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
        <div className="space-y-4 pb-20">
          {/* Page header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Queue Status</h1>
            <p className="text-gray-600">Your current position and wait time</p>
          </div>

          {/* No appointment today */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                No Appointment Today
              </CardTitle>
              <CardDescription>You don't have any appointments scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Queue Position</h3>
                <p className="text-gray-600 text-sm">
                  You don't have any appointments scheduled for today, so you're not in the queue.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="space-y-4 pb-20">
        {/* Page header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Queue Status</h1>
          <p className="text-gray-600">Your current position and wait time</p>
        </div>

        {/* Patient's queue position */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Your Position
            </CardTitle>
            <CardDescription>Real-time queue information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {patientQueueData.position}
              </div>
              <p className="text-lg text-gray-600">Position in queue</p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xl font-bold text-blue-600">{patientQueueData.estimatedWaitTime} min</p>
                  <p className="text-sm text-blue-600">Est. Wait</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xl font-bold text-green-600">{patientQueueData.appointmentTime}</p>
                  <p className="text-sm text-green-600">Scheduled</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status and doctor info */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Doctor</p>
                  <p className="text-sm text-gray-600">{patientQueueData.doctorName}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-4">
              <Badge 
                variant={patientQueueData.status === 'waiting' ? 'secondary' : 'default'}
                className="text-base px-4 py-2"
              >
                {patientQueueData.status === 'waiting' ? 'Waiting' : patientQueueData.status.replace('_', ' ')}
              </Badge>
            </div>
            
            <p className="text-center text-sm text-gray-600">
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
    <div className="space-y-4 pb-20">
      {/* Page header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Patient Queue</h1>
        <p className="text-gray-600">Current waiting patients</p>
      </div>

      {/* Loading state */}
      {queueLoading && <MobileQueueLoadingState />}

      {/* Error state */}
      {queueError && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
              Error Loading Queue
            </CardTitle>
            <CardDescription>Unable to fetch queue information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-gray-600 text-sm mb-4">
                {queueError}
              </p>
              <Button onClick={handleRefresh} variant="outline" size="sm">
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
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Queue Status
              </CardTitle>
              <CardDescription>Real-time queue information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{queueData.stats.waiting}</p>
                  <p className="text-sm text-blue-600">Waiting</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{queueData.stats.averageWaitTime}</p>
                  <p className="text-sm text-green-600">Avg Wait</p>
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
            <CardContent className="space-y-3">
              {queueData.queues.length > 0 ? (
                queueData.queues.map((queueItem) => (
                  <div key={queueItem.id} className={`flex items-center justify-between p-3 rounded-lg ${
                    queueItem.status === 'in_progress' ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        queueItem.status === 'in_progress' 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        {queueItem.position}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{queueItem.patientName}</p>
                        <p className="text-sm text-gray-600">{queueItem.doctorName}</p>
                        <p className="text-xs text-gray-500">{queueItem.appointmentTime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Wait: {queueItem.estimatedWaitTime} min</p>
                      <Badge 
                        variant={queueItem.status === 'waiting' ? 'outline' : 'default'}
                        className={queueItem.status === 'in_progress' ? 'bg-orange-600' : ''}
                      >
                        {queueItem.status === 'waiting' ? 'Waiting' : queueItem.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No patients in queue</h3>
                  <p className="text-gray-600 text-sm">
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
