import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios"

function DashboardPage() {
  const navigate = useNavigate();

  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [accountsRes, transactionsRes] = await Promise.all([
        api.get('/accounts/'),
        api.get('/transactions/'),
      ]);
        setBalance(accountsRes.data[0]?.balance ?? 0);
        setAccountId(accountsRes.data[0]?.id);
        setTransactions(transactionsRes.data.slice(0, 5));
      } catch (err) {
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="dashboard"><p>Загрузка...</p></div>;
  }

  if (error) {
    return <div className="dashboard"><p>{error}</p></div>;
  }

  function formatMoney(amount) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(amount);
  }

  function formatTransaction(transaction) {
  if (transaction.type === 'deposit') {
    return { label: 'Пополнение', sign: '+', color: 'green' };
  } else if (transaction.type === 'withdrawal') {
    return { label: 'Снятие', sign: '-', color: 'red' };
  } else {
    if (transaction.from_account === accountId) {
      return { label: 'Перевод', sign: '-', color: 'red' };
    } else {
      return { label: 'Входящий перевод', sign: '+', color: 'green' };
    }
  }
}

  return (
    <div className="dashboard">

      <h1 className="dashboard-title">Главная</h1>

      <div className="dashboard-grid">

        <div className="widget">
          <h3>Текущий баланс</h3>
          <p className="widget-value">{formatMoney(balance)}</p>
        </div>

        <div className="widget">
          <h3>Потрачено за месяц</h3>
          <p className="widget-value">
            {formatMoney(
              transactions
                .filter(t => t.type !== 'deposit')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0)
            )}
          </p>
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
          {transactions.length === 0 ? (
            <p>Операций пока нет</p>
          ) : (
            transactions.map((transaction) => {
              const { label, sign, color } = formatTransaction(transaction);
              return (
                <div className="history-item" key={transaction.id}>
                  <span>{label}</span>
                  <span style={{ color }}>
                    {sign}{formatMoney(transaction.amount)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;