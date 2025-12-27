# HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN 🚀

Đây là hướng dẫn dành cho thành viên mới muốn chạy dự án này trên máy cá nhân.

## 1. Cài đặt môi trường cần thiết
Trước khi bắt đầu, hãy chắc chắn máy bạn đã cài:
- **Node.js** (Phiên bản 18 hoặc mới hơn): [Tải tại đây](https://nodejs.org/en)
- **Git**: [Tải tại đây](https://git-scm.com/downloads)
- **VS Code**: [Tải tại đây](https://code.visualstudio.com/)

---

## 2. Kéo Code về máy
Mở Terminal (hoặc Git Bash), chạy lệnh:
```bash
git clone https://github.com/phuca0111/WebTMDT.git
cd ecommerce-nextjs
```

---

## 3. Cài đặt thư viện (Dependencies)
Tại thư mục dự án, chạy lệnh:
```bash
npm install
```
*Chờ một chút để nó tải các thư viện về...*

---

## 4. Cấu hình Database (.env)
Tạo một file tên là `.env` ngay tại thư mục gốc (ngang hàng với `package.json`).
Copy nội dung sau dán vào:

```env
# Kết nối đến Database chung của nhóm (Supabase)
DATABASE_URL="postgresql://postgres:Team*4dua@db.inlmxianelctnxzaxyqd.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:Team*4dua@db.inlmxianelctnxzaxyqd.supabase.co:5432/postgres"

# Secret Key cho đăng nhập (Giữ bí mật)
JWT_SECRET="super-secret-key-change-me"

# Cấu hình MOMO (Nếu test thanh toán)
MOMO_PARTNER_CODE="MOMO..."
MOMO_ACCESS_KEY="..."
MOMO_SECRET_KEY="..."
next_public_app_url="http://localhost:3000"
```

---

## 5. Chạy dự án
Sau khi xong các bước trên, chạy lệnh:

```bash
npm run dev
```

Mở trình duyệt truy cập: **[http://localhost:3000](http://localhost:3000)**

---

## ❓ Câu hỏi thường gặp

**Q: Database trắng trơn, không có sản phẩm?**
A: Vì bạn đang dùng database chung trên Cloud nên dữ liệu đã có sẵn rồi. Nếu vẫn không thấy, hãy thử chạy lệnh đồng bộ:
```bash
npx prisma generate
```

**Q: Lỗi hình ảnh không hiển thị?**
A: Đảm bảo bạn đã pull code mới nhất (có cập nhật `next.config.ts`). Thử tắt server `Ctrl + C` và chạy lại `npm run dev`.

**Q: Muốn test trên điện thoại/mạng LAN?**
A: Chạy lệnh `npm run share` thay vì `npm run dev`.
