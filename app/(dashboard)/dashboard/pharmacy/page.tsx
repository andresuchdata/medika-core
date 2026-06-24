'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pill, CheckCircle, Clock, RefreshCw, Package, User } from 'lucide-react'
import { queueService } from '@/lib/api/queue-service'
import { cn } from '@/lib/utils/cn'

interface PharmacyPatient {
  id: string
  position: number
  patientName: string
  doctorName: string
  appointmentTime: string
  appointmentType: string
  dispensed: boolean
}

// Mock prescriptions keyed by position for the demo
const MOCK_PRESCRIPTIONS: Record<number, { name: string; dosage: string; qty: number }[]> = {
  1: [{ name: 'Paracetamol 500mg', dosage: '3x1 sesudah makan', qty: 10 }, { name: 'Amoxicillin 500mg', dosage: '3x1 habiskan', qty: 21 }],
  2: [{ name: 'Antasida Doen', dosage: '3x2 sebelum makan', qty: 18 }, { name: 'Ranitidine 150mg', dosage: '2x1', qty: 14 }],
  3: [{ name: 'Metformin 500mg', dosage: '2x1 sesudah makan', qty: 60 }, { name: 'Vitamin B Complex', dosage: '1x1', qty: 30 }],
}

function getPrescriptions(pos: number) {
  // cycle through mock data
  return MOCK_PRESCRIPTIONS[((pos - 1) % 3) + 1] || MOCK_PRESCRIPTIONS[1]
}

export default function PharmacyPage() {
  const [patients, setPatients] = useState<PharmacyPatient[]>([])
  const [dispensed, setDispensed] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await queueService.getQueue({ limit: 100 })
      if (res.success && res.data) {
        const raw = res.data as any
        const completed: PharmacyPatient[] = (raw.queues || [])
          .filter((q: any) => q.status === 'completed')
          .map((q: any) => ({
            id: q.id,
            position: q.position,
            patientName: q.patient_name || 'Pasien',
            doctorName: q.doctor_name || 'Dokter',
            appointmentTime: q.appointment_time || '',
            appointmentType: q.appointment_type || 'consultation',
            dispensed: false,
          }))
        setPatients(completed)
        setLastUpdated(new Date())
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [fetchData])

  const markDispensed = (id: string) => {
    setDispensed(prev => new Set(prev).add(id))
  }

  const pending = patients.filter(p => !dispensed.has(p.id))
  const done = patients.filter(p => dispensed.has(p.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farmasi</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Pasien yang menunggu pengambilan obat
            {lastUpdated && (
              <span className="ml-2 text-gray-400">
                · {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Menunggu</p>
              <p className="text-2xl font-bold text-gray-900">{pending.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Diselesaikan</p>
              <p className="text-2xl font-bold text-gray-900">{done.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Pill className="h-4 w-4 text-orange-500" />
            Antrian Farmasi
            {pending.length > 0 && (
              <Badge className="ml-auto bg-orange-100 text-orange-700">{pending.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-10 text-center text-gray-400 text-sm">Memuat...</div>
          ) : pending.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle className="mx-auto h-10 w-10 text-green-300 mb-3" />
              <p className="text-gray-500 font-medium">Semua obat sudah diserahkan</p>
              <p className="text-gray-400 text-sm mt-1">Tidak ada pasien yang menunggu</p>
            </div>
          ) : (
            <div className="divide-y">
              {pending.map(patient => {
                const prescriptions = getPrescriptions(patient.position)
                return (
                  <div key={patient.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900">{patient.patientName}</p>
                            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                              No. {patient.position}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">
                            dr. {patient.doctorName}
                            {patient.appointmentTime && ` · ${patient.appointmentTime}`}
                          </p>
                          {/* Prescriptions */}
                          <div className="mt-2 space-y-1">
                            {prescriptions.map((rx, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs bg-blue-50 rounded p-1.5">
                                <Pill className="h-3 w-3 text-blue-500 mt-0.5 shrink-0" />
                                <div>
                                  <span className="font-medium text-blue-800">{rx.name}</span>
                                  <span className="text-blue-600 ml-1">— {rx.dosage}</span>
                                  <span className="text-blue-500 ml-1">({rx.qty} tab)</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 shrink-0 mt-1"
                        onClick={() => markDispensed(patient.id)}
                      >
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Serahkan
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Done */}
      {done.length > 0 && (
        <Card className="border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 font-medium">Sudah Diserahkan</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {done.map(patient => (
                <div key={patient.id} className="flex items-center gap-3 px-4 py-3 opacity-50">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">{patient.patientName}</p>
                    <p className="text-xs text-gray-400">dr. {patient.doctorName}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Selesai</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
