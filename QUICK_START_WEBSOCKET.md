# 🚀 Quick Start Guide - WebSocket Testing

## ⚡ 5 phút để test WebSocket

### Bước 1: Start Server (30 giây)

```bash
cd /home/dawy/TTDN/multiple_choice_nestjs
npm run start:dev
```

Chờ đến khi thấy: `Application is running on: http://0.0.0.0:3000`

---

### Bước 2: Lấy JWT Token (1 phút)

**Option A: Dùng Postman**

1. Import collection: `WebSocket_Exam_Test.postman_collection.json`
2. Import environment: `WebSocket_Test.postman_environment.json`
3. Run request "1. Login (Get Token)"
4. Token tự động lưu vào environment

**Option B: Dùng curl**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "your_password"
  }'
```

Copy `accessToken` từ response.

---

### Bước 3: Mở HTML Test Client (30 giây)

1. Mở file: `test-websocket.html` trong Chrome/Firefox
2. Paste JWT token vào ô "JWT Token"
3. Click nút **"Connect"**
4. ✅ Thấy status: **"Connected ✓"**

---

### Bước 4: Test Start Exam (1 phút)

**Trong Postman:**

1. Run request "2. Start Exam (Trigger examStarted event)"
2. Xem response trả về thông tin bài thi

**Trong HTML Client:** 3. ✅ Nhận được event **"examStarted"** với data:

```json
{
  "message": "Exam started successfully",
  "data": {
    "pickExamId": 123,
    "examId": 1,
    "examTitle": "Sample Exam",
    "startTime": "...",
    "endTime": "...",
    "duration": 60
  }
}
```

---

### Bước 5: Test Submit Exam (1 phút)

**Trong Postman:**

1. Run request "3. Submit Exam (Trigger examResult event)"
2. Xem response trả về kết quả bài thi

**Trong HTML Client:** 3. ✅ Nhận được event **"examResult"** với data:

```json
{
  "message": "Your exam has been graded",
  "data": {
    "pickExamId": 123,
    "score": 85,
    "percentage": 85.5,
    "totalQuestions": 20,
    "correctAnswers": 17,
    "status": "completed"
  }
}
```

---

## 🎯 Bonus: Test Join/Leave Room (1 phút)

**Trong HTML Client:**

1. Nhập "1" vào ô "Exam ID"
2. Click **"Join Exam Room"**
3. ✅ Nhận event `joinedExam`
4. Click **"Leave Exam Room"**
5. ✅ Nhận event `leftExam`

---

## ✅ Checklist

- [ ] Server đã chạy
- [ ] Đã login và có JWT token
- [ ] HTML client đã connect thành công
- [ ] Start exam → Nhận event `examStarted` ✅
- [ ] Submit exam → Nhận event `examResult` ✅
- [ ] Join room → Nhận event `joinedExam` ✅
- [ ] Leave room → Nhận event `leftExam` ✅

---

## 🐛 Lỗi thường gặp

| Lỗi              | Nguyên nhân        | Giải pháp                  |
| ---------------- | ------------------ | -------------------------- |
| "connect_error"  | Token sai/hết hạn  | Login lại để lấy token mới |
| Không nhận event | User ID không đúng | Check token payload        |
| CORS error       | Browser block      | Đã config, refresh browser |
| 401 Unauthorized | Thiếu token        | Thêm token vào header      |

---

## 📞 Cần trợ giúp?

📖 Xem tài liệu chi tiết: `WEBSOCKET_TEST_GUIDE.md`
📄 Implementation details: `WEBSOCKET_IMPLEMENTATION.md`

---

**Happy Testing! 🎉**
