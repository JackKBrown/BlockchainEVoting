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
  PRIMARY KEY (name)
  );

INSERT INTO authority VALUES
  ('test_auth_1', 
  '65537', 
  '0x00b0c40888a0677ef88eebd38a6e2a684a1705d97928685c0b6d1312562fa176713a7e49ca447ef46d47ec2d9bfba23d78e4bf2f93d359d6aed5da1ea60c6ab138a2ad9407b86d40508e2b093e7a0dc1abe6bac740a322645495ae720f707fda9f8e1a0053cd87c9527a6c8d651d47a56a854f729144426b1a9baa3607da8b63a792ddb25e94f99cbafa86e5d634225504d1f3b43965a351ec537567db46e9d956808ec67165dcabd281f8eebf3313d60c5b325e1dc7205b1475142dfbdf1945296bf3abc43847386225d17cb5a1aeaf496118d10aaaf45e059c97b4527907d65795e8d12a7b82f3eff2bb66c1d0a76e7378ba32c762a19e306b6cca553b66e301', 
  '0x00b3e2f87b4c11add36801eaf8f2688648607c1725b947b29c5f0421bf018e8eabcb4588d7cbe1f3952220e78ba4ea079cea88d37d7fd4eadad7a5e4a6cf488fa0ace570da142e8735cd3a4a1234135173171d3fc66add3d369c58d1e13a00ae24293054e68cecf24d7b9365e5d694f7bd83b25f6814af7a0a95bd49a8ee34462c001e0e3cf3b205f101a0d81be8e5c998ef17c79b71b7c4f9c382551a72ba3208621fef09d0261a3869a33386d00b5e52c74db18c021e8497adb2b667fd035d6d99d2312bbce5c818a3bc6f24aca2a04bd602014ca70bf98bd0af204ebca8f90b613d446a49d682a219dd670039a84351fa6397b2cad30be18b15473dd24e2ca1');
  
INSERT INTO client VALUES 
  ('vin', 'pass', 0),
  ('kelsier', 'pass', 0),
  ('breeze', 'pass', 0),
  ('jason', 'pass', 0),
  ('john', 'pass', 0),
  ('jane', 'pass', 0),
  ('jessica', 'pass', 0);
