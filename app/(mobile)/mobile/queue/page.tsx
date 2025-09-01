import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, User, AlertCircle, CheckCircle } from 'lucide-react'

export default function MobileQueuePage() {
  return (
    <div className="space-y-4 pb-20">
      {/* Page header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Patient Queue</h1>
        <p className="text-gray-600">Current waiting patients</p>
      </div>

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
              <p className="text-2xl font-bold text-blue-600">7</p>
              <p className="text-sm text-blue-600">Waiting</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">15 min</p>
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
          {[
            { position: 1, patient: 'John Doe', waitTime: '5 min', status: 'next' },
            { position: 2, patient: 'Jane Smith', waitTime: '12 min', status: 'waiting' },
            { position: 3, patient: 'Mike Johnson', waitTime: '18 min', status: 'waiting' },
            { position: 4, patient: 'Sarah Wilson', waitTime: '25 min', status: 'waiting' },
            { position: 5, patient: 'David Brown', waitTime: '32 min', status: 'waiting' },
          ].map((queueItem, index) => (
            <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
              queueItem.status === 'next' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  queueItem.status === 'next' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-700'
                }`}>
                  {queueItem.position}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{queueItem.patient}</p>
                  <p className="text-sm text-gray-600">Wait: {queueItem.waitTime}</p>
                </div>
              </div>
              <div className="text-right">
                {queueItem.status === 'next' ? (
                  <Badge variant="default" className="bg-blue-600">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Next
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    Waiting
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent completions */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Completed</CardTitle>
          <CardDescription>Patients seen today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { patient: 'Emily Davis', completed: '09:30 AM', duration: '25 min' },
            { patient: 'Robert Wilson', completed: '10:15 AM', duration: '20 min' },
            { patient: 'Lisa Anderson', completed: '11:00 AM', duration: '30 min' },
          ].map((completed, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">{completed.patient}</p>
                  <p className="text-sm text-gray-600">Duration: {completed.duration}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600 font-medium">{completed.completed}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
