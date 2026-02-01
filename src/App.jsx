import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import OTPVerify from './pages/OTPVerify';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Settings from './pages/Settings';
import Invoices from './pages/Invoices';
import Statistics from './pages/Statistics';
import ProtectedRoute from "./routes/ProtectedRoute";
import Logout from './pages/Logout';
import AddProduct from "./pages/AddProduct";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/logout" element={
          <Logout/>
          } />

        <Route path="/" element={
          <Login />
          } />


        <Route path="/signup" element={
          <Signup/>
          } />


        <Route path="/forgotpassword" element={
          <ForgotPassword />
          } />


        <Route path="/otp" element={
          <OTPVerify />
          } />


        <Route path="/resetpassword" element={
              <ResetPassword />
          } />


        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
          } />


        <Route path="/products" element={
          <ProtectedRoute>
            <Products />

          </ProtectedRoute>
          } />
    < Route path="/products/new" element={
      <ProtectedRoute><AddProduct /></ProtectedRoute>} />

        <Route path="/settings" element={ 
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
          }/>


        <Route path='/invoices' element={
          <ProtectedRoute>
            <Invoices/>

          </ProtectedRoute>
          }/>


        <Route path='/statistics' element={
          <ProtectedRoute>
            <Statistics/>

          </ProtectedRoute>
          }/>


      </Routes>
    </Router>
  );
}

export default App;