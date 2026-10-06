CREATE TABLE students (
    id VARCHAR(8) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    major VARCHAR(20) NOT NULL,
    email VARCHAR(120) NOT NULL,
    CONSTRAINT uq_students_email UNIQUE (email),
    CONSTRAINT ck_students_id CHECK (length(id) = 8),
    CONSTRAINT ck_students_name CHECK (trim(name) <> '')
);

CREATE TABLE courses (
    code VARCHAR(10) NOT NULL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    credits INTEGER NOT NULL,
    CONSTRAINT ck_courses_credits CHECK (credits BETWEEN 1 AND 6)
);

CREATE TABLE semesters (
    code VARCHAR(10) NOT NULL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    CONSTRAINT ck_semesters_dates
    CHECK (end_date >= start_date)
);

CREATE TABLE lecturers (
    id VARCHAR(10) NOT NULL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE class_sections (
id VARCHAR(20) NOT NULL PRIMARY KEY,
course_code VARCHAR(10) NOT NULL
REFERENCES courses(code),
semester_code VARCHAR(10) NOT NULL
REFERENCES semesters(code),
lecturer_id VARCHAR(10) NOT NULL
REFERENCES lecturers(id),
capacity INTEGER NOT NULL,
CONSTRAINT ck_sections_capacity CHECK (capacity > 0)
);

CREATE TABLE enrollments (
    student_id VARCHAR(8) NOT NULL
    REFERENCES students(id),
    class_section_id VARCHAR(20) NOT NULL
    REFERENCES class_sections(id),
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_enrollments
    PRIMARY KEY (student_id, class_section_id)
);

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

INSERT INTO students (id, name, major, email) VALUES
('22000001', 'Nguyen Minh Anh', 'KHDL', 'anh@example.com'),
('22000002', 'Tran Duc Long', 'KHDL', 'long@example.com'),
('22000003', 'Pham Thu Ha', 'KHDL', 'ha@example.com'),
('22000004', 'Le Hoang Nam', 'KHDL', 'nam@example.com');

INSERT INTO courses (code, name, credits) VALUES
('INT2204', 'Co so du lieu Web va he thong thong tin', 3),
('INT2205', 'Khai pha du lieu', 3),
('INT2206', 'Lap trinh Python', 2);

INSERT INTO semesters
(code, name, start_date, end_date) VALUES
('2026-1', 'Hoc ky I - 2026', '2026-09-01', '2027-01-31');

INSERT INTO lecturers (id, name) VALUES
('GV01', 'Nguyen Thu Lan'),
('GV02', 'Le Minh Son');

INSERT INTO class_sections
(id, course_code, semester_code, lecturer_id, capacity)
VALUES
('WEB-01', 'INT2204', '2026-1', 'GV01', 3),
('WEB-02', 'INT2204', '2026-1', 'GV01', 2),
('DM-01', 'INT2205', '2026-1', 'GV02', 2),
('PY-01', 'INT2206', '2026-1', 'GV02', 2);

INSERT INTO enrollments (student_id, class_section_id) VALUES
('22000001', 'WEB-01'),
('22000002', 'WEB-01'),
('22000001', 'DM-01'),
('22000003', 'DM-01'),
('22000003', 'PY-01');