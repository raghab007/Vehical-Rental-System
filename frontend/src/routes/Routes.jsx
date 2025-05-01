import { useRecoilState } from "recoil";
import { Route, Routes } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoginPage from "../pages/Login";
import HomePage from "../pages/home";
import Signup from "../pages/Signup";
import AboutUs from "../pages/Aboutus";
import ContactUs from "../pages/ContactUs";
import BlogPage from "../pages/Blog";
import UserProfile from "../pages/UserProfile";
import CarDetailPage from "../pages/CarDetails";
import AdminLayout from "../pages/admin/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Customers from "../pages/admin/Customers";
import Vehicles from "../pages/admin/Vehicles";
import PaymentHistory from "../pages/admin/PaymentHistory";
import Settings from "../pages/admin/Settings";
import { userSelector } from "../store/atoms";
import VerifyPayment from "../pages/PaymentVerify";
import VehicleRental from "../pages/vehicle";
import ExtensionRequests from "../pages/admin/ExtensionRequests";
import ExtensionPaymentVerify from "../pages/ExtensionPaymentVerify";
import AdminPackagesPage from "../pages/admin/AdminPackages";
import Rentals from "../pages/admin/Rentals";
import OffRoadingNepal from "../pages/OffRoadingNepal";
import NepalRoadTrips from "../pages/RoadTrips";
import CarSelectionGuide from "../pages/whytochoose";
import JourneyWheelsPage from "../pages/firsttrip";

function AppRoutes() {
  const [userinfo] = useRecoilState(userSelector);

  console.log(userinfo.role);

  return (
    <>
      {userinfo.role === "USER" || !userinfo.role ? (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/vehicle" element={<VehicleRental />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/road-trips" element={<NepalRoadTrips></NepalRoadTrips>}></Route>
            <Route path="/choose-car" element={<CarSelectionGuide></CarSelectionGuide>
            }></Route>
            <Route path="/renting-tips"element= {<JourneyWheelsPage></JourneyWheelsPage>}></Route>
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/cardetails/:carId" element={<CarDetailPage />} />
            <Route path="/information" element={<OffRoadingNepal></OffRoadingNepal>}></Route>
            <Route path="/extension/payment/verify" element={<ExtensionPaymentVerify></ExtensionPaymentVerify>}></Route>
            <Route path="/payment/verify" element={<VerifyPayment></VerifyPayment>}></Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
          <Footer />
        </>
      ) : userinfo.role === "ADMIN" ? (
        <>
          <Routes>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="" element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="payment-history" element={<PaymentHistory />} />
              <Route path="extensions" element={<ExtensionRequests></ExtensionRequests>}></Route>
              <Route path="settings" element={<Settings />} />
              <Route path="packages" element={<AdminPackagesPage></AdminPackagesPage>}></Route>
              <Route path="rentals" element={<Rentals></Rentals>}></Route>
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </>
      ) : (
        <ErrorPage />
      )}
    </>
  );
}

export default AppRoutes;
