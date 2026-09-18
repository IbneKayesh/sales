-- feature list
-- drop table tmsb_teach;

CREATE TABLE tmsb_teach (
  -- default 1
  id varchar(50) PRIMARY KEY,
  teach_users varchar(50) NOT NULL, -- Company / Tenant Id
  teach_bsins varchar(50) NOT NULL, -- Business / Branch Id
  teach_ccode varchar(50) NOT NULL, -- Auto-generated code (TCH00000001)
  teach_teach varchar(50),          -- Parent Topic (optional hierarchy)
  teach_srial integer NOT NULL DEFAULT 1, -- Display Serial / Sequence (e.g. 01)

  -- custom
  teach_cname varchar(100) NOT NULL, -- Lesson Title
  teach_descr varchar(500),         -- Lesson Content Descriptions for Kids
  teach_notes varchar(50),          -- Teacher Notes
  teach_reads integer NOT NULL DEFAULT 0, -- Target practice reads / repetitions
  teach_marks integer NOT NULL DEFAULT 1, -- Total marks

  -- default 2
  teach_actve boolean NOT NULL DEFAULT true,
  teach_crusr varchar(50) NOT NULL,
  teach_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  teach_upusr varchar(50) NOT NULL,
  teach_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  teach_rvnmr integer NOT NULL DEFAULT 1
);