import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

interface StudentAttendanceCardProps {
    List: {
        enrollmentNo: number;
        name: string;
    },
    attendance: string,
    onAttendanceChange: CallableFunction
}

const StudentAttendanceCard = ({ List, attendance, onAttendanceChange }: StudentAttendanceCardProps) => {
    const handleChange = (event: any) => {
        onAttendanceChange(List.enrollmentNo, event.target.value);
    };

    const getStatusColor = (value: string) => {
        switch (value) {
            case 'PRESENT':
                return 'text-emerald-600';
            case 'ABSENT':
                return 'text-red-600';
            case 'LEAVE':
                return 'text-blue-600';
            default:
                return 'text-gray-600';
        }
    };

    const attendanceOptions = [
        { value: 'PRESENT', label: 'Present', color: '#059669' },
        { value: 'ABSENT', label: 'Absent', color: '#DC2626' },
        { value: 'LEAVE', label: 'On Leave', color: '#2563EB' }
    ];

    return (
        <Card className="hover:shadow-md transition-shadow duration-200">
            <div className="flex flex-col sm:flex-row items-start md:justify-between sm:items-center gap-4 p-3 md:p-4">
                {/* Student Info Section */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-gray-900">{List.enrollmentNo}</p>
                        <p className="truncate text-sm text-gray-600">{List.name}</p>
                    </div>
                </div>

                {/* Radio Buttons Section */}
                <div className="w-full sm:w-auto">
                    <RadioGroup
                        row
                        aria-label="attendance-status"
                        name="attendance-status"
                        value={attendance || "ABSENT"}
                        onChange={handleChange}
                        className="flex flex-wrap justify-start sm:justify-end gap-x-4 gap-y-2"
                    >
                        {attendanceOptions.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={
                                    <Radio
                                        sx={{
                                            padding: '4px',
                                            '& .MuiSvgIcon-root': {
                                                fontSize: '1.25rem',
                                            },
                                            color: option.color,
                                            '&.Mui-checked': {
                                                color: option.color
                                            }
                                        }}
                                    />
                                }
                                label={
                                    <span className={`text-sm font-medium ${getStatusColor(option.value)}`}>
                                        {option.label}
                                    </span>
                                }
                                className="m-0"
                                sx={{
                                    margin: 0,
                                    '& .MuiTypography-root': {
                                        fontSize: '0.875rem'
                                    }
                                }}
                            />
                        ))}
                    </RadioGroup>
                </div>
            </div>
        </Card>
    );
};

export default StudentAttendanceCard;