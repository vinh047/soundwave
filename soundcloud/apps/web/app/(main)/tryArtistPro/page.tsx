// pages/TryArtistPro.tsx
import React from "react";
import { CheckCircle, Zap, BarChart2, Globe } from "lucide-react"; // Cần cài lucide-react hoặc dùng icon library khác

const TryArtistPro = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 text-white p-12 text-center shadow-lg">
        <h1 className="text-4xl font-extrabold mb-4">
          Mở khóa tiềm năng âm nhạc của bạn
        </h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
          Phân phối nhạc không giới hạn, phân tích chuyên sâu và công cụ quảng
          bá mạnh mẽ.
        </p>
        <button className="bg-white text-orange-600 font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors shadow-md">
          Bắt đầu dùng thử miễn phí
        </button>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: <Zap className="w-6 h-6 text-orange-500" />,
            title: "Tải lên ngay lập tức",
            desc: "Không còn chờ đợi kiểm duyệt lâu.",
          },
          {
            icon: <BarChart2 className="w-6 h-6 text-orange-500" />,
            title: "Phân tích Real-time",
            desc: "Biết ai đang nghe nhạc của bạn ở đâu.",
          },
          {
            icon: <Globe className="w-6 h-6 text-orange-500" />,
            title: "Phân phối toàn cầu",
            desc: "Có mặt trên mọi nền tảng lớn.",
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="mb-4 bg-orange-50 w-12 h-12 flex items-center justify-center rounded-full">
              {feature.icon}
            </div>
            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-500 text-sm">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Pricing Table */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b text-center">
          <h2 className="text-2xl font-bold mb-2">Gói Pro Artist</h2>
          <div className="text-4xl font-extrabold text-orange-600">
            99.000đ
            <span className="text-base text-gray-400 font-normal">/tháng</span>
          </div>
        </div>
        <div className="p-8">
          <ul className="space-y-4 max-w-md mx-auto">
            {[
              "Upload không giới hạn",
              "Tick xanh xác thực",
              "Hỗ trợ ưu tiên 24/7",
              "Giữ 100% tiền bản quyền",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
          <button className="w-full mt-8 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all">
            Đăng ký ngay
          </button>
        </div>
      </section>
    </div>
  );
};

export default TryArtistPro;
