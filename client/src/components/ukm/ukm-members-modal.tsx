import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Search,
  Download,
  Calendar,
  Mail,
  Phone,
  GraduationCap,
  User,
  Clock,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getAllRegistrations } from "@/lib/api"
import { useAuth } from "@/lib/auth"

interface UKMMembersModalProps {
  ukm: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UKMMembersModal({
  ukm,
  open,
  onOpenChange,
}: UKMMembersModalProps) {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch all registrations to get members for this UKM
  const { data: registrationsResponse } = useQuery({
    queryKey: ["/api/registrations", user?.email],
    queryFn: () => getAllRegistrations(user?.email || ""),
    enabled: !!user?.email && !!ukm,
  })

  if (!ukm) return null

  const registrations = registrationsResponse?.success ? registrationsResponse.data || [] : []
  
  // Filter registrations for this specific UKM
  // Check if ukm is object or array format
  const ukmId = ukm.id_ukm || ukm[0]
  const ukmMembers = registrations.filter((reg: any) => reg[2] === ukmId)
  
  // Filter members based on search term
  const filteredMembers = ukmMembers.filter((member: any) =>
    !searchTerm ||
    member[1]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member[3]?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white/95 backdrop-blur-xl border-white/20">
        <DialogHeader className="border-b border-slate-200/50 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Anggota {ukm.nama_ukm || ukm[1]}
                </DialogTitle>
                <p className="text-slate-600 mt-1">
                  Kelola dan pantau semua anggota yang terdaftar
                </p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 shadow-sm px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              {ukmMembers.length} Anggota
            </Badge>
          </div>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Input
                placeholder="Cari anggota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-blue-400"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            </div>
            <Button
              variant="outline"
              className="border-slate-200 text-slate-600 hover:bg-slate-50 bg-white/80"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>

          {/* Members Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white/80 backdrop-blur-sm">
            {filteredMembers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Anggota</TableHead>
                    <TableHead className="font-semibold text-slate-700">Email</TableHead>
                    <TableHead className="font-semibold text-slate-700">Tanggal Daftar</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member: any, index: number) => (
                    <TableRow key={member[0]} className="hover:bg-slate-50/50 transition-all duration-200">
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 ring-2 ring-slate-200">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold">
                              {member[1]?.substring(0, 2).toUpperCase() || "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-slate-800">
                              {member[1] || "Nama tidak tersedia"}
                            </div>
                            <div className="text-sm text-slate-500 flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              ID: {member[0]}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-slate-700">
                          <Mail className="w-4 h-4 mr-2 text-slate-400" />
                          {member[1] || "Email tidak tersedia"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-slate-700">
                          <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                          {member[4] ? new Date(member[4]).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }) : "Tidak diketahui"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                          Aktif
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {searchTerm ? "Tidak ada anggota yang ditemukan" : "Belum ada anggota"}
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  {searchTerm
                    ? "Coba gunakan kata kunci yang berbeda atau periksa ejaan"
                    : "UKM ini belum memiliki anggota yang terdaftar. Bagikan UKM ini untuk mendapatkan anggota baru."}
                </p>
              </div>
            )}
          </div>

          {/* Statistics */}
          {ukmMembers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total Anggota</p>
                    <p className="text-2xl font-bold text-slate-800">{ukmMembers.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Anggota Baru (7 hari)</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {ukmMembers.filter((member: any) => {
                        if (!member[4]) return false
                        const regDate = new Date(member[4])
                        const today = new Date()
                        const daysDiff = Math.floor((today.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24))
                        return daysDiff <= 7
                      }).length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Pendaftar Hari Ini</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {ukmMembers.filter((member: any) => {
                        if (!member[4]) return false
                        const regDate = new Date(member[4])
                        const today = new Date()
                        return regDate.toDateString() === today.toDateString()
                      }).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}