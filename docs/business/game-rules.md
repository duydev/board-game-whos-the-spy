# Tài liệu Nghiệp vụ: Luật chơi Game "Ai là gián điệp?"

## 1. Mục đích và Mô tả Game

"Ai là gián điệp?" là một board game xã hội, nơi người chơi được chia thành hai phe:

- **Dân thường (Civilians)**: Biết từ khóa và phải tìm ra gián điệp
- **Gián điệp (Spies)**: Không biết từ khóa và phải giả vờ để không bị phát hiện

Mục tiêu của game:

- **Dân thường**: Tìm và loại bỏ tất cả gián điệp
- **Gián điệp**: Ẩn náu cho đến khi số lượng gián điệp bằng hoặc nhiều hơn số dân thường còn lại

## 2. Quy trình chơi

### 2.1 Setup (Thiết lập)

**Ràng buộc nghiệp vụ:**

- Số người chơi tối thiểu: **3 người**
- Số gián điệp tối thiểu: **1 người**
- Số gián điệp phải **nhỏ hơn** tổng số người chơi
- Công thức: `1 <= numberOfSpies < totalPlayers`

**Các bước setup:**

1. Chọn số lượng người chơi (totalPlayers)
2. Chọn số lượng gián điệp (numberOfSpies)
3. Chọn thể loại từ khóa (category) hoặc để ngẫu nhiên (random)
4. Nhập tên cho từng người chơi

### 2.2 Phân vai (Role Assignment)

**Quy tắc phân phối vai trò:**

1. Hệ thống chọn ngẫu nhiên một cặp từ khóa (WordPair) từ category đã chọn
2. Cặp từ khóa gồm 2 từ: `[word1, word2]`
3. Ngẫu nhiên chọn `numberOfSpies` người chơi làm gián điệp
4. Phân phối từ khóa cho dân thường:
   - Phân phối đều giữa `word1` và `word2`
   - Nếu số dân thường lẻ, từ nào có ít người hơn sẽ được ưu tiên
   - Gián điệp **không** nhận từ khóa (word = undefined)

**Ví dụ:**

- 5 người chơi, 1 gián điệp, cặp từ ["Chó", "Mèo"]
- 1 người là gián điệp (không có từ)
- 2 người nhận "Chó"
- 2 người nhận "Mèo"

### 2.3 Thảo luận (Discussion)

**Quy tắc:**

1. Mỗi vòng thảo luận có thời gian: **120 giây (2 phút)**
2. Người chơi lần lượt mô tả từ khóa của mình:
   - Dân thường: Mô tả từ khóa của mình (nhưng không được nói trực tiếp từ đó)
   - Gián điệp: Phải giả vờ mô tả để không bị phát hiện
3. Người chơi có thể chuyển sang người tiếp theo
4. Khi hết thời gian hoặc tất cả đã nói, chuyển sang giai đoạn bỏ phiếu

**Điều hướng:**

- `currentDiscussionPlayerIndex`: Chỉ số người chơi đang thảo luận (chỉ tính người chơi còn sống)
- `discussionTimeRemaining`: Thời gian còn lại (giây)

### 2.4 Bỏ phiếu (Voting)

**Quy tắc bỏ phiếu:**

1. Tất cả người chơi còn sống (không bị loại) phải bỏ phiếu
2. Mỗi người chỉ được bỏ phiếu **1 lần** trong mỗi vòng
3. Không được bỏ phiếu cho:
   - Chính mình
   - Người chơi đã bị loại
4. Người chơi đã bị loại **không được** bỏ phiếu

**Tính toán kết quả:**

1. Đếm số phiếu cho từng người chơi
2. Người có **nhiều phiếu nhất** sẽ bị loại
3. Nếu có **hòa** (tie), hệ thống sẽ **ngẫu nhiên** chọn một trong những người có số phiếu cao nhất

**Lưu ý:**

- Nếu không có phiếu nào được bỏ, không có ai bị loại
- Nếu tất cả đều có 0 phiếu, không có ai bị loại

### 2.5 Loại bỏ (Elimination)

**Quy trình:**

1. Sau khi kết thúc voting, người có nhiều phiếu nhất bị đánh dấu `isEliminated = true`
2. Kiểm tra điều kiện thắng/thua
3. Nếu chưa có phe thắng:
   - Tăng `currentRound` lên 1
   - Reset `currentDiscussionPlayerIndex = 0`
   - Reset `currentVotingPlayerIndex = 0`
   - Reset `votes = {}`
   - Reset `discussionTimeRemaining = 120`
   - Bắt đầu vòng thảo luận mới

### 2.6 Điều kiện thắng/thua (Win Conditions)

**Dân thường thắng:**

- Điều kiện: `activeSpies.length === 0`
- Tức là tất cả gián điệp đã bị loại
- Kết quả: `winner = 'civilians'`, `isGameOver = true`

**Gián điệp thắng:**

- Điều kiện: `activeSpies.length >= activeCivilians.length`
- Tức là số gián điệp còn lại bằng hoặc nhiều hơn số dân thường còn lại
- Kết quả: `winner = 'spies'`, `isGameOver = true`

**Game tiếp tục:**

- Điều kiện: `activeSpies.length > 0 && activeSpies.length < activeCivilians.length`
- Tức là vẫn còn gián điệp và số gián điệp ít hơn số dân thường
- Kết quả: `winner = null`, `isGameOver = false`
- Tiếp tục vòng thảo luận mới

## 3. Cấu trúc Dữ liệu

### 3.1 GameConfig

```typescript
{
  totalPlayers: number; // Tổng số người chơi (>= 3)
  numberOfSpies: number; // Số gián điệp (>= 1, < totalPlayers)
  category: Category | 'random'; // Thể loại từ khóa
}
```

### 3.2 Player

```typescript
{
  id: string;                 // ID duy nhất
  name: string;               // Tên người chơi
  role: 'civilian' | 'spy';   // Vai trò
  word?: string;              // Từ khóa (chỉ dân thường có)
  isEliminated: boolean;      // Đã bị loại chưa
  voteCount?: number;         // Số phiếu nhận được (tính toán)
}
```

### 3.3 GameState

```typescript
{
  config: GameConfig;
  players: Player[];
  currentRound: number;                    // Vòng hiện tại (bắt đầu từ 1)
  currentDiscussionPlayerIndex: number;    // Chỉ số người đang thảo luận
  currentVotingPlayerIndex: number;         // Chỉ số người đang vote
  votes: Record<string, string>;          // Map voterId -> votedPlayerId
  wordPair: WordPair | null;               // Cặp từ khóa đã chọn
  winner: 'civilians' | 'spies' | null;    // Phe thắng
  isGameOver: boolean;                      // Game đã kết thúc chưa
  discussionTimeRemaining: number;         // Thời gian còn lại (giây)
}
```

### 3.4 WordPair

```typescript
type WordPair = [string, string]; // Cặp từ khóa
```

## 4. Quy tắc Nghiệp vụ Chi tiết

### 4.1 Validation GameConfig

- `totalPlayers >= 3`: Phải có ít nhất 3 người chơi
- `numberOfSpies >= 1`: Phải có ít nhất 1 gián điệp
- `numberOfSpies < totalPlayers`: Số gián điệp phải ít hơn tổng số người chơi

### 4.2 Phân phối Từ khóa

- Cặp từ khóa được chọn ngẫu nhiên từ category
- Nếu category = 'random', chọn ngẫu nhiên category trước, rồi chọn cặp từ
- Từ khóa được phân phối đều giữa 2 từ trong cặp
- Gián điệp không nhận từ khóa

### 4.3 Tính toán Vote

- Chỉ đếm vote của người chơi còn sống
- Mỗi người chỉ được vote 1 lần
- Nếu hòa, chọn ngẫu nhiên trong số những người có nhiều vote nhất

### 4.4 Điều kiện Thắng

- Kiểm tra sau mỗi lần loại bỏ người chơi
- Dân thường thắng khi không còn gián điệp nào
- Gián điệp thắng khi số lượng bằng hoặc nhiều hơn dân thường

## 5. Luồng Game Hoàn chỉnh

```
1. Setup
   └─> Chọn config (players, spies, category)
   └─> Nhập tên người chơi

2. Khởi tạo Game
   └─> Chọn word pair
   └─> Phân phối vai trò
   └─> Phân phối từ khóa
   └─> Khởi tạo GameState (round = 1, time = 120s)

3. Vòng chơi (lặp lại cho đến khi có phe thắng)
   ├─> Discussion Phase
   │   └─> Người chơi lần lượt mô tả (2 phút)
   │   └─> Chuyển người chơi tiếp theo
   │
   ├─> Voting Phase
   │   └─> Tất cả người chơi bỏ phiếu
   │   └─> Tính toán kết quả
   │
   ├─> Elimination Phase
   │   └─> Loại bỏ người có nhiều phiếu nhất
   │   └─> Kiểm tra điều kiện thắng
   │
   └─> Nếu chưa thắng:
       └─> Tăng round
       └─> Reset discussion
       └─> Quay lại Discussion Phase

4. Kết thúc
   └─> Hiển thị kết quả (civilians hoặc spies thắng)
```

## 6. Edge Cases và Xử lý

### 6.1 Không có phiếu nào

- Nếu không có phiếu nào được bỏ → Không có ai bị loại
- Game tiếp tục với vòng mới

### 6.2 Hòa phiếu (Tie)

- Nếu nhiều người có cùng số phiếu cao nhất → Chọn ngẫu nhiên một người
- Sử dụng `Math.random()` để chọn

### 6.3 Tất cả người chơi bị loại

- Trường hợp này không thể xảy ra vì:
  - Dân thường thắng khi loại hết gián điệp
  - Gián điệp thắng khi số lượng >= dân thường
  - Không thể loại hết tất cả

### 6.4 Thời gian thảo luận

- Thời gian mặc định: 120 giây
- Có thể cập nhật thời gian còn lại
- Khi hết thời gian, chuyển sang voting phase

## 7. Persistence

Game state được lưu trong `localStorage`:

- Key: `gameState`
- Format: JSON string của GameState
- Tự động lưu sau mỗi thao tác thay đổi state
- Có thể load lại game state khi refresh trang

## 8. Tóm tắt Ràng buộc Nghiệp vụ

| Ràng buộc                  | Giá trị                                      |
| -------------------------- | -------------------------------------------- |
| Số người chơi tối thiểu    | 3                                            |
| Số gián điệp tối thiểu     | 1                                            |
| Số gián điệp tối đa        | totalPlayers - 1                             |
| Thời gian thảo luận        | 120 giây                                     |
| Số từ trong cặp từ khóa    | 2                                            |
| Round bắt đầu từ           | 1                                            |
| Không được vote cho        | Chính mình, người đã bị loại                 |
| Điều kiện dân thường thắng | activeSpies.length === 0                     |
| Điều kiện gián điệp thắng  | activeSpies.length >= activeCivilians.length |
