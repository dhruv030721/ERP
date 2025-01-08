import React, { useId, ForwardedRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    type?: string;
    className?: string;
    divclassName?: string;
    labelclassName?: string;
    placeholder? : string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, type = "text", className = "", divclassName = "", labelclassName = "", placeholder="", ...props }, ref: ForwardedRef<HTMLInputElement>) => {
        const id = useId();

        return (
            <div className={`flex flex-col  ${divclassName}`}>
                <label htmlFor={id} className={`${labelclassName}`}>{label}</label>
                <input type={type} placeholder={placeholder} id={id} className={`outline-none border py-3 px-2 rounded-lg border-gray-300 text-sm mt-3 w-full remove-arrow ${className}`} ref={ref} {...props} autoComplete='correct-password' />
            </div>
        );
    }
);

export default Input;
