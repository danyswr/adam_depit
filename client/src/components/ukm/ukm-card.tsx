import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users } from "lucide-react";
import { UKM } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { getUKMMemberCount } from "@/lib/api";

interface UKMCardProps {
  ukm: UKM;
  onViewDetail: (ukm: UKM) => void;
  showActions?: boolean;
  onEdit?: (ukm: UKM) => void;
  onDelete?: (ukm: UKM) => void;
  onJoinUKM?: (ukm: UKM) => void;
  showJoinButton?: boolean;
}

export default function UKMCard({ ukm, onViewDetail, showActions = false, onEdit, onDelete, onJoinUKM, showJoinButton = false }: UKMCardProps) {
  const defaultImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400";

  // Fetch member count for this UKM
  const { data: memberCountData } = useQuery({
    queryKey: ['/api/ukm-members', ukm.id_ukm],
    queryFn: () => getUKMMemberCount(ukm.id_ukm),
    enabled: !!ukm.id_ukm,
  });

  const memberCount = memberCountData?.success ? (memberCountData.data || 0) : 0;

  // Use uploaded image URL if available, otherwise use default
  let imageUrl = ukm.gambar_url && ukm.gambar_url.trim() !== "" ? ukm.gambar_url : defaultImage;
  
  // Convert Google Drive URLs to thumbnail format for better web compatibility
  if (imageUrl && imageUrl.includes('drive.google.com')) {
    const fileIdMatch = imageUrl.match(/(?:\/d\/|id=|&id=)([a-zA-Z0-9-_]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      // Use Google Drive thumbnail API instead of uc?export=view
      imageUrl = `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w800`;

    }
  }
  


  return (
    <Card className="overflow-hidden hover-scale transition-all duration-300 border border-gray-100 bg-white">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={ukm.nama_ukm}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== defaultImage) {
                target.src = defaultImage;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{ukm.nama_ukm}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{ukm.deskripsi}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Aktif
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {memberCount} Anggota
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <div className="flex space-x-2 w-full">
          <Button 
            variant="outline"
            className="flex-1" 
            onClick={() => onViewDetail(ukm)}
          >
            Lihat Detail
          </Button>
          
          {showJoinButton && onJoinUKM && (
            <Button 
              className="flex-1" 
              onClick={() => onJoinUKM(ukm)}
            >
              Daftar UKM
            </Button>
          )}
          
          {showActions && (
            <>
              {onEdit && (
                <Button variant="outline" onClick={() => onEdit(ukm)}>
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button variant="destructive" onClick={() => onDelete(ukm)}>
                  Hapus
                </Button>
              )}
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
