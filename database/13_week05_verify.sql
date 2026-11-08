-- ==========================================
-- BUOI 5: KIEM CHUNG COURSEHUB REACT FRONTEND
-- ==========================================

-- 1. Kiem tra suc chua va so luong dang ky
SELECT
    class_id,
    capacity,
    enrolled,
    remaining
FROM v_section_summary
WHERE class_id IN ('WEB-01', 'RACE-01')
ORDER BY class_id;


-- 2. Kiem tra cac lop sinh vien da dang ky
SELECT
    student_id,
    class_section_id
FROM enrollments
WHERE student_id = '22000004'
ORDER BY class_section_id;


-- 3. Kiem tra lich su dang ky va huy dang ky
SELECT
    id,
    student_id,
    class_section_id,
    event_type,
    occurred_at
FROM enrollment_events
WHERE dataset = 'demo'
  AND student_id = '22000004'
  AND class_section_id = 'WEB-01'
ORDER BY id DESC
LIMIT 10;


-- 4. Kiem tra dang ky RACE-01
SELECT
    student_id,
    class_section_id
FROM enrollments
WHERE class_section_id = 'RACE-01'
ORDER BY student_id;