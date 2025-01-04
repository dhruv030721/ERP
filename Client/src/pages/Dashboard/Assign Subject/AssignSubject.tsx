import { useEffect, useState } from "react"
import { Dropdown, Loading, MuiButton } from "../../../components"
import { academicServices } from "../../../services"
import { IoPersonAdd } from "react-icons/io5"
import toast from "react-hot-toast"
import { toastDesign } from "../../../components/GlobalVariables"
import { useSelector } from "react-redux"
import { FaLongArrowAltRight } from "react-icons/fa"
import { RootState } from "../../../slices/store"

interface Option {
    value: string
    label: string
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
    ]

    const types: Option[] = [
        { value: "LECTURE", label: "Lecture" },
        { value: "LAB", label: "Lab" }
    ]

    const batch: Option[] = [
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" }
    ]

    // Cached State Data
    const Data_Subject = useSelector((state: RootState) => state.academic.SubjectData);
    const Data_Branch = useSelector((state: RootState) => state.academic.BranchData);


    // Form state
    const [selectedFaculty, setFaculty] = useState<string>('')
    const [selectedSem, setSem] = useState<string>('')
    const [selectedSubject, setSubject] = useState<string>('')
    const [selectedBranch, setBranch] = useState<string>('')
    const [selectedType, setType] = useState<string>('')
    const [selectedBatch, setBatch] = useState<string>('')

    // Dropdown enable states
    const [isSemEnabled, setSemEnabled] = useState(false)
    const [isSubjectEnabled, setSubjectEnabled] = useState(false)
    const [isFacultyEnabled, setFacultyEnabled] = useState(false)
    const [isTypeEnabled, setTypeEnabled] = useState(false)
    const [isBatchEnabled, setBatchEnabled] = useState(false)

    // Data loading states
    const [loading, setLoading] = useState<boolean | null>(true)
    const [facultiesData, setFacultiesData] = useState<Option[]>([])
    const [branchData, setBranchData] = useState<Option[]>([])
    const [subjectData, setSubjectData] = useState<Option[]>([])
    const [filteredSubjects, setFilteredSubject] = useState<Option[]>([])
    const [AssignedSubject, setAssignedSubject] = useState<any>([])

    const { mobileNumber } = useSelector((state: any) => state.auth.userData)

    // Validation function
    const isFormValid = (): boolean => {
        if (!selectedBranch || !selectedSem || !selectedSubject || !selectedFaculty || !selectedType) {
            return false
        }
        // Additional validation for LAB type
        if (selectedType === "LAB" && !selectedBatch) {
            return false
        }
        return true
    }

    const handleBranchChange = (value: string) => {
        setBranch(value)
        setSemEnabled(true)
        // Reset dependent fields
        setSem('')
        setSubject('')
        setFaculty('')
        setType('')
        setBatch('')
        setSubjectEnabled(false)
        setFacultyEnabled(false)
        setTypeEnabled(false)
        setBatchEnabled(false)
    }

    const handleSemChange = (value: string) => {
        const filtered = subjectData.filter((data: any) =>
            data.sem == value && data.branchId == selectedBranch
        ).map((data: any) => ({
            value: data.code,
            label: `${data.code} - ${data.name}`
        }))
        setFilteredSubject(filtered)
        setSem(value)
        setSubjectEnabled(true)
        // Reset dependent fields
        setSubject('')
        setFaculty('')
        setType('')
        setBatch('')
        setFacultyEnabled(false)
        setTypeEnabled(false)
        setBatchEnabled(false)
    }

    const handleSubjectChange = (value: string) => {
        setSubject(value)
        setFacultyEnabled(true)
        // Reset dependent fields
        setFaculty('')
        setType('')
        setBatch('')
        setTypeEnabled(false)
        setBatchEnabled(false)
    }

    const handleFacultyChange = (value: string) => {
        setFaculty(value)
        setTypeEnabled(true)
        // Reset dependent fields
        setType('')
        setBatch('')
        setBatchEnabled(false)
    }

    const handleTypeChange = (value: string) => {
        setType(value)
        setBatchEnabled(value === "LAB")
        if (value !== "LAB") {
            setBatch('')
        }
    }

    const handleBatchChange = (value: string) => {
        setBatch(value)
    }

    const AssignHandler = async () => {
        if (!isFormValid()) {
            toast.error("Please fill all required fields", toastDesign)
            return
        }

        const assign_subject_data = {
            branch: selectedBranch,
            sem: Number(selectedSem),
            subject: selectedSubject,
            faculty: selectedFaculty,
            type: selectedType,
            batch: selectedType === "LAB" ? selectedBatch : null
        }

        await toast.promise(
            academicServices.AssignSubject(assign_subject_data),
            {
                loading: "Processing",
                success: (response) => {
                    // Reset form after successful assignment
                    setBranch('')
                    setSem('')
                    setSubject('')
                    setFaculty('')
                    setType('')
                    setBatch('')
                    setSemEnabled(false)
                    setSubjectEnabled(false)
                    setFacultyEnabled(false)
                    setTypeEnabled(false)
                    setBatchEnabled(false)
                    return response.data.message
                },
                error: (error) => error.response.data.message
            },
            toastDesign
        )
    }

    useEffect(() => {
        (async () => {
            try {
                const [facultyResponse, branchResponse, subjectResponse, assignedSubjectResponse] =
                    await Promise.all([
                        academicServices.GetFaculty(),
                        Data_Branch && Data_Branch.length ? null : academicServices.GetBranch(),
                        Data_Subject && Data_Subject.length ? null : academicServices.GetSubjects(),
                        academicServices.GetAssignSubject(mobileNumber)
                    ])

                const facultyData = facultyResponse.data.data.map((data: any) => ({
                    value: data.mobileNumber,
                    label: `${data.first_name} ${data.last_name}`
                }))

                let BranchData = branchResponse != null ? branchResponse.data.data : Data_Branch;
                const SubjectData = subjectResponse != null ? subjectResponse.data.data : Data_Subject;

                BranchData = BranchData.map((data: any) => ({
                    value: data.id,
                    label: `${data.id} - ${data.name}`
                }))

                setFacultiesData(facultyData)
                setBranchData(BranchData)
                setSubjectData(SubjectData)
                setAssignedSubject(assignedSubjectResponse.data.data)
            } catch (error) {
                toast.error("Error loading data", toastDesign)
            } finally {
                setLoading(false)
            }
        })()
    }, [Data_Branch, Data_Subject, mobileNumber])

    if (loading) {
        return <Loading message="" size="max-w-[20%]" />
    }

    return (
        <div className="p-10 flex flex-col">
            <h1 className="font-bold text-2xl">Assign Subject</h1>
            <p className="text-gray-500">"Assign faculty members to subjects for the semester."</p>
            <div className="flex mt-10 gap-x-10">
                <div className="grid grid-cols-3 gap-y-5">
                    <div>
                        <Dropdown
                            List={branchData}
                            label="Branch"
                            value={selectedBranch}
                            helperText="Branch"
                            dropdownHandler={handleBranchChange}
                            width={300}
                        />
                    </div>
                    <div>
                        <Dropdown
                            List={semData}
                            label="Sem"
                            value={selectedSem}
                            helperText="Sem"
                            dropdownHandler={handleSemChange}
                            width={200}
                            disabled={!isSemEnabled}
                        />
                    </div>
                    <div>
                        <Dropdown
                            List={filteredSubjects}
                            label="Subject"
                            value={selectedSubject}
                            helperText="Subject"
                            dropdownHandler={handleSubjectChange}
                            width={350}
                            disabled={!isSubjectEnabled}
                        />
                    </div>
                    <div>
                        <Dropdown
                            List={facultiesData}
                            label="Faculty"
                            value={selectedFaculty}
                            helperText="Faculty"
                            dropdownHandler={handleFacultyChange}
                            width={200}
                            disabled={!isFacultyEnabled}
                        />
                    </div>
                    <div>
                        <Dropdown
                            List={types}
                            label="Type"
                            value={selectedType}
                            helperText="Type"
                            dropdownHandler={handleTypeChange}
                            width={200}
                            disabled={!isTypeEnabled}
                        />
                    </div>
                    <div>
                        <Dropdown
                            List={batch}
                            label="Batch"
                            value={selectedBatch}
                            helperText="Batch"
                            dropdownHandler={handleBatchChange}
                            width={200}
                            disabled={!isBatchEnabled}
                        />
                    </div>
                </div>
                <div>
                    <MuiButton
                        btnName="Assign"
                        color="rgb(23,37,84)"
                        type="submit"
                        icon={<IoPersonAdd />}
                        eventHandler={AssignHandler}
                        width="150px"
                        height="50px"
                    />
                </div>
            </div>
            <div className="flex flex-col mt-10 gap-y-5">
                <h1 className="text-xl font-bold">Assigned Subjects : </h1>
                {AssignedSubject.map((data: any) => (
                    <div key={`${data.subject.code}-${data.type}-${data.batch}`} className="flex items-center justify-center gap-x-5 border-zinc-300 border shadow-sm rounded-md p-3 w-fit">
                        <h1 className="font-semibold">Sem : {data.subject.sem}</h1>
                        <FaLongArrowAltRight />
                        <h1 className="font-semibold">Subject : {data.subject.name} : ({data.type} - {data.batch})</h1>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AssignSubject