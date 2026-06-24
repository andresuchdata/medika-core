'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ClipboardList, Clock, PhoneCall, Stethoscope, CheckCircle,
  Pill, RefreshCw, ArrowRight
} from 'lucide-react'
import { queueService } from '@/lib/api/queue-service'
import { cn } from '@/lib/utils/cn'

interface VisitCard {
  id: string
  position: number
  patientName: string
  doctorName: string
  appointmentType: string
  appointmentTime: string
  estimatedWaitTime: number
  status: 'waiting' | 'called' | 'in_progress' | 'completed' | 'cancelled'
}

const STAGES = [
  { key: 'waiting', label: 'Menunggu', icon: Clock, color: 'yellow', bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700' },
  { key: 'called', label: 'Dipanggil', icon: PhoneCall, color: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' },
  { key: 'in_progress', label: 'Konsultasi', icon: Stethoscope, color: 'orange', bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
  { key: 'completed', label: 'Selesai / Farmasi', icon: Pill, color: 'green', bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
]

const TYPE_LABEL: Record<string, string> = {
  consultation: 'Konsultasi',
  follow_up: 'Kontrol',
  emergency: 'Darurat',
  routine_checkup: 'Pemeriksaan',
}

export default function VisitJourneyPage() {
  const [cards, setCards] = useState<VisitCard[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await queueService.getQueue({ limit: 100 })
      if (res.success && res.data) {
        const raw = res.data as any
        const all: VisitCard[] = (raw.queues || []).map((q: any) => ({
          id: q.id,
          position: q.position,
          patientName: q.patient_name || 'Pasien',
          doctorName: q.doctor_name || 'Dokter',
          appointmentType: q.appointment_type || 'consultation',
          appointmentTime: q.appointment_time || '',
          estimatedWaitTime: q.estimated_wait_time || 0,
          status: q.status,
        }))
        setCards(all)
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
    const interval = setInterval(fetchData, 12000)
    return () => clearInterval(interval)
  }, [fetchData])

  const doAction = async (id: string, action: 'call_next' | 'start_consultation' | 'complete_consultation') => {
    setActionLoading(id + action)
    try {
      await queueService.queueAction(id, action)
      await fetchData()
    } catch (err) {
      alert('Aksi gagal: ' + (err instanceof Error ? err.message : 'Error'))
    } finally {
      setActionLoading(null)
    }
  }

  const stageCards = (key: string) => cards.filter(c => c.status === key)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Perjalanan Kunjungan</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Pantau status pasien dari pendaftaran hingga farmasi
            {lastUpdated && (
              <span className="ml-2 text-gray-400">
                · Diperbarui {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Flow indicator */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {STAGES.map((stage, idx) => (
          <div key={stage.key} className="flex items-center gap-1 shrink-0">
            <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium', stage.badge)}>
              <stage.icon className="h-3.5 w-3.5" />
              {stage.label}
              <span className="font-bold ml-0.5">{stageCards(stage.key).length}</span>
            </div>
            {idx < STAGES.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />}
          </div>
        ))}
      </div>

      {/* Kanban board */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAGES.map(s => (
            <div key={s.key} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {STAGES.map(stage => {
            const stageItems = stageCards(stage.key)
            return (
              <div key={stage.key} className={cn('rounded-xl border-2 overflow-hidden', stage.border)}>
                {/* Column header */}
                <div className={cn('px-3 py-2.5 flex items-center gap-2', stage.bg)}>
                  <stage.icon className={cn('h-4 w-4 text-${stage.color}-600')} />
                  <span className="font-semibold text-sm text-gray-800">{stage.label}</span>
                  <span className={cn('ml-auto text-xs font-bold px-2 py-0.5 rounded-full', stage.badge)}>
                    {stageItems.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="p-2 space-y-2 bg-white min-h-[120px]">
                  {stageItems.length === 0 && (
                    <p className="text-center text-xs text-gray-400 py-6">Tidak ada pasien</p>
                  )}
                  {stageItems.map(card => (
                    <div key={card.id} className={cn('rounded-lg border p-3 text-sm space-y-2', stage.bg, stage.border)}>
                      <div className="flex items-start gap-2">
                        <div className={cn(
                          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0',
                          stage.key === 'waiting' ? 'bg-yellow-400'
                            : stage.key === 'called' ? 'bg-blue-500'
                            : stage.key === 'in_progress' ? 'bg-orange-500'
                            : 'bg-green-500'
                        )}>
                          {card.position}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate leading-tight">{card.patientName}</p>
                          <p className="text-xs text-gray-500 truncate">{card.doctorName}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{TYPE_LABEL[card.appointmentType] || card.appointmentType}</span>
                        {card.appointmentTime && <span>{card.appointmentTime}</span>}
                      </div>
                      {/* Action button */}
                      {stage.key === 'waiting' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full h-7 text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                          disabled={actionLoading === card.id + 'call_next'}
                          onClick={() => doAction(card.id, 'call_next')}
                        >
                          <PhoneCall className="h-3 w-3 mr-1" /> Panggil
                        </Button>
                      )}
                      {stage.key === 'called' && (
                        <Button
                          size="sm"
                          className="w-full h-7 text-xs bg-orange-500 hover:bg-orange-600"
                          disabled={actionLoading === card.id + 'start_consultation'}
                          onClick={() => doAction(card.id, 'start_consultation')}
                        >
                          <Stethoscope className="h-3 w-3 mr-1" /> Mulai Konsultasi
                        </Button>
                      )}
                      {stage.key === 'in_progress' && (
                        <Button
                          size="sm"
                          className="w-full h-7 text-xs bg-green-600 hover:bg-green-700"
                          disabled={actionLoading === card.id + 'complete_consultation'}
                          onClick={() => doAction(card.id, 'complete_consultation')}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" /> Selesai → Farmasi
                        </Button>
                      )}
                      {stage.key === 'completed' && (
                        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                          <Pill className="h-3 w-3" /> Menuju farmasi
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
