import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from 'react-router-dom';
import SignUpForm from './components/signup';
import LoginForm from './components/login';
import ReportComponent from './components/LostandFoundForm';
import LostAndFoundLanding from './components/landing';
import Navbar from './components/navbar';
import { AuthProvider } from './context/AuthContext';
import ItemsPage from './components/ItemsPage';
import UserClaims from './components/UserClaims';
import FounderClaims from './components/FounderClaims';

function App() {
//   const token = localStorage.getItem("token");
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="signup" element={<SignUpForm/>} />
        <Route path="login" element={<LoginForm />} />
        <Route path="/" element={<Root/>}>
          <Route index element={<LostAndFoundLanding />} />        {/*default child route*/}
         
          {/* <Route element={<ProtectedRoute />}>
          </Route> */}
          <Route path="/myclaims" element={<UserClaims/>} />
          <Route path="/items" element={<ItemsPage/>} />
          <Route path="report" element={<ReportComponent />}></Route>
          <Route path="/founder-claims" element={<FounderClaims />} />
        </Route>
      </>
    )
  );

  return (
    <AuthProvider>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

const Root = () => {
  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      <Outlet />
      {/* <Footer /> */}
    </div>
  );
}

export default App;
