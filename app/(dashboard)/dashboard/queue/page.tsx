'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, RefreshCw, PhoneCall, Stethoscope, CheckCircle, Users, Activity, Wifi } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { queueService } from '@/lib/api/queue-service'
import { cn } from '@/lib/utils/cn'

interface QueueItem {
  id: string
  position: number
  status: 'waiting' | 'called' | 'in_progress' | 'completed' | 'cancelled'
  patientName: string
  patientId: string
  doctorName: string
  estimatedWaitTime: number
  appointmentTime: string
  appointmentType: string
}

interface QueueStats {
  waiting: number
  called: number
  inProgress: number
  total: number
  averageWaitTime: string
}

const STATUS_CONFIG = {
  waiting: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400' },
  called: { label: 'Dipanggil', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  in_progress: { label: 'Konsultasi', color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  completed: { label: 'Selesai', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
  cancelled: { label: 'Batal', color: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400' },
}

const TYPE_LABEL: Record<string, string> = {
  consultation: 'Konsultasi',
  follow_up: 'Kontrol',
  emergency: 'Darurat',
  routine_checkup: 'Pemeriksaan',
}

export default function QueuePage() {
  const { user } = useAuth()
  const isPatient = user?.role === 'patient'

  const [items, setItems] = useState<QueueItem[]>([])
  const [stats, setStats] = useState<QueueStats>({ waiting: 0, called: 0, inProgress: 0, total: 0, averageWaitTime: '—' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [live, setLive] = useState(true)

  // Patient view state
  const [myQueue, setMyQueue] = useState<any>(null)
  const [myQueueLoading, setMyQueueLoading] = useState(true)

  const fetchQueue = useCallback(async () => {
    if (isPatient) return
    try {
      const res = await queueService.getQueue({ limit: 50, ...(user?.organizationId ? { organizationId: user.organizationId } : {}) })
      if (res.success && res.data) {
        const raw = res.data as any
        const queues: QueueItem[] = (raw.queues || []).map((q: any) => ({
          id: q.id,
          position: q.position,
          status: q.status,
          patientName: q.patient_name || 'Pasien',
          patientId: q.patient_id || '',
          doctorName: q.doctor_name || 'Dokter',
          estimatedWaitTime: q.estimated_wait_time || 0,
          appointmentTime: q.appointment_time || '',
          appointmentType: q.appointment_type || 'consultation',
        }))
        setItems(queues)
        const waiting = queues.filter(q => q.status === 'waiting').length
        const called = queues.filter(q => q.status === 'called').length
        const inProgress = queues.filter(q => q.status === 'in_progress').length
        setStats({
          waiting,
          called,
          inProgress,
          total: queues.length,
          averageWaitTime: raw.stats?.average_wait_time ? `${raw.stats.average_wait_time} mnt` : '—',
        })
        setLastUpdated(new Date())
        setError(null)
      }
    } catch (err) {
      setError('Gagal memuat antrian')
    } finally {
      setLoading(false)
    }
  }, [isPatient, user?.organizationId])

  const fetchMyQueue = useCallback(async () => {
    if (!isPatient || !user?.id) return
    setMyQueueLoading(true)
    try {
      const res = await queueService.getPatientQueue(user.id)
      if (res.success) setMyQueue(res.data || null)
    } catch {
      setMyQueue(null)
    } finally {
      setMyQueueLoading(false)
    }
  }, [isPatient, user?.id])

  useEffect(() => {
    if (isPatient) { fetchMyQueue(); return }
    fetchQueue()
    const interval = live ? setInterval(fetchQueue, 10000) : null
    return () => { if (interval) clearInterval(interval) }
  }, [isPatient, live, fetchQueue, fetchMyQueue])

  const doAction = async (queueId: string, action: 'call_next' | 'start_consultation' | 'complete_consultation') => {
    setActionLoading(queueId + action)
    try {
      await queueService.queueAction(queueId, action)
      await fetchQueue()
    } catch (err) {
      alert('Aksi gagal: ' + (err instanceof Error ? err.message : 'Error'))
    } finally {
      setActionLoading(null)
    }
  }

  // ── Patient view ──────────────────────────────────────────
  if (isPatient) {
    if (myQueueLoading) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Status Antrian Anda</h1>
          <Card><CardContent className="p-8 text-center text-gray-500">Memuat...</CardContent></Card>
        </div>
      )
    }
    if (!myQueue) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Status Antrian Anda</h1>
          <Card>
            <CardContent className="p-10 text-center">
              <Clock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="font-medium text-gray-700">Tidak ada janji hari ini</p>
              <p className="text-sm text-gray-500 mt-1">Anda tidak sedang dalam antrian</p>
            </CardContent>
          </Card>
        </div>
      )
    }
    const cfg = STATUS_CONFIG[myQueue.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.waiting
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">Status Antrian Anda</h1>
        <Card className="border-2 border-blue-200">
          <CardContent className="p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50 border-4 border-blue-200">
              <span className="text-4xl font-black text-blue-600">{myQueue.position}</span>
            </div>
            <p className="text-gray-500">Nomor Antrian Anda</p>
            <Badge className={`text-sm px-4 py-1.5 ${cfg.color}`} variant="outline">
              <span className={`w-2 h-2 rounded-full mr-2 inline-block ${cfg.dot}`} />
              {cfg.label}
            </Badge>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">{myQueue.estimated_wait_time || '—'} mnt</p>
                <p className="text-xs text-blue-600 mt-0.5">Estimasi tunggu</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">{myQueue.appointment_time || '—'}</p>
                <p className="text-xs text-green-600 mt-0.5">Jadwal</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <p><span className="font-medium">Dokter:</span> {myQueue.doctor_name}</p>
              <p className="mt-1"><span className="font-medium">Jenis:</span> {TYPE_LABEL[myQueue.appointment_type] || myQueue.appointment_type}</p>
            </div>
            <p className="text-xs text-gray-400">
              {myQueue.status === 'waiting' && 'Silakan duduk di ruang tunggu. Anda akan dipanggil segera.'}
              {myQueue.status === 'called' && '⚡ Anda dipanggil! Segera menuju ruang konsultasi.'}
              {myQueue.status === 'in_progress' && 'Anda sedang dalam konsultasi dengan dokter.'}
            </p>
          </CardContent>
        </Card>
        <Button variant="outline" className="w-full" onClick={fetchMyQueue}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh Status
        </Button>
      </div>
    )
  }

  // ── Staff/Admin view ─────────────────────────────────────
  const activeItems = items.filter(q => !['completed', 'cancelled'].includes(q.status))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Antrian Pasien</h1>
          <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
            <span className={cn('w-2 h-2 rounded-full', live ? 'bg-green-400 animate-pulse' : 'bg-gray-300')} />
            {live ? `Live · diperbarui ${lastUpdated ? lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}` : 'Pause'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setLive(l => !l)}>
            <Wifi className={cn('mr-2 h-4 w-4', live ? 'text-green-500' : 'text-gray-400')} />
            {live ? 'Live' : 'Pause'}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchQueue} disabled={loading}>
            <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Menunggu', value: stats.waiting, icon: Clock, color: 'yellow' },
          { label: 'Dipanggil', value: stats.called, icon: PhoneCall, color: 'blue' },
          { label: 'Konsultasi', value: stats.inProgress, icon: Stethoscope, color: 'orange' },
          { label: 'Total Hari Ini', value: stats.total, icon: Users, color: 'gray' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 bg-${color}-100 rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon className={`h-5 w-5 text-${color}-600`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Error */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="p-4 text-red-600 text-sm">{error}</CardContent>
        </Card>
      )}

      {/* Queue list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" />
            Antrian Aktif
            <Badge variant="secondary" className="ml-auto">{activeItems.length} pasien</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading && items.length === 0 ? (
            <div className="py-12 text-center text-gray-400">Memuat antrian...</div>
          ) : activeItems.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle className="mx-auto h-10 w-10 text-green-300 mb-3" />
              <p className="text-gray-500 font-medium">Antrian kosong</p>
              <p className="text-gray-400 text-sm mt-1">Semua pasien sudah dilayani</p>
            </div>
          ) : (
            <div className="divide-y">
              {activeItems.map(item => {
                const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.waiting
                return (
                  <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    {/* Position */}
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 text-sm',
                      item.status === 'in_progress' ? 'bg-orange-500'
                        : item.status === 'called' ? 'bg-blue-500'
                        : 'bg-gray-400'
                    )}>
                      {item.position}
                    </div>

                    {/* Patient info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{item.patientName}</p>
                        <Badge className={`text-xs ${cfg.color}`} variant="outline">
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${cfg.dot}`} />
                          {cfg.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {item.doctorName} · {TYPE_LABEL[item.appointmentType] || item.appointmentType}
                        {item.appointmentTime && ` · ${item.appointmentTime}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Estimasi tunggu: {item.estimatedWaitTime} mnt
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      {item.status === 'waiting' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 text-xs"
                          disabled={actionLoading === item.id + 'call_next'}
                          onClick={() => doAction(item.id, 'call_next')}
                        >
                          <PhoneCall className="h-3.5 w-3.5 mr-1" />
                          Panggil
                        </Button>
                      )}
                      {item.status === 'called' && (
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-xs"
                          disabled={actionLoading === item.id + 'start_consultation'}
                          onClick={() => doAction(item.id, 'start_consultation')}
                        >
                          <Stethoscope className="h-3.5 w-3.5 mr-1" />
                          Mulai
                        </Button>
                      )}
                      {item.status === 'in_progress' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-xs"
                          disabled={actionLoading === item.id + 'complete_consultation'}
                          onClick={() => doAction(item.id, 'complete_consultation')}
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Selesai
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed today */}
      {items.filter(q => q.status === 'completed').length > 0 && (
        <Card className="border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-500 font-medium">Selesai Hari Ini</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {items.filter(q => q.status === 'completed').map(item => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 opacity-60">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700">{item.patientName}</p>
                    <p className="text-xs text-gray-400">{item.doctorName}</p>
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
