import { useEffect, useState } from "react";
import { Dropdown } from "../../../components";
import { academicServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { setSubjectData } from "../../../slices/academics";
import { RootState } from "../../../slices/store";
import { Loading } from "../../../components";
import MuiButton from "../../../components/MuiButton";
import { IoCloudDownload } from "react-icons/io5";

interface Option {
    value: string;
    label: string;
}


const AttendanceReport = () => {
    const [loading, setLoading] = useState<boolean>(true);


    const [selectedSem, setSelectedSem] = useState<Option | null>(null);
    const [subjectData, setSubjectDataState] = useState<Option[]>([]);
    const [branchData, setBranchDataState] = useState<Option[]>([]);
    const [selectedMonth, setMonth] = useState<Option | null>(null);
    const [selectedBranch, setBranch] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const dispatch = useDispatch();


    // Dropdown enable states
    const [isSemEnabled, setSemEnabled] = useState(false);
    const [isSubjectEnabled, setSubjectEnabled] = useState(false);


    const SubjectData: any = useSelector((state: RootState) => state.academic.SubjectData);
    const Data_Branch = useSelector((state: RootState) => state.academic.BranchData);
    const Data_Subject = useSelector((state: RootState) => state.academic.SubjectData)

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

    const month: Option[] = [
        { value: "semester", label: "Semester" },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
    ]

    const handleSemChange = (value: string) => {
        setSelectedSem(sem.find(option => option.value === value) || null);

        const filteredSubjects = SubjectData.filter((subject: any) => subject.sem == value).map((sub: any) => {
            return {
                value: sub.code,
                label: `${sub.code} - ${sub.name}`
            };
        });
        setSelectedSubject('');
        setSubjectDataState(filteredSubjects);
        setSubjectEnabled(true);
    };

    const handleSubjectChange = (value: string) => {
        setSelectedSubject(value)
    };

    const handleMonthChange = (value: string) => {
        setMonth(month.find(option => option.value == value) || null);
    }

    const handleBranchChange = (value: string) => {
        setBranch(value);
        const filteredSubjects = SubjectData.filter((subject: any) => subject.branchId == value).map((sub: any) => {
            return {
                value: sub.code,
                label: sub.name
            };
        });
        setSelectedSubject('');
        setSubjectDataState(filteredSubjects);
        setSemEnabled(true);
    }

    useEffect(() => {
        (async () => {
            try {
                const [subjectData, branchDataResponse] = await Promise.all([
                    Data_Subject && Data_Subject.length ? null : academicServices.GetSubjects(),
                    // Only fetch branch data if not already present in the state
                    Data_Branch && Data_Branch.length ? null : academicServices.GetBranch()
                ]);

                let branchData;
                const SubjectData = subjectData && subjectData.data.data.length ? subjectData.data.data : Data_Subject;


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

                // Dispatch subject data to the state
                dispatch(setSubjectData(SubjectData));
                setSubjectDataState(SubjectData);
                setBranchDataState(branchData || []);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        })();
    }, [dispatch, Data_Branch, Data_Subject]);


    if (loading) {
        return (
            <Loading message='' size='max-w-[20%]' />
        )
    }

    const DownloadHandler = async () => {

    }

    return (
        <div className="p-10">
            <h1 className="font-semibold text-lg">Download Attendance Report:</h1>
            <p className="text-gray-500">"Here, you can download attendance report for subject based on month"</p>
            <div className="flex gap-x-10 items-center">
                <div className="mt-10">
                    <Dropdown
                        List={branchData}
                        label={"Branch"}
                        value={selectedBranch}
                        helperText="Branch"
                        dropdownHandler={handleBranchChange}
                        width={250}
                    />
                </div>
                <div className="mt-10">
                    <Dropdown
                        List={sem}
                        label={"Sem"}
                        value={selectedSem?.value}
                        helperText="Semester"
                        dropdownHandler={handleSemChange}
                        width={100}
                        disabled={!isSemEnabled}
                    />
                </div>
                <div className="mt-10">
                    <Dropdown
                        List={subjectData.length ? subjectData : []}
                        label={"Subject"}
                        value={selectedSubject}
                        helperText="Subject"
                        dropdownHandler={handleSubjectChange}
                        width={400}
                        disabled={!isSubjectEnabled}
                    />
                </div>
                <div className="mt-10">
                    <Dropdown
                        List={month.length ? month : []}
                        label={"Month"}
                        value={selectedMonth?.value}
                        helperText="Month"
                        dropdownHandler={handleMonthChange}
                        width={200}
                    />
                </div>
                <div className="mt-5">
                    <MuiButton btnName="Download Report" color="rgb(23,37,84)" type="submit" icon={<IoCloudDownload />} eventHandler={DownloadHandler} width="220px" height="50px" />
                </div>

            </div>
        </div>
    );
};

export default AttendanceReport;
