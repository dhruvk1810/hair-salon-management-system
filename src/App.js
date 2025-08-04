import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import Home from './components/Home';
import Navbar from './components/partial/Navbar';
import Footer from './components/partial/Footer';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import SalonLogin from './components/SalonLogin';
import UserLogin from './components/UserLogin';
import UserAccount from './components/UserAccount';
import UserHistory from './components/UserHistory';
import SalonRegister from './components/SalonRegister';
import Appointment from './components/Appointment';
import SalonHome from './components/SalonHome';
import SalonList from './components/SalonList';
import SalonAppointments from './components/SalonAppointments';
import SalonStatus from './components/SalonStatus';
import SalonForgotPassword from './components/SalonForgotPassword';
import SalonResetPassword from './components/SalonResetPassword';
import UserForgotPassword from './components/UserForgotPassword';
import UserResetPassword from './components/UserResetPassword';
function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/salonhome" element={<SalonHome />} />
          <Route path="/salonstatus" element={<SalonStatus />} />
          <Route path="/salonlogin" element={<SalonLogin />} />
          <Route path="/userlogin" element={<UserLogin />} />
          <Route path="/salonlist" element={<SalonList />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/salonforgotpassword" element={<SalonForgotPassword />} />
          <Route path="/salonresetpassword" element={<SalonResetPassword />} />
          <Route path="/userforgotpassword" element={<UserForgotPassword />} />
          <Route path="/userresetpassword" element={<UserResetPassword />} />
          <Route path="/salonappointments" element={<SalonAppointments />} />
          <Route path="/useraccount" element={<UserAccount />} />
          <Route path="/salonregister" element={<SalonRegister />} />
          <Route path="/userhistory" element={<UserHistory />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
