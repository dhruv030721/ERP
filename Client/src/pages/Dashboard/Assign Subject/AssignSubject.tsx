import { useEffect, useState } from "react"
import { academicServices } from "../../../services"
import { IoPersonAdd } from "react-icons/io5"
import toast from "react-hot-toast"
import { toastDesign } from "../../../components/GlobalVariables"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RootState } from "../../../slices/store"
import { Button } from "@mui/material"
import { setAssignSubject } from "@/slices/academics"
import { useNavigate } from "react-router-dom"
import { Loading } from "@/components"

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
    const Data_Auth = useSelector((state: RootState) => state.auth.userData);


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

    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                    label: `Prof. ${data.first_name} ${data.last_name}`
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
                dispatch(setAssignSubject(assignedSubjectResponse.data.data));

            } catch (error) {
                console.log(error)
                toast.error("Error loading data", toastDesign)
            } finally {
                setLoading(false)
            }
        })()
    }, [Data_Branch, Data_Subject, mobileNumber, dispatch])

    if (loading) {
        return <Loading message="" size="max-w-[20%]" />
    }

    if (Data_Auth == null) {
        navigate('/login');
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">

            {Data_Auth?.role != "ADMIN" ?
                // <AccessDenied /> 
                <></>
                :
                (
                    <Card className="border">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold tracking-tight">
                                Assign Subject
                            </CardTitle>
                            <CardDescription className="text-gray-500">
                                Assign faculty members to subjects for the semester
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 font-DmSans" >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Branch</label>
                                    <Select value={selectedBranch} onValueChange={handleBranchChange}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Branch" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {branchData.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Semester</label>
                                    <Select
                                        value={selectedSem}
                                        onValueChange={handleSemChange}
                                        disabled={!isSemEnabled}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Semester" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {semData.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Subject</label>
                                    <Select
                                        value={selectedSubject}
                                        onValueChange={handleSubjectChange}
                                        disabled={!isSubjectEnabled}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredSubjects.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Faculty</label>
                                    <Select
                                        value={selectedFaculty}
                                        onValueChange={handleFacultyChange}
                                        disabled={!isFacultyEnabled}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Faculty" />
                                        </SelectTrigger>
                                        <SelectContent >
                                            {facultiesData.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Type</label>
                                    <Select
                                        value={selectedType}
                                        onValueChange={handleTypeChange}
                                        disabled={!isTypeEnabled}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {types.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedType === "LAB" && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Batch</label>
                                        <Select
                                            value={selectedBatch}
                                            onValueChange={handleBatchChange}
                                            disabled={!isBatchEnabled}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Batch" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {batch.map((item) => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>

                            <div className="py-5">
                                <Button
                                    onClick={AssignHandler}
                                    variant="outlined"
                                    className="!border !border-blue-500 !rounded-md bg-gradient-to-r from-blue-600 to-indigo-600  hover:from-blue-700 hover:to-indigo-700"
                                >
                                    <IoPersonAdd className="mr-2" />
                                    Assign Subject
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

            <Card className="border pb-5 shadow-none">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">Assigned Subjects</CardTitle>
                    <CardDescription className="text-gray-500 flex gap-x-2">
                        <p className="text-red-500 font-semibold">Notice:</p>You can download subject attendance report which subject assigned to you
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6">
                    <ScrollArea className="pr-4">
                        <div className="space-y-4">
                            {AssignedSubject.map((data: any) => (
                                <div
                                    key={`${data.subject.code}-${data.type}-${data.batch}`}
                                    className="p-4 bg-white rounded-lg border"
                                >
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge variant="secondary" className="text-sm">
                                            Sem {data.subject.sem}
                                        </Badge>
                                        <Badge variant="outline" className="text-sm truncate">
                                            {data.subject.name}
                                        </Badge>
                                        <Badge variant="default" className="bg-blue-100 text-blue-800">
                                            {data.type} {data.type === "LAB" && data.batch ? `- ${data.batch}` : ""}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}

export default AssignSubject;