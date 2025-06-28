"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Eye,
  UserPlus,
  Edit,
  Trash2,
  Star,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Share2,
  Bookmark,
} from "lucide-react";
import type { UKM } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { getUKMMemberCount } from "@/lib/api";
import { useState } from "react";

interface UKMCardProps {
  ukm: UKM;
  onViewDetail: (ukm: UKM) => void;
  showActions?: boolean;
  onEdit?: (ukm: UKM) => void;
  onDelete?: (ukm: UKM) => void;
  onJoinUKM?: (ukm: UKM) => void;
  showJoinButton?: boolean;
}

export default function UKMCard({
  ukm,
  onViewDetail,
  showActions = false,
  onEdit,
  onDelete,
  onJoinUKM,
  showJoinButton = false,
}: UKMCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const defaultImage =
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400";

  // Fetch member count for this UKM
  const { data: memberCountData, isLoading: memberCountLoading } = useQuery({
    queryKey: ["ukm-member-count", ukm.id_ukm],
    queryFn: () => getUKMMemberCount(ukm.id_ukm),
    enabled: !!ukm.id_ukm,
    staleTime: 0, // Always refetch
    refetchOnMount: true,
  });

  const memberCount = memberCountData?.success ? memberCountData.data || 0 : 0;

  // Use uploaded image URL if available, otherwise use default
  let imageUrl =
    ukm.gambar_url && ukm.gambar_url.trim() !== ""
      ? ukm.gambar_url
      : defaultImage;

  // Convert Google Drive URLs to thumbnail format for better web compatibility
  if (imageUrl && imageUrl.includes("drive.google.com")) {
    const fileIdMatch = imageUrl.match(/(?:\/d\/|id=|&id=)([a-zA-Z0-9-_]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      // Use Google Drive thumbnail API instead of uc?export=view
      imageUrl = `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w800`;
    }
  }

  // Get category color based on UKM name/type
  const getCategoryColor = (name: string) => {
    const lowerName = name.toLowerCase();
    if (
      lowerName.includes("teknologi") ||
      lowerName.includes("robotika") ||
      lowerName.includes("komputer")
    ) {
      return "blue";
    } else if (
      lowerName.includes("seni") ||
      lowerName.includes("musik") ||
      lowerName.includes("teater")
    ) {
      return "purple";
    } else if (
      lowerName.includes("olahraga") ||
      lowerName.includes("basket") ||
      lowerName.includes("futsal")
    ) {
      return "green";
    } else if (lowerName.includes("fotografi") || lowerName.includes("media")) {
      return "amber";
    } else {
      return "amber";
    }
  };

  const categoryColor = getCategoryColor(ukm.nama_ukm);

  return (
    <Card
      className="group overflow-hidden bg-white border border-amber-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0 relative">
        <div className="relative h-32 overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={ukm.nama_ukm}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== defaultImage) {
                target.src = defaultImage;
              }
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Floating Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <Button
              size="icon"
              variant="ghost"
              className="w-6 h-6 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                setIsBookmarked(!isBookmarked);
              }}
            >
              <Bookmark
                className={`w-3 h-3 ${isBookmarked ? "fill-current" : ""}`}
              />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="w-6 h-6 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                // Handle share
              }}
            >
              <Share2 className="w-3 h-3" />
            </Button>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="text-xs bg-green-500/90 backdrop-blur-sm text-white border-0 shadow-lg">
              <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse" />
              Aktif
            </Badge>
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge
              className={`text-xs bg-${categoryColor}-500/90 backdrop-blur-sm text-white border-0 shadow-lg`}
            >
              <Sparkles className="w-2 h-2 mr-1" />
              {ukm.kategori || "Umum"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 bg-gradient-to-br from-white to-amber-50/30">
        {/* Title */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-amber-800 group-hover:text-amber-900 transition-colors duration-300 line-clamp-2 flex-1">
            {ukm.nama_ukm}
          </h3>
          <div className="flex items-center ml-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-amber-700 ml-1">4.8</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-amber-700/80 mb-3 line-clamp-2 leading-relaxed text-sm">
          {ukm.deskripsi}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center bg-white/50 backdrop-blur-sm rounded-lg p-2 border border-amber-200/50">
            <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center mr-2">
              <Users className="h-3 w-3 text-amber-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-800">
                {memberCountLoading ? "..." : memberCount}
              </div>
              <div className="text-xs text-amber-600">Anggota</div>
            </div>
          </div>

          <div className="flex items-center bg-white/50 backdrop-blur-sm rounded-lg p-2 border border-amber-200/50">
            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
              <Calendar className="h-3 w-3 text-green-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-800">12</div>
              <div className="text-xs text-amber-600">Event</div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-amber-600/70 mb-3">
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            <span>Kampus Utama</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>Bergabung sejak 2020</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {["Kreatif", "Inovatif", "Prestasi"].map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 bg-gradient-to-br from-white to-amber-50/30">
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            className="flex-1 h-8 text-xs border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-400 transition-all duration-300 group/btn bg-transparent"
            onClick={() => onViewDetail(ukm)}
          >
            <Eye className="mr-1 w-3 h-3 group-hover/btn:scale-110 transition-transform" />
            Lihat Detail
            <ArrowRight className="ml-1 w-3 h-3 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-300" />
          </Button>

          {showJoinButton && onJoinUKM && (
            <Button
              className="flex-1 h-8 text-xs bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group/join"
              onClick={() => onJoinUKM(ukm)}
            >
              <UserPlus className="mr-1 w-3 h-3 group-hover/join:scale-110 transition-transform" />
              Bergabung
              <Sparkles className="ml-1 w-3 h-3 opacity-0 group-hover/join:opacity-100 group-hover/join:rotate-12 transition-all duration-300" />
            </Button>
          )}

          {showActions && (
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-400 transition-all duration-300 bg-transparent"
                  onClick={() => onEdit(ukm)}
                >
                  <Edit className="w-3 h-3" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-400 transition-all duration-300 bg-transparent"
                  onClick={() => onDelete(ukm)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
