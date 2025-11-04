// components/Footer.tsx
import { Facebook, Twitter, Instagram, Mail, Headphones } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-t from-black to-zinc-950 text-gray-400 py-12 mt-20 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Cột 1: Logo + Mô tả */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Headphones className="h-6 w-6 text-orange-500" />
              <h3 className="text-xl font-bold text-white">SoundWave</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              Nền tảng âm nhạc hiện đại — nơi nghệ sĩ gặp gỡ người hâm mộ.
            </p>
            <p className="text-xs text-gray-600 mt-3">
              Âm nhạc không giới hạn.
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Khám phá
            </h4>
            <ul className="space-y-2 text-sm">
              {["Giới thiệu", "Tính năng", "Nghệ sĩ", "Bảng xếp hạng"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-orange-500 transition-colors duration-200 inline-block"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Hỗ trợ
            </h4>
            <ul className="space-y-2 text-sm">
              {["Điều khoản", "Chính sách bảo mật", "Trợ giúp", "Liên hệ"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-orange-500 transition-colors duration-200 inline-block"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Cột 4: Kết nối */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Theo dõi chúng tôi
            </h4>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, label: "Facebook", href: "#" },
                { Icon: Twitter, label: "Twitter", href: "#" },
                { Icon: Instagram, label: "Instagram", href: "#" },
                {
                  Icon: Mail,
                  label: "Email",
                  href: "mailto:hello@soundwave.com",
                },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group p-2 rounded-full bg-zinc-800 hover:bg-orange-500 transition-all duration-300"
                >
                  <Icon className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>

            {/* Newsletter nhỏ (tùy chọn) */}
            <p className="text-xs text-gray-500 mt-5">
              Nhận tin tức âm nhạc mới nhất qua email.
            </p>
          </div>
        </div>

        {/* Dòng bản quyền */}
        <div className="mt-10 pt-6  flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600">
          <p>© {currentYear} SoundWave. Đã đăng ký bản quyền.</p>
          <p className="mt-2 sm:mt-0">
            Made with <span className="text-orange-500">♥</span> for music
            lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
