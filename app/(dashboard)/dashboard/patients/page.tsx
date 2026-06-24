"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Users, Calendar, Phone, IdCard, ShieldCheck, UserCheck, UserX } from 'lucide-react'
import { usePatients } from '@/lib/hooks/use-data-fetching'
import { PatientsLoadingState } from '@/components/ui/loading-states'
import Link from 'next/link'
import { Patient } from '@/types'

function BPJSBadge({ patient }: { patient: Patient }) {
  const bpjs = patient.penjamin?.find(p => p.jenis === 'bpjs_kesehatan')
  if (!bpjs) return <Badge variant="secondary" className="text-xs">Umum</Badge>
  return (
    <Badge className={`text-xs ${bpjs.status === 'aktif' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600'}`} variant="outline">
      <ShieldCheck className="h-3 w-3 mr-1" />
      BPJS {bpjs.kelas ? `Kelas ${bpjs.kelas}` : ''}
    </Badge>
  )
}

function GenderBadge({ gender }: { gender: 'L' | 'P' }) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${gender === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
      {gender === 'L' ? '♂ L' : '♀ P'}
    </span>
  )
}

export default function PatientsPage() {
  const { data, loading, error, refetch } = usePatients()
  const [search, setSearch] = useState('')

  if (loading) return <PatientsLoadingState />

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Pasien</h1>
            <p className="text-gray-500 text-sm">Manajemen rekam medis pasien</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600 mb-4">Gagal memuat data: {error}</p>
            <Button onClick={() => refetch()} variant="outline">Coba Lagi</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const patients: Patient[] = data?.data?.patients || []
  const stats = data?.data?.stats
  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.nik?.includes(search) ||
    p.noRekamMedis?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Pasien</h1>
          <p className="text-gray-500 text-sm">Manajemen rekam medis pasien</p>
        </div>
        <Link href="/dashboard/patients/new">
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Daftar Pasien Baru
          </Button>
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Pasien', value: stats.total, icon: Users, color: 'blue' },
            { label: 'Aktif', value: stats.active, icon: UserCheck, color: 'green' },
            { label: 'Nonaktif', value: stats.inactive, icon: UserX, color: 'gray' },
            { label: 'Rata-rata Usia', value: `${stats.averageAge} th`, icon: Calendar, color: 'purple' },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 bg-${color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 text-${color}-600`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Cari nama, NIK, atau no. rekam medis..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Patient List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Daftar Pasien
            {search && <span className="text-gray-400 font-normal ml-2 text-sm">— {filtered.length} hasil</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="mx-auto h-10 w-10 mb-3 text-gray-300" />
              <p className="font-medium">{search ? 'Pasien tidak ditemukan' : 'Belum ada pasien'}</p>
              <p className="text-sm mt-1">
                {search ? 'Coba kata kunci lain' : 'Mulai dengan mendaftarkan pasien baru'}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map(patient => (
                <div key={patient.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shrink-0">
                      <span className="text-blue-700 font-semibold text-sm">
                        {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 truncate">{patient.name}</p>
                        <GenderBadge gender={patient.jenisKelamin} />
                        <BPJSBadge patient={patient} />
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        {patient.nik && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <IdCard className="h-3 w-3" />
                            {patient.nik}
                          </span>
                        )}
                        {patient.noRekamMedis && (
                          <span className="text-xs text-gray-400">RM: {patient.noRekamMedis}</span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Phone className="h-3 w-3" />
                          {patient.phone}
                        </span>
                      </div>
                      {patient.alamat && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {[patient.alamat.kecamatan, patient.alamat.kabupaten, patient.alamat.provinsi].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-xs text-gray-500">
                      {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Belum pernah'}
                    </p>
                    <p className="text-xs text-gray-400">Kunjungan terakhir</p>
                    <Badge
                      variant={patient.status === 'active' ? 'default' : 'secondary'}
                      className={`text-xs mt-1 ${patient.status === 'active' ? 'bg-green-100 text-green-700' : ''}`}
                    >
                      {patient.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
