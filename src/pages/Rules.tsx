import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Rules = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Luật chơi "Ai là gián điệp?"</h1>
        <p className="text-muted-foreground">Hướng dẫn chi tiết cách chơi</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Chuẩn bị</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Trước khi bắt đầu, bạn cần:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Chọn số lượng người chơi (tối thiểu 3 người, tối đa 10 người)</li>
            <li>Chọn số lượng gián điệp (thường là 1-2 gián điệp tùy số người chơi)</li>
            <li>Chọn thể loại từ khóa hoặc để ngẫu nhiên</li>
            <li>Nhập tên của tất cả người chơi</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Phân vai</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Sau khi setup, hệ thống sẽ tự động:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Chọn ngẫu nhiên một cặp từ từ thể loại đã chọn</li>
            <li>
              Phân phối vai trò cho từng người chơi:
              <ul className="list-circle list-inside ml-6 mt-2">
                <li>
                  <strong>Dân thường:</strong> Nhận một từ khóa (một trong hai từ của cặp từ)
                </li>
                <li>
                  <strong>Gián điệp:</strong> Không biết từ khóa, chỉ thấy dấu "?"
                </li>
              </ul>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Vòng thảo luận</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Người chơi lần lượt mô tả từ khóa của mình:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Mỗi người có 2 phút để thảo luận</li>
            <li>
              Người chơi lần lượt mô tả từ khóa của mình{' '}
              <strong>KHÔNG được nói trực tiếp từ đó</strong>
            </li>
            <li>Dân thường sẽ mô tả từ khóa của mình</li>
            <li>Gián điệp phải đoán và mô tả sao cho không bị phát hiện</li>
            <li>Mọi người có thể đặt câu hỏi và thảo luận</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4. Bỏ phiếu (Vote)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Sau khi thảo luận xong, tất cả người chơi sẽ bỏ phiếu:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Mỗi người chọn một người mà họ nghi ngờ là gián điệp</li>
            <li>Không được bỏ phiếu cho chính mình</li>
            <li>Người nhận được nhiều phiếu nhất sẽ bị loại</li>
            <li>Nếu có nhiều người cùng số phiếu, hệ thống sẽ chọn ngẫu nhiên</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>5. Điều kiện thắng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Trò chơi kết thúc khi một trong hai phe thắng:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Dân thường thắng:</strong> Khi tất cả gián điệp đã bị loại
            </li>
            <li>
              <strong>Gián điệp thắng:</strong> Khi số lượng gián điệp còn lại bằng hoặc nhiều hơn
              số dân thường còn lại
            </li>
          </ul>
          <p className="mt-4">
            Nếu chưa có phe nào thắng, trò chơi tiếp tục với vòng thảo luận mới.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>6. Kết thúc game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Khi game kết thúc:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Hệ thống sẽ hiển thị vai trò thực tế của từng người chơi</li>
            <li>Hiển thị cặp từ khóa đã được sử dụng</li>
            <li>Bạn có thể chọn "Chơi lại" với cùng nhóm hoặc "Tạo nhóm mới"</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>💡 Mẹo chơi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>
              <strong>Cho dân thường:</strong> Mô tả từ khóa một cách rõ ràng nhưng không quá trực
              tiếp. Quan sát cách người khác mô tả để tìm gián điệp.
            </li>
            <li>
              <strong>Cho gián điệp:</strong> Lắng nghe cẩn thận và mô tả một cách chung chung. Cố
              gắng không quá khác biệt so với người khác.
            </li>
            <li>Đặt câu hỏi thông minh để phát hiện sự không nhất quán</li>
            <li>Chú ý đến ngôn ngữ cơ thể và cách trả lời của người khác</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
