import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function AnalyticsPage() {
  const income = 85000;
  const expenses = 42800;

  const categoryData = {
    labels: ["Еда", "Транспорт", "Развлечения", "Подписки", "Другое"],
    datasets: [
      {
        data: [12000, 8000, 6500, 2300, 14000],
        backgroundColor: [
        "rgba(159, 64, 64, 0.8)",
        "rgba(72, 159, 64, 0.6)",
        "rgba(64,120,159,0.5)",
        "rgba(156, 64, 159, 0.4)",
        "rgba(255, 255, 255, 0.3)"
      ],
      },
    ],
  };

  const monthlyData = {
  labels: ["1 нед", "2 нед", "3 нед", "4 нед"],
  datasets: [
    {
      label: "Расходы",
      data: [8000, 12000, 9500, 13300],
      borderColor: "rgba(255,99,132,0.8)",
      backgroundColor: "rgba(255,99,132,0.2)",
      tension: 0.4
    },
    {
      label: "Доходы",
      data: [20000, 15000, 30000, 20000],
      borderColor: "rgba(64,120,159,0.9)",
      backgroundColor: "rgba(64,120,159,0.2)",
      tension: 0.4
    }
  ]
};

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Аналитика</h1>

      {/* Основные показатели */}
      <div className="dashboard-grid">
        <div className="widget">
          <h3>Доходы за месяц</h3>
          <p className="widget-value">{income.toLocaleString()} ₽</p>
        </div>

        <div className="widget">
          <h3>Расходы за месяц</h3>
          <p className="widget-value">{expenses.toLocaleString()} ₽</p>
        </div>
      </div>

      {/* Графики */}
      <div className="analytics-grid">
        <div className="widget">
          <h3>Расходы по категориям</h3>
          <Doughnut data={categoryData} />
        </div>

        <div className="widget">
          <h3>Динамика за месяц</h3>
          <Line data={monthlyData} />
        </div>
      </div>

      {/* Отчет */}
      <div className="history-widget">
        <h3>Отчет</h3>
        <p>Скачать финансовый отчет за текущий месяц.</p>
        <button className="login-btn">Скачать отчет</button>
      </div>
    </div>
  );
}

export default AnalyticsPage;