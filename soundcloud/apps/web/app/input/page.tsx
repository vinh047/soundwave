import React from "react";
import { Input } from "@/components/ui/Input";
import { Search, User } from "lucide-react";

export default function InputShowcase() {
  return (
    <div className="space-y-8 p-6 max-w-2xl mx-auto">
      {/* Kích thước */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Kích thước</h2>
        <div className="space-y-4">
          <Input size="sm" placeholder="Nhỏ (sm)" />
          <Input size="md" placeholder="Trung bình (md)" />
          <Input size="lg" placeholder="Lớn (lg)" />
        </div>
      </section>

      {/* Có icon bên trái */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Có icon bên trái</h2>
        <div className="space-y-4">
          <Input size="md" leftIcon={<Search />} placeholder="Tìm kiếm..." />
          <Input size="lg" leftIcon={<User />} placeholder="Tên người dùng" />
        </div>
      </section>

      {/* Có addon bên phải */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Có addon bên phải</h2>
        <div className="space-y-4">
          <Input
            size="md"
            rightAddon={<span className="text-sm text-gray-500">VNĐ</span>}
            placeholder="Giá tiền"
          />
        </div>
      </section>

      {/* Trường mật khẩu có nút hiện/ẩn */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Trường mật khẩu</h2>
        <div className="space-y-4">
          <Input type="password" placeholder="Mật khẩu" />
        </div>
      </section>

      {/* Trạng thái lỗi */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Trạng thái lỗi</h2>
        <div className="space-y-4">
          <Input placeholder="Email" error="Email không hợp lệ" />
          <Input
            placeholder="Số điện thoại"
            helperText="Nhập số di động của bạn"
          />
        </div>
      </section>

      {/* Disabled */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Disabled</h2>
        <div className="space-y-4">
          <Input disabled placeholder="Không thể nhập" />
        </div>
      </section>

      {/* Full width */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Full width</h2>
        <div className="space-y-4">
          <Input fullWidth placeholder="Chiều rộng đầy đủ" />
        </div>
      </section>
    </div>
  );
}
