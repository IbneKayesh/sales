-- feature list
-- drop table tmsb_teach;

CREATE TABLE tmsb_teach (
  -- default 1
  id varchar(50) PRIMARY KEY,
  teach_srial varchar(50) NOT NULL,
  teach_teach varchar(50) NOT NULL, --parent child format teaching materials

  -- custom
  teach_cname varchar(50) NOT NULL, --student Name
  teach_descr varchar(500), --reading descriptions
  teach_notes varchar(50), --notes
  teach_ttype varchar(50), --subject name
  teach_tagno varchar(100), --tag no
  teach_marks integer NOT NULL DEFAULT 1, --total marks
  teach_stats boolean NOT NULL DEFAULT false, --on / off

  -- default 2
  teach_actve boolean NOT NULL DEFAULT true,
  teach_crusr varchar(50) NOT NULL,
  teach_crdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  teach_upusr varchar(50) NOT NULL,
  teach_updat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  teach_rvnmr integer NOT NULL DEFAULT 1
);