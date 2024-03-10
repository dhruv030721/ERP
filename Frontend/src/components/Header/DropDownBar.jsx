import React from 'react'
import DropDown from './DropDown';

function DropDownBar() {
    const dashboardList = ['Enquiry', 'Admission Form', 'Student Memo Generation', 'GR/SCHOLAR NO.', 'Subject Enrollment', 'Student Data Lock', 'Student Data Block/Unblock'];
    const admissionList = [];
    const studentList = ['Student Profile', 'Roll # Update', 'Admission Cancellation', 'Past Student Information', 'Student Bulk Update', 'Student Permanent Delete', 'Other'];
    const teacherList = ['Time Table', 'Proxy Time Table', 'Student Attendance', 'Student Attendance Entire', 'Staff Attendance', 'Leave Approval', 'Log Book', 'Staff Profile', 'Staff Monthly Vision', 'Staff Charge Patrak', 'To do task', 'Staff bulk update'];
    const reportList = ['General Report', 'Students Report', 'Information Report', 'Student Attendance', 'Teacher Attendance', 'Parents Report', 'Blank Sheets', 'Time Table'];
    const certificatesList = ['Bonofide Certificate', 'Trial Certificate', 'Character Certificate', 'N.O.C Certificate', 'LC Verification Form', 'I Card', 'Other Certificate'];
    const otherutilityList = [];
    const classroomList = ['Enquiry', 'Admission Form', 'Student Memo Generation', 'Admission']
    const maintainanceList = ['Enquiry', 'Admission Form', 'Student Memo Generation']
    return (
        <div className='drop-shadow-lg shadow-lg h-12 flex justify-center pl-5 text-white font-bold bg-clip-padding rounded backdrop-filter backdrop-blur-sm bg-opacity-10' id='drop-down-container'>
            <ul className='flex'>
                <DropDown list={dashboardList} name="Dashboard" />
                <DropDown list={admissionList} name="Admission" />
                <DropDown list={studentList} name="Student" />
                <DropDown list={teacherList} name="Teacher" />
                <DropDown list={reportList} name="Report" />
                <DropDown list={certificatesList} name="Certificate" />
                <DropDown list={otherutilityList} name="Other Utility" />
                <DropDown list={classroomList} name="Classroom" />
                <DropDown list={maintainanceList} name="Maintainance" />
            </ul>
        </div>

    )
}

export default DropDownBar
