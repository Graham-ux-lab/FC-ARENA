USE fifa_db;
INSERT INTO users (id, username, email, password_hash, ea_id, platform, role, status) 
VALUES (UUID(), 'admin', 'admin@fifa.local', '$2b$10$27KDcje2vVlKR2gaHmVR9OK9H.QbBSaYJhE9dw2xOemEtl.A9Ekkq', 'admin', 'ps', 'admin', 'approved');