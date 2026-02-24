import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">

      <h1 className="dashboard-title">Главная</h1>

      <div className="dashboard-grid">

        <div className="widget">
          <h3>Текущий баланс</h3>
          <p className="widget-value">124 500 ₽</p>
        </div>

        <div className="widget">
          <h3>Потрачено за месяц</h3>
          <p className="widget-value">32 800 ₽</p>
        </div>

        <div className="widget clickable" onClick={() => navigate("/accounts")}>
          <h3>Открыть новый счет</h3>
          <p>Перейти к счетам →</p>
        </div>

        <div className="widget clickable" onClick={() => navigate("/transfer")}>
          <h3>Платежи</h3>
          <p>Перейти к переводам →</p>
        </div>

      </div>

      <div className="history-widget">
        <h3>Последние операции</h3>

        <div className="history-list">
          <div className="history-item">
            <span>Перевод</span>
            <span>-2 500 ₽</span>
          </div>

          <div className="history-item">
            <span>Пополнение</span>
            <span>+10 000 ₽</span>
          </div>

          <div className="history-item">
            <span>Покупка</span>
            <span>-1 200 ₽</span>
          </div>

          <div className="history-item">
            <span>Подписка</span>
            <span>-399 ₽</span>
          </div>

          <div className="history-item">
            <span>Перевод</span>
            <span>-5 000 ₽</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default DashboardPage;