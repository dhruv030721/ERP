import { useEffect, useState } from "react";
import { academicServices } from "../../../services";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../slices/store";
import { Loading } from "../../../components";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';
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

    const handleSemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedSem(sem.find(option => option.value === value) || null);

        const filteredAssignSubjectData = AssignSubjectData.filter(
            (subject: AssignSubject) => subject.sem === parseInt(value)
        ).map((assignSubject: AssignSubject) => ({
            value: `${assignSubject.subjectCode}_${assignSubject.sem}_${assignSubject.type}_${assignSubject.batch}`,
            label: `${assignSubject.subjectCode} - ${assignSubject.subject.name} (${assignSubject.type === "LAB" ? `LAB - ${assignSubject.batch}` : "LECTURE"
                })`
        }));

        console.log(filteredAssignSubjectData)

        setSelectedSubject('');
        setAssignSubjectDataOption(filteredAssignSubjectData);
        setSubjectEnabled(true);
    };

    const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubject(event.target.value);
    };

    const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setBranch(value);

        console.log(AssignSubjectData)

        const filteredAssignSubjectData = AssignSubjectData.filter(
            (subject: AssignSubject) => subject.branchId === parseInt(value)
        ).map((assignSubject: AssignSubject) => ({
            value: `${assignSubject.subjectCode}_${assignSubject.sem}_${assignSubject.type}_${assignSubject.batch}`,
            label: `${assignSubject.subjectCode} - ${assignSubject.subject.name} (${assignSubject.type === "LAB" ? `LAB - ${assignSubject.batch}` : "LECTURE"
                })`
        }));

        console.log(filteredAssignSubjectData)

        setSelectedSubject('');
        setAssignSubjectDataOption(filteredAssignSubjectData);
        setSemEnabled(true);
    };

    const DownloadHandler = async () => {
        if (selectedSem && selectedSubject) {
            await toast.promise(
                academicServices.DownloadReport(selectedSubject),
                {
                    loading: "Report Downloading",
                    success: "Report Downloaded Successfully!",
                    error: (error) => `${error.response.data.message}`
                },
                toastDesign
            );
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const [assignSubjectResponse, branchDataResponse] = await Promise.all([
                    Data_AssignSubject && Data_AssignSubject.length
                        ? null
                        : academicServices.GetAssignSubject(Data_Auth?.mobileNumber),
                    Data_Branch && Data_Branch.length
                        ? null
                        : academicServices.GetBranch(),
                ]);

                let branchData;

                if (Data_Branch && Data_Branch.length) {
                    branchData = Data_Branch.map((data: any) => ({
                        value: data.id,
                        label: `${data.id} - ${data.name}`
                    }));
                } else if (branchDataResponse) {
                    branchData = branchDataResponse.data.data.map((data: any) => ({
                        value: data.id,
                        label: `${data.id} - ${data.name}`
                    }));
                }

                if (Data_AssignSubject && Data_AssignSubject.length) {
                    setAssignSubjectData(Data_AssignSubject);
                } else if (assignSubjectResponse) {
                    setAssignSubjectData(assignSubjectResponse.data.data);
                    dispatch(setAssignSubject(assignSubjectResponse.data.data));
                }


                console.log(AssignSubjectData)
                setBranchDataState(branchData || []);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        })();
    }, [dispatch, Data_Auth, Data_Branch]);

    if (loading) {
        return <Loading message="" size="max-w-[20%]" />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Download Attendance Report
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                        Generate and download attendance reports for specific subjects on a monthly basis
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Branch</label>
                                <select
                                    value={selectedBranch}
                                    onChange={handleBranchChange}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="">Select Branch</option>
                                    {branchData.map((branch) => (
                                        <option key={branch.value} value={branch.value}>
                                            {branch.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Semester</label>
                                <select
                                    value={selectedSem?.value || ''}
                                    onChange={handleSemChange}
                                    disabled={!isSemEnabled}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select Semester</option>
                                    {sem.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Subject</label>
                                <select
                                    value={selectedSubject}
                                    onChange={handleSubjectChange}
                                    disabled={!isSubjectEnabled}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select Subject</option>
                                    {AssignSubjectDataOption.map((subject) => (
                                        <option key={subject.value} value={subject.value}>
                                            {subject.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={DownloadHandler}
                            disabled={!selectedSubject}
                            className="w-full md:w-auto px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <Download className="w-5 h-5" />
                            <span>Download Report</span>
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AttendanceReport;