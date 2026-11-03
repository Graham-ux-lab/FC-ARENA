CREATE TABLE IF NOT EXISTS match_edits (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  match_id CHAR(36) NOT NULL,
  edited_by CHAR(36) NOT NULL,
  old_p1_score INT,
  old_p2_score INT,
  new_p1_score INT,
  new_p2_score INT,
  old_winner_id CHAR(36),
  new_winner_id CHAR(36),
  edited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
  FOREIGN KEY (edited_by) REFERENCES users(id)
);