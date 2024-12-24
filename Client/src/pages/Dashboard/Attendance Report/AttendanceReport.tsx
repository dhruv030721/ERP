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
    const [selectedSem, setSelectedSem] = useState<Option | null>(null);
    const [subjectData, setSubjectDataState] = useState<Option[]>([]);
    const [branchData, setBranchDataState] = useState<Option[]>([]);
    const [selectedMonth, setMonth] = useState<Option | null>(null);
    const [selectedBranch, setBranch] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const dispatch = useDispatch();
    const SubjectData: any = useSelector((state: RootState) => state.academic.SubjectData);
    const [loading, setLoading] = useState<boolean>(true);

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
        { value: "whole sem", label: "whole sem" },
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
                label: sub.name
            };
        });
        setSelectedSubject('');
        setSubjectDataState(filteredSubjects);
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
    }

    useEffect(() => {
        (async () => {
            try {
                const [subjectData, branchDataResponse] = await Promise.all([
                    academicServices.GetSubjects(),
                    academicServices.GetBranch()
                ])

                const branchData = branchDataResponse.data.data.map((data: any) => ({
                    value: data.id,
                    label: `${data.id} - ${data.name}`
                }))

                dispatch(setSubjectData(subjectData.data.data));
                setSubjectDataState(subjectData.data.data);
                setBranchDataState(branchData)
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        })();
    }, [dispatch,]);

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
                        defaultValue={selectedBranch}
                        helperText="Branch"
                        dropdownHandler={handleBranchChange}
                        width={250}
                    />
                </div>
                <div className="mt-10">
                    <Dropdown
                        List={sem}
                        label={"Sem"}
                        defaultValue={selectedSem?.value}
                        helperText="Semester"
                        dropdownHandler={handleSemChange}
                        width={100}
                    />
                </div>
                <div className="mt-10">
                    <Dropdown
                        List={subjectData.length ? subjectData : []}
                        label={"Subject"}
                        defaultValue={selectedSubject}
                        helperText="Subject"
                        dropdownHandler={handleSubjectChange}
                        width={400}
                    />
                </div>
                <div className="mt-10">
                    <Dropdown
                        List={month.length ? month : []}
                        label={"Month"}
                        defaultValue={selectedMonth?.value}
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
