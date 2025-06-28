"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Users,
  Calendar,
  Star,
  Music,
  Trophy,
  Share,
  MapPin,
  Clock,
  Award,
  Target,
  Sparkles,
  UserPlus,
  Bookmark,
  CheckCircle,
  TrendingUp,
  Zap,
  Shield,
  Globe,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight,
} from "lucide-react";
import type { UKM } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { useRegisterToUKM } from "@/hooks/use-ukm";
import { useState } from "react";

interface UKMDetailModalProps {
  ukm: UKM | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UKMDetailModal({
  ukm,
  open,
  onOpenChange,
}: UKMDetailModalProps) {
  const { isLoggedIn } = useAuth();
  const registerMutation = useRegisterToUKM();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  if (!ukm) return null;

  const defaultImage =
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400";

  // Process image URL for Google Drive compatibility
  let imageUrl =
    ukm.gambar_url && ukm.gambar_url.trim() !== ""
      ? ukm.gambar_url
      : defaultImage;
  if (imageUrl && imageUrl.includes("drive.google.com")) {
    const fileIdMatch = imageUrl.match(/(?:\/d\/|id=|&id=)([a-zA-Z0-9-_]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      imageUrl = `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w800`;
    }
  }

  const handleJoinUKM = async () => {
    if (!isLoggedIn) {
      // Could trigger login modal here
      return;
    }

    await registerMutation.mutateAsync(ukm.id_ukm);
    onOpenChange(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: ukm.nama_ukm,
          text: ukm.deskripsi,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      // Could show toast here
    }
  };

  // Mock data - in real app this would come from API
  const stats = [
    { label: "Anggota Aktif", value: "150+", icon: Users, color: "blue" },
    { label: "Event per Tahun", value: "25+", icon: Calendar, color: "green" },
    { label: "Prestasi", value: "12+", icon: Trophy, color: "yellow" },
    { label: "Rating", value: "4.8", icon: Star, color: "amber" },
  ];

  const activities = [
    {
      name: "Latihan Rutin",
      description:
        "Latihan vokal dan harmonisasi setiap minggu untuk mengasah kemampuan anggota",
      icon: Music,
      frequency: "Mingguan",
      color: "purple",
    },
    {
      name: "Konser Tahunan",
      description:
        "Pertunjukan akbar di akhir tahun sebagai puncak kegiatan UKM",
      icon: Star,
      frequency: "Tahunan",
      color: "amber",
    },
    {
      name: "Kompetisi",
      description: "Mengikuti berbagai lomba tingkat regional dan nasional",
      icon: Trophy,
      frequency: "Berkala",
      color: "green",
    },
    {
      name: "Workshop",
      description: "Pelatihan khusus dengan mentor profesional dari industri",
      icon: Target,
      frequency: "Bulanan",
      color: "blue",
    },
  ];

  const benefits = [
    "Pengembangan skill profesional",
    "Networking dengan alumni sukses",
    "Sertifikat kegiatan resmi",
    "Kesempatan magang di industri",
    "Mentoring dari praktisi berpengalaman",
    "Akses ke event eksklusif",
  ];

  const socialLinks = [
    { icon: Instagram, label: "Instagram", url: "#" },
    { icon: Facebook, label: "Facebook", url: "#" },
    { icon: Twitter, label: "Twitter", url: "#" },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: Target },
    { id: "activities", label: "Kegiatan", icon: Calendar },
    { id: "benefits", label: "Manfaat", icon: Award },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-screen overflow-y-auto p-0 bg-white border-0 shadow-2xl">
        <DialogTitle className="sr-only">{ukm.nama_ukm}</DialogTitle>
        <DialogDescription className="sr-only">
          {ukm.deskripsi}
        </DialogDescription>

        <div className="relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg border border-amber-200"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 text-amber-700" />
          </Button>

          {/* Hero Section */}
          <div className="relative h-80 overflow-hidden">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={ukm.nama_ukm}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Floating Action Buttons */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-green-500/90 backdrop-blur-sm text-white border-0 shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                Aktif
              </Badge>
              <Badge className="bg-amber-500/90 backdrop-blur-sm text-white border-0 shadow-lg">
                <Star className="w-3 h-3 mr-1 fill-current" />
                4.8 Rating
              </Badge>
            </div>

            <div className="absolute top-4 right-16 flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0 rounded-full"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
                />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0 rounded-full"
                onClick={handleShare}
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>

            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="max-w-4xl">
                <h1 className="text-4xl font-bold mb-4">{ukm.nama_ukm}</h1>
                <div className="flex items-center gap-6 text-white/90 mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Kampus Utama
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Bergabung sejak 2020
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    150+ Anggota
                  </div>
                </div>
                <p className="text-lg text-white/90 leading-relaxed max-w-3xl">
                  {ukm.deskripsi}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center text-white">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-white/90 text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 bg-gradient-to-br from-white to-amber-50">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-8 bg-amber-100 p-1 rounded-lg">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-white text-amber-800 shadow-md"
                        : "text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-amber-800 mb-4">
                    Tentang {ukm.nama_ukm}
                  </h3>
                  <p className="text-amber-700/80 leading-relaxed text-lg">
                    {ukm.deskripsi}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-amber-800 mb-4">
                    Visi & Misi
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-amber-200 shadow-sm">
                      <h4 className="font-bold text-amber-800 mb-3 flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        Visi
                      </h4>
                      <p className="text-amber-700/80">
                        Menjadi UKM terdepan dalam mengembangkan bakat dan
                        kreativitas mahasiswa di bidang seni dan budaya.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 border border-amber-200 shadow-sm">
                      <h4 className="font-bold text-amber-800 mb-3 flex items-center">
                        <Zap className="w-5 h-5 mr-2" />
                        Misi
                      </h4>
                      <p className="text-amber-700/80">
                        Memberikan wadah pengembangan diri, menciptakan karya
                        berkualitas, dan membangun networking profesional.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "activities" && (
              <div>
                <h3 className="text-2xl font-bold text-amber-800 mb-6">
                  Kegiatan Utama
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {activities.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-xl p-6 border border-amber-200 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start">
                          <div
                            className={`w-12 h-12 bg-${activity.color}-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}
                          >
                            <IconComponent
                              className={`w-6 h-6 text-${activity.color}-600`}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-amber-800">
                                {activity.name}
                              </h4>
                              <Badge
                                variant="outline"
                                className="text-xs border-amber-300 text-amber-700"
                              >
                                {activity.frequency}
                              </Badge>
                            </div>
                            <p className="text-amber-700/80 text-sm leading-relaxed">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "benefits" && (
              <div>
                <h3 className="text-2xl font-bold text-amber-800 mb-6">
                  Manfaat Bergabung
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-white rounded-lg p-4 border border-amber-200"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-amber-800 font-medium">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-6 border border-amber-200">
                  <h4 className="font-bold text-amber-800 mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Peluang Karir
                  </h4>
                  <p className="text-amber-700/80 mb-4">
                    Alumni kami telah berkarir di berbagai industri kreatif
                    terkemuka dan mendirikan startup sukses.
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-amber-700">
                        95% Alumni Terserap Industri
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-amber-700">Network Global</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact & Social */}
            <div className="mt-8 bg-white rounded-xl p-6 border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-4">Hubungi Kami</h4>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center text-amber-700">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">ukm@university.ac.id</span>
                </div>
                <div className="flex items-center text-amber-700">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">+62 812-3456-7890</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <Button
                        key={index}
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                      >
                        <IconComponent className="w-4 h-4" />
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-white mb-6 md:mb-0">
                <h3 className="text-2xl font-bold mb-2 flex items-center">
                  <Sparkles className="w-6 h-6 mr-2" />
                  Siap Bergabung dengan Kami?
                </h3>
                <p className="text-white/90 text-lg">
                  Wujudkan potensi terbaikmu dan raih prestasi gemilang bersama{" "}
                  {ukm.nama_ukm}
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent backdrop-blur-sm"
                  onClick={handleShare}
                >
                  <Share className="h-4 w-4 mr-2" />
                  Bagikan
                </Button>
                <Button
                  onClick={handleJoinUKM}
                  disabled={!isLoggedIn || registerMutation.isPending}
                  className="bg-white text-amber-600 hover:bg-amber-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {registerMutation.isPending
                    ? "Mendaftar..."
                    : "Daftar Sekarang"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
