import { useEffect, useState } from "react"
import { Dropdown, Loading, MuiButton } from "../../../components"
import { academicServices } from "../../../services";
import { IoPersonAdd } from "react-icons/io5";


interface Option {
    value: string;
    label: string;
}

const AssignSubject = () => {

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

    const [selectedFaculty, setFaculty] = useState<string | undefined>(undefined);
    const [selectedSem, setSem] = useState<string | undefined>(undefined)
    const [selectedSubject, setSubject] = useState<string | undefined>(undefined);
    const [selectedBranch, setBranch] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean | null>(true);
    const [facultiesData, setFacultiesData] = useState<Option[]>([]);
    const [branchData, setBranchData] = useState<Option[]>([]);
    const [subjectData, setSubjectData] = useState<Option[]>([]);
    const [filteredSubjects, setFilteredSubject] = useState<Option[]>([]);

    const handleFacultyChange = (value: string) => {
        setFaculty(value);
    }

    const handleSemChange = (value: string) => {
        const filtered = subjectData.filter((data: any) => data.sem == value && data.branchId == selectedBranch).map((data: any) => {
            return {
                value: data.code,
                label: data.name
            }
        })
        setFilteredSubject(filtered)
        setSem(value);
    }

    const handleSubjectChange = (value: string) => {
        setSubject(value)
    }

    const handleBranchChange = (value: string) => {
        setBranch(value);
    }

    useEffect(() => {
        (async () => {
            let facultyData = await academicServices.GetFaculty();
            let branchData = await academicServices.GetBranch();
            const subjectData = await academicServices.GetSubjects();
            console.log(subjectData.data.data);


            facultyData = facultyData.data.data.map((data: any) => {
                return {
                    value: data.mobileNumber,
                    label: `${data.first_name} ${data.last_name}`
                }
            })
            branchData = branchData.data.data.map((data: any) => {
                return {
                    value: data.id,
                    label: `${data.id} - ${data.name}`
                }
            })
            setFacultiesData(facultyData);
            setBranchData(branchData);
            setSubjectData(subjectData.data.data);
            setLoading(false);
        })();
    }, [])

    if (loading) {
        return (
            <Loading message='' size='max-w-[20%]' />
        )
    }

    return (
        <div className="p-10">
            <h1 className="font-bold text-2xl">Assign Faculty</h1>
            <p className="text-gray-500">Assign faculty members to subjects for the semester.</p>
            <div className="flex mt-10 gap-x-10">
                <div>
                    <Dropdown
                        List={branchData}
                        label={"Branch"}
                        defaultValue={selectedBranch}
                        helperText="Branch"
                        dropdownHandler={handleBranchChange}
                        width={300}
                    />
                </div>
                <div>
                    <Dropdown
                        List={semData}
                        label={"Sem"}
                        defaultValue={selectedSem}
                        helperText="Sem"
                        dropdownHandler={handleSemChange}
                        width={200}
                    />
                </div>
                <div>
                    <Dropdown
                        List={filteredSubjects}
                        label={"Subject"}
                        defaultValue={selectedSubject}
                        helperText="Subject"
                        dropdownHandler={handleSubjectChange}
                        width={350}
                    />
                </div>
                <div>
                    <Dropdown
                        List={facultiesData}
                        label={"Faculty"}
                        defaultValue={selectedFaculty}
                        helperText="Faculty"
                        dropdownHandler={handleFacultyChange}
                        width={200}
                    />
                </div>
                <div className="">
                    <MuiButton btnName="Assign" color="rgb(23,37,84)" type="submit" icon={<IoPersonAdd />} eventHandler={() => { }} width="150px" height="50px" />
                </div>
            </div>
        </div>
    )
}

export default AssignSubject
