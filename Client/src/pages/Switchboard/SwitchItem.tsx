import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

interface SwitchItemProps {
    name: string;
    icon: ReactElement;
    bgcolor?: string;
    url?: string;
}

const SwitchItem: React.FC<SwitchItemProps> = ({ name, icon, url, bgcolor }) => {
    return (
        <Link
            to={url || `${name.toLowerCase()}`}
            className={`cursor-pointer border border-zinc-400 shadow h-24 space-y-3 flex flex-col md:items-center items-start p-5 rounded-xl font-bold text-sm ${bgcolor} hover:scale-110 transition-all`}
        >
            {icon}
            <h1>{name}</h1>
        </Link>
    );
};

export default SwitchItem;
