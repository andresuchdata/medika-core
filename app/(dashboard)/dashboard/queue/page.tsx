import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, User, Stethoscope } from 'lucide-react'

export default function QueuePage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Patient Queue</h1>
        <p className="text-gray-600">Current patient queue and wait times</p>
      </div>

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
              <div className="text-2xl font-bold text-blue-600">7</div>
              <div className="text-sm text-blue-600">Patients Waiting</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">15 min</div>
              <div className="text-sm text-green-600">Average Wait</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">3</div>
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
          <div className="space-y-3">
            {[
              { position: 1, patient: 'John Doe', doctor: 'Dr. Sarah Johnson', waitTime: '5 min', status: 'waiting' },
              { position: 2, patient: 'Jane Smith', doctor: 'Dr. Mike Wilson', waitTime: '12 min', status: 'waiting' },
              { position: 3, patient: 'Bob Johnson', doctor: 'Dr. Sarah Johnson', waitTime: '18 min', status: 'waiting' },
              { position: 4, patient: 'Alice Brown', doctor: 'Dr. Mike Wilson', waitTime: '25 min', status: 'waiting' },
            ].map((item) => (
              <div key={item.position} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {item.position}
                  </div>
                  <div>
                    <p className="font-medium">{item.patient}</p>
                    <p className="text-sm text-gray-600">{item.doctor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Wait: {item.waitTime}</p>
                  <Badge variant="secondary">{item.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
