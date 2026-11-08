# Buổi 5 – React Frontend cho CourseHub

## 1. Mục tiêu

- Xây dựng giao diện frontend bằng React và Vite.
- Kết nối frontend với FastAPI thông qua HTTP API.
- Thực hiện tìm kiếm, đăng ký và hủy đăng ký lớp học phần.
- Xử lý các trạng thái loading, empty, error và các mã HTTP.

## 2. Công nghệ sử dụng

- React 18.2.0
- Vite 7.1.7
- JavaScript ES Modules
- FastAPI
- PostgreSQL
- Fetch API

## 3. Cấu trúc frontend

```text
frontend/
├── src/
│   ├── components/
│   │   ├── EnrollmentList.jsx
│   │   ├── Notice.jsx
│   │   └── SectionTable.jsx
│   ├── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── tests/
│   └── api.test.mjs
├── package.json
└── vite.config.js
```

## 4. Các chức năng đã thực hiện

- Hiển thị danh sách khóa học và lớp học phần.
- Tìm kiếm và lọc lớp học phần.
- Xem danh sách lớp đã đăng ký theo mã sinh viên.
- Đăng ký lớp học phần bằng HTTP POST.
- Hủy đăng ký bằng HTTP DELETE.
- Tải lại dữ liệu sau khi thao tác.
- Kiểm tra mã sinh viên và xử lý lỗi từ Backend.

## 5. Xử lý HTTP API

| HTTP Status | Ý nghĩa                                        |
| ----------- | ---------------------------------------------- |
| 200         | Yêu cầu thành công                             |
| 201         | Đăng ký thành công                             |
| 204         | Hủy đăng ký thành công, không có response body |
| 404         | Không tìm thấy sinh viên hoặc dữ liệu          |
| 409         | Xung đột dữ liệu hoặc lớp đã hết chỗ           |
| 422         | Dữ liệu gửi lên không hợp lệ                   |

## 6. Kiểm thử

### Unit test

- GET trả về dữ liệu JSON.
- POST gửi dữ liệu JSON.
- DELETE 204 trả về null.
- HTTP 404 và 409 tạo lỗi có status tương ứng.
- HTTP 422 hiển thị lỗi validation.
- Phản hồi không phải JSON tạo lỗi.
- Lỗi kết nối được chuyển thành thông báo dễ hiểu.
- AbortError được giữ nguyên.

Kết quả: **8/8 tests PASS, 0 failed.**

### Production build

- Chạy `npm run build`.
- Kết quả: 31 modules transformed.
- Build thành công và tạo thư mục `dist`.

### Production preview

- Chạy `npm run preview`.
- Truy cập thành công tại `http://127.0.0.1:5173/`.
- Đã kiểm tra giao diện và các chức năng tìm kiếm, đăng ký, hủy đăng ký.

## 7. Các vấn đề đã xử lý

- Cấu hình CORS giữa React và FastAPI.
- Điều chỉnh hàm `api()` để nhận options object.
- Xử lý DELETE HTTP 204 không có JSON body.
- Xử lý lỗi kết nối và AbortError.
- Xử lý trường hợp sinh viên chưa có đăng ký.
- Xử lý lỗi 404, 409 và 422.
- Kiểm tra giao diện trên màn hình nhỏ.

## 8. Lệnh chạy dự án

### Backend

Chạy FastAPI theo cấu hình của dự án.

### Frontend

```powershell
npm install
npm run dev
```

### Kiểm thử

```powershell
npm test
```

### Production build

```powershell
npm run build
npm run preview
```

## 9. Kết luận

Đã hoàn thành phần frontend React kết nối với FastAPI và PostgreSQL. Các chức năng chính đã được thực hành và kiểm tra; unit test, production build và production preview đều thành công.

# Week 5 - Supplementary Exercises

## Exercise 1: StudentForm

- Tách form chọn sinh viên thành StudentForm.jsx.
- Truyền dữ liệu và callback thông qua props.
- State được quản lý tại App.jsx.

## Exercise 2: Course Filter

- Lọc học phần INT2204, INT2205, INT2206.
- Kết hợp tìm kiếm và lọc theo môn học.
- Hiển thị trạng thái khi không có kết quả.

## Exercise 3: Enrollment History

- API: GET /enrollment-events.
- Hỗ trợ student_id, event_type, skip, limit.
- Chỉ lấy dữ liệu demo.
- Giới hạn limit từ 1 đến 100.
- Sắp xếp occurred_at DESC, id DESC.
- Frontend hiển thị 5 sự kiện mỗi trang.

## Exercise 4: Server-side Search and Pagination

- API: GET /courses.
- q: từ khóa tìm kiếm theo mã hoặc tên học phần.
- skip: vị trí bắt đầu lấy dữ liệu, mặc định 0.
- limit: số bản ghi mỗi trang, mặc định 10, tối đa 100.
- Sắp xếp ổn định bằng ORDER BY code.
- Sử dụng SQL LIMIT và OFFSET.
- Frontend gửi yêu cầu mới khi từ khóa hoặc trang thay đổi.
