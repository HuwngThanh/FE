import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/Home';
import SeeMore from './pages/SeeMoreProduct/SeeMore';
import ProducrtDetels from './components/product-details/ProductDetails';
import Admin from './admin/Admins';
import CreateUser from './admin/admin-manager/User/CreateUser';
import ListUser from './admin/admin-manager/User/ShowListUser';
import Dashboard from './admin/components/ShowDashboard';
import ShowUpdateUser from './admin/admin-manager/User/ShowUpdateUser';
import ListFilm from './admin/admin-manager/Film/Show/js/ShowListFilm';
import UpdateFilm from './admin/admin-manager/Film/Update/ShowUpdateFilm';
import UpdateEpisodeList from './admin/admin-manager/Film/Update/UpdateEpisodeList';
import UpdateReview from './admin/admin-manager/Film/Update/UpdateReview';
import CreateFilm from './admin/admin-manager/Film/Create/ShowCreateFilm';
import CreateEpisodeFilm from './admin/admin-manager/Film/Create/ShowCreateEpisodeList';
import SearchPage from './pages/home/components/js/SearchPage';
import ScrollToTop from './components/js/ScrollToTop';
import HistoryPage from './pages/home/components/js/HistoryPage';
import AnalyticsTracker from './AnalyticsTracker';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { initGA } from './analytics';

function App() {
  useEffect(() => {
    initGA(); // Chạy một lần khi app khởi động
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <AnalyticsTracker />
      {/* Các routes hoặc layout khác */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seemore" element={<SeeMore />} />
        <Route path="/movies/:slug" element={<ProducrtDetels />} />
        <Route path="/admin" element={<Admin />} />

        <Route path="/admin/createuser" element={<CreateUser />} />
        <Route path="/admin/listuser" element={<ListUser />} />
        <Route path="/admin/updateuser/:id/admin" element={<ShowUpdateUser />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/listfilm" element={<ListFilm />} />
        <Route path="/admin/update-Film/:slug" element={<UpdateFilm />} />
        <Route path="/admin/update-Film/update-episode-list/:slug" element={<UpdateEpisodeList />} />
        <Route path="/admin/update-Film/update-review/:slug" element={<UpdateReview />} />
        <Route path="/admin/Create-Film/" element={<CreateFilm />} />
        <Route path="/admin/Create-Film/create-episode" element={<CreateEpisodeFilm />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
