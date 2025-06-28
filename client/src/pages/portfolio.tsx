"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import UKMCard from "@/components/ukm/ukm-card"
import UKMDetailModal from "@/components/ukm/ukm-detail-modal"
import {
  Search,
  Loader2,
  Grid3X3,
  List,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  Calendar,
  ArrowUpDown,
  X,
  Zap,
  Target,
  Compass,
  BookOpen,
  Music,
  Camera,
  Code,
  Heart,
  Briefcase,
} from "lucide-react"
import type { UKM } from "@shared/schema"
import { useUKMs } from "@/hooks/use-ukm"

export default function Portfolio() {
  const [selectedUKM, setSelectedUKM] = useState<UKM | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const { data: ukmsResponse, isLoading } = useUKMs()
  const ukms = ukmsResponse?.success ? ukmsResponse.data || [] : []

  // Categories with icons and colors
  const categories = [
    { value: "all", label: "Semua Kategori", icon: Target, color: "slate", count: ukms.length },
    { value: "seni", label: "Seni & Budaya", icon: Music, color: "purple", count: 0 },
    { value: "olahraga", label: "Olahraga", icon: Zap, color: "green", count: 0 },
    { value: "teknologi", label: "Teknologi", icon: Code, color: "blue", count: 0 },
    { value: "sosial", label: "Sosial", icon: Heart, color: "pink", count: 0 },
    { value: "akademik", label: "Akademik", icon: BookOpen, color: "amber", count: 0 },
    { value: "fotografi", label: "Fotografi", icon: Camera, color: "indigo", count: 0 },
    { value: "bisnis", label: "Bisnis", icon: Briefcase, color: "emerald", count: 0 },
  ]

  // Enhanced filtering and sorting
  const filteredAndSortedUKMs = useMemo(() => {
    const filtered = ukms.filter((ukm: any) => {
      const matchesSearch =
        !searchTerm ||
        ukm[1]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ukm[3]?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === "all" || getCategoryFromName(ukm[1]).includes(categoryFilter)

      return matchesSearch && matchesCategory
    })

    // Sort the filtered results
    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case "name":
          return a[1].localeCompare(b[1])
        case "newest":
          return new Date(b[4]).getTime() - new Date(a[4]).getTime()
        case "oldest":
          return new Date(a[4]).getTime() - new Date(b[4]).getTime()
        case "popular":
          return Math.random() - 0.5 // Random for demo
        default:
          return 0
      }
    })

    return filtered
  }, [ukms, searchTerm, categoryFilter, sortBy])

  // Helper function to determine category from UKM name
  const getCategoryFromName = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("seni") || lowerName.includes("musik") || lowerName.includes("teater")) return "seni"
    if (lowerName.includes("olahraga") || lowerName.includes("basket") || lowerName.includes("futsal"))
      return "olahraga"
    if (lowerName.includes("teknologi") || lowerName.includes("robotika") || lowerName.includes("komputer"))
      return "teknologi"
    if (lowerName.includes("sosial") || lowerName.includes("peduli")) return "sosial"
    if (lowerName.includes("akademik") || lowerName.includes("penelitian")) return "akademik"
    if (lowerName.includes("fotografi") || lowerName.includes("photo")) return "fotografi"
    if (lowerName.includes("bisnis") || lowerName.includes("entrepreneur")) return "bisnis"
    return "all"
  }

  // Update category counts
  const updatedCategories = categories.map((cat) => ({
    ...cat,
    count:
      cat.value === "all"
        ? ukms.length
        : ukms.filter((ukm: any) => getCategoryFromName(ukm[1]).includes(cat.value)).length,
  }))

  const clearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("all")
    setSortBy("name")
  }

  const stats = {
    totalUKM: ukms.length,
    activeMembers: Math.floor(Math.random() * 1000) + 500,
    achievements: Math.floor(Math.random() * 100) + 50,
    events: Math.floor(Math.random() * 200) + 100,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 left-10 w-2 h-2 bg-indigo-400 rounded-full"></div>
        <div className="absolute top-20 right-20 w-2 h-2 bg-blue-400 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-indigo-400 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-blue-400 rounded-full"></div>
        <div className="absolute top-32 left-32 w-1 h-1 bg-purple-400 rounded-full"></div>
        <div className="absolute top-48 right-48 w-1 h-1 bg-indigo-300 rounded-full"></div>
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-400/20 to-orange-400/20 rounded-full blur-3xl translate-y-48 -translate-x-48"></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Compass className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight">
                Portfolio UKM
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
                Jelajahi berbagai Unit Kegiatan Mahasiswa dan temukan komunitas yang sesuai dengan passion Anda
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-1">{stats.totalUKM}</div>
                  <div className="text-sm text-slate-600">Total UKM</div>
                </div>
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-1">{stats.activeMembers}</div>
                  <div className="text-sm text-slate-600">Anggota Aktif</div>
                </div>
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-1">{stats.achievements}</div>
                  <div className="text-sm text-slate-600">Prestasi</div>
                </div>
                <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-800 mb-1">{stats.events}</div>
                  <div className="text-sm text-slate-600">Event</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Search Bar */}
            <Card className="mb-8 bg-white/80 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder="Cari UKM berdasarkan nama atau deskripsi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 h-14 text-lg bg-white/80 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400 rounded-2xl shadow-lg"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6" />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 text-slate-400 hover:text-slate-600"
                        onClick={() => setSearchTerm("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Quick Filters */}
                  <div className="flex flex-wrap lg:flex-nowrap gap-3">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full lg:w-48 h-14 bg-white/80 backdrop-blur-sm border-slate-200 rounded-2xl shadow-lg">
                        <SelectValue placeholder="Kategori" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl border-white/20">
                        {updatedCategories.map((category) => {
                          const IconComponent = category.icon
                          return (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center">
                                <IconComponent className="w-4 h-4 mr-2" />
                                {category.label}
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {category.count}
                                </Badge>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full lg:w-48 h-14 bg-white/80 backdrop-blur-sm border-slate-200 rounded-2xl shadow-lg">
                        <SelectValue placeholder="Urutkan" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl border-white/20">
                        <SelectItem value="name">
                          <div className="flex items-center">
                            <ArrowUpDown className="w-4 h-4 mr-2" />
                            Nama A-Z
                          </div>
                        </SelectItem>
                        <SelectItem value="newest">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Terbaru
                          </div>
                        </SelectItem>
                        <SelectItem value="oldest">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Terlama
                          </div>
                        </SelectItem>
                        <SelectItem value="popular">
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Terpopuler
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`h-14 w-14 rounded-2xl shadow-lg border-slate-200 ${
                          viewMode === "grid"
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : "bg-white/80 backdrop-blur-sm"
                        }`}
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid3X3 className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`h-14 w-14 rounded-2xl shadow-lg border-slate-200 ${
                          viewMode === "list"
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : "bg-white/80 backdrop-blur-sm"
                        }`}
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {(searchTerm || categoryFilter !== "all" || sortBy !== "name") && (
                  <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-200">
                    <span className="text-sm font-medium text-slate-600">Filter aktif:</span>
                    {searchTerm && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Pencarian: "{searchTerm}"
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-2 hover:bg-blue-100"
                          onClick={() => setSearchTerm("")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {categoryFilter !== "all" && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        Kategori: {updatedCategories.find((c) => c.value === categoryFilter)?.label}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-2 hover:bg-purple-100"
                          onClick={() => setCategoryFilter("all")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {sortBy !== "name" && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Urutan: {sortBy === "newest" ? "Terbaru" : sortBy === "oldest" ? "Terlama" : "Terpopuler"}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-2 hover:bg-green-100"
                          onClick={() => setSortBy("name")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Hapus Semua
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category Pills */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {updatedCategories.slice(0, 8).map((category) => {
                  const IconComponent = category.icon
                  const isActive = categoryFilter === category.value
                  return (
                    <Button
                      key={category.value}
                      variant={isActive ? "default" : "outline"}
                      onClick={() => setCategoryFilter(category.value)}
                      className={`h-12 px-6 rounded-2xl shadow-lg transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 text-white shadow-xl transform scale-105`
                          : "bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 hover:bg-slate-50 hover:scale-105"
                      }`}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {category.label}
                      <Badge
                        variant="outline"
                        className={`ml-2 text-xs ${
                          isActive ? "bg-white/20 text-white border-white/30" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {category.count}
                      </Badge>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {filteredAndSortedUKMs.length > 0 ? (
                    <>
                      Menampilkan {filteredAndSortedUKMs.length} UKM
                      {searchTerm && (
                        <span className="text-blue-600"> untuk "{searchTerm}"</span>
                      )}
                    </>
                  ) : (
                    "Tidak ada UKM ditemukan"
                  )}
                </h2>
                <p className="text-slate-600">
                  {categoryFilter !== "all" && (
                    <>
                      Kategori: {updatedCategories.find((c) => c.value === categoryFilter)?.label} •{" "}
                    </>
                  )}
                  Diurutkan berdasarkan{" "}
                  {sortBy === "name"
                    ? "nama"
                    : sortBy === "newest"
                      ? "terbaru"
                      : sortBy === "oldest"
                        ? "terlama"
                        : "popularitas"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* UKM Grid/List */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Memuat UKM...</h3>
                <p className="text-slate-600">Sedang mengambil data terbaru untuk Anda</p>
              </div>
            ) : filteredAndSortedUKMs.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    : "space-y-6"
                }
              >
                {filteredAndSortedUKMs.map((ukm: any, index) => (
                  <div
                    key={ukm[0]}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <UKMCard
                      ukm={{
                        id_ukm: ukm[0],
                        nama_ukm: ukm[1],
                        gambar_url: ukm[2],
                        deskripsi: ukm[3],
                        id_users: ukm[4],
                        prestasi: ukm[5],
                      }}
                      onViewDetail={setSelectedUKM}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Search className="h-16 w-16 text-slate-400" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-4">Tidak ada UKM ditemukan</h3>
                <p className="text-xl text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                  {searchTerm
                    ? `Tidak ada UKM yang cocok dengan pencarian "${searchTerm}"`
                    : "Coba ubah filter atau kata kunci pencarian Anda"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-3"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Hapus Semua Filter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 bg-white/80 backdrop-blur-sm shadow-lg px-8 py-3"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Reset Pencarian
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* UKM Detail Modal */}
      <UKMDetailModal
        ukm={selectedUKM}
        open={!!selectedUKM}
        onOpenChange={(open) => !open && setSelectedUKM(null)}
      />
    </div>
  )
}
