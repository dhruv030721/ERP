import React, { useState, useRef } from 'react';
import { BsPersonFillAdd } from "react-icons/bs";
import { IoCloudUpload, IoCloudDownload } from "react-icons/io5";
import MuiButton from "../../../components/MuiButton.tsx"
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import axios from "axios";
import toast from "react-hot-toast";
import { academicServices } from '../../../services';
import { toastDesign, } from '../../../components/GlobalVariables';
import { ComingSoon } from "../../../components/index.ts"

interface AddStudentProps { }

const AddStudent: React.FC<AddStudentProps> = () => {
    const [alignment, setAlignment] = useState('add-subject');
    const [excelFileName, setExcelFileName] = useState("*Upload file in excel format");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (_event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
        console.log(newAlignment);
        setAlignment(newAlignment);
    };

    const ExcelsheetNameHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {

        if (event.target.files && event.target.files.length > 0) {
            setExcelFileName(event.target.files[0].name);
            const file = event.target.files[0];
            await toast.promise(
                academicServices.ImportSubjectData(file),
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
            const response = await axios.get('https://res.cloudinary.com/dij4vwbs6/raw/upload/v1735887701/Subject_Data_Sheet_o4xkgn.xlsx', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Subject Data Sheet.xlsx');
            document.body.appendChild(link);
            link.click();
            toast.success("File Download Successfully", toastDesign);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className='mx-10 flex flex-col'>
            <div className='flex-col space-y-2 px-2 py-7'>
                <div className='flex gap-x-5'>
                    <BsPersonFillAdd size={30} />
                    <h1 className='font-bold text-xl'>Subject</h1>
                </div>
                <p className='text-gray-500'>"Here, you can add subject by using excel format sheet."</p>
            </div>

            <div className='mt-5'>
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform"
                >
                    <ToggleButton value="add-subject"><p className='normal-case font-bold font-poppins'>Add Subject</p></ToggleButton>
                    <ToggleButton value="update-subject"><p className='normal-case font-bold font-poppins'>Update Subject</p></ToggleButton>
                </ToggleButtonGroup>
            </div>

            {alignment === 'add-subject' ? (
                <div className='flex justify-center space-x-10'>
                    <div className='flex flex-col space-y-5 mt-5 justify-center items-center'>
                        <h1 className='font-bold text-red-600'>{excelFileName}</h1>
                        <div>
                            <MuiButton color='rgb(23,37,84)' btnName="Upload File" type={"file"} eventHandler={ExcelsheetNameHandler} icon={<IoCloudUpload />} fileInputRef={fileInputRef} width='200px' height='50px' />
                        </div>
                    </div>

                    <div className='flex flex-col space-y-5 mt-5 justify-center items-center'>
                        <h1 className='font-bold'>Download Sample Excel</h1>
                        <div>
                            <MuiButton color='rgb(23,37,84)' btnName="Download Sample Excel" type="button" eventHandler={DownloadSampleExcelHandler} icon={<IoCloudDownload />} width='300px' height="50px" />
                        </div>
                    </div>
                </div>

            ) : (
                <ComingSoon />
            )}
        </div>
    );
}

export default AddStudent;

