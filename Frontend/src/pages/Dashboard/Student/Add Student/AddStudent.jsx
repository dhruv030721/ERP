import React, { useState } from 'react'
import { BsPersonFillAdd } from "react-icons/bs";
import Button from '@mui/material/Button';
import { IoCloudUpload } from "react-icons/io5";
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { IoCloudDownload } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast"
import {academicServices } from '../../../../services';
import {toastDesign} from '../../../../components/GlobalVariables'



function AddStudent() {

  const [alignment, setAlignment] = useState('add-student');
  const [excelFileName, setExcelFileName] = useState("*Upload file in excel format");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  // Set Excelsheet Name
  const ExcelsheetNameHandler = async(event) => {
    setExcelFileName(event.target.files[0].name);
    let file = event.target.files[0];
    await toast.promise(
      academicServices.ImportStudentData(file), 
      {
        loading : "Data Uploading.....",
        success : (response) => {
          setExcelFileName("*Upload file in excel format");
          event.target.value = null;
          return `${response.message}`;
        },
        error : (error) => {
          console.log(error);
          setExcelFileName("*Upload file in excel format");
          event.target.value = null;
          return `${error.response.data.message}`;
        } 
      },
      toastDesign
    )
  }

  
  // Download Sample File
  async function DownloadSampleExcelHandler (){
    try {
      const response = await axios.get('/api/academics/Download_Import_Student_Sample_file', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'import_student_demo_excel.xlsx');
      document.body.appendChild(link);
      link.click();
      toast.success("File Download Sucessfully",
      toastDesign
    );  
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


      {/* <div className='bg-gradient-to-r  from-black via-black to-white h-[1px]'></div> */}

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
      {/* Content according to toggle selected */}

      {
        alignment == 'add-student' ?
          (
            // For Add one student
            <div className='flex justify-center items-center font-bold text-2xl'>
              {/* TODO Add this functionlity */}
              <h1>Comming Soon....</h1>
            </div>
          )
          :
          (
            // To add student more than one using excel
            <div className='flex justify-center space-x-10'>
              <div className='flex flex-col space-y-5 mt-5 justify-center items-center'>
                <h1 className='font-bold text-red-600'>{excelFileName}</h1>  
                <div>
                  <Button
                    role={undefined}
                    component = "label"
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
                <h1 className='font-bold '>Download Sample Excel</h1>

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
          )
      }
    </div>
  )
}

export default AddStudent


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