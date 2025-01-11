import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface SwitchItemProps {
    name: string;
    icon: React.ReactNode;
    url?: string;
    bgcolor?: string;
    onClick?: () => void;
}

const SwitchItem = ({ name, icon, url, bgcolor, onClick }: SwitchItemProps) => {
    const location = useLocation();
    const isActive = url ? location.pathname.includes(url.split("/")[1]) : false;

    const content = (
        <div
            className={`flex items-center gap-3 px-4 py-3  transition-colors w-full ${bgcolor || 'hover:bg-gray-100'
                } ${isActive ? 'text-orange-700 bg-orange-50 border-l-4 border-orange-700' : ''}`}
        >
            <div className="flex-shrink-0">
                {icon}
            </div>
            <span className="text-sm truncate">{name}</span>
        </div>
    );

    if (onClick) {
        return (
            <button type="button" onClick={onClick} className="w-full text-left">
                {content}
            </button>
        );
    }

    return (
        <Link to={url || `/${name.toLowerCase()}`} className="block w-full">
            {content}
        </Link>
    );
};

export default SwitchItem;