import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Calendar, Trophy, Plus, Eye, UserMinus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useUserUKMs } from "@/hooks/use-ukm";
import UKMDetailModal from "@/components/ukm/ukm-detail-modal";
import { UKM } from "@shared/schema";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [selectedUKM, setSelectedUKM] = useState<UKM | null>(null);
  const { data: userUKMsResponse } = useUserUKMs();

  const userUKMs = userUKMsResponse?.success ? userUKMsResponse.data || [] : [];
  
  // Calculate real stats from actual data
  const userStats = {
    registeredUKM: userUKMs.length,
    upcomingEvents: 0, // Will be calculated from real event data when available
    activityPoints: userUKMs.length * 100, // 100 points per UKM registration
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Akses Ditolak</h1>
              <p className="text-gray-600 mb-4">Silakan login untuk mengakses dashboard</p>
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
          {/* Dashboard Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {user.namaMahasiswa.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">
                      Selamat datang, <span className="font-semibold">{user.namaMahasiswa}</span>
                    </p>
                    <p className="text-sm text-gray-500">NIM: {user.nim}</p>
                  </div>
                </div>
                
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" className="bg-accent hover:bg-accent/90 text-white border-accent">
                      <Trophy className="mr-2 h-4 w-4" />
                      Panel Admin
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">UKM Terdaftar</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.registeredUKM}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <Calendar className="h-6 w-6 text-secondary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Event Mendatang</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.upcomingEvents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Trophy className="h-6 w-6 text-accent" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Poin Aktivitas</p>
                    <p className="text-2xl font-bold text-gray-900">{userStats.activityPoints}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My UKMs Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">UKM Saya</CardTitle>
                <Link href="/portfolio">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Daftar UKM Baru
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {userUKMs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userUKMs.map((ukm: any) => (
                    <Card key={ukm[0]} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <img
                          src={ukm[2] || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200"}
                          alt={ukm[1]}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold text-gray-900 mb-2">{ukm[1]}</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Bergabung: {new Date(ukm[4]).toLocaleDateString('id-ID')}
                        </p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setSelectedUKM({
                              id_ukm: ukm[0],
                              nama_ukm: ukm[1],
                              gambar_url: ukm[2],
                              deskripsi: ukm[3],
                              id_users: ukm[4],
                              prestasi: ukm[5],
                            })}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Detail
                          </Button>
                          <Button size="sm" variant="destructive" className="flex-1">
                            <UserMinus className="mr-1 h-3 w-3" />
                            Keluar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum bergabung dengan UKM</h3>
                  <p className="text-gray-500 mb-4">
                    Jelajahi berbagai UKM yang tersedia dan temukan yang sesuai dengan minat Anda
                  </p>
                  <Link href="/portfolio">
                    <Button>
                      Jelajahi UKM
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
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
