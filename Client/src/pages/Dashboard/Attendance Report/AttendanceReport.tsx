import { useState } from "react";
import { Dropdown } from "../../../components";

interface Option {
    value: string;
    label: string;
}

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

const AttendanceReport = () => {
    const [selectedSem, setSelectedSem] = useState<Option | null>(null);

    const handleDropdownChange = (option: Option) => {
        setSelectedSem(option);
    };

    return (
        <div className="p-10">
            <h1 className="font-semibold text-lg">Download Attendance Report:</h1>
            <div className="mt-10">
                <Dropdown
                    List={sem}
                    label="Sem"
                    defaultValue="Sem"
                    helperText="Semester"
                    onChange={handleDropdownChange}
                />
            </div>
        </div>
    );
};

export default AttendanceReport;
