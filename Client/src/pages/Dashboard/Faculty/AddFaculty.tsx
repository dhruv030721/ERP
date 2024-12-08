import { BsPersonFillAdd } from "react-icons/bs";
import { BasicDatePicker } from "../../../components/index";
import { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import RowRadioButtonsGroup from "../../../components/InputFields/RadioGroup";
import { authServices } from "../../../services";
import { toastDesign } from "../../../components/GlobalVariables";
import MaterialInput from "../../../components/InputFields/MaterialInput";

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
      value: "Male",
    },
    {
      label: "Female",
      value: "Female",
    },
  ];
  const [dob, setDob] = useState(null);
  const [gender, setGender] = useState("male");
  const { control, handleSubmit, reset } = useForm<RegisterFacultyInputs>();

  const AddFacultyHandler: SubmitHandler<RegisterFacultyInputs> = async (data) => {
    data.dob = dob;
    data.gender = gender;
    await toast.promise(
      authServices.register(data),
      {
        loading: "Processing",
        success: (response) => {
          reset();
          return `${response.data.message}`;
        },
        error: (error) => {
          return `${error.response.data.message}`;
        },
      },
      toastDesign
    );
  };

  return (
    <div className="p-20">
      <div className='flex-col space-y-2 px-2 pb-10'>
        <div className='flex gap-x-5'>
          <BsPersonFillAdd size={30} />
          <h1 className='font-bold text-xl'>Add Faculty</h1>
        </div>
        <p className='text-gray-500'>"Here, you can register new faculty."</p>
      </div>

      <div>
        <form
          className="grid grid-cols-3  gap-20 items-center"
          onSubmit={handleSubmit(AddFacultyHandler)}
        >
          <div className = "gap-y-5 flex flex-col w-full">
            <Controller
              name="first_name"
              control={control}
              defaultValue=""
              render={({ field }) => <MaterialInput label="First Name" {...field} />}
            />
            <Controller
              name="middle_name"
              control={control}
              defaultValue=""
              render={({ field }) => <MaterialInput label="Middle Name" {...field} />}
            />
            <Controller
              name="last_name"
              control={control}
              defaultValue=""
              render={({ field }) => <MaterialInput label="Last Name" {...field} />}
            />
            <Controller
              name="mobileNumber"
              control={control}
              defaultValue=""
              render={({ field }) => <MaterialInput label="Mobile Number" {...field} />}
            />
          </div>
          <div className="h-full flex justify-center items-center"><div className="bg-gray-500 h-full w-[0.5px]"></div></div>
          <div className="gap-y-5 flex flex-col w-full">
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => <MaterialInput label="Email" {...field} />}
            />
            <BasicDatePicker label="Date of Birth" value={dob} setValue={setDob} />
            <RowRadioButtonsGroup fields={fields} value={gender} setValue={setGender} />
            <button
              className="bg-blue-950 rounded-md py-3 text-white font-bold"
              type="submit"
            >
              Add Faculty
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFaculty;
