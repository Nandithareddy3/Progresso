import { Navigate, Outlet } from 'react-router-dom';

const HouseholdRoute = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.household ? <Outlet /> : <Navigate to="/welcome" />;
};

export default HouseholdRoute;