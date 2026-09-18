-- feature list
-- drop table tmsb_exams;

CREATE TABLE tmsb_exams (
  -- default 1
  id varchar(50) PRIMARY KEY,
  exams_users varchar(50) NOT NULL, -- Company / Tenant Id
  exams_bsins varchar(50) NOT NULL, -- Business / Branch Id
  exams_srial varchar(50) NOT NULL, -- Serial / Question sequence
  exams_ccode varchar(50) NOT NULL, -- Auto-generated code (EXM00000001)
  exams_trdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Exam / Test date
  exams_teach varchar(50) NOT NULL, -- Teaching Material Id (refers to tmsb_teach.id)

  -- custom
  exams_cname varchar(50) NOT NULL, -- Question / Quiz Task Title
  exams_answr varchar(500),         -- Expected Answer / Model Solution
  exams_notes varchar(50),          -- Teacher Hints / Evaluation Guidance
  exams_marks integer NOT NULL DEFAULT 1, -- Marks for this question
  exams_stats boolean NOT NULL DEFAULT false, -- Evaluated / Passed status

  -- default 2
  exams_actve boolean NOT NULL DEFAULT true,
  exams_crusr varchar(50) NOT NULL,
  exams_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  exams_upusr varchar(50) NOT NULL,
  exams_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  exams_rvnmr integer NOT NULL DEFAULT 1
);