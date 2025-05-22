import React, { useEffect, useState } from 'react';
import Navbar from './js/navbar.jsx';
import Siderbar from './js/siderbar.jsx';
import Dashboard from './js/Dashboard.jsx';

function ShowDashboard() {
  return (
    <>
      <Navbar></Navbar>
      <Siderbar></Siderbar>
      <Dashboard></Dashboard>
    </>
  );
}

export default ShowDashboard;
