import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage"
import AccountDetailsPage from "../pages/AccountDetailsPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import TransferPage from "../pages/TransferPage";
import ProfilePage from "../pages/ProfilePage";
import AccountsPage from "../pages/AccountsPage"
import PrivateRoute from "../components/PrivateRoute";

function Router() {
    return(
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/transfer" element={<PrivateRoute><TransferPage/></PrivateRoute>} />
                <Route path="/accounts" element={<PrivateRoute><AccountsPage /></PrivateRoute>} />
                <Route path="/accounts/:id" element={<PrivateRoute><AccountDetailsPage /></PrivateRoute>} />
                <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
            </Routes>
    );
}

export default Router;
