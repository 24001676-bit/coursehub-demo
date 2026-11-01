    BEGIN;
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(50) NOT NULL PRIMARY KEY,
    description VARCHAR(200) NOT NULL,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE enrollment_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id VARCHAR(8) NOT NULL REFERENCES students(id),
    class_section_id VARCHAR(20) NOT NULL REFERENCES class_sections(id),
    event_type VARCHAR(20) NOT NULL,
    source VARCHAR(20) NOT NULL DEFAULT 'api',
    dataset VARCHAR(20) NOT NULL DEFAULT 'demo',
    occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,   

    CONSTRAINT ck_enrollment_events_type
    CHECK (event_type IN ('CREATED', 'CANCELLED')),
CONSTRAINT ck_enrollment_events_dataset
    CHECK (dataset IN ('demo', 'performance'))
);

INSERT INTO schema_migrations (version, description)
VALUES ('001', 'Add enrollment event audit table');

COMMIT;

-- chưa tạo index thứ 2

EXPLAIN (ANALYZE, BUFFERS)
SELECT id, student_id, class_section_id, event_type, occurred_at
FROM enrollment_events
WHERE dataset = 'performance'
  AND student_id = '22000001'
  AND occurred_at >= TIMESTAMP '2025-12-20 00:00:00'
ORDER BY occurred_at DESC
LIMIT 50;

-- tạo truy vấn chỉ mục thứ 2 và truy vấn

CREATE INDEX idx_enrollment_events_dataset_student_time
ON enrollment_events (dataset, student_id, occurred_at DESC);

ANALYZE enrollment_events;

SELECT COUNT(*) FROM enrollments WHERE class_section_id = 'WEB-01';


SELECT * FROM enrollments WHERE student_id = '22000003' AND class_section_id = 'WEB-01';

EXPLAIN (ANALYZE, BUFFERS)
SELECT id, student_id, class_section_id, event_type, occurred_at
FROM enrollment_events
WHERE dataset = 'performance'
  AND class_section_id = 'WEB-01'
  AND event_type = 'CREATED'
  AND occurred_at >= TIMESTAMP '2025-06-01 00:00:00'
ORDER BY occurred_at DESC
LIMIT 50;
