import React, { useState } from 'react';
import { BsPersonFillAdd } from "react-icons/bs";
import Button from '@mui/material/Button';
import { IoCloudUpload, IoCloudDownload } from "react-icons/io5";
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import axios from "axios";
import toast from "react-hot-toast";
import { academicServices } from '../../../../services';
import { toastDesign } from '../../../../components/GlobalVariables';

interface AddStudentProps { }

const AddStudent: React.FC<AddStudentProps> = () => {
  const [alignment, setAlignment] = useState('add-student');
  const [excelFileName, setExcelFileName] = useState("*Upload file in excel format");

  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    setAlignment(newAlignment);
  };

  const ExcelsheetNameHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setExcelFileName(event.target.files[0].name);
      let file = event.target.files[0];
      await toast.promise(
        academicServices.ImportStudentData(file),
        {
          loading: "Data Uploading.....",
          success: (response: any) => {
            setExcelFileName("*Upload file in excel format");
            event.target.value = "";
            return `${response.message}`;
          },
          error: (error: any) => {
            console.log(error);
            setExcelFileName("*Upload file in excel format");
            event.target.value = "";
            return `${error.response.data.message}`;
          }
        },
        toastDesign
      );
    }
  }

  const DownloadSampleExcelHandler = async () => {
    try {
      const response = await axios.get('/api/academics/Download_Import_Student_Sample_file', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'import_student_demo_excel.xlsx');
      document.body.appendChild(link);
      link.click();
      toast.success("File Download Successfully", toastDesign);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className='mx-10 flex flex-col'>
      <div className='flex space-x-5 p-10'>
        <BsPersonFillAdd size={30} />
        <h1 className='font-bold text-xl'>Add Student</h1>
      </div>

      <div className='mt-5'>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="add-student"><p className='normal-case font-bold font-poppins'>Add Student</p></ToggleButton>
          <ToggleButton value="import-excel"><p className='normal-case font-bold font-poppins'>Import Excel</p></ToggleButton>
        </ToggleButtonGroup>
      </div>

      {alignment === 'add-student' ? (
        <div className='flex justify-center items-center font-bold text-2xl'>
          <h1>Coming Soon....</h1>
        </div>
      ) : (
        <div className='flex justify-center space-x-10'>
          <div className='flex flex-col space-y-5 mt-5 justify-center items-center'>
            <h1 className='font-bold text-red-600'>{excelFileName}</h1>
            <div>
              <Button
                role={undefined}
                component="label"
                variant="contained"
                tabIndex={-1}
                startIcon={<IoCloudUpload />}
                sx={{ backgroundColor: '#093163', color: 'white', '&:hover': { backgroundColor: '#093163' } }}
              >
                Upload file
                <VisuallyHiddenInput type="file" onChange={ExcelsheetNameHandler} />
              </Button>
            </div>
          </div>

          <div className='flex flex-col space-y-5 mt-5 justify-center items-center'>
            <h1 className='font-bold'>Download Sample Excel</h1>
            <div>
              <Button
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<IoCloudDownload />}
                sx={{ backgroundColor: '#093163', color: 'white', '&:hover': { backgroundColor: '#093163' } }}
                onClick={DownloadSampleExcelHandler}
              >
                Download Excel
                <VisuallyHiddenInput type="button" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddStudent;

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
