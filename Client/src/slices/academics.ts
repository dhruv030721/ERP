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
    SubjectData: Subject[] | null;
    BranchData: Branch[] | null;
    AssignSubjectData: AssignSubject[] | null;
}

interface StudentData {
    enrollmentNo: string,
    name: string,
    mobileNumber: string,
}

interface Subject {
    code: number,
    name: string,
    branch: string,
    sem: number
}

export interface AssignSubject {
    facultyId: string,
    type: string,
    batch: string,
    id: string
    subjectCode: number,
    subject: Subject,
    branchId: number,
    sem: number
}

interface Subject {
    branchId: number,
    code: number,
    sem: number,
    name: string
}

export interface Branch {
    id: number,
    name: string
}

const initialState: AcademicState = {
    Timetable: null,
    StudentData: null,
    SubjectData: null,
    BranchData: null,
    AssignSubjectData: null
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
        },

        setSubjectData: (state, action: PayloadAction<Subject[]>) => {
            state.SubjectData = action.payload;
        },

        setBranchData: (state, action: PayloadAction<Branch[]>) => {
            state.BranchData = action.payload;
        },

        setAssignSubject: (state, action: PayloadAction<AssignSubject[]>) => {
            state.AssignSubjectData = action.payload;
        },

        resetAcademicState: (state) => {
            state.Timetable = null;
            state.StudentData = null;
            state.SubjectData = null;
            state.BranchData = null;
        }

    },
});

export const { setTimetable, setStudentData, setSubjectData, setBranchData, setAssignSubject, resetAcademicState } = academicSlice.actions;

export default academicSlice.reducer;
