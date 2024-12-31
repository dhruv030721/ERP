import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Dropdown, MuiButton } from "../../../components";
import { academicServices } from "../../../services";
import { FaEye } from "react-icons/fa6";
import { IoCloudDownload, IoCloudUpload } from "react-icons/io5";
import { useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { toastDesign } from "../../../components/GlobalVariables";


interface Option {
    value: string;
    label: string;
}

const ManageTimetable = () => {

    const semData: Option[] = [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
    ];

    const [alignment, setAlignment] = useState('upload-timetable');
    const [selectedBranch, setBranch] = useState('');
    const [selectedSem, setSem] = useState('');
    const [branchData, setBranchData] = useState<Option[]>([]);
    const [excelFileName, setExcelFileName] = useState("*Upload file in excel format")
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (_event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
        setAlignment(newAlignment);
    }

    const handleBranchChange = (value: string) => {
        setBranch(value);
    }

    const handleSemChange = (value: string) => {
        setSem(value);
    }

    const handleTimeTableChange = () => {

    }

    const ExcelsheetNameHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setExcelFileName(event.target.files[0].name);
            const file = event.target.files[0];
            await toast.promise(
                academicServices.SetTimetable(file),
                {
                    loading: "Data Uploading",
                    success: (response) => {
                        setExcelFileName("*Upload file in excel format");
                        event.target.value = "";
                        return `${response.data.message}`
                    },
                    error: (error) => {
                        setExcelFileName("*Upload file in excel format");
                        event.target.value = "";
                        return `${error.response.data.message}`
                    }
                },
                toastDesign
            );
        }
    }

    const DownloadSampleExcelHandler = async () => {
        try {
            // Ensure the response type is set to 'blob' for binary data
            const response = await axios.get('https://res.cloudinary.com/dij4vwbs6/raw/upload/v1734803628/ERP/Sample%20Files/timetable', {
                responseType: 'blob', // Set response type to 'blob'
            });

            // Create a URL object for the downloaded file
            const url = window.URL.createObjectURL(response.data);

            // Create a temporary anchor element for download
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'timetable_sample_file.xlsx'); // Set the download filename
            document.body.appendChild(link);
            link.click();

            // Clean up the temporary anchor
            link.remove();

            // Success toast notification
            toast.success("File downloaded successfully!", toastDesign);
        } catch (error: any) {
            console.error("Error during file download:", error);

            // Error toast notification
            toast.error(error.response?.data?.message || "Failed to download file!");
        }
    };


    useEffect(() => {
        (async () => {
            let branchData = await academicServices.GetBranch();
            console.log(branchData.data.data);

            branchData = branchData.data.data.map((data: any) => {
                return {
                    value: data.id,
                    label: `${data.id} - ${data.name}`
                }
            })

            setBranchData(branchData);
        })();
    }, [])

    return (
        <div className='p-10'>
            <h1 className="font-bold text-2xl">Manage Timetable</h1>
            <p className="text-gray-500">"Effortlessly create, edit, and organize your schedules with our time table management feature."</p>
            <div className="mt-10">
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    aria-label="Platform">
                    <ToggleButton value="upload-timetable"><p className="normal-case font-bold font-poppins">Upload Timetable</p></ToggleButton>
                    <ToggleButton value="view-timetable"><p className="normal-case font-bold font-poppins">View Timetable</p></ToggleButton>
                </ToggleButtonGroup>
            </div>

            {alignment === 'view-timetable' ? (
                <div className="flex gap-x-5 mt-5">
                    <Dropdown
                        List={branchData}
                        label={"Branch"}
                        defaultValue={selectedBranch}
                        helperText="Branch"
                        dropdownHandler={handleBranchChange}
                        width={300}
                    />
                    <Dropdown
                        List={semData}
                        label={"Sem"}
                        defaultValue={selectedSem}
                        helperText="Sem"
                        dropdownHandler={handleSemChange}
                        width={300}
                    />
                    <div className="">
                        <MuiButton btnName="View" color="rgb(23,37,84)" type="submit" icon={<FaEye />} eventHandler={handleTimeTableChange} width="150px" height="50px" />
                    </div>
                </div>

            ) : (
                <div className="flex gap-x-5 justify-center w-full p-10">
                    <div className="flex flex-col justify-center items-center space-y-5">
                        <p className="text-red-700 font-bold">{excelFileName}</p>
                        <MuiButton color='rgb(23,37,84)' btnName="Upload File" type={"file"} eventHandler={ExcelsheetNameHandler} icon={<IoCloudUpload />} fileInputRef={fileInputRef} width='200px' height='50px' />
                    </div>
                    <div className="flex flex-col justify-center items-center space-y-5">
                        <p className="font-bold">Download sample file</p>
                        <MuiButton color='rgb(23,37,84)' btnName="Download Sample File" type={"file"} eventHandler={DownloadSampleExcelHandler} icon={<IoCloudDownload />} width='250px' height='50px' />
                    </div>
                </div>
            )
            }
        </div >
    )
}

export default ManageTimetable