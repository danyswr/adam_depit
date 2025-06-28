import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Users, Calendar, Star, Music, Trophy, Share } from "lucide-react";
import { UKM } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { useRegisterToUKM } from "@/hooks/use-ukm";

interface UKMDetailModalProps {
  ukm: UKM | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UKMDetailModal({ ukm, open, onOpenChange }: UKMDetailModalProps) {
  const { isLoggedIn } = useAuth();
  const registerMutation = useRegisterToUKM();

  if (!ukm) return null;

  const defaultImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400";

  // Process image URL for Google Drive compatibility
  let imageUrl = ukm.gambar_url && ukm.gambar_url.trim() !== "" ? ukm.gambar_url : defaultImage;
  if (imageUrl && imageUrl.includes('drive.google.com')) {
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
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      // Could show toast here
    }
  };

  // Mock activities data - in real app this would come from API
  const activities = [
    {
      name: "Latihan Rutin",
      description: "Latihan vokal dan harmonisasi setiap minggu",
      icon: Music,
    },
    {
      name: "Konser Tahunan",
      description: "Pertunjukan akbar di akhir tahun",
      icon: Star,
    },
    {
      name: "Kompetisi",
      description: "Mengikuti berbagai lomba tingkat nasional",
      icon: Trophy,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto p-0">
        <DialogTitle className="sr-only">{ukm.nama_ukm}</DialogTitle>
        <DialogDescription className="sr-only">{ukm.deskripsi}</DialogDescription>
        <div className="relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full shadow-lg"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Hero Image */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={imageUrl}
              alt={ukm.nama_ukm}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{ukm.nama_ukm}</h2>
              <div className="flex items-center text-gray-600 space-x-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  0 Anggota
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Didirikan {new Date(ukm.created_at).getFullYear()}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Deskripsi</h3>
              <p className="text-gray-600 leading-relaxed">{ukm.deskripsi}</p>
            </div>

            {/* Activities */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Kegiatan Utama</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activities.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <IconComponent className="h-8 w-8 text-primary mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">{activity.name}</h4>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Tertarik bergabung?</h3>
                  <p className="text-gray-600">Daftarkan diri Anda dan mulai berkembang bersama kami</p>
                </div>
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={handleShare}>
                    <Share className="h-4 w-4 mr-2" />
                    Bagikan
                  </Button>
                  <Button 
                    onClick={handleJoinUKM}
                    disabled={!isLoggedIn || registerMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {registerMutation.isPending ? "Mendaftar..." : "Daftar Sekarang"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
