# Ai là gián điệp? - Who's the Spy Web App

Web application cho board game "Ai là gián điệp?" được xây dựng với React, Vite, TypeScript và shadcn/ui.

## Tính năng

- 🎮 Chọn số lượng người chơi và số gián điệp
- 📝 Nhập tên người chơi
- 🎯 Chọn thể loại từ khóa hoặc để ngẫu nhiên
- ⏱️ Timer cho vòng thảo luận
- 🗳️ Hệ thống bỏ phiếu
- 💾 Lưu trữ game state trong local storage
- 📱 Responsive design
- 🎨 UI đẹp với shadcn/ui

## Công nghệ sử dụng

- **React 19** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Local Storage** - Data persistence

## Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## Cấu trúc dự án

```
src/
├── components/     # React components
├── contexts/       # React contexts (GameContext)
├── data/          # Data files (categories.json)
├── pages/         # Page components
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Luật chơi

1. **Setup**: Chọn số người chơi, số gián điệp, thể loại từ
2. **Phân vai**: Mỗi người nhận một từ khóa (dân thường) hoặc "?" (gián điệp)
3. **Thảo luận**: Người chơi lần lượt mô tả từ khóa của mình (2 phút)
4. **Vote**: Tất cả vote ai là gián điệp, người có nhiều vote nhất bị loại
5. **Kết thúc**:
   - Dân thường thắng nếu loại hết gián điệp
   - Gián điệp thắng nếu số gián điệp = số dân thường còn lại
6. **Lặp lại**: Nếu chưa có phe thắng, tiếp tục vòng thảo luận mới

Xem chi tiết tại trang [Luật chơi](/rules).

## Deployment

### Vercel

Project được cấu hình để deploy tự động lên Vercel thông qua GitHub Actions.

Cần setup các secrets trong GitHub:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Manual Deployment

```bash
npm run build
# Deploy thư mục dist/ lên Vercel
```

## License

MIT
