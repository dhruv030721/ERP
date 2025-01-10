import { Link, useLocation } from "react-router-dom";

interface SwitchItemProps {
    name: string;
    icon: React.ReactElement;
    bgcolor?: string;
    url?: string;
    onClick?: () => void;
}


const SwitchItem: React.FC<SwitchItemProps> = ({ name, icon, url, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname.includes(name.toLowerCase());

    const content = (
        <div
            className={`w-full cursor-pointer border-l-4 ${isActive
                ? 'border-l-orange-500 bg-orange-50 text-orange-700'
                : 'border-l-transparent hover:border-l-orange-200 hover:bg-gray-50'
                } flex items-center gap-3 p-3 transition-all`}
            onClick={onClick}
        >
            <div className="min-w-[24px]">{icon}</div>
            <span className="font-medium text-sm">{name}</span>
        </div>
    );

    return onClick ? (
        content
    ) : (
        <Link to={url || `/${name.toLowerCase()}`}>
            {content}
        </Link>
    );
};

export default SwitchItem;