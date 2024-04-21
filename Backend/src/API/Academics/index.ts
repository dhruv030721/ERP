import {Router} from 'express'
import AddStudent from './Student/Add Student/controller'
import upload from '../../Utils/upload';

const router = Router();

router.post("/ImportStudentdata", upload.single('file'), AddStudent.ImportStudentdata);
router.post("/AddStudent", AddStudent.AddNewStudent);
router.get("/Download_Import_Student_Sample_file",AddStudent.DownloadImportStudentSampleFile);

export default router;