"use client"

import { useState, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ArrowLeft, ArrowRight, User, MapPin, Phone, CreditCard, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils/cn'
import { patientService } from '@/lib/api/patient-service'
import type { Penjamin } from '@/types'

const steps = [
  { id: 1, label: 'Data Diri', icon: User },
  { id: 2, label: 'Alamat', icon: MapPin },
  { id: 3, label: 'Kontak Darurat', icon: Phone },
  { id: 4, label: 'Penjamin', icon: CreditCard },
]

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  nik: z.string().length(16, 'NIK harus 16 digit').regex(/^\d+$/, 'NIK hanya angka'),
  dateOfBirth: z.string().min(1, 'Tanggal lahir wajib diisi'),
  jenisKelamin: z.enum(['L', 'P'], { error: 'Wajib dipilih' }),
  golonganDarah: z.string().optional(),
  agama: z.string().optional(),
  statusPerkawinan: z.string().optional(),
  phone: z.string().min(8, 'Nomor tidak valid'),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  jalan: z.string().min(1, 'Alamat wajib diisi'),
  rt: z.string().optional(),
  rw: z.string().optional(),
  kelurahan: z.string().optional(),
  kecamatan: z.string().optional(),
  kabupaten: z.string().min(1, 'Kabupaten/Kota wajib diisi'),
  provinsi: z.string().min(1, 'Provinsi wajib diisi'),
  kodePos: z.string().optional(),
  emergencyName: z.string().min(1, 'Nama wajib diisi'),
  emergencyPhone: z.string().min(8, 'Nomor tidak valid'),
  emergencyRelationship: z.string().min(1, 'Hubungan wajib diisi'),
  penjaminJenis: z.string().optional(),
  penjaminNomor: z.string().optional(),
  penjaminKelas: z.string().optional(),
  penjaminSegmen: z.string().optional(),
  penjaminFaskesTk1: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const PROVINSI = [
  'Aceh','Sumatera Utara','Sumatera Barat','Riau','Kepulauan Riau',
  'Jambi','Sumatera Selatan','Kepulauan Bangka Belitung','Bengkulu','Lampung',
  'DKI Jakarta','Jawa Barat','Banten','Jawa Tengah','DI Yogyakarta','Jawa Timur',
  'Bali','Nusa Tenggara Barat','Nusa Tenggara Timur',
  'Kalimantan Barat','Kalimantan Tengah','Kalimantan Selatan','Kalimantan Timur','Kalimantan Utara',
  'Sulawesi Utara','Gorontalo','Sulawesi Tengah','Sulawesi Barat','Sulawesi Selatan','Sulawesi Tenggara',
  'Maluku','Maluku Utara','Papua Barat','Papua',
]

function NewPatientForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromAppointment = searchParams.get('from') === 'appointment'
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', nik: '', dateOfBirth: '', jenisKelamin: undefined,
      golonganDarah: '', agama: '', statusPerkawinan: '', phone: '', email: '',
      jalan: '', rt: '', rw: '', kelurahan: '', kecamatan: '',
      kabupaten: '', provinsi: '', kodePos: '',
      emergencyName: '', emergencyPhone: '', emergencyRelationship: '',
      penjaminJenis: '', penjaminNomor: '', penjaminKelas: '',
      penjaminSegmen: '', penjaminFaskesTk1: '',
    },
  })

  const stepFields: Record<number, (keyof FormValues)[]> = {
    1: ['name', 'nik', 'dateOfBirth', 'jenisKelamin', 'phone'],
    2: ['jalan', 'kabupaten', 'provinsi'],
    3: ['emergencyName', 'emergencyPhone', 'emergencyRelationship'],
    4: [],
  }

  const goNext = async () => {
    const valid = await form.trigger(stepFields[step])
    if (valid) setStep(s => Math.min(s + 1, 4))
  }

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const payload = {
        name: data.name,
        nik: data.nik,
        email: data.email || '',
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        jenisKelamin: data.jenisKelamin,
        golonganDarah: data.golonganDarah,
        agama: data.agama,
        statusPerkawinan: data.statusPerkawinan,
        alamat: {
          jalan: data.jalan,
          rt: data.rt,
          rw: data.rw,
          kelurahan: data.kelurahan,
          kecamatan: data.kecamatan,
          kabupaten: data.kabupaten,
          provinsi: data.provinsi,
          kodePos: data.kodePos,
        },
        emergencyContact: {
          name: data.emergencyName,
          phone: data.emergencyPhone,
          relationship: data.emergencyRelationship,
        },
        penjamin: data.penjaminJenis && data.penjaminJenis !== 'umum' ? [{
          id: '',
          jenis: data.penjaminJenis,
          nomorKartu: data.penjaminNomor || '',
          kelas: data.penjaminKelas,
          segmen: data.penjaminSegmen,
          faskesTk1: data.penjaminFaskesTk1,
          status: 'aktif',
        } as Penjamin] : [],
      }
      await patientService.createPatient(payload)
      router.push(fromAppointment ? '/dashboard/appointments/new?newPatient=true' : '/dashboard/patients')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Gagal mendaftarkan pasien')
    } finally {
      setSubmitting(false)
    }
  }

  const penjaminJenis = form.watch('penjaminJenis')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={fromAppointment ? '/dashboard/appointments/new' : '/dashboard/patients'}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Pasien Baru</h1>
          <p className="text-sm text-gray-500">Isi data pasien dengan lengkap dan benar</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center">
        {steps.map((s, idx) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1 min-w-0">
              <div className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center border-2 text-sm font-semibold shrink-0',
                step > s.id ? 'bg-green-500 border-green-500 text-white'
                  : step === s.id ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              )}>
                {step > s.id ? <Check className="h-4 w-4" /> : s.id}
              </div>
              <span className={cn('text-xs font-medium whitespace-nowrap', step === s.id ? 'text-blue-600' : 'text-gray-400')}>
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={cn('flex-1 h-0.5 mb-5 mx-1', step > s.id ? 'bg-green-400' : 'bg-gray-200')} />
            )}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Step 1: Data Diri */}
          {step === 1 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-blue-600" /> Data Diri Pasien
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap <span className="text-red-500">*</span></FormLabel>
                    <FormControl><Input placeholder="Sesuai KTP" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="nik" render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK <span className="text-red-500">*</span></FormLabel>
                    <FormControl><Input placeholder="16 digit" maxLength={16} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Lahir <span className="text-red-500">*</span></FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="jenisKelamin" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Kelamin <span className="text-red-500">*</span></FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="L">Laki-laki</SelectItem>
                          <SelectItem value="P">Perempuan</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <FormField control={form.control} name="golonganDarah" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gol. Darah</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl><SelectTrigger><SelectValue placeholder="-" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {['A','B','AB','O'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="agama" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agama</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl><SelectTrigger><SelectValue placeholder="-" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {['Islam','Kristen','Katolik','Hindu','Buddha','Konghucu','Lainnya'].map(a => (
                            <SelectItem key={a} value={a.toLowerCase()}>{a}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="statusPerkawinan" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Kawin</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl><SelectTrigger><SelectValue placeholder="-" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="belum_kawin">Belum Kawin</SelectItem>
                          <SelectItem value="kawin">Kawin</SelectItem>
                          <SelectItem value="cerai_hidup">Cerai Hidup</SelectItem>
                          <SelectItem value="cerai_mati">Cerai Mati</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Telepon <span className="text-red-500">*</span></FormLabel>
                    <FormControl><Input placeholder="08xxxxxxxxxx" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="opsional" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
          )}

          {/* Step 2: Alamat */}
          {step === 2 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4 text-blue-600" /> Alamat Domisili
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="jalan" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jalan / Alamat <span className="text-red-500">*</span></FormLabel>
                    <FormControl><Textarea placeholder="Nama jalan, nomor rumah, blok..." rows={2} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="rt" render={({ field }) => (
                    <FormItem><FormLabel>RT</FormLabel><FormControl><Input placeholder="001" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="rw" render={({ field }) => (
                    <FormItem><FormLabel>RW</FormLabel><FormControl><Input placeholder="001" {...field} /></FormControl></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="kelurahan" render={({ field }) => (
                    <FormItem><FormLabel>Kelurahan/Desa</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="kecamatan" render={({ field }) => (
                    <FormItem><FormLabel>Kecamatan</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="kabupaten" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kabupaten/Kota <span className="text-red-500">*</span></FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="provinsi" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provinsi <span className="text-red-500">*</span></FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Pilih provinsi" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {PROVINSI.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="kodePos" render={({ field }) => (
                  <FormItem><FormLabel>Kode Pos</FormLabel><FormControl><Input placeholder="5 digit" maxLength={5} {...field} /></FormControl></FormItem>
                )} />
              </CardContent>
            </Card>
          )}

          {/* Step 3: Kontak Darurat */}
          {step === 3 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Phone className="h-4 w-4 text-blue-600" /> Kontak Darurat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="emergencyName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama <span className="text-red-500">*</span></FormLabel>
                    <FormControl><Input placeholder="Nama lengkap" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="emergencyRelationship" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hubungan <span className="text-red-500">*</span></FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {['Suami/Istri','Orang Tua','Anak','Saudara','Kerabat','Teman','Lainnya'].map(r => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="emergencyPhone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>No. Telepon <span className="text-red-500">*</span></FormLabel>
                    <FormControl><Input placeholder="08xxxxxxxxxx" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
          )}

          {/* Step 4: Penjamin */}
          {step === 4 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-4 w-4 text-blue-600" /> Data Penjamin / Asuransi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                  Opsional — kosongkan jika pasien membayar mandiri (umum)
                </div>
                <FormField control={form.control} name="penjaminJenis" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Penjamin</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Pilih jenis" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="bpjs_kesehatan">BPJS Kesehatan</SelectItem>
                        <SelectItem value="bpjs_ketenagakerjaan">BPJS Ketenagakerjaan</SelectItem>
                        <SelectItem value="asuransi">Asuransi Swasta</SelectItem>
                        <SelectItem value="umum">Umum (Mandiri)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                {penjaminJenis && penjaminJenis !== 'umum' && (
                  <>
                    <FormField control={form.control} name="penjaminNomor" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Kartu</FormLabel>
                        <FormControl>
                          <Input placeholder={penjaminJenis === 'bpjs_kesehatan' ? '13 digit nomor BPJS' : 'Nomor kartu'} {...field} />
                        </FormControl>
                      </FormItem>
                    )} />
                    {penjaminJenis === 'bpjs_kesehatan' && (
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="penjaminKelas" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kelas</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl><SelectTrigger><SelectValue placeholder="-" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="1">Kelas 1</SelectItem>
                                <SelectItem value="2">Kelas 2</SelectItem>
                                <SelectItem value="3">Kelas 3</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="penjaminSegmen" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Segmen</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl><SelectTrigger><SelectValue placeholder="-" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {['PBI','PBPU','PPU','BP'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )} />
                      </div>
                    )}
                    <FormField control={form.control} name="penjaminFaskesTk1" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Faskes Tingkat 1</FormLabel>
                        <FormControl><Input placeholder="Nama puskesmas/klinik BPJS" {...field} /></FormControl>
                      </FormItem>
                    )} />
                  </>
                )}
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{submitError}</div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" onClick={step === 1 ? () => router.push('/dashboard/patients') : () => setStep(s => s - 1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {step === 1 ? 'Batal' : 'Kembali'}
            </Button>
            {step < 4 ? (
              <Button type="button" onClick={goNext}>
                Lanjut <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={submitting} className="bg-green-600 hover:bg-green-700">
                {submitting ? 'Menyimpan...' : 'Daftarkan Pasien'}
                {!submitting && <Check className="ml-2 h-4 w-4" />}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}

export default function NewPatientPage() {
  return (
    <Suspense>
      <NewPatientForm />
    </Suspense>
  )
}
