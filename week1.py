#print("CourseHub - Buoi 1")
#làm ví dụ
students = [
{"id": "22000001", "name": "Nguyen Minh Anh", "major": "KHDL"},
{"id": "22000002", "name": "Tran Duc Long", "major": "KHDL"},
]
courses = [
{
"code": "INT2204",
"name": "Co so du lieu Web va he thong thong tin",
"capacity": 3,
"enrolled": 2,
},
{
"code": "INT2205",
"name": "Khai pha du lieu",
"capacity": 2,
"enrolled": 2,
},
]
enrollments = [
{"student_id": "22000001", "course_code": "INT2204"}
]
print(students)

for course in courses:
    remaining = course["capacity"] - course["enrolled"]
    print(course["code"], "- con", remaining, "cho")

def find_course(course_code):
    for course in courses:
        if course["code"] == course_code:
            return course
    return None

print(find_course("INT2204"))

def can_enroll(student_id, course_code):
    course = find_course(course_code)
    if course is None:
            return False, "Hoc phan khong ton tai"
    if course["enrolled"] >= course["capacity"]:
            return False, "Lop da du so luong"
    duplicated = any(
        item["student_id"] == student_id and item["course_code"] == course_code
        for item in enrollments
        )
    if duplicated:
            return False, "Sinh vien da dang ky hoc phan nay"
    return True, "Co the dang ky"
print(can_enroll("22000002", "INT2204"))

try:
    limit = int(input("Nhap so luong hoc phan muon hien thi: "))
    print(courses[:limit])
except ValueError:
    print("So luong phai la so nguyen")

def search_courses(keyword):
    normalized = keyword.strip().lower()
    results = []
    for course in courses:
        code = course["code"].lower()
        name = course["name"].lower()
        if normalized in code or normalized in name:
            results.append(course)
    return results
print(search_courses("web"))

def search_courses(keyword):
    new_keyword = keyword.strip().lower() # Xóa khoảng trắng, chuyển về dạng thường để tìm không phân biệt dạng hoa hay thường.

    new_list = [] # khỏi tạo một list rỗng để lưu kết quả phù hợp
    # Duyệt qua từng khóa học trong course
    for course in courses:
          #Lấy ra mã khóa học và tên khóa học rồi chuẩn hóa
          code = course["code"].strip().lower()
          name = course["name"].strip().lower()

          #Kiểm tra điều kiện xem keyword có thỏa mãn hay không
          if (new_keyword in code or new_keyword in name):
               new_list.append(course)
    return new_list

print(search_courses("Web"))

def enroll_student(student_id, course_code):
    # kiểm tra sinh viên có tồn tại không
     check_student = False
     for student in students:
          if (student_id == student["id"]):
               check_student = True

     if (check_student == False):
         return "Sinh viên không tồn tại"
    
    # kiểm tra khóa học có tồn tại không, nếu tồn tại thì còn chỗ hay không
     check_course = False
     for course in courses:
        if (course_code == course["code"]):
              check_course = True
              if (course["enrolled"] >= course["capacity"]):
                   return "Lớp hết chỗ"

     if (check_course == False):
          return "Khóa học không tồn tại"

     # Kiểm tra đăng ký trùng
     for enroll in enrollments:
          if (enroll["student_id"] == student_id and enroll["course_code"]):
               return "Học sinh này đăng ký trùng"
     # Nếu thông qua các điều kiện thì thêm vào danh sách
     add_student = {"student_id": student_id, "course_code": course_code}
     enrollments.append(add_student)
     # Cập nhật số lượng chỗ
     for course in courses:
          if (course_code == course["code"]):
               course["enrolled"] += 1
               
     return "Đăng ký thành công"
    
         
# kiểm tra sinh viên tồn tại
print("Sinh viên này có tồn tại hay không:")
print(enroll_student("22000003", "INT2204"))
# Kiểm tra khóa học tồn tại
print("Khóa học này có tồn tại không:")
print(enroll_student("22000001", "INT2206"))
# Kiểm tra đăng ký trùng
print("Sinh viên không đăng ký trùng đúng ko:")
print(enroll_student("22000001", "INT2204"))
#Kiểm tra lớp đầy
print("Lớp có còn chỗ không:")
print(enroll_student("22000002","INT2205"))
#Kiểm tra đăng ký thành công
print("Học sinh đã đăng ký thành công chưa:")
print(enroll_student("22000002", "INT2204"))