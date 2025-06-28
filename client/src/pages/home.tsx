import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import UKMCard from "@/components/ukm/ukm-card";
import UKMDetailModal from "@/components/ukm/ukm-detail-modal";
import LoginModal from "@/components/auth/login-modal";
import RegisterModal from "@/components/auth/register-modal";
import { UKM } from "@shared/schema";
import { useUKMs } from "@/hooks/use-ukm";
import { useAuth } from "@/lib/auth";
import { Users, Calendar, TrendingUp, Award } from "lucide-react";

export default function Home() {
  const [selectedUKM, setSelectedUKM] = useState<UKM | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { isLoggedIn } = useAuth();
  const { data: ukmsResponse } = useUKMs();

  const ukms = ukmsResponse?.success ? ukmsResponse.data?.slice(0, 3) || [] : [];

  const handleJoinUKM = (ukm: UKM) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    // If logged in, show UKM detail modal
    setSelectedUKM(ukm);
  };

  const stats = [
    { label: "UKM Aktif", value: "25+", icon: Users },
    { label: "Anggota Aktif", value: "2,500+", icon: TrendingUp },
    { label: "Event Tahunan", value: "150+", icon: Calendar },
    { label: "Prestasi", value: "50+", icon: Award },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-slide-up">
            Portfolio UKM Terbaik
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto animate-slide-up">
            Temukan dan bergabung dengan Unit Kegiatan Mahasiswa yang sesuai dengan passion dan minat Anda. 
            Kembangkan potensi diri melalui berbagai kegiatan yang inspiratif.
          </p>
          <div className="space-x-4 animate-slide-up">
            <Link href="/portfolio">
              <Button size="lg" variant="secondary" className="hover-scale">
                Jelajahi Portfolio
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary hover-scale"
              onClick={() => {
                if (!isLoggedIn) {
                  setShowRegisterModal(true);
                } else {
                  // If already logged in, navigate to portfolio
                  window.location.href = '/portfolio';
                }
              }}
            >
              {isLoggedIn ? 'Jelajahi UKM' : 'Bergabung Sekarang'}
            </Button>
          </div>
        </div>
      </section>

      {/* Featured UKMs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">UKM Unggulan</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bergabunglah dengan komunitas mahasiswa yang aktif dan berprestasi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {ukms.map((ukm: any) => (
              <UKMCard
                key={ukm.id_ukm}
                ukm={ukm}
                onViewDetail={setSelectedUKM}
                onJoinUKM={handleJoinUKM}
                showJoinButton={true}
              />
            ))}
          </div>

          <div className="text-center">
            <Link href="/portfolio">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 hover-scale">
                Lihat Semua UKM
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="animate-bounce-gentle">
                  <IconComponent className="h-12 w-12 mx-auto mb-4 text-white/80" />
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-lg text-white/90">{stat.label}</div>
                </div>
              );
            })}
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
            // Switch to register modal after closing login
            setTimeout(() => setShowRegisterModal(true), 100);
          }
        }} 
      />
      <RegisterModal 
        open={showRegisterModal} 
        onOpenChange={(open) => {
          setShowRegisterModal(open);
          if (!open && !isLoggedIn) {
            // Switch to login modal after closing register
            setTimeout(() => setShowLoginModal(true), 100);
          }
        }} 
      />
    </div>
  );
}
