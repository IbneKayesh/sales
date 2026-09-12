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
  teach_reads integer NOT NULL DEFAULT 0, --total reads
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

-keep the UI consistency
-don't write any new CSS
-write smiliar code patterns of other folders
-use existing components, src/components/*.*
build
-pages/M09/Teach/TeachPage.jsx
-pages/M09/Exam/ExamPage.jsx
-hooks/M09/useTeach.js
-hooks/M09/useExam.js
-models/M09/teachAPI.js
-models/M09/examAPI.js


its will for kids learning purpose, preset learning (teaching) materials, they will study and and every week will held exam
all the data manually entry