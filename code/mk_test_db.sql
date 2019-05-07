DROP TABLE client;
DROP TABLE authority;

CREATE TABLE authority (
  name varchar(32),
  pub_key TEXT NOT NULL,
  priv_key TEXT NOT NULL,
  big_N TEXT NOT NULL,
  PRIMARY KEY (pub_key)
  );

CREATE TABLE client (
  name varchar(32) NOT NULL,
  password varchar(32) NOT NULL,
  got_token bit, 
  auth_pub_key TEXT,
  PRIMARY KEY (name),
  FOREIGN KEY (auth_pub_key) REFERENCES authority(pub_key)
  );

INSERT INTO authority VALUES
  ('smith banks', 'public', 'N', 'private');
  
INSERT INTO client VALUES 
  ('jason', 'pass', 0, 'public'), 
  ('katie', 'pass', 0, 'public');