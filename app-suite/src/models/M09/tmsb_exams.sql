-- feature list
-- drop table tmsb_exams;

CREATE TABLE tmsb_exams (
  -- default 1
  id varchar(50) PRIMARY KEY,
  exams_srial varchar(50) NOT NULL,
  exams_teach varchar(50) NOT NULL, --tech id

  -- custom
  exams_cname varchar(50) NOT NULL, --question Name
  exams_answr varchar(500), --answer
  exams_notes varchar(50), -- notes
  exams_marks integer NOT NULL DEFAULT 1, --marks
  exams_stats boolean NOT NULL DEFAULT false, --pass or fail

  -- default 2
  exams_actve boolean NOT NULL DEFAULT true,
  exams_crusr varchar(50) NOT NULL,
  exams_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  exams_upusr varchar(50) NOT NULL,
  exams_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  exams_rvnmr integer NOT NULL DEFAULT 1
);