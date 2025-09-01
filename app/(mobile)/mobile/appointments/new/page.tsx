import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TimePicker } from '@/components/ui/time-picker'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link' 

export default function MobileNewAppointmentPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/mobile/appointments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">New Appointment</h1>
          <p className="text-sm text-gray-600">Schedule a new patient appointment</p>
        </div>
      </div>

      {/* Appointment form - full width mobile optimized */}
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="patient">Patient</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="john-doe">John Doe</SelectItem>
              <SelectItem value="jane-smith">Jane Smith</SelectItem>
              <SelectItem value="bob-johnson">Bob Johnson</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="doctor">Doctor</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dr-sarah">Dr. Sarah Johnson</SelectItem>
              <SelectItem value="dr-mike">Dr. Mike Wilson</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input type="date" id="date" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <TimePicker id="time" name="time" minuteStep={5} />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Appointment Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultation">Consultation</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="routine-check">Routine Check</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            placeholder="Additional notes about the appointment..."
            rows={3}
          />
        </div>
        
        <div className="flex gap-3 pt-6">
          <Button type="submit" className="flex-1">
            Schedule Appointment
          </Button>
          <Link href="/mobile/appointments">
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
