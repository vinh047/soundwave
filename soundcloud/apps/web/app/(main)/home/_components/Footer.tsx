// components/Footer.tsx
import { Facebook, Twitter, Instagram, Mail, Headphones } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 bg-white py-12 text-gray-600 transition-colors duration-300 dark:bg-black dark:border-zinc-800 dark:text-gray-400 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Cột 1: Logo + Mô tả */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {/* Icon giữ màu cam để nổi bật thương hiệu */}
              <Headphones className="h-6 w-6 text-orange-500" />
              {/* Tiêu đề: Đen ở Light Mode, Trắng ở Dark Mode */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                SoundWave
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Nền tảng âm nhạc hiện đại — nơi nghệ sĩ gặp gỡ người hâm mộ.
            </p>
            <p className="text-xs font-medium text-gray-900 dark:text-gray-500 mt-3">
              Âm nhạc không giới hạn.
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-900 dark:text-white">
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
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-900 dark:text-white">
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
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-900 dark:text-white">
              Theo dõi chúng tôi
            </h4>
            <div className="flex gap-3">
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
                  // Nút Social:
                  // Light Mode: Nền xám nhạt (gray-100), icon xám đậm
                  // Dark Mode: Nền đen nhạt (zinc-800), icon trắng mờ
                  // Hover: Nền cam, icon trắng
                  className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-all duration-300 hover:bg-orange-500 dark:bg-zinc-800"
                >
                  <Icon className="h-5 w-5 text-gray-600 transition-colors group-hover:text-white dark:text-gray-400" />
                </a>
              ))}
            </div>

            {/* Newsletter nhỏ */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                Đăng ký nhận tin tức mới nhất
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full rounded-l-md border border-gray-300 bg-gray-50 px-3 py-2 text-xs text-gray-900 focus:border-orange-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
                <button className="rounded-r-md bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition-colors">
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dòng bản quyền */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-500">
          <p>© {currentYear} SoundWave. Đã đăng ký bản quyền.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Made with <span className="text-orange-500 animate-pulse">♥</span>{" "}
            for music lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
