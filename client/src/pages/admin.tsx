import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, RefreshCw, Edit, Trash2, University, Users, UserPlus, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useUKMs, useDeleteUKM } from "@/hooks/use-ukm";
import { useQuery } from "@tanstack/react-query";
import UKMFormModal from "@/components/ukm/ukm-form-modal";
import UKMDetailModal from "@/components/ukm/ukm-detail-modal";
import { UKM } from "@shared/schema";
import { Link } from "wouter";
import { getAllRegistrations } from "@/lib/api";

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const [selectedUKM, setSelectedUKM] = useState<UKM | null>(null);
  const [editingUKM, setEditingUKM] = useState<UKM | null>(null);
  const [deletingUKM, setDeletingUKM] = useState<UKM | null>(null);
  const [showUKMForm, setShowUKMForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: ukmsResponse, isLoading, refetch } = useUKMs();
  const deleteMutation = useDeleteUKM();

  // Fetch registration data for statistics
  const { data: registrationsResponse } = useQuery({
    queryKey: ['/api/registrations', user?.email],
    queryFn: () => getAllRegistrations(user?.email || ''),
    enabled: !!user?.email,
  });

  const ukms = ukmsResponse?.success ? ukmsResponse.data || [] : [];
  const registrations = registrationsResponse?.success ? registrationsResponse.data || [] : [];

  // Filter UKMs by current admin user
  const adminUKMs = ukms.filter((ukm: any) => ukm[4] === user?.userId); // id_users at index 4

  // Filter UKMs based on search term AND admin ownership
  const filteredUKMs = adminUKMs.filter((ukm: any) => 
    !searchTerm || 
    ukm[1]?.toLowerCase().includes(searchTerm.toLowerCase()) || // nama_ukm
    ukm[3]?.toLowerCase().includes(searchTerm.toLowerCase())    // deskripsi
  );
  
  // Calculate real admin stats from actual data
  const adminUKMIds = adminUKMs.map((ukm: any) => ukm[0]); // Get admin's UKM IDs
  const adminRegistrations = registrations.filter((reg: any) => 
    adminUKMIds.includes(reg[2]) // reg[2] is id_ukm
  );
  
  const adminStats = {
    totalUKM: adminUKMs.length,
    totalMembers: adminRegistrations.length,
    newRegistrations: adminRegistrations.filter((reg: any) => {
      const regDate = new Date(reg[4]); // reg[4] is created_at
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7; // New registrations in last 7 days
    }).length,
    dailyActivity: adminRegistrations.filter((reg: any) => {
      const regDate = new Date(reg[4]); // reg[4] is created_at
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff === 0; // Today's registrations
    }).length,
  };

  const handleDeleteUKM = async () => {
    if (!deletingUKM) return;
    
    await deleteMutation.mutateAsync(deletingUKM.id_ukm);
    setDeletingUKM(null);
  };

  const handleEditUKM = (ukm: UKM) => {
    setEditingUKM(ukm);
    setShowUKMForm(true);
  };

  const handleFormSuccess = () => {
    setEditingUKM(null);
    refetch();
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Akses Ditolak</h1>
              <p className="text-gray-600 mb-4">Hanya admin yang dapat mengakses halaman ini</p>
              <Link href="/">
                <Button>Kembali ke Beranda</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Admin Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg bg-accent">
                      {user?.namaMahasiswa.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Panel Admin</h1>
                    <p className="text-gray-600">Kelola data UKM dan anggota</p>
                  </div>
                </div>
                <Button onClick={() => setShowUKMForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah UKM
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <University className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total UKM</p>
                    <p className="text-2xl font-bold text-gray-900">{adminStats.totalUKM}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Anggota</p>
                    <p className="text-2xl font-bold text-gray-900">{adminStats.totalMembers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <UserPlus className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Pendaftar Baru</p>
                    <p className="text-2xl font-bold text-gray-900">{adminStats.newRegistrations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Aktivitas Harian</p>
                    <p className="text-2xl font-bold text-gray-900">{adminStats.dailyActivity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* UKM Management Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">Kelola UKM</CardTitle>
                <div className="flex space-x-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Cari UKM..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  </div>
                  <Button variant="outline" onClick={() => refetch()}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>UKM</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Tanggal Dibuat</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUKMs.map((ukm: any) => (
                      <TableRow key={ukm[0]}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <img
                                src={ukm[2] || "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"}
                                alt={ukm[1]}
                                className="w-full h-full object-cover"
                              />
                              <AvatarFallback>
                                {ukm[1]?.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">{ukm[1]}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-gray-900">
                            {ukm[3]}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900">
                          {new Date(ukm[4]).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedUKM({
                                id_ukm: ukm[0],
                                nama_ukm: ukm[1],
                                gambar_url: ukm[2],
                                deskripsi: ukm[3],
                                id_users: ukm[4],
                                prestasi: ukm[5],
                              })}
                            >
                              <Search className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUKM({
                                id_ukm: ukm[0],
                                nama_ukm: ukm[1],
                                gambar_url: ukm[2],
                                deskripsi: ukm[3],
                                id_users: ukm[4],
                                prestasi: ukm[5],
                              })}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setDeletingUKM({
                                id_ukm: ukm[0],
                                nama_ukm: ukm[1],
                                gambar_url: ukm[2],
                                deskripsi: ukm[3],
                                id_users: ukm[4],
                                prestasi: ukm[5],
                              })}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredUKMs.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <University className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchTerm ? "Tidak ada UKM yang ditemukan" : "Belum ada UKM yang terdaftar"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Modals */}
      <UKMFormModal
        open={showUKMForm}
        onOpenChange={setShowUKMForm}
        ukm={editingUKM}
        onSuccess={handleFormSuccess}
      />

      <UKMDetailModal
        ukm={selectedUKM}
        open={!!selectedUKM}
        onOpenChange={(open) => !open && setSelectedUKM(null)}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingUKM} onOpenChange={() => setDeletingUKM(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus UKM</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus UKM "{deletingUKM?.nama_ukm}"? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUKM}
              className="bg-destructive hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
