// import { useContext } from 'react';
import './MenuItem.css';
import { Typography } from '@mui/material';

// import { UserContext } from '../../context/UserContext';

const MenuItem = ({ item, activeMenuItem, setActiveMenuItem, index }: any) => {
    // const { setUser } = useContext(UserContext);
    const { label, Icon, logout } = item;
    const isActive = index === activeMenuItem;
    return (
        <div className='menu-item' onClick={() => logout ? logout('setUser') : setActiveMenuItem(index)}>
            <div className="icon-label">
                <Icon htmlColor={isActive ? 'var(--blue)' : ''} />
                <Typography className={isActive ? 'active-icon-label' : ''} fontWeight={isActive ? 'bold' : 'normal'} >{label}</Typography>
            </div>
            {
                index === activeMenuItem && <div className='active-indicator' />
            }

        </div>
    )
}

export default MenuItem