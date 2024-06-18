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

interface TimetableState {
    Timetable: TimeTable | null;
}

const initialState: TimetableState = {
    Timetable: null,
};

const academicSlice = createSlice({
    name: "academic",
    initialState: initialState,
    reducers: {
        setTimetable: (state, action: PayloadAction<TimeTable>) => {
            state.Timetable = action.payload;
        },
    },
});

export const { setTimetable } = academicSlice.actions;


export default academicSlice.reducer;
