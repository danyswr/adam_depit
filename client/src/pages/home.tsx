import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import UKMCard from "@/components/ukm/ukm-card";
import UKMDetailModal from "@/components/ukm/ukm-detail-modal";
import LoginModal from "@/components/auth/login-modal";
import RegisterModal from "@/components/auth/register-modal";
import { UKM } from "@shared/schema";
import { useUKMs } from "@/hooks/use-ukm";
import { useAuth } from "@/lib/auth";
import { Users, Calendar, TrendingUp, Award, Info, ArrowRight, Star, Sparkles, ChevronDown } from 'lucide-react';

export default function Home() {
  const [selectedUKM, setSelectedUKM] = useState<UKM | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { isLoggedIn } = useAuth();
  const { data: ukmsResponse } = useUKMs();
  const ukms = ukmsResponse?.success ? ukmsResponse.data?.slice(0, 3) || [] : [];
  const showDemoAlert = !ukmsResponse?.success;

  const handleJoinUKM = (ukm: UKM) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setSelectedUKM(ukm);
  };

  const stats = [
    { label: "UKM Aktif", value: "25+", icon: Users, color: "from-amber-400 to-yellow-500" },
    { label: "Anggota Aktif", value: "2,500+", icon: TrendingUp, color: "from-yellow-400 to-amber-500" },
    { label: "Event Tahunan", value: "150+", icon: Calendar, color: "from-amber-500 to-orange-400" },
    { label: "Prestasi", value: "50+", icon: Award, color: "from-yellow-500 to-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-200/30 to-amber-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-amber-300/20 to-yellow-300/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-yellow-100/40 to-amber-100/40 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-2 h-2 bg-amber-400 rounded-full"></div>
          <div className="absolute top-20 right-20 w-2 h-2 bg-yellow-400 rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-2 h-2 bg-amber-400 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-2 h-2 bg-yellow-400 rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full text-amber-800 text-sm font-medium mb-8 animate-bounce">
            <Sparkles className="w-4 h-4 mr-2" />
            Platform UKM Terdepan di Indonesia
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-800 via-yellow-700 to-orange-700 bg-clip-text text-transparent mb-6">
            Portfolio UKM
            <span className="block text-4xl md:text-6xl mt-2">Terbaik</span>
          </h1>

          <p className="text-xl md:text-2xl text-amber-700/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Temukan dan bergabung dengan Unit Kegiatan Mahasiswa yang sesuai dengan passion dan minat Anda. 
            <span className="block mt-2 font-medium text-yellow-700">Kembangkan potensi diri melalui berbagai kegiatan yang inspiratif.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/portfolio">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                Jelajahi Portfolio
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-amber-400 text-amber-700 hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-400 hover:text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => {
                if (!isLoggedIn) {
                  setShowRegisterModal(true);
                } else {
                  window.location.href = '/portfolio';
                }
              }}
            >
              {isLoggedIn ? 'Jelajahi UKM' : 'Bergabung Sekarang'}
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-amber-600" />
        </div>
      </section>

      {/* Featured UKMs Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-amber-50/50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full text-amber-800 text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              UKM Pilihan
            </div>

            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-800 to-yellow-700 bg-clip-text text-transparent mb-6">
              UKM Unggulan
            </h2>

            <p className="text-xl text-amber-700/70 max-w-3xl mx-auto leading-relaxed">
              Bergabunglah dengan komunitas mahasiswa yang aktif dan berprestasi dalam berbagai bidang
            </p>

            {showDemoAlert && (
              <Alert className="max-w-3xl mx-auto mt-8 border-amber-200 bg-gradient-to-r from-yellow-50 to-amber-50">
                <Info className="h-5 w-5 text-amber-600" />
                <AlertDescription className="text-amber-700">
                  Sedang menggunakan data demo. Untuk data real, pastikan Google Apps Script sudah di-deploy dengan benar.
                  <span className="block mt-1 text-sm opacity-75">Error dari server: "{ukmsResponse?.error}"</span>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {ukms.map((ukm: any, index: number) => (
              <div 
                key={ukm.id_ukm}
                className="transform hover:scale-105 transition-all duration-300 animate-pulse"
              >
                <UKMCard
                  ukm={ukm}
                  onViewDetail={setSelectedUKM}
                  onJoinUKM={handleJoinUKM}
                  showJoinButton={true}
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/portfolio">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                Lihat Semua UKM
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-yellow-500 to-orange-500"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-16 left-16 w-4 h-4 bg-white rounded-full"></div>
          <div className="absolute top-32 right-32 w-3 h-3 bg-white rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-4 h-4 bg-white rounded-full"></div>
          <div className="absolute bottom-16 right-16 w-3 h-3 bg-white rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Pencapaian Kami
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Angka-angka yang membanggakan dari komunitas UKM kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className="text-center group cursor-pointer"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-lg text-white/90 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-white via-amber-50 to-yellow-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 transform hover:scale-105 transition-all duration-300">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-800 to-yellow-700 bg-clip-text text-transparent mb-6">
              Siap Memulai Perjalanan Anda?
            </h2>
            <p className="text-xl text-amber-700/70 mb-8 leading-relaxed">
              Bergabunglah dengan ribuan mahasiswa lainnya dan temukan passion Anda melalui UKM yang tepat
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => setShowRegisterModal(true)}
            >
              Mulai Sekarang
            </Button>
          </div>
        </div>
      </section>

      {/* Modals */}
      <UKMDetailModal
        ukm={selectedUKM}
        open={!!selectedUKM}
        onOpenChange={(open) => !open && setSelectedUKM(null)}
      />
      <LoginModal 
        open={showLoginModal} 
        onOpenChange={(open) => {
          setShowLoginModal(open);
          if (!open && !isLoggedIn) {
            setTimeout(() => setShowRegisterModal(true), 100);
          }
        }} 
      />
      <RegisterModal 
        open={showRegisterModal} 
        onOpenChange={(open) => {
          setShowRegisterModal(open);
          if (!open && !isLoggedIn) {
            setTimeout(() => setShowLoginModal(true), 100);
          }
        }} 
      />


    </div>
  );
}