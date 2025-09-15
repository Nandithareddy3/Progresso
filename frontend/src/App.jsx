import { Routes, Route, useLocation } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import HouseholdRoute from './components/HouseholdRoute';
import JoinPage from './pages/JoinPage';
import { AnimatePresence } from 'framer-motion';
import ChoresDetailPage from './pages/ChoresDetailPage';
import LeaderboardDetailPage from './pages/LeaderboardDetailPage';
import ChoreBankDetailPage from './pages/ChoreBankDetailPage';
import ProfilePage from './pages/ProfilePage';
function App() {
  const location = useLocation();

  return (
    <>
      <ToastContainer />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/*Public Routes*/}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/join/:inviteCode" element={<JoinPage />} />

          {/*Private Routes (must be logged in)*/}
          <Route element={<PrivateRoute />}>
            <Route path="/welcome" element={<WelcomePage />} />

            {/*Household-Only Routes*/}
            <Route element={<HouseholdRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/chores" element={<ChoresDetailPage />} />
                <Route path="/leaderboard" element={<LeaderboardDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/dashboard/chore-bank" element={<ChoreBankDetailPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;