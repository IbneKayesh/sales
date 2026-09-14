-- feature list
-- drop table tmsb_teach;

CREATE TABLE tmsb_teach (
  -- default 1
  id varchar(50) PRIMARY KEY,
  teach_users varchar(50) NOT NULL, -- Company / Tenant Id
  teach_bsins varchar(50) NOT NULL, -- Business / Branch Id
  teach_ccode varchar(50) NOT NULL, -- Auto-generated code (TCH00000001)
  teach_srial varchar(50) NOT NULL, -- Display Serial / Sequence (e.g. 01)
  teach_teach varchar(50),          -- Parent Topic / Material Id (optional hierarchy)

  -- custom
  teach_cname varchar(50) NOT NULL, -- Lesson / Topic Title (e.g., Alphabet - Letter A)
  teach_descr varchar(500),         -- Reading Content / Descriptions for Kids
  teach_notes varchar(50),          -- Teacher Guidance / Notes
  teach_ttype varchar(50),          -- Subject Name (e.g., English, Math, Phonics)
  teach_tagno varchar(100),         -- Grade / Level / Tag (e.g., Kindergarten, Grade 1)
  teach_reads integer NOT NULL DEFAULT 0, -- Target practice reads / repetitions
  teach_marks integer NOT NULL DEFAULT 1, -- Total marks / points
  teach_stats boolean NOT NULL DEFAULT false, -- Ready for Kids (true) / Draft (false)

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