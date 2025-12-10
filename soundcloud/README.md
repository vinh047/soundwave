# Hệ Thống Nghe Nhạc Trực Tuyến (SoundCloud Clone)

Một nền tảng nghe nhạc trực tuyến hiện đại, được xây dựng với Next.js, Turborepo và các công nghệ web mới nhất.

## 🚀 Tính Năng Chính

- **Nghe Nhạc Trực Tuyến**: Trải nghiệm nghe nhạc mượt mà với trình phát nhạc tích hợp, hỗ trợ visualization sóng nhạc.
- **Quản Lý Playlist**: Tạo, chỉnh sửa, xóa và chia sẻ playlist cá nhân.
- **Thư Viện Cá Nhân**: 
  - **History**: Xem lại lịch sử nghe nhạc gần đây.
  - **Likes**: Lưu và quản lý các bài hát yêu thích.
  - **Following**: Theo dõi nghệ sĩ và cập nhật bài hát mới từ họ.
- **Hồ Sơ Nghệ Sĩ**: Trang cá nhân đầy đủ cho nghệ sĩ với danh sách bài hát, album và thông tin chi tiết.
- **Tải Lên Nhạc**: Tính năng tải lên bài hát hỗ trợ kéo thả (Drag & Drop).
- **Giao Diện Hiện Đại**: Thiết kế đẹp mắt, hỗ trợ Dark Mode, Responsive trên mọi thiết bị.

## 🛠️ Công Nghệ Sử Dụng

Dự án được xây dựng trên cấu trúc Monorepo sử dụng **Turborepo**.

### Frontend (`apps/web`)
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Ngôn ngữ**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) (Icons)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Audio Visualization**: [Wavesurfer.js](https://wavesurfer-js.org/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)

### Backend & Database
- **Database**: PostgreSQL / MySQL
- **ORM**: [Prisma](https://www.prisma.io/) (`@repo/database`)

### Tools
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Build System**: [Turbo](https://turbo.build/)

## 📦 Cài Đặt & Chạy Dự Án

### 1. Yêu cầu tiên quyết
- Node.js (phiên bản LTS mới nhất)
- pnpm (`npm install -g pnpm`)

### 2. Cài đặt dependencies
Tại thư mục gốc của dự án:

```bash
pnpm install
```

### 3. Cấu hình môi trường
Tạo file `.env` trong thư mục `apps/web` và cấu hình các biến môi trường cần thiết (ví dụ: kết nối Database, NextAuth secret, Cloudinary/S3 nếu có).

### 4. Chạy Database
Đảm bảo database đã được khởi chạy và schema được đẩy lên:

```bash
# Từ thư mục gốc
pnpm db:push
```

### 5. Chạy ứng dụng (Development)

```bash
pnpm dev
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

## 📂 Cấu Trúc Dự Án

```
.
├── apps
│   └── web              # Ứng dụng Next.js chính (Frontend & API Routes)
├── packages
│   ├── database         # Prisma schema và client configuration
│   ├── ui               # Shared UI components
│   ├── types            # Shared TypeScript types
│   ├── eslint-config    # Cấu hình ESLint chung
│   └── typescript-config # Cấu hình TypeScript chung
├── package.json         # Root package.json
├── pnpm-workspace.yaml  # Cấu hình workspace
└── turbo.json           # Cấu hình Turborepo
```

## 🤝 Đóng Góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo Pull Request hoặc mở Issue nếu bạn tìm thấy lỗi hoặc muốn đề xuất tính năng mới.
