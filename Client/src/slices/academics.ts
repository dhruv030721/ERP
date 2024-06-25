import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TimetableData {
    id: string,
    time: string,
    day: string,
    subject: string,
    facultyId: string,
    lectureType: string,
    batch: string | null
}

interface TimeTable {
    Monday: [TimetableData]
    Tuesday: [TimetableData]
    Wednesday: [TimetableData]
    Thursday: [TimetableData]
    Friday: [TimetableData]
}

interface AcademicState {
    Timetable: TimeTable | null;
    StudentData: StudentData | null;
}

interface StudentData {
    enrollmentNo: string,
    name: string,
    mobileNumber: string,
}

const initialState: AcademicState = {
    Timetable: null,
    StudentData: null
};

const academicSlice = createSlice({
    name: "academic",
    initialState: initialState,
    reducers: {
        setTimetable: (state, action: PayloadAction<TimeTable>) => {
            state.Timetable = action.payload;
        },

        setStudentData: (state, action: PayloadAction<StudentData>) => {
            state.StudentData = action.payload;
            console.log(state.StudentData);
        },

    },
});

export const { setTimetable, setStudentData } = academicSlice.actions;


export default academicSlice.reducer;
