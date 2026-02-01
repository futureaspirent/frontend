

import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

import Sidebar from '../components/Sidebar';
import styles from '../styles/Dashboard.module.css';

import Sales from "../assets/Sales.png"
import Revenue from "../assets/Revenue.png"
import Profit from "../assets/Profit.png"
import Cost from "../assets/Cost.png"
import Purchase from "../assets/Purchase.png"
import CostP from "../assets/Cost-p.png"
import Cancel from "../assets/Cancel.png"
import ReturnP from "../assets/Return-p.png"
import Quantity from "../assets/Quantity.png"
import Location from "../assets/Location.png"
import Suppliers from "../assets/Suppliers.png"
import categories from "../assets/Categories.png"


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {

 const [stats, setStats] = useState(null);

  useEffect(() => {

      const fetchStats = async () => {
      try {
      
        const token = localStorage.getItem('token'); // your JWT
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/statistics`, {
          headers: { 'x-auth-token': token },user :localStorage.getItem('IASM-UID')
        });
       
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
      
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);


  const [period, setPeriod] = useState("monthly");
  const [dashData, setDashData] = useState({ salesChart: [], purchaseChart: [] });
  const [topSelling, setTopSelling] = useState([]);

  // Fetch chart + top selling based on period
  useEffect(() => {
    const fetchDash = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/statistics/dashSummary?period=${period}`,
          { headers: { "x-auth-token": token } }
        );

        const data = await res.json();

        setDashData({
          salesChart: data.salesChart || [],
          purchaseChart: data.purchaseChart || []
        });
        
        setTopSelling(data.topSelling || []);
        
      } catch (err) {
        console.error(err);
      }
    };

    fetchDash();
  }, [period]);

  const getLabels = (period, salesChart, purchaseChart) => {
    if (period === "weekly") {
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    }

    if (period === "yearly") {
      const years = [
        ...new Set([
          ...salesChart.map(i => i._id?.year),
          ...purchaseChart.map(i => i._id?.year)
        ])
      ].sort();
      return years;
    }

    return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  };

  const buildChartData = (salesChart, purchaseChart, period) => {
    const labels = getLabels(period, salesChart, purchaseChart);

    const salesMap = {};
    const purchaseMap = {};

    salesChart.forEach(i => {
      if (period === "monthly") salesMap[i._id.month] = i.totalAmount;
      if (period === "weekly") salesMap[i._id.day] = i.totalAmount;
      if (period === "yearly") salesMap[i._id.year] = i.totalAmount;
    });

    purchaseChart.forEach(i => {
      if (period === "monthly") purchaseMap[i._id.month] = i.totalAmount;
      if (period === "weekly") purchaseMap[i._id.day] = i.totalAmount;
      if (period === "yearly") purchaseMap[i._id.year] = i.totalAmount;
    });

    let salesData = [];
    let purchaseData = [];

    if (period === "monthly" || period === "weekly") {
      salesData = labels.map((_, idx) => salesMap[idx + 1] || 0);
      purchaseData = labels.map((_, idx) => purchaseMap[idx + 1] || 0);
    }

    if (period === "yearly") {
      salesData = labels.map(y => salesMap[y] || 0);
      purchaseData = labels.map(y => purchaseMap[y] || 0);
    }

    return {
      labels,
      datasets: [
        { label: "Sales", data: salesData, backgroundColor: "#34D399",borderRadius: 8, barPercentage: 0.6 },
        { label: "Purchase", data: purchaseData, backgroundColor: "#60A5FA" ,borderRadius: 8, barPercentage: 0.6 }
      ]
    };
  };

  const chartData = buildChartData(
    dashData.salesChart,
    dashData.purchaseChart,
    period
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true }
    }
  };

  if (!stats) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Home</h1>

        <div className={styles.topSection}>

          
          <div className={styles.overviewCard}>
            <h3>Sales Overview</h3>
            <div className={styles.cardsRow}>
              <div className={styles.smallCard}>
                <img src={Sales} alt="icon" />
                <span>{stats.sales.totalQuantity}</span>
                <p>Sales</p>
              </div>
              <div className={styles.smallCard}>
                <img src={Revenue} alt="icon" />
                <span>₹{stats.sales.totalValue}</span>
                <p>Revenue</p>
              </div>
              <div className={styles.smallCard}>
                <img src={Profit} alt="icon" />
                <span>₹868</span>
                <p>Profit</p>
              </div>
              <div className={styles.smallCard}>
                <img src={Cost} alt="icon" />
                <span>₹17432</span>
                <p>Cost</p>
              </div>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <h3>Inventory Summary</h3>
            <div className={styles.summaryRow}>
              <div className={styles.summaryItem}>
                <img src={Quantity} alt="icon" />
                <span>{stats.inventory.totalItems}</span>
                <p>In Stock</p>
              </div>
              <div className={styles.summaryItem}>
                <img src={Location} alt="icon" />
                <span>200</span>
                <p>To be received</p>
              </div>
            </div>
          </div>
        </div>



       <div className={styles.middleSection}>

            

         


      <div className={styles.overviewCard}>
        <h3>Purchase Overview</h3>

        <div className={styles.cardsRow}>


            <div className={styles.smallCard}>
              <img src={Purchase} alt="icon" />
              <span>{stats.purchases.totalQuantity}</span>
              <p>Purchases</p>
            </div>

            <div className={styles.smallCard}>
             <img src={CostP} alt="icon" />
              <span>${stats.purchases.totalValue}</span>
              <p>Cost</p>
            </div>

            <div className={styles.smallCard}>
              <img src={Cancel} alt="icon" />
              <span>5</span>
              <p>Cancelled</p>
            </div>

            <div className={styles.smallCard}>
              <img src={ReturnP} alt="icon" />
              <span>17432</span>
              <p>Returned</p>
            </div>



        </div>

    </div>
                <div className={styles.summaryCard}>
              <h3>Product Summary</h3>
              <div className={styles.summaryRow}>
                <div className={styles.summaryItem}>
                  <img src={Suppliers} alt="icon" />
                  <span>31</span>
                  <p>Number of Suppliers</p>
                </div>

                <div className={styles.summaryItem}>
                  <img src={categories} alt="icon" />
                  <span>{stats.products.categories}</span>
                  <p>Categories</p>
                </div>
              </div>
          </div>

</div>

        <div className={styles.bottomSection}>
          <div className={styles.chartCard}>
            <div className={styles.cardHeader}>
              <h3>Sales & Purchase</h3>
              <select className={styles.dropdown} value={period} onChange={(e)=>setPeriod(e.target.value)}>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
              </select>
            </div>
            <div style={{ height: '-webkit-fill-available',minHeight:'500px' }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className={styles.topProducts}>
            <h3>Top Products</h3>
            <ul>
              {topSelling?.map((p) => (
               
               <li key={p._id} style={{ display: "flex",flexDirection:"column",alignItems:"center",justifyContent:"center", gap: 10 }}>
              <img
           src={p?.imageUrl ? `${import.meta.env.VITE_API_URL+p.imageUrl}` : `${import.meta.env.VITE_API_URL}/default/product.png`}

                alt={p.name}
                style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }}
              />
              <span>{p.name}</span>
              <small>({p.sold})</small>
            </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
