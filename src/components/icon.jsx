import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Icon = ({ icon, className, ...props }) => {
    return <FontAwesomeIcon icon={icon} className={`w-6 h-6 ${className}`} {...props} />;
};

export default Icon;