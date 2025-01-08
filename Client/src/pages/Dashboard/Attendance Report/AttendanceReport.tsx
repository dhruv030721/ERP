import { useEffect, useState } from "react";
import { Dropdown } from "../../../components";
import { academicServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../slices/store";
import { Loading } from "../../../components";
import MuiButton from "../../../components/MuiButton";
import { IoCloudDownload } from "react-icons/io5";
import toast from "react-hot-toast";
import { toastDesign } from "../../../components/GlobalVariables";
import { AssignSubject, setAssignSubject } from "../../../slices/academics";

interface Option {
    value: string;
    label: string;
}

const AttendanceReport = () => {
    const [loading, setLoading] = useState<boolean>(true);

    const [selectedSem, setSelectedSem] = useState<Option | null>(null);
    const [branchData, setBranchDataState] = useState<Option[]>([]);
    // const [selectedMonth, setMonth] = useState<Option | null>(null);
    const [AssignSubjectData, setAssignSubjectData] = useState<AssignSubject[]>([]);
    const [AssignSubjectDataOption, setAssignSubjectDataOption] = useState<Option[]>([]);
    const [selectedBranch, setBranch] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const dispatch = useDispatch();


    // Dropdown enable states
    const [isSemEnabled, setSemEnabled] = useState(false);
    const [isSubjectEnabled, setSubjectEnabled] = useState(false);


    const Data_Branch = useSelector((state: RootState) => state.academic.BranchData);
    const Data_AssignSubject = useSelector((state: RootState) => state.academic.AssignSubjectData);
    const Data_Auth = useSelector((state: RootState) => state.auth.userData);

    const sem: Option[] = [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
    ];

    const handleSemChange = (value: string) => {
        setSelectedSem(sem.find(option => option.value === value) || null);

        const filteredAssignSubjectData = AssignSubjectData.filter((subject: any) => subject.sem == value).map((assignSubject: any) => {
            return {
                value: `${assignSubject.subjectCode}_${assignSubject.sem}_${assignSubject.type}_${assignSubject.batch}`,
                label: `${assignSubject.subjectCode}  - ${assignSubject.subject.name} (${assignSubject.type == "LAB" ? `LAB - ${assignSubject.batch}` : "LECTURE"})`
            }
        })
        setSelectedSubject('');
        setAssignSubjectDataOption(filteredAssignSubjectData);
        setSubjectEnabled(true);
    };

    const handleSubjectChange = (value: string) => {
        setSelectedSubject(value)
    };

    const handleBranchChange = (value: string) => {
        setBranch(value);
        const filteredAssignSubjectData = AssignSubjectData.filter((subject: any) => subject.branchId === value).map((assignSubject: any) => {
            return {
                value: `${assignSubject.subjectCode}_${assignSubject.sem}_${assignSubject.type}_${assignSubject.batch}`,
                label: `${assignSubject.subjectCode} - ${assignSubject.subject.name} (${assignSubject.type == "LAB" ? `LAB - ${assignSubject.batch}` : "LECTURE"})`
            }
        })
        setSelectedSubject('');
        setAssignSubjectDataOption(filteredAssignSubjectData);
        setSemEnabled(true);
    }

    const DownloadHandler = async () => {

        if (selectedSem && selectedSubject) {
            await toast.promise(
                academicServices.DownloadReport(selectedSubject),
                {
                    loading: "Report Downloading",
                    success: () => {
                        return "Report Downloaded Successfully!"
                    },
                    error: (error) => {
                        return `${error.response.data.message}`;
                    }
                },
                toastDesign
            )
        }

    }


    useEffect(() => {
        (async () => {
            try {
                const [assignSubjectResponse, branchDataResponse] = await Promise.all([
                    Data_AssignSubject && Data_AssignSubject.length ? null : academicServices.GetAssignSubject(Data_Auth?.mobileNumber),
                    Data_Branch && Data_Branch.length ? null : academicServices.GetBranch(),

                ]);

                let branchData;

                if (Data_Branch && Data_Branch.length) {
                    // Use branch data from the state
                    branchData = Data_Branch.map((data: any) => ({
                        value: data.id,
                        label: `${data.id} - ${data.name}`
                    }));
                } else if (branchDataResponse) {
                    // Use branch data from the API
                    branchData = branchDataResponse.data.data.map((data: any) => ({
                        value: data.id,
                        label: `${data.id} - ${data.name}`
                    }));
                }

                if (Data_AssignSubject && Data_AssignSubject.length) {
                    setAssignSubjectData(Data_AssignSubject)
                } else {
                    setAssignSubjectData(assignSubjectResponse?.data.data)
                }

                dispatch(setAssignSubject(assignSubjectResponse?.data.data))
                setBranchDataState(branchData || []);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        })();
    }, [dispatch, Data_Auth]);

    if (loading) {
        return (
            <Loading message='' size='max-w-[20%]' />
        )
    }


    return (
        <div className="p-10">
            <h1 className="text-center font-semibold text-xl md:text-start">Download Attendance Report</h1>
            <p className="text-center  text-xs md:text-start md:text-md text-gray-500">"Here, you can download attendance report for subject based on month"</p>
            <div className="grid grid-cols-3 gap-y-4 mt-7 md:flex-row ">
                <Dropdown
                    List={branchData}
                    label={"Branch"}
                    value={selectedBranch}
                    helperText="Branch"
                    dropdownHandler={handleBranchChange}
                    width={250}
                />
                <Dropdown
                    List={sem}
                    label={"Sem"}
                    value={selectedSem?.value}
                    helperText="Semester"
                    dropdownHandler={handleSemChange}
                    width={200}
                    disabled={!isSemEnabled}
                />
                <Dropdown
                    List={AssignSubjectDataOption.length ? AssignSubjectDataOption : []}
                    label={"Subject"}
                    value={selectedSubject}
                    helperText="Subject"
                    dropdownHandler={handleSubjectChange}
                    width={400}
                    disabled={!isSubjectEnabled}
                />
            </div>
            <div className="w-full flex items-center mt-5">
                <MuiButton btnName="Download Report" color="rgb(23,37,84)" type="submit" icon={<IoCloudDownload />} eventHandler={DownloadHandler} width="220px" height="50px" />
            </div>
        </div>
    );
};

export default AttendanceReport;
