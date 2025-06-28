"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UKMCard from "@/components/ukm/ukm-card";
import UKMDetailModal from "@/components/ukm/ukm-detail-modal";
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
  Filter,
  SlidersHorizontal,
  ArrowUpRight,
  Clock,
  MapPin,
} from "lucide-react";
import type { UKM } from "@shared/schema";
import { useUKMs } from "@/hooks/use-ukm";

export default function Portfolio() {
  const [selectedUKM, setSelectedUKM] = useState<UKM | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const { data: ukmsResponse, isLoading } = useUKMs();
  const ukms = ukmsResponse?.success ? ukmsResponse.data || [] : [];

  // Categories with icons and colors - Updated to amber theme
  const categories = [
    {
      value: "all",
      label: "Semua Kategori",
      icon: Target,
      color: "amber",
      count: ukms.length,
    },
    {
      value: "seni",
      label: "Seni & Budaya",
      icon: Music,
      color: "purple",
      count: 0,
    },
    {
      value: "olahraga",
      label: "Olahraga",
      icon: Zap,
      color: "green",
      count: 0,
    },
    {
      value: "teknologi",
      label: "Teknologi",
      icon: Code,
      color: "blue",
      count: 0,
    },
    { value: "sosial", label: "Sosial", icon: Heart, color: "pink", count: 0 },
    {
      value: "akademik",
      label: "Akademik",
      icon: BookOpen,
      color: "amber",
      count: 0,
    },
    {
      value: "fotografi",
      label: "Fotografi",
      icon: Camera,
      color: "indigo",
      count: 0,
    },
    {
      value: "bisnis",
      label: "Bisnis",
      icon: Briefcase,
      color: "emerald",
      count: 0,
    },
  ];

  // Enhanced filtering and sorting
  const filteredAndSortedUKMs = useMemo(() => {
    const filtered = ukms.filter((ukm: any) => {
      const matchesSearch =
        !searchTerm ||
        ukm[1]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ukm[3]?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ||
        getCategoryFromName(ukm[1]).includes(categoryFilter);

      return matchesSearch && matchesCategory;
    });

    // Sort the filtered results
    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case "name":
          return a[1].localeCompare(b[1]);
        case "newest":
          return new Date(b[4]).getTime() - new Date(a[4]).getTime();
        case "oldest":
          return new Date(a[4]).getTime() - new Date(b[4]).getTime();
        case "popular":
          return Math.random() - 0.5; // Random for demo
        default:
          return 0;
      }
    });

    return filtered;
  }, [ukms, searchTerm, categoryFilter, sortBy]);

  // Helper function to determine category from UKM name
  const getCategoryFromName = (name: string) => {
    if (!name || typeof name !== "string") return "all";
    const lowerName = name.toLowerCase();
    if (
      lowerName.includes("seni") ||
      lowerName.includes("musik") ||
      lowerName.includes("teater")
    )
      return "seni";
    if (
      lowerName.includes("olahraga") ||
      lowerName.includes("basket") ||
      lowerName.includes("futsal")
    )
      return "olahraga";
    if (
      lowerName.includes("teknologi") ||
      lowerName.includes("robotika") ||
      lowerName.includes("komputer")
    )
      return "teknologi";
    if (lowerName.includes("sosial") || lowerName.includes("peduli"))
      return "sosial";
    if (lowerName.includes("akademik") || lowerName.includes("penelitian"))
      return "akademik";
    if (lowerName.includes("fotografi") || lowerName.includes("photo"))
      return "fotografi";
    if (lowerName.includes("bisnis") || lowerName.includes("entrepreneur"))
      return "bisnis";
    return "all";
  };

  // Update category counts
  const updatedCategories = categories.map((cat) => ({
    ...cat,
    count:
      cat.value === "all"
        ? ukms.length
        : ukms.filter((ukm: any) =>
            getCategoryFromName(ukm[1]).includes(cat.value),
          ).length,
  }));

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setSortBy("name");
  };

  const stats = {
    totalUKM: ukms.length,
    activeMembers: Math.floor(Math.random() * 1000) + 500,
    achievements: Math.floor(Math.random() * 100) + 50,
    events: Math.floor(Math.random() * 200) + 100,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern - Consistent with admin */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23f59e0b fillOpacity=0.03%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className="relative z-10">
        {/* Hero Section - Updated to amber theme */}
        <section className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Header */}
            <div className="text-center mb-16">
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Compass className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-800 via-yellow-700 to-orange-700 bg-clip-text text-transparent mb-6 leading-tight">
                Portfolio UKM
              </h1>
              <p className="text-xl md:text-2xl text-amber-700/80 max-w-4xl mx-auto leading-relaxed mb-12">
                Jelajahi berbagai Unit Kegiatan Mahasiswa dan temukan komunitas
                yang sesuai dengan passion Anda
              </p>

              {/* Enhanced Stats Grid - Updated to amber theme */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                <Card className="bg-white/70 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Target className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-amber-800 mb-1">
                        {stats.totalUKM}
                      </div>
                      <div className="text-sm text-amber-700 font-medium">
                        Total UKM
                      </div>
                      <div className="flex items-center text-green-600 text-xs mt-2">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        +15% bulan ini
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-amber-800 mb-1">
                        {stats.activeMembers}
                      </div>
                      <div className="text-sm text-amber-700 font-medium">
                        Anggota Aktif
                      </div>
                      <div className="flex items-center text-green-600 text-xs mt-2">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        +8% minggu ini
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Award className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-amber-800 mb-1">
                        {stats.achievements}
                      </div>
                      <div className="text-sm text-amber-700 font-medium">
                        Prestasi
                      </div>
                      <div className="flex items-center text-green-600 text-xs mt-2">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        +24% tahun ini
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Calendar className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-amber-800 mb-1">
                        {stats.events}
                      </div>
                      <div className="text-sm text-amber-700 font-medium">
                        Event
                      </div>
                      <div className="flex items-center text-green-600 text-xs mt-2">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        +12% semester ini
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section - Updated to amber theme */}
        <section className="pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Search Card */}
            <Card className="mb-8 bg-white/80 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Enhanced Search Input */}
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder="Cari UKM berdasarkan nama atau deskripsi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-14 pr-12 h-16 text-lg bg-white/90 backdrop-blur-sm border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-2xl shadow-lg transition-all duration-300"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center">
                      <Search className="text-white h-5 w-5" />
                    </div>
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-12 w-12 text-amber-500 hover:text-amber-700 hover:bg-amber-100 rounded-xl"
                        onClick={() => setSearchTerm("")}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    )}
                  </div>

                  {/* Enhanced Filter Controls */}
                  <div className="flex flex-wrap lg:flex-nowrap gap-4">
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="w-full lg:w-56 h-16 bg-white/90 backdrop-blur-sm border-amber-200 rounded-2xl shadow-lg text-base">
                        <div className="flex items-center">
                          <Filter className="w-5 h-5 mr-3 text-amber-600" />
                          <SelectValue placeholder="Pilih Kategori" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl">
                        {updatedCategories.map((category) => {
                          const IconComponent = category.icon;
                          return (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                              className="py-3"
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-8 h-8 bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 rounded-lg flex items-center justify-center mr-3`}
                                >
                                  <IconComponent className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-medium text-amber-800">
                                  {category.label}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="ml-auto text-xs border-amber-200 text-amber-700"
                                >
                                  {category.count}
                                </Badge>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full lg:w-56 h-16 bg-white/90 backdrop-blur-sm border-amber-200 rounded-2xl shadow-lg text-base">
                        <div className="flex items-center">
                          <SlidersHorizontal className="w-5 h-5 mr-3 text-amber-600" />
                          <SelectValue placeholder="Urutkan" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl">
                        <SelectItem value="name" className="py-3">
                          <div className="flex items-center">
                            <ArrowUpDown className="w-4 h-4 mr-3 text-amber-600" />
                            <span className="font-medium text-amber-800">
                              Nama A-Z
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="newest" className="py-3">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-3 text-amber-600" />
                            <span className="font-medium text-amber-800">
                              Terbaru
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="oldest" className="py-3">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-3 text-amber-600" />
                            <span className="font-medium text-amber-800">
                              Terlama
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="popular" className="py-3">
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-3 text-amber-600" />
                            <span className="font-medium text-amber-800">
                              Terpopuler
                            </span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {/* View Mode Toggle - Updated to amber theme */}
                    <div className="flex gap-2 bg-amber-100 p-2 rounded-2xl">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-12 w-12 rounded-xl transition-all duration-300 ${
                          viewMode === "grid"
                            ? "bg-white text-amber-600 shadow-lg scale-105"
                            : "text-amber-600 hover:text-amber-800"
                        }`}
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid3X3 className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-12 w-12 rounded-xl transition-all duration-300 ${
                          viewMode === "list"
                            ? "bg-white text-amber-600 shadow-lg scale-105"
                            : "text-amber-600 hover:text-amber-800"
                        }`}
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Active Filters Display - Updated to amber theme */}
                {(searchTerm ||
                  categoryFilter !== "all" ||
                  sortBy !== "name") && (
                  <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-amber-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center">
                        <Filter className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-amber-800">
                        Filter Aktif:
                      </span>
                    </div>
                    {searchTerm && (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-4 py-2 rounded-xl">
                        <Search className="w-3 h-3 mr-2" />"{searchTerm}"
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 ml-2 hover:bg-amber-200 rounded-lg"
                          onClick={() => setSearchTerm("")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {categoryFilter !== "all" && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-4 py-2 rounded-xl">
                        <Target className="w-3 h-3 mr-2" />
                        {
                          updatedCategories.find(
                            (c) => c.value === categoryFilter,
                          )?.label
                        }
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 ml-2 hover:bg-yellow-200 rounded-lg"
                          onClick={() => setCategoryFilter("all")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    {sortBy !== "name" && (
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200 px-4 py-2 rounded-xl">
                        <ArrowUpDown className="w-3 h-3 mr-2" />
                        {sortBy === "newest"
                          ? "Terbaru"
                          : sortBy === "oldest"
                            ? "Terlama"
                            : "Terpopuler"}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 ml-2 hover:bg-orange-200 rounded-lg"
                          onClick={() => setSortBy("name")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="text-amber-700 hover:text-amber-800 hover:bg-amber-50 border-amber-200 rounded-xl px-4 py-2 bg-transparent"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Hapus Semua
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Category Pills - Updated to amber theme */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-4">
                {updatedCategories.slice(0, 8).map((category) => {
                  const IconComponent = category.icon;
                  const isActive = categoryFilter === category.value;
                  return (
                    <Button
                      key={category.value}
                      variant={isActive ? "default" : "outline"}
                      onClick={() => setCategoryFilter(category.value)}
                      className={`h-14 px-6 rounded-2xl shadow-lg transition-all duration-300 group ${
                        isActive
                          ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-xl transform scale-105 hover:scale-110"
                          : "bg-white/80 backdrop-blur-sm border-amber-200 text-amber-700 hover:bg-amber-50 hover:scale-105 hover:shadow-xl"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 transition-all duration-300 ${
                          isActive
                            ? "bg-white/20"
                            : "bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:from-amber-600 group-hover:to-yellow-600"
                        }`}
                      >
                        <IconComponent
                          className={`w-4 h-4 ${isActive ? "text-white" : "text-white"}`}
                        />
                      </div>
                      <span className="font-semibold">{category.label}</span>
                      <Badge
                        variant="outline"
                        className={`ml-3 text-xs transition-all duration-300 ${
                          isActive
                            ? "bg-white/20 text-white border-white/30"
                            : "bg-amber-100 text-amber-700 group-hover:bg-amber-200 group-hover:text-amber-800"
                        }`}
                      >
                        {category.count}
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Results Header - Updated to amber theme */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20">
                <h2 className="text-2xl font-bold text-amber-800 mb-2 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center mr-3">
                    <Compass className="w-4 h-4 text-white" />
                  </div>
                  {filteredAndSortedUKMs.length > 0 ? (
                    <>
                      {filteredAndSortedUKMs.length} UKM Ditemukan
                      {searchTerm && (
                        <span className="text-amber-600 ml-2">
                          untuk "{searchTerm}"
                        </span>
                      )}
                    </>
                  ) : (
                    "Tidak ada UKM ditemukan"
                  )}
                </h2>
                <div className="flex items-center gap-4 text-sm text-amber-700">
                  {categoryFilter !== "all" && (
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      {
                        updatedCategories.find(
                          (c) => c.value === categoryFilter,
                        )?.label
                      }
                    </div>
                  )}
                  <div className="flex items-center">
                    <ArrowUpDown className="w-4 h-4 mr-1" />
                    {sortBy === "name"
                      ? "Diurutkan A-Z"
                      : sortBy === "newest"
                        ? "Terbaru dulu"
                        : sortBy === "oldest"
                          ? "Terlama dulu"
                          : "Terpopuler dulu"}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Kampus Utama
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* UKM Grid/List */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-20 h-20 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                  <Loader2 className="h-10 w-10 animate-spin text-white" />
                </div>
                <h3 className="text-2xl font-bold text-amber-800 mb-3">
                  Memuat Portfolio UKM
                </h3>
                <p className="text-lg text-amber-700 mb-6">
                  Sedang mengambil data terbaru untuk Anda
                </p>
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            ) : filteredAndSortedUKMs.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    : "space-y-6"
                }
              >
                {filteredAndSortedUKMs.map((ukm: any, index: number) => (
                  <div
                    key={ukm[0]}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-700"
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
              <div className="text-center py-24">
                <div className="w-32 h-32 bg-gradient-to-r from-amber-200 via-yellow-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Search className="h-16 w-16 text-amber-500" />
                </div>
                <h3 className="text-4xl font-bold text-amber-800 mb-4">
                  Tidak ada UKM ditemukan
                </h3>
                <p className="text-xl text-amber-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                  {searchTerm
                    ? `Maaf, tidak ada UKM yang cocok dengan pencarian "${searchTerm}". Coba gunakan kata kunci yang berbeda.`
                    : "Coba ubah filter atau kata kunci pencarian Anda untuk menemukan UKM yang sesuai."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-lg rounded-2xl"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Hapus Semua Filter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    className="border-amber-200 text-amber-700 hover:bg-amber-50 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl px-8 py-4 text-lg rounded-2xl transition-all duration-300"
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
  );
}
