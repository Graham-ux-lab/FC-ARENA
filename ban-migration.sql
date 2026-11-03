USE fifa_db;
ALTER TABLE users MODIFY COLUMN status ENUM('pending','approved','rejected','banned') DEFAULT 'pending';