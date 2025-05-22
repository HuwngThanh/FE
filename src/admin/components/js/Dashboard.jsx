import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/dashboard.css';
import { useGetAnalyticsMutation } from '../../../apis/dashboardApi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [getAnalytics] = useGetAnalyticsMutation();
  const [analyticsData, setAnalyticsData] = useState({
    dates: [],
    activeUsers: [],
    newUsers: [],
    sessions: [],
    screenPageViews: [],
    averageSessionDuration: [],
    bounceRate: [],
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getAnalytics({
          startDate: '7daysAgo',
          endDate: 'today',
          metrics: ['activeUsers', 'newUsers', 'sessions', 'screenPageViews', 'averageSessionDuration', 'bounceRate'],
          dimensions: ['date'],
        }).unwrap();

        const data = response.data;

        setAnalyticsData({
          dates: data.map((item) => item.date),
          activeUsers: data.map((item) => item.activeUsers),
          newUsers: data.map((item) => item.newUsers),
          sessions: data.map((item) => item.sessions),
          screenPageViews: data.map((item) => item.screenPageViews),
          averageSessionDuration: data.map((item) => item.averageSessionDuration),
          bounceRate: data.map((item) => item.bounceRate),
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, [getAnalytics]);

  return (
    <div className="admin-main-content">
      <div className="admin-container-fluid">
        <h4>Dashboard / Tổng quan</h4>

        {/* Biểu đồ người dùng hoạt động */}
        <div className="row mt-3">
          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Người dùng hoạt động trong 7 ngày qua</h5>
                <Line
                  data={{
                    labels: analyticsData.dates,
                    datasets: [
                      {
                        label: 'Người dùng hoạt động',
                        data: analyticsData.activeUsers,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.2,
                      },
                      {
                        label: 'Người dùng mới',
                        data: analyticsData.newUsers,
                        borderColor: 'rgb(255, 99, 132)',
                        tension: 0.2,
                      },
                      {
                        label: 'Số phiên truy cập',
                        data: analyticsData.sessions,
                        borderColor: 'rgb(54, 162, 235)',
                        tension: 0.2,
                      },
                      {
                        label: 'Lượt xem trang/màn hình',
                        data: analyticsData.screenPageViews,
                        borderColor: 'rgb(153, 102, 255)',
                        tension: 0.2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Thống kê người dùng & hành vi',
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bảng thông tin tổng quát */}
        <div className="row mt-3">
          {[
            {
              color: 'primary',
              text: 'User mới / Tổng user hoạt động',
              count: `${analyticsData.newUsers.at(-1) || 0} / ${analyticsData.activeUsers.at(-1) || 0}`,
            },
            {
              color: 'success',
              text: 'Số phiên truy cập',
              count: analyticsData.sessions.at(-1) || 0,
            },
            {
              color: 'warning',
              text: 'Thời lượng trung bình phiên (giây)',
              count: Math.round(analyticsData.averageSessionDuration.at(-1) || 0),
            },
            {
              color: 'danger',
              text: 'Tỷ lệ thoát (%)',
              count: (analyticsData.bounceRate.at(-1) || 0).toFixed(2),
            },
          ].map((item, index) => (
            <div className="col-md-3" key={index}>
              <div className={`card bg-${item.color} text-white p-3`}>
                <h5>{item.count}</h5>
                <p>{item.text}</p>
                <button className="btn btn-light btn-sm">
                  Xem thêm <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
