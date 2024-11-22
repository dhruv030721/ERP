import React, { useId, ForwardedRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    type?: string;
    className?: string;
    divclassName?: string;
    labelclassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, type = "text", className = "", divclassName = "", labelclassName = "", ...props }, ref: ForwardedRef<HTMLInputElement>) => {
        const id = useId();

        return (
            <div className={`flex flex-col  ${divclassName}`}>
                <label htmlFor={id} className={`${labelclassName}`}>{label}</label>
                <input type={type} id={id} className={`outline-none border py-3 px-2 rounded-lg border-gray-300 text-sm mt-3 w-full ${className}`} ref={ref} {...props} />
            </div>
        );
    }
);

export default Input;
