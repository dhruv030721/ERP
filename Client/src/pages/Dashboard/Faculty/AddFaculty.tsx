import { BsPersonFillAdd } from "react-icons/bs"
import { BasicDatePicker, Input } from "../../../components/index"
import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast"
import RowRadioButtonsGroup from "../../../components/InputFields/RadioGroup";
import { authServices } from "../../../services";
import { toastDesign } from "../../../components/GlobalVariables";

interface RegisterFacultyInputs {
    employeeId: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    mobileNumber: string;
    email: string;
    dob: string | null;
    gender: string | null;
}


const AddFaculty = () => {

    const fields: Array<object> = [
        {
            label: "Male",
            value: 'Male'
        },
        {
            label: "Female",
            value: "Female"
        }
    ]
    const [dob, setDob] = useState(null);
    const [gender, setGender] = useState('male');
    const { register, handleSubmit, reset } = useForm<RegisterFacultyInputs>();

    const AddFacultyHandler: SubmitHandler<RegisterFacultyInputs> = async (data) => {
        data.dob = dob;
        data.gender = gender;
        console.log(data)
        await toast.promise(
            authServices.register(data),
            {
                loading: "Processing",
                success: (response) => {
                    reset();
                    return `${response.data.message}`
                },
                error: (error) => {
                    return `${error.response.data.message}`
                }
            },
            toastDesign
        );
    }

    return (
        <div className="p-20">
            <div className='flex space-x-5 mb-20'>
                <BsPersonFillAdd size={30} />
                <h1 className='font-bold text-xl'>Add Faculty</h1>
            </div>

            <div className="">
                <form className="grid grid-cols-3 gap-20 items-center" onSubmit={handleSubmit(AddFacultyHandler)}>
                    <Input label="First name" type="text" {...register("first_name")} />
                    <Input label="Middle name" type="text" {...register("middle_name")} />
                    <Input label="Last name" type="text" {...register("last_name")} />
                    <Input label="Mobile Number" type="number" {...register("mobileNumber")} />
                    <Input label="Email" type="email" {...register("email")} />
                    <BasicDatePicker label="Date of Birth" value={dob} setValue={setDob} />
                    <RowRadioButtonsGroup fields={fields} value={gender} setValue={setGender} />
                    <button className='bg-blue-950 rounded-md py-3 text-white font-bold ' type="submit">Add Faculty</button>
                </form>
            </div>
        </div>
    )
}

export default AddFaculty
