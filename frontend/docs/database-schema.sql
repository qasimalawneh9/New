-- Talkcon Database Schema for Laravel Backend
-- This file contains the database structure needed for the Laravel backend

-- Users table (base table for all user types)
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    type ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
    avatar VARCHAR(255) NULL,
    status ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_type (type),
    INDEX idx_status (status)
);

-- Student profiles table
CREATE TABLE student_profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    learning_languages JSON NOT NULL,
    native_language VARCHAR(100) NOT NULL,
    levels JSON NULL,
    completed_lessons INT NOT NULL DEFAULT 0,
    hours_learned DECIMAL(8,2) NOT NULL DEFAULT 0,
    wallet_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Teacher profiles table
CREATE TABLE teacher_profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    languages JSON NOT NULL,
    native_language VARCHAR(100) NOT NULL,
    rating DECIMAL(3,2) NOT NULL DEFAULT 0,
    review_count INT NOT NULL DEFAULT 0,
    price DECIMAL(8,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    availability JSON NULL,
    specialties JSON NULL,
    experience INT NOT NULL DEFAULT 0,
    description TEXT NULL,
    video_url VARCHAR(500) NULL,
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    response_time VARCHAR(50) NOT NULL DEFAULT '24h',
    completed_lessons INT NOT NULL DEFAULT 0,
    badges JSON NULL,
    country VARCHAR(100) NULL,
    timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    earnings DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_rating (rating)
);

-- Teacher meeting platforms table
CREATE TABLE teacher_meeting_platforms (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT UNSIGNED NOT NULL,
    zoom_url VARCHAR(500) NULL,
    google_meet_url VARCHAR(500) NULL,
    skype_url VARCHAR(500) NULL,
    voov_url VARCHAR(500) NULL,
    preferred_platform ENUM('zoom', 'google_meet', 'skype', 'voov') NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (teacher_id) REFERENCES teacher_profiles(id) ON DELETE CASCADE,
    INDEX idx_teacher_id (teacher_id)
);

-- Teacher applications table
CREATE TABLE teacher_applications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    application_data JSON NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    admin_notes TEXT NULL,
    processed_by BIGINT UNSIGNED NULL,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- Lessons table
CREATE TABLE lessons (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    language VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INT NOT NULL, -- in minutes
    price DECIMAL(8,2) NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
    type ENUM('trial', 'regular', 'package') NOT NULL DEFAULT 'regular',
    notes TEXT NULL,
    rating INT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (teacher_id) REFERENCES teacher_profiles(id),
    FOREIGN KEY (student_id) REFERENCES student_profiles(id),
    INDEX idx_teacher_id (teacher_id),
    INDEX idx_student_id (student_id),
    INDEX idx_date (date),
    INDEX idx_status (status)
);

-- Bookings table
CREATE TABLE bookings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INT NOT NULL,
    language VARCHAR(100) NOT NULL,
    type ENUM('trial', 'regular') NOT NULL DEFAULT 'regular',
    price DECIMAL(8,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
    notes TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (teacher_id) REFERENCES teacher_profiles(id),
    FOREIGN KEY (student_id) REFERENCES student_profiles(id),
    INDEX idx_teacher_id (teacher_id),
    INDEX idx_student_id (student_id),
    INDEX idx_status (status)
);

-- Wallet transactions table
CREATE TABLE wallet_transactions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    type ENUM('recharge', 'payment', 'refund') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    method ENUM('paypal', 'mastercard', 'visa', 'bank_transfer', 'wallet') NOT NULL,
    status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    description TEXT NOT NULL,
    lesson_id BIGINT UNSIGNED NULL,
    teacher_id BIGINT UNSIGNED NULL,
    payment_details JSON NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE SET NULL,
    FOREIGN KEY (teacher_id) REFERENCES teacher_profiles(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_status (status)
);

-- Payout requests table
CREATE TABLE payout_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT UNSIGNED NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    method ENUM('paypal', 'bank_transfer') NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'completed') NOT NULL DEFAULT 'pending',
    payment_details JSON NOT NULL,
    notes TEXT NULL,
    admin_notes TEXT NULL,
    processed_by BIGINT UNSIGNED NULL,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (teacher_id) REFERENCES teacher_profiles(id),
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_teacher_id (teacher_id),
    INDEX idx_status (status)
);

-- Reviews table
CREATE TABLE reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL,
    teacher_id BIGINT UNSIGNED NOT NULL,
    lesson_id BIGINT UNSIGNED NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES student_profiles(id),
    FOREIGN KEY (teacher_id) REFERENCES teacher_profiles(id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id),
    INDEX idx_teacher_id (teacher_id),
    INDEX idx_lesson_id (lesson_id)
);

-- Messages table
CREATE TABLE messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT UNSIGNED NOT NULL,
    receiver_id BIGINT UNSIGNED NOT NULL,
    content TEXT NOT NULL,
    type ENUM('text', 'booking', 'lesson_reminder') NOT NULL DEFAULT 'text',
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    INDEX idx_sender_id (sender_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_created_at (created_at)
);

-- Community posts table
CREATE TABLE community_posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    author_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    language VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags JSON NULL,
    likes_count INT NOT NULL DEFAULT 0,
    replies_count INT NOT NULL DEFAULT 0,
    views_count INT NOT NULL DEFAULT 0,
    is_moderated BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (author_id) REFERENCES users(id),
    INDEX idx_author_id (author_id),
    INDEX idx_language (language),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
);

-- Community events table
CREATE TABLE community_events (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    host_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    language VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    duration INT NOT NULL, -- in minutes
    max_participants INT NOT NULL,
    participants JSON NULL,
    status ENUM('upcoming', 'live', 'completed', 'cancelled') NOT NULL DEFAULT 'upcoming',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (host_id) REFERENCES users(id),
    INDEX idx_host_id (host_id),
    INDEX idx_start_time (start_time),
    INDEX idx_status (status)
);

-- Activity log table
CREATE TABLE activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    metadata JSON NULL,
    created_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
);

-- System settings table
CREATE TABLE system_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(100) UNIQUE NOT NULL,
    value JSON NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_key_name (key_name)
);

-- Insert default system settings
INSERT INTO system_settings (key_name, value) VALUES 
('platform_fee', '0.2'),
('currency', '"USD"'),
('supported_languages', '["English", "Spanish", "French", "German", "Italian", "Portuguese", "Chinese", "Japanese", "Korean", "Arabic"]'),
('timezones', '["UTC", "America/New_York", "Europe/London", "Asia/Tokyo", "Australia/Sydney"]'),
('payout_minimums', '{"paypal": 25, "bank_transfer": 100}');
