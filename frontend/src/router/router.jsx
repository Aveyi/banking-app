import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage"
import AccountDetailsPage from "../pages/AccountDetailsPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import TransferPage from "../pages/TransferPage";
import ProfilePage from "../pages/ProfilePage";
import AccountsPage from "../pages/AccountsPage"

function Router() {
    return(
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/transfer" element={<TransferPage/>} />
                <Route path="/accounts" element={<AccountsPage />} />
                <Route path="/accounts/:id" element={<AccountDetailsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
            </Routes>
    );
}

export default Router;
