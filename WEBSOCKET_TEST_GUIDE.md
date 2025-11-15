# Hướng dẫn Test WebSocket cho Exam Notifications

## 📋 Mục lục

1. [Chuẩn bị](#chuẩn-bị)
2. [Test bằng HTML Client](#test-bằng-html-client)
3. [Test bằng Postman](#test-bằng-postman)
4. [Các Event WebSocket](#các-event-websocket)
5. [Kịch bản Test](#kịch-bản-test)

---

## 🔧 Chuẩn bị

### 1. Khởi động server

```bash
npm run start:dev
```

Server sẽ chạy tại: `http://localhost:3000`
WebSocket namespace: `/exam-notifications`

### 2. Lấy JWT Token

Sử dụng Postman để login và lấy access token:

**Endpoint:** `POST http://localhost:3000/api/v1/auth/login`

**Body (JSON):**

```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "..."
}
```

Lưu lại `accessToken` để sử dụng cho các bước tiếp theo.

---

## 🌐 Test bằng HTML Client

### Bước 1: Mở file test-websocket.html

Mở file `test-websocket.html` trong trình duyệt (Chrome, Firefox, Edge).

### Bước 2: Nhập thông tin kết nối

- **WebSocket Server URL:** `http://localhost:3000/exam-notifications` (mặc định)
- **JWT Token:** Paste access token vừa lấy được từ API login

### Bước 3: Kết nối

Click nút **"Connect"**

Bạn sẽ thấy:

- Status chuyển sang "Connected ✓"
- Message "connected" xuất hiện với thông tin userId

### Bước 4: Join Exam Room

- Nhập **Exam ID** (ví dụ: `1`)
- Click nút **"Join Exam Room"**

Bạn sẽ nhận được message `joinedExam` xác nhận đã join room thành công.

### Bước 5: Test các chức năng

Giữ HTML client mở và thực hiện các API call từ Postman (xem phần dưới).

---

## 📬 Test bằng Postman

### A. Test Start Exam (Nhận thông báo examStarted)

**Endpoint:** `POST http://localhost:3000/api/v1/pick-exam/start`

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "examId": 1,
  "userId": 1
}
```

**Kết quả:**

- API trả về thông tin bài thi bắt đầu
- **WebSocket client sẽ nhận được event `examStarted`** với dữ liệu:

```json
{
  "message": "Exam started successfully",
  "data": {
    "pickExamId": 123,
    "examId": 1,
    "examTitle": "Sample Exam",
    "startTime": "2025-07-15T10:00:00.000Z",
    "endTime": "2025-07-15T11:00:00.000Z",
    "duration": 60
  },
  "timestamp": "2025-07-15T10:00:00.000Z"
}
```

---

### B. Test Submit Exam (Nhận thông báo examResult)

**Endpoint:** `POST http://localhost:3000/api/v1/pick-exam/:pickExamId/submit`

**Headers:**

```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "answers": [
    {
      "questionId": 1,
      "answerId": 2
    },
    {
      "questionId": 2,
      "answerId": 5
    }
  ]
}
```

**Kết quả:**

- API trả về kết quả bài thi
- **WebSocket client sẽ nhận được event `examResult`** với dữ liệu:

```json
{
  "message": "Your exam has been graded",
  "data": {
    "pickExamId": 123,
    "examId": 1,
    "status": "completed",
    "score": 85,
    "percentage": 85.5,
    "totalQuestions": 20,
    "correctAnswers": 17,
    "finishTime": "2025-07-15T10:45:00.000Z"
  },
  "timestamp": "2025-07-15T10:45:00.000Z"
}
```

---

## 📡 Các Event WebSocket

### 1. Client → Server Events

| Event       | Payload              | Mô tả                                |
| ----------- | -------------------- | ------------------------------------ |
| `joinExam`  | `{ examId: string }` | Join vào room của một bài thi cụ thể |
| `leaveExam` | `{ examId: string }` | Leave khỏi room của bài thi          |

### 2. Server → Client Events

| Event          | Khi nào trigger                      | Data                                       |
| -------------- | ------------------------------------ | ------------------------------------------ |
| `connected`    | Khi client kết nối thành công        | `{ message, userId, timestamp }`           |
| `joinedExam`   | Sau khi join exam room thành công    | `{ examId, message, timestamp }`           |
| `leftExam`     | Sau khi leave exam room thành công   | `{ examId, message, timestamp }`           |
| `examStarted`  | Khi user bắt đầu làm bài (API start) | `{ message, data: {...}, timestamp }`      |
| `examResult`   | Khi user nộp bài (API submit)        | `{ message, data: {...}, timestamp }`      |
| `timeWarning`  | Cảnh báo thời gian còn lại           | `{ message, minutesRemaining, timestamp }` |
| `examExpiring` | Bài thi sắp hết hạn                  | `{ message, timestamp }`                   |

---

## 🎯 Kịch bản Test

### Kịch bản 1: Test thông báo bắt đầu làm bài

1. **Mở HTML client**, connect với JWT token
2. **Gửi request start exam** từ Postman
3. **Kiểm tra HTML client** nhận được event `examStarted`
4. **Verify data** trong event có đúng thông tin pickExamId, examId, startTime, endTime

---

### Kịch bản 2: Test thông báo kết quả bài thi

1. **Mở HTML client**, connect với JWT token
2. **Start exam** từ Postman (nếu chưa start)
3. **Submit exam** từ Postman với câu trả lời
4. **Kiểm tra HTML client** nhận được event `examResult`
5. **Verify data** có đúng score, percentage, correctAnswers, totalQuestions

---

### Kịch bản 3: Test join/leave exam room

1. **Mở HTML client**, connect với JWT token
2. **Nhập exam ID** vào input
3. **Click "Join Exam Room"**
4. **Kiểm tra** nhận được event `joinedExam`
5. **Click "Leave Exam Room"**
6. **Kiểm tra** nhận được event `leftExam`

---

### Kịch bản 4: Test multiple clients (mở 2 tab browser)

1. **Mở 2 tab browser** với file HTML
2. **Tab 1**: Connect với user A token, join exam room 1
3. **Tab 2**: Connect với user B token, join exam room 1
4. **Từ Postman**: User A start exam 1
5. **Tab 1 nhận** event `examStarted` (vì là user A)
6. **Tab 2 KHÔNG nhận** event `examStarted` (vì là user B)

Điều này chứng minh thông báo được gửi đúng user.

---

### Kịch bản 5: Test authentication failure

1. **Mở HTML client**
2. **Không nhập JWT token** hoặc nhập token sai
3. **Click "Connect"**
4. **Kiểm tra** connection bị reject với error `connect_error`
5. **Status** vẫn là "Disconnected"

---

## 🐛 Troubleshooting

### Lỗi: "connect_error"

- **Nguyên nhân:** Token không hợp lệ hoặc đã hết hạn
- **Giải pháp:** Login lại để lấy token mới

### Lỗi: Không nhận được event

- **Nguyên nhân:** Server chưa gửi event hoặc user không đúng
- **Giải pháp:** Kiểm tra console log server, verify userId trong token

### Lỗi: CORS error

- **Nguyên nhân:** WebSocket Gateway chưa config CORS
- **Giải pháp:** Đã config `cors: { origin: '*' }` trong Gateway

---

## 📊 Kết quả mong đợi

✅ **WebSocket được tích hợp thành công**

- Client kết nối được với JWT authentication
- Nhận thông báo real-time khi start exam
- Nhận thông báo real-time khi submit exam
- Join/leave room hoạt động đúng

✅ **Độ trễ thấp**

- Thông báo được gửi ngay lập tức (< 100ms)
- Không bị mất message

✅ **Tài liệu đầy đủ**

- Các event được mô tả rõ ràng
- Kịch bản test chi tiết
- Ví dụ cụ thể với data thực

---

## 📝 Ghi chú

- WebSocket chạy trên namespace `/exam-notifications` để tách biệt với các WebSocket khác
- JWT token được verify khi client connect, đảm bảo bảo mật
- Mỗi user có mapping riêng với socketId để gửi thông báo cá nhân hóa
- Exam room cho phép broadcast thông báo tới tất cả user đang làm cùng một bài thi

---

## 🎓 Tài liệu tham khảo

- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [NestJS WebSockets](https://docs.nestjs.com/websockets/gateways)
- [Testing WebSockets](https://socket.io/docs/v4/testing/)
