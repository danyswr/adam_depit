"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  University,
  Users,
  UserPlus,
  Settings,
  BarChart3,
  Calendar,
  Eye,
  Sparkles,
  Crown,
  Shield,
  Activity,
  Target,
  Clock,
  Filter,
  Download,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useUKMs, useDeleteUKM } from "@/hooks/use-ukm"
import { useQuery } from "@tanstack/react-query"
import UKMFormModal from "@/components/ukm/ukm-form-modal"
import UKMDetailModal from "@/components/ukm/ukm-detail-modal"
import UKMMembersModal from "@/components/ukm/ukm-members-modal"
import type { UKM } from "@shared/schema"
import { Link } from "wouter"
import { getAllRegistrations } from "@/lib/api"

export default function Admin() {
  const { user, isAdmin } = useAuth()
  const [selectedUKM, setSelectedUKM] = useState<UKM | null>(null)
  const [editingUKM, setEditingUKM] = useState<UKM | null>(null)
  const [deletingUKM, setDeletingUKM] = useState<UKM | null>(null)
  const [showUKMForm, setShowUKMForm] = useState(false)
  const [showMembersModal, setShowMembersModal] = useState(false)
  const [selectedUKMForMembers, setSelectedUKMForMembers] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { data: ukmsResponse, isLoading, refetch } = useUKMs()
  const deleteMutation = useDeleteUKM()

  // Fetch registration data for statistics
  const { data: registrationsResponse } = useQuery({
    queryKey: ["/api/registrations", user?.email],
    queryFn: () => getAllRegistrations(user?.email || ""),
    enabled: !!user?.email,
  })

  const ukms = ukmsResponse?.success ? ukmsResponse.data || [] : []
  const registrations = registrationsResponse?.success ? registrationsResponse.data || [] : []

  // Filter UKMs by current admin user - check both userId and email
  const adminUKMs = ukms.filter((ukm: any) => 
    ukm[4] === user?.userId || ukm[4] === user?.email
  )

  // Filter UKMs based on search term AND admin ownership
  const filteredUKMs = adminUKMs.filter(
    (ukm: any) =>
      !searchTerm ||
      ukm[1]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ukm[3]?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Calculate real admin stats from actual data
  const adminUKMIds = adminUKMs.map((ukm: any) => ukm[0])
  const adminRegistrations = registrations.filter((reg: any) => adminUKMIds.includes(reg[2]))

  const adminStats = {
    totalUKM: adminUKMs.length,
    totalMembers: adminRegistrations.length,
    newRegistrations: adminRegistrations.filter((reg: any) => {
      const regDate = new Date(reg[4])
      const today = new Date()
      const daysDiff = Math.floor((today.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff <= 7
    }).length,
    dailyActivity: adminRegistrations.filter((reg: any) => {
      const regDate = new Date(reg[4])
      const today = new Date()
      const daysDiff = Math.floor((today.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff === 0
    }).length,
  }

  const handleDeleteUKM = async () => {
    if (!deletingUKM) return
    await deleteMutation.mutateAsync(deletingUKM.id_ukm)
    setDeletingUKM(null)
  }

  const handleEditUKM = (ukm: UKM) => {
    setEditingUKM(ukm)
    setShowUKMForm(true)
  }

  const handleFormSuccess = () => {
    setEditingUKM(null)
    refetch()
  }

  const handleViewMembers = (ukm: any) => {
    setSelectedUKMForMembers(ukm)
    setShowMembersModal(true)
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-2 h-2 bg-purple-400 rounded-full"></div>
          <div className="absolute top-20 right-20 w-2 h-2 bg-purple-300 rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-2 h-2 bg-purple-400 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-2 h-2 bg-purple-300 rounded-full"></div>
        </div>
        <Card className="w-full max-w-md mx-4 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardContent className="pt-8 pb-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Akses Ditolak</h1>
              <p className="text-white/70 mb-8 leading-relaxed">
                Halaman ini khusus untuk administrator. Silakan login dengan akun admin untuk melanjutkan.
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-3">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-16 left-16 w-2 h-2 bg-amber-400 rounded-full"></div>
        <div className="absolute top-32 right-32 w-2 h-2 bg-amber-300 rounded-full"></div>
        <div className="absolute bottom-32 left-32 w-2 h-2 bg-amber-400 rounded-full"></div>
        <div className="absolute bottom-16 right-16 w-2 h-2 bg-amber-300 rounded-full"></div>
      </div>

      <div className="relative z-10">
        {/* Top Navigation */}
        <nav className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-slate-500">Portfolio UKM Management</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </Button>
                <Avatar className="h-10 w-10 ring-2 ring-amber-200 ring-offset-2">
                  <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold">
                    {user?.namaMahasiswa.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Sparkles className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold">Selamat Datang, {user?.namaMahasiswa}!</h2>
                        <p className="text-white/90 text-lg">Kelola UKM Anda dengan mudah dan efisien</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-white/80">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date().toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                        <Shield className="w-3 h-3 mr-1" />
                        Administrator
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent backdrop-blur-sm"
                      onClick={() => refetch()}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                    <Button
                      onClick={() => setShowUKMForm(true)}
                      className="bg-white text-orange-600 hover:bg-white/90 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah UKM
                      <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total UKM */}
            <Card className="bg-white/70 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">Total UKM</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-slate-800">{adminStats.totalUKM}</p>
                      <div className="flex items-center text-green-600 text-xs">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        +12%
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">UKM yang dikelola</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <University className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-3/4 transition-all duration-1000"></div>
                </div>
              </CardContent>
            </Card>

            {/* Total Members */}
            <Card className="bg-white/70 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">Total Anggota</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-slate-800">{adminStats.totalMembers}</p>
                      <div className="flex items-center text-green-600 text-xs">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        +8%
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">Anggota aktif</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-4/5 transition-all duration-1000"></div>
                </div>
              </CardContent>
            </Card>

            {/* New Registrations */}
            <Card className="bg-white/70 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">Pendaftar Baru</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-slate-800">{adminStats.newRegistrations}</p>
                      <div className="flex items-center text-green-600 text-xs">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        +24%
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">7 hari terakhir</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <UserPlus className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-2/3 transition-all duration-1000"></div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Activity */}
            <Card className="bg-white/70 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-1">Aktivitas Hari Ini</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-slate-800">{adminStats.dailyActivity}</p>
                      <div className="flex items-center text-green-600 text-xs">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        +15%
                      </div>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">Pendaftar hari ini</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Activity className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-1/2 transition-all duration-1000"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* UKM Management Table */}
          <Card className="bg-white/70 backdrop-blur-xl border-white/20 shadow-xl">
            <CardHeader className="border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Manajemen UKM
                  </CardTitle>
                  <p className="text-slate-600 mt-1">Kelola dan pantau semua UKM yang Anda buat</p>
                </div>
                <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
                  <div className="relative">
                    <Input
                      placeholder="Cari UKM..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full lg:w-64 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-slate-200 text-slate-600 hover:bg-slate-50 bg-white/80 backdrop-blur-sm"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-200 text-slate-600 hover:bg-slate-50 bg-white/80 backdrop-blur-sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50 border-b border-slate-200/50">
                      <TableHead className="font-semibold text-slate-700 py-4">UKM</TableHead>
                      <TableHead className="font-semibold text-slate-700">Deskripsi</TableHead>
                      <TableHead className="font-semibold text-slate-700">Status</TableHead>
                      <TableHead className="font-semibold text-slate-700">Anggota</TableHead>
                      <TableHead className="font-semibold text-slate-700">Dibuat</TableHead>
                      <TableHead className="font-semibold text-slate-700 text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUKMs.map((ukm: any, index: number) => (
                      <TableRow
                        key={ukm[0]}
                        className="hover:bg-slate-50/50 transition-all duration-200 border-b border-slate-100 group"
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <Avatar className="h-14 w-14 ring-2 ring-slate-200 group-hover:ring-blue-300 transition-all duration-200">
                                <img
                                  src={
                                    ukm[2] ||
                                    "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
                                  }
                                  alt={ukm[1]}
                                  className="w-full h-full object-cover"
                                />
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold">
                                  {ukm[1]?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                                {ukm[1]}
                              </div>
                              <div className="text-xs text-slate-500 flex items-center mt-1">
                                <Clock className="w-3 h-3 mr-1" />
                                Aktif sejak {new Date().getFullYear()}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-slate-700 text-sm line-clamp-2 leading-relaxed">{ukm[3]}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 border-green-200 shadow-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                            Aktif
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 hover:bg-blue-50 text-blue-600 p-2 h-auto"
                            onClick={() => handleViewMembers(ukm)}
                          >
                            <Users className="w-4 h-4" />
                            <span className="font-medium">
                              {registrations.filter((reg: any) => reg[2] === ukm[0]).length} anggota
                            </span>
                          </Button>
                        </TableCell>
                        <TableCell className="text-slate-700 font-medium">
                          {new Date().toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-white/80 backdrop-blur-sm shadow-sm"
                              onClick={() =>
                                setSelectedUKM({
                                  id_ukm: ukm[0],
                                  nama_ukm: ukm[1],
                                  gambar_url: ukm[2],
                                  deskripsi: ukm[3],
                                  id_users: ukm[4],
                                  prestasi: ukm[5],
                                })
                              }
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-amber-200 text-amber-600 hover:bg-amber-50 bg-white/80 backdrop-blur-sm shadow-sm"
                              onClick={() =>
                                handleEditUKM({
                                  id_ukm: ukm[0],
                                  nama_ukm: ukm[1],
                                  gambar_url: ukm[2],
                                  deskripsi: ukm[3],
                                  id_users: ukm[4],
                                  prestasi: ukm[5],
                                })
                              }
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50 bg-white/80 backdrop-blur-sm shadow-sm"
                              onClick={() =>
                                setDeletingUKM({
                                  id_ukm: ukm[0],
                                  nama_ukm: ukm[1],
                                  gambar_url: ukm[2],
                                  deskripsi: ukm[3],
                                  id_users: ukm[4],
                                  prestasi: ukm[5],
                                })
                              }
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredUKMs.length === 0 && !isLoading && (
                <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-blue-50">
                  <div className="w-24 h-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <University className="h-12 w-12 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {searchTerm ? "Tidak ada UKM yang ditemukan" : "Belum ada UKM"}
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                    {searchTerm
                      ? "Coba gunakan kata kunci yang berbeda atau periksa ejaan Anda"
                      : "Mulai perjalanan Anda dengan menambahkan UKM pertama dan bangun komunitas yang luar biasa"}
                  </p>
                  {!searchTerm && (
                    <Button
                      onClick={() => setShowUKMForm(true)}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-3"
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Tambah UKM Pertama
                      <Sparkles className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <UKMFormModal open={showUKMForm} onOpenChange={setShowUKMForm} ukm={editingUKM} onSuccess={handleFormSuccess} />
      <UKMDetailModal ukm={selectedUKM} open={!!selectedUKM} onOpenChange={(open) => !open && setSelectedUKM(null)} />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingUKM} onOpenChange={() => setDeletingUKM(null)}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl">
          <AlertDialogHeader>
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl flex items-center justify-center mr-4 shadow-xl">
                <Trash2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <AlertDialogTitle className="text-2xl font-bold text-slate-800">Hapus UKM</AlertDialogTitle>
                <p className="text-slate-600 text-sm">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>
            <AlertDialogDescription className="text-slate-700 bg-red-50 p-6 rounded-2xl border border-red-200 leading-relaxed">
              Apakah Anda yakin ingin menghapus UKM <strong>{deletingUKM?.nama_ukm}</strong>? Semua data terkait
              termasuk anggota, kegiatan, dan riwayat akan ikut terhapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 pt-6">
            <AlertDialogCancel className="border-slate-200 text-slate-600 hover:bg-slate-50 bg-white/80 backdrop-blur-sm px-6">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUKM}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-6"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus UKM
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* UKM Members Modal */}
      <UKMMembersModal
        ukm={selectedUKMForMembers}
        open={showMembersModal}
        onOpenChange={setShowMembersModal}
      />
    </div>
  )
}