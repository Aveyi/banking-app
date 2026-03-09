import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

function AccountsPage() {
  // Список вкладов из базы
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояние формы нового вклада
  const [amount, setAmount] = useState(50000);
  const [term, setTerm] = useState(12);
  const [allowTopUp, setAllowTopUp] = useState(false);
  const [allowWithdraw, setAllowWithdraw] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get('/deposits/');
        setDeposits(res.data);
      } catch (err) {
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const rates = { 1: 0.14, 3: 0.135, 6: 0.1456, 12: 0.13 };
  let rate = rates[term];
  if (allowTopUp) rate -= 0.005;
  if (allowWithdraw) rate -= 0.005;
  const finalAmount = Math.round(amount * (1 + rate * (term / 12)));

  async function handleCreateDeposit() {
    if (amount <= 0) {
      setSubmitError("Введите корректную сумму вклада");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await api.post('/deposits/',{
        amount: amount,
        duration: term,
        interest_rate: (rate * 100).toFixed(2),
      });

      setDeposits([...deposits, res.data]);

      setAmount(50000);
      setTerm(12);
      setAllowTopUp(false);
      setAllowWithdraw(false);
    } catch (err) {
      setSubmitError("Не удалось открыть вклад");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="dashboard"><p>Загрузка...</p></div>;
  if (error) return <div className="dashboard"><p>{error}</p></div>;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Ваши счета и вклады</h1>

      {/* Список вкладов из базы */}
      <div className="dashboard-grid">
        {deposits.length === 0 ? (
          <p>У вас пока нет вкладов</p>
        ) : (
          deposits.map((deposit) => (
            <div className="widget" key={deposit.id}>
              <h3>Вклад</h3>
              <p className="widget-value">
                {Number(deposit.amount).toLocaleString('ru-RU')} ₽
              </p>
              <p>Доходность: {deposit.interest_rate}%</p>
              <p>Срок: {deposit.duration} мес.</p>
            </div>
          ))
        )}
      </div>

      {/* Форма открытия нового вклада */}
      <div className="history-widget">
        <h3>Открыть новый вклад</h3>
        <div className="deposit-form">

          <div className="form-row">
            <label>Сумма вклада</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>

          <div className="form-row">
            <label>Срок</label>
            <input
              type="range"
              min="1"
              max="4"
              value={[1, 3, 6, 12].indexOf(term) + 1}
              onChange={(e) => {
                const map = [1, 3, 6, 12];
                setTerm(map[e.target.value - 1]);
              }}
            />
            <p>{term} мес.</p>
          </div>

          <div className="switch-row">
            <label>
              <input type="checkbox" checked={allowTopUp}
                onChange={() => setAllowTopUp(!allowTopUp)} />
              Пополнение
            </label>
            <label>
              <input type="checkbox" checked={allowWithdraw}
                onChange={() => setAllowWithdraw(!allowWithdraw)} />
              Снятие
            </label>
          </div>

          <div className="result">
            <p>Ставка: {(rate * 100).toFixed(2)}%</p>
            <p>Итоговая сумма: {finalAmount.toLocaleString()} ₽</p>
          </div>
          {submitError && (
            <p style={{ color: 'red', marginBottom: '8px' }}>{submitError}</p>
          )}
          <button className="login-btn" onClick={handleCreateDeposit} disabled={submitting}>{submitting ? 'Открываем...' : 'Открыть вклад'}</button>
        </div>
      </div>
    </div>
  );
}

export default AccountsPage;