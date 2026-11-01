BEGIN;

-- 1. Thêm cột note (cho phép NULL để dữ liệu cũ không bị lỗi)
ALTER TABLE enrollment_events
ADD COLUMN note VARCHAR(200);

-- 2. Ghi nhận phiên bản migration 002
INSERT INTO schema_migrations (version, description)
VALUES ('002', 'Add note column to enrollment_events table');

COMMIT;