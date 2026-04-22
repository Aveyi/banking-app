import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, PointElement, LineElement,
  Tooltip, Legend
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import api from "../api/axios";

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  ArcElement, PointElement, LineElement,
  Tooltip, Legend
);

const doughnutOptions = {
  plugins: { legend: { labels: { color: "#bfd3e4" } } }
};

const chartOptions = {
  plugins: { legend: { labels: { color: "#bfd3e4" } } },
  scales: {
    x: { ticks: { color: "#bfd3e4" }, grid: { color: "rgba(255,255,255,0.35)" } },
    y: { ticks: { color: "#bfd3e4" }, grid: { color: "rgba(255,255,255,0.35)" } }
  }
};

function AnalyticsPage() {
  const [weeklyData, setWeeklyData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [weeklyRes, categoryRes] = await Promise.all([
          api.get('/analytics/weekly/'),
          api.get('/analytics/categories/'),
        ]);

        // Формируем данные для линейного графика
        setWeeklyData({
          labels: weeklyRes.data.labels,
          datasets: [
            {
              label: 'Расходы',
              data: weeklyRes.data.expenses,
              borderColor: 'rgba(255,99,132,0.8)',
              backgroundColor: 'rgba(255,99,132,0.2)',
              tension: 0.4,
            },
            {
              label: 'Доходы',
              data: weeklyRes.data.incomes,
              borderColor: 'rgba(72,159,64,0.6)',
              backgroundColor: 'rgba(64,120,159,0.2)',
              tension: 0.4,
            },
          ],
        });

        // Считаем итоги за месяц
        setTotalExpenses(weeklyRes.data.expenses.reduce((a, b) => a + b, 0));
        setTotalIncome(weeklyRes.data.incomes.reduce((a, b) => a + b, 0));

        // Формируем данные для кольцевой диаграммы
        setCategoryData({
          labels: categoryRes.data.labels,
          datasets: [{
            data: categoryRes.data.data,
            backgroundColor: [
              'rgba(159,64,64,0.8)',
              'rgba(72,159,64,0.6)',
              'rgba(64,120,159,0.5)',
              'rgba(156,64,159,0.4)',
              'rgba(255,255,255,0.3)',
            ],
          }],
        });

      } catch (err) {
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="dashboard"><p>Загрузка...</p></div>;
  if (error) return <div className="dashboard"><p>{error}</p></div>;
  async function handleDownloadReport() {
  try {
    const res = await api.get('/report/', {
      responseType: 'blob', // говорим axios что ждём файл, а не JSON
    });

    // Создаём ссылку для скачивания и кликаем по ней
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'report.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error('Ошибка при скачивании отчёта');
  }
}

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Аналитика</h1>

      <div className="dashboard-grid">
        <div className="widget">
          <h3>Доходы за месяц</h3>
          <p className="widget-value">{totalIncome.toLocaleString('ru-RU')} ₽</p>
        </div>
        <div className="widget">
          <h3>Расходы за месяц</h3>
          <p className="widget-value">{totalExpenses.toLocaleString('ru-RU')} ₽</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="widget">
          <h3>Расходы по категориям</h3>
          {categoryData && <Doughnut data={categoryData} options={doughnutOptions} />}
        </div>
        <div className="widget">
          <h3>Динамика за месяц</h3>
          {weeklyData && <Line data={weeklyData} options={chartOptions} />}
        </div>
      </div>

      <div className="history-widget">
        <h3>Отчет</h3>
        <p>Скачать финансовый отчет за текущий месяц.</p>
        <button className="login-btn" onClick={handleDownloadReport}>
          Скачать отчет
        </button>
      </div>
    </div>
  );
}

export default AnalyticsPage;