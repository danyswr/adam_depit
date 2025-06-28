import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import UKMCard from "@/components/ukm/ukm-card";
import UKMDetailModal from "@/components/ukm/ukm-detail-modal";
import { Search, Loader2 } from "lucide-react";
import { UKM } from "@shared/schema";
import { useUKMs } from "@/hooks/use-ukm";

export default function Portfolio() {
  const [selectedUKM, setSelectedUKM] = useState<UKM | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  
  const { data: ukmsResponse, isLoading } = useUKMs();
  const ukms = ukmsResponse?.success ? ukmsResponse.data || [] : [];

  // Filter UKMs based on search term and category
  const filteredUKMs = ukms.filter((ukm: any) => {
    const matchesSearch = !searchTerm || 
      ukm[1]?.toLowerCase().includes(searchTerm.toLowerCase()) || // nama_ukm
      ukm[3]?.toLowerCase().includes(searchTerm.toLowerCase());   // deskripsi
    
    // Category filtering would need to be implemented based on UKM data structure
    const matchesCategory = !categoryFilter; // For now, no category filtering
    
    return matchesSearch && matchesCategory;
  });

  const handleSearch = () => {
    // Search is handled automatically through filteredUKMs
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Portfolio UKM</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jelajahi berbagai Unit Kegiatan Mahasiswa dan temukan yang sesuai dengan minat Anda
            </p>
          </div>

          {/* Search and Filter */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Cari UKM..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
                <div className="md:w-64">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Semua Kategori</SelectItem>
                      <SelectItem value="seni">Seni & Budaya</SelectItem>
                      <SelectItem value="olahraga">Olahraga</SelectItem>
                      <SelectItem value="teknologi">Teknologi</SelectItem>
                      <SelectItem value="sosial">Sosial</SelectItem>
                      <SelectItem value="akademik">Akademik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Cari
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* UKM Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredUKMs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUKMs.map((ukm: any) => (
                <UKMCard
                  key={ukm[0]} // id_ukm is at index 0
                  ukm={{
                    id_ukm: ukm[0],
                    nama_ukm: ukm[1],
                    gambar_url: ukm[2],
                    deskripsi: ukm[3],
                    created_at: ukm[4],
                    updated_at: ukm[5],
                  }}
                  onViewDetail={setSelectedUKM}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Tidak ada UKM ditemukan</h3>
              <p className="text-gray-500">Coba ubah kata kunci atau filter pencarian Anda</p>
            </div>
          )}
        </div>
      </section>

      {/* UKM Detail Modal */}
      <UKMDetailModal
        ukm={selectedUKM}
        open={!!selectedUKM}
        onOpenChange={(open) => !open && setSelectedUKM(null)}
      />
    </div>
  );
}
