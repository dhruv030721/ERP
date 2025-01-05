import React, { useState, useRef } from 'react';
import { BsPersonFillAdd } from "react-icons/bs";
import { IoCloudUpload, IoCloudDownload } from "react-icons/io5";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import axios from "axios";
import toast from "react-hot-toast";
import { academicServices } from '../../../../services';
import { toastDesign, } from '../../../../components/GlobalVariables';
import { MuiButton, ComingSoon, AccessDenied } from "../../../../components/index.ts"
import { useSelector } from 'react-redux';
import { RootState } from '../../../../slices/store.ts';
import { useNavigate } from 'react-router-dom';

interface AddStudentProps { }

const AddStudent: React.FC<AddStudentProps> = () => {
  const [alignment, setAlignment] = useState('add-student');
  const [excelFileName, setExcelFileName] = useState("*Upload file in excel format");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const Data_Auth = useSelector((state: RootState) => state.auth.userData);

  const navigate = useNavigate();

  const handleChange = (_event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    setAlignment(newAlignment);
  };

  const ExcelsheetNameHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {

    if (event.target.files && event.target.files.length > 0) {
      setExcelFileName(event.target.files[0].name);
      const file = event.target.files[0];
      await toast.promise(
        academicServices.ImportStudentData(file),
        {
          loading: "Data Uploading",
          success: (response) => {
            setExcelFileName("*Upload file in excel format");
            event.target.value = "";
            return `${response.data.message}`;
          },
          error: (error) => {
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
      const response = await axios.get('https://res.cloudinary.com/dij4vwbs6/raw/upload/v1735888446/Student_Data_Sheet_s4yfza.xlsx', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Student Data Sheet.xlsx');
      document.body.appendChild(link);
      link.click();
      toast.success("File Download Successfully", toastDesign);
    } catch (e) {
      console.log(e);
    }
  }

  if (Data_Auth == null) {
    navigate('/login');
  } else {
    if (Data_Auth.role != "ADMIN") {
      return <AccessDenied />
    }
  }

  return (
    <div className='mx-10 flex flex-col'>
      <div className='flex-col space-y-2 px-2 py-7 items-center'>
        <div className='flex gap-x-5'>
          <BsPersonFillAdd size={30} />
          <h1 className='font-bold text-xl'>Add Student</h1>
        </div>
        <p className='text-gray-500'>"Here, you can register new Student."</p>
      </div>

      <div className='mt-5 text-center md:text-start'>
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
        <div className='mt-5'>
          <ComingSoon />
        </div>
      ) : (
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="font-bold text-red-600 text-sm sm:text-base text-center break-all max-w-[300px]">
              {excelFileName}
            </h1>
            <MuiButton
              color='rgb(23,37,84)'
              btnName="Upload File"
              type="file"
              eventHandler={ExcelsheetNameHandler}
              icon={<IoCloudUpload />}
              fileInputRef={fileInputRef}
              width="110%"
              height="50px"
            />
          </div>

          <div className="flex flex-col items-center space-y-4">
            <h1 className="font-bold text-sm sm:text-base text-center">
              Download Sample Excel
            </h1>
            <MuiButton
              color='rgb(23,37,84)'
              btnName="Download Sample Excel"
              type="button"
              eventHandler={DownloadSampleExcelHandler}
              icon={<IoCloudDownload />}
              width="100%"
              height="50px"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AddStudent;

