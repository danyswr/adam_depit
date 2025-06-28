import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const navigationLinks = [
    { name: "Beranda", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Tentang", href: "/about" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const categoryLinks = [
    { name: "Seni & Budaya", href: "/portfolio?category=seni" },
    { name: "Olahraga", href: "/portfolio?category=olahraga" },
    { name: "Teknologi", href: "/portfolio?category=teknologi" },
    { name: "Sosial", href: "/portfolio?category=sosial" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div>
            <h3 className="text-xl font-bold mb-4">UKM Portfolio</h3>
            <p className="text-gray-400 mb-4">
              Platform digital untuk mengeksplorasi dan bergabung dengan Unit Kegiatan Mahasiswa terbaik di universitas.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kategori UKM</h4>
            <ul className="space-y-2">
              {categoryLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                info@ukmportfolio.ac.id
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +62 21 123 4567
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Jakarta, Indonesia
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2024 UKM Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
