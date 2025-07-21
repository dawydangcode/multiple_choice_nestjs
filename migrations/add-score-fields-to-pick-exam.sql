-- Migration: Add score fields to pick_exam table
-- Date: 2025-07-21

USE your_database_name; -- Thay đổi tên database

ALTER TABLE pick_exam 
ADD COLUMN total_questions INT NULL COMMENT 'Tổng số câu hỏi',
ADD COLUMN correct_answers INT NULL COMMENT 'Số câu trả lời đúng',
ADD COLUMN score DECIMAL(5,2) NULL COMMENT 'Điểm số',
ADD COLUMN percentage DECIMAL(5,2) NULL COMMENT 'Phần trăm đúng',
ADD COLUMN grade VARCHAR(20) NULL COMMENT 'Xếp hạng (Excellent, Good, Average, etc.)';

-- Verify the changes
DESCRIBE pick_exam;
