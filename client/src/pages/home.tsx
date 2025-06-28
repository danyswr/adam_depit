import { useState, useEffect, useRef } from "react";
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
import {
  Users,
  Calendar,
  TrendingUp,
  Award,
  Info,
  ArrowRight,
  Star,
  Sparkles,
  ChevronDown,
  Heart,
  Shield,
  Zap,
  Target,
  BookOpen,
  Trophy,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Quote,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MousePointer,
  Rocket,
  Globe,
  Camera,
  Music,
  Code,
  Palette,
  Gamepad2,
  Coffee,
  Lightbulb,
  Megaphone,
  PlusCircle,
  MinusCircle,
  RotateCcw,
  Share2,
  Download,
  Eye,
  ThumbsUp,
  Send,
  Layers,
  Grid,
  Compass,
  Briefcase,
  GraduationCap,
  Users2,
  Bookmark,
  Filter,
  Search,
  Bell,
  Settings,
} from "lucide-react";

export default function Home() {
  const [selectedUKM, setSelectedUKM] = useState<UKM | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  const heroRef = useRef(null);
  const statsRef = useRef(null);

  const { isLoggedIn } = useAuth();
  const { data: ukmsResponse } = useUKMs();
  const ukms = ukmsResponse?.success
    ? ukmsResponse.data?.slice(0, 6) || []
    : [];
  const showDemoAlert = !ukmsResponse?.success;
  
  // Debug logging
  console.log("Home UKMs response:", ukmsResponse);
  console.log("Home UKMs data:", ukms);

  // Scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animated counters
  useEffect(() => {
    const targetValues = [25, 2500, 150, 50];
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    const animate = () => {
      for (let step = 0; step <= steps; step++) {
        setTimeout(() => {
          setAnimatedStats(
            targetValues.map((target) => Math.floor((target * step) / steps)),
          );
        }, step * stepDuration);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate();
          observer.unobserve(entry.target);
        }
      });
    });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinUKM = (ukm: UKM) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setSelectedUKM(ukm);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const stats = [
    {
      label: "UKM Aktif",
      value: "25+",
      icon: Users,
      animatedValue: animatedStats[0],
      color: "amber",
    },
    {
      label: "Anggota",
      value: "2,500+",
      icon: TrendingUp,
      animatedValue: animatedStats[1],
      color: "yellow",
    },
    {
      label: "Event",
      value: "150+",
      icon: Calendar,
      animatedValue: animatedStats[2],
      color: "orange",
    },
    {
      label: "Prestasi",
      value: "50+",
      icon: Award,
      animatedValue: animatedStats[3],
      color: "amber",
    },
  ];

  const features = [
    {
      icon: Target,
      title: "Pengembangan Skill",
      description:
        "Program mentoring dan workshop untuk mengasah kemampuan sesuai bidang minat.",
      benefits: ["Mentoring Personal", "Workshop Rutin", "Sertifikasi"],
    },
    {
      icon: Users2,
      title: "Komunitas Solid",
      description:
        "Networking dengan mahasiswa dari berbagai fakultas dan angkatan.",
      benefits: ["Alumni Network", "Cross-Faculty", "Peer Support"],
    },
    {
      icon: Trophy,
      title: "Track Record",
      description:
        "Prestasi gemilang di berbagai kompetisi nasional dan internasional.",
      benefits: ["Kompetisi Nasional", "International Events", "Awards"],
    },
  ];

  const testimonials = [
    {
      name: "Sarah Putri",
      role: "Alumni UKM Fotografi",
      content:
        "UKM Fotografi membuka jalan karir saya di industri kreatif. Pengalaman dan networking yang didapat sangat berharga.",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      company: "Creative Studio",
    },
    {
      name: "Ahmad Rizki",
      role: "Ketua UKM Robotika",
      content:
        "Melalui UKM Robotika, saya belajar leadership dan technical skills yang tidak didapat di kelas reguler.",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      company: "Tech Startup",
    },
    {
      name: "Maya Sari",
      role: "Alumni UKM Teater",
      content:
        "Kepercayaan diri dan public speaking skills yang diasah di UKM Teater sangat membantu karir saya.",
      avatar: "/placeholder.svg?height=60&width=60",
      rating: 5,
      company: "Media Company",
    },
  ];

  const categories = [
    { name: "Teknologi", icon: Code, count: 8, color: "blue" },
    { name: "Seni", icon: Palette, count: 12, color: "purple" },
    { name: "Olahraga", icon: Trophy, count: 15, color: "green" },
    { name: "Musik", icon: Music, count: 6, color: "red" },
    { name: "Fotografi", icon: Camera, count: 4, color: "amber" },
    { name: "Gaming", icon: Gamepad2, count: 3, color: "indigo" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #f59e0b 1px, transparent 1px), radial-gradient(circle at 75% 75%, #eab308 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Header Navigation */}

      {/* Hero Section - Compact */}
      <section ref={heroRef} className="relative py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-amber-100 rounded-full text-amber-800 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Platform UKM Terdepan
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-800 to-yellow-700 bg-clip-text text-transparent">
                Portfolio UKM
              </span>
              <br />
              <span className="text-3xl md:text-5xl bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                Terbaik
              </span>
            </h1>

            <p className="text-lg md:text-xl text-amber-700/80 mb-8 max-w-3xl mx-auto">
              Temukan dan bergabung dengan Unit Kegiatan Mahasiswa yang sesuai
              dengan passion Anda. Kembangkan potensi diri melalui berbagai
              kegiatan inspiratif.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/portfolio">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Eye className="mr-2 w-5 h-5" />
                  Jelajahi Portfolio
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-amber-400 text-amber-700 hover:bg-amber-50 px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => setShowRegisterModal(true)}
              >
                <Users className="mr-2 w-5 h-5" />
                Bergabung Sekarang
              </Button>
            </div>
          </div>

          {/* Quick Stats - Compact Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-amber-100"
                >
                  <div className="text-center">
                    <IconComponent className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-amber-800 mb-1">
                      {stat.animatedValue}+
                    </div>
                    <div className="text-xs text-amber-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section - Grid Layout */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-amber-100 rounded-full text-amber-800 text-sm font-medium mb-4">
              <Grid className="w-4 h-4 mr-2" />
              Kategori UKM
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-4">
              Temukan Passion Anda
            </h2>
            <p className="text-lg text-amber-700/70 max-w-2xl mx-auto">
              Jelajahi berbagai kategori UKM yang tersedia
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-gray-100">
                    <div
                      className={`w-12 h-12 rounded-lg bg-${category.color}-100 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent
                        className={`h-6 w-6 text-${category.color}-600`}
                      />
                    </div>

                    <h3 className="text-sm font-bold text-gray-800 mb-2 text-center">
                      {category.name}
                    </h3>

                    <div className="text-center">
                      <span className="inline-flex items-center px-2 py-1 bg-amber-100 rounded-full text-amber-700 text-xs font-medium">
                        {category.count} UKM
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section - Tab Layout */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 rounded-full text-amber-800 text-sm font-medium mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Keunggulan Platform
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-4">
              Mengapa Memilih Kami?
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Feature Tabs */}
            <div className="space-y-3">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className={`cursor-pointer p-4 rounded-lg transition-all duration-300 ${
                      activeTab === index
                        ? "bg-white shadow-lg border-l-4 border-amber-500"
                        : "bg-white/50 hover:bg-white/80 hover:shadow-md"
                    }`}
                    onClick={() => setActiveTab(index)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mr-3">
                        <IconComponent className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-amber-800 text-base">
                          {feature.title}
                        </h4>
                        <p className="text-amber-600 text-sm">
                          {feature.description}
                        </p>
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 transition-all duration-300 ${
                          activeTab === index
                            ? "text-amber-600"
                            : "text-amber-400"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feature Content */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className={`transition-all duration-500 ${
                      activeTab === index ? "opacity-100" : "opacity-0 absolute"
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mr-4">
                        <IconComponent className="h-6 w-6 text-amber-600" />
                      </div>
                      <h3 className="text-xl font-bold text-amber-800">
                        {feature.title}
                      </h3>
                    </div>

                    <p className="text-amber-700/80 mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-amber-700 text-sm">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* UKM Showcase - Clean Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-amber-100 rounded-full text-amber-800 text-sm font-medium mb-4">
              <Star className="w-4 h-4 mr-2" />
              UKM Unggulan
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-4">
              Portfolio Terbaik
            </h2>
            <p className="text-lg text-amber-700/70 max-w-2xl mx-auto">
              Jelajahi UKM-UKM terbaik dengan prestasi membanggakan
            </p>

            {showDemoAlert && (
              <Alert className="max-w-2xl mx-auto mt-6 border-amber-200 bg-amber-50">
                <Info className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-700 text-sm">
                  Sedang menggunakan data demo. Untuk data real, pastikan Google
                  Apps Script sudah di-deploy.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {ukms.map((ukm: any, index: number) => (
              <div key={ukm.id_ukm} className="group">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden border border-gray-100">
                  <UKMCard
                    ukm={ukm}
                    onViewDetail={setSelectedUKM}
                    onJoinUKM={handleJoinUKM}
                    showJoinButton={true}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/portfolio">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Jelajahi Semua UKM
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics - Compact */}
      <section
        ref={statsRef}
        className="py-16 bg-gradient-to-r from-amber-500 to-yellow-500"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pencapaian Luar Biasa
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Angka-angka membanggakan komunitas UKM kami
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center cursor-pointer group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>

                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {stat.animatedValue}+
                    </div>

                    <div className="text-white/90 font-medium text-sm">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials - Compact Carousel */}
      <section className="py-16 bg-gradient-to-br from-white to-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-amber-100 rounded-full text-amber-800 text-sm font-medium mb-4">
              <Quote className="w-4 h-4 mr-2" />
              Testimoni Alumni
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-4">
              Kisah Sukses Mereka
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <Quote className="w-12 h-12 text-amber-300 mx-auto mb-6" />

            <div className="text-center">
              <p className="text-lg text-amber-800 mb-6 leading-relaxed italic">
                "{testimonials[currentTestimonial].content}"
              </p>

              <div className="flex items-center justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map(
                  (_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ),
                )}
              </div>

              <div className="flex items-center justify-center">
                <img
                  src={
                    testimonials[currentTestimonial].avatar ||
                    "/placeholder.svg"
                  }
                  alt={testimonials[currentTestimonial].name}
                  className="w-12 h-12 rounded-full mr-4 border-2 border-amber-200"
                />
                <div className="text-left">
                  <h4 className="font-bold text-amber-800">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-amber-600 text-sm">
                    {testimonials[currentTestimonial].role}
                  </p>
                  <p className="text-amber-500 text-xs">
                    {testimonials[currentTestimonial].company}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-amber-500 w-6"
                      : "bg-amber-200 hover:bg-amber-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter - Compact Form */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-yellow-500">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <Mail className="w-16 h-16 text-white mx-auto mb-6" />

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Jangan Lewatkan Update Terbaru
            </h2>

            <p className="text-lg text-white/90 mb-8">
              Dapatkan notifikasi tentang event menarik dan kesempatan emas
              lainnya
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="max-w-md mx-auto"
            >
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Anda"
                  className="flex-1 px-4 py-3 rounded-lg border-0 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
                <Button
                  type="submit"
                  className="bg-white text-amber-600 hover:bg-amber-50 px-6 py-3 rounded-lg font-semibold"
                  disabled={isSubscribed}
                >
                  {isSubscribed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {isSubscribed && (
                <div className="mt-4 p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <div className="flex items-center justify-center text-white text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Terima kasih! Anda telah berlangganan.
                  </div>
                </div>
              )}
            </form>

            <div className="mt-8 flex justify-center space-x-6 text-white/80 text-sm">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                100% Aman
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Update Instan
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                Tanpa Spam
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Compact */}
      <section className="py-16 bg-gradient-to-br from-white to-amber-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <Rocket className="w-16 h-16 text-amber-500 mx-auto mb-6" />

            <h2 className="text-3xl md:text-4xl font-bold text-amber-800 mb-4">
              Wujudkan Potensi Terbaikmu
            </h2>

            <p className="text-lg text-amber-700/70 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan mahasiswa yang telah menemukan passion
              mereka
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => setShowRegisterModal(true)}
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Mulai Perjalanan Saya
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-amber-400 text-amber-700 hover:bg-amber-50 px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Phone className="mr-2 w-5 h-5" />
                Konsultasi Gratis
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-6 text-center text-sm">
              <div>
                <div className="text-2xl font-bold text-amber-600 mb-1">
                  2500+
                </div>
                <div className="text-amber-700/70">Mahasiswa</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600 mb-1">
                  98%
                </div>
                <div className="text-amber-700/70">Kepuasan</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600 mb-1">
                  50+
                </div>
                <div className="text-amber-700/70">Prestasi</div>
              </div>
            </div>
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
