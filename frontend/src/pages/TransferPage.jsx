import { useEffect, useState } from "react";
import api from "../api/axios";

function TransferPage() {
  const [mode, setMode] = useState("phone");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get('/accounts/');
        setBalance(res.data[0]?.balance ?? 0);
      } catch (err) {
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    }
    loadData(); // вызываем функцию
  }, []); // [] — только один раз

  async function handleTransfer() {
    setError(null);
    setSuccess(null);

    if (!recipient) {
      setError('Введите номер ' + (mode === 'phone' ? 'телефона' : 'карты'));
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Введите сумму перевода');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/transfer/', {
        mode,
        recipient,
        amount: Number(amount),
      });

      setSuccess(res.data.message);
      // Обновляем баланс после перевода
      const accountsRes = await api.get('/accounts/');
      setBalance(accountsRes.data[0]?.balance ?? 0);
      // Сбрасываем форму
      setRecipient('');
      setAmount('');

    } catch (err) {
      setError(err.response?.data?.error ?? 'Ошибка при переводе');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="dashboard"><p>Загрузка...</p></div>;

  return (
    <div className="dashboard">
      <div className="transfer-container">
        <div className="widget transfer-widget">
          <h3>Новый перевод</h3>

          {/* Показываем текущий баланс */}
          <p style={{ marginBottom: '16px', color: '#888' }}>
            Доступно: {Number(balance).toLocaleString('ru-RU')} ₽
          </p>

          <div className="transfer-switch">
            <button
              className={mode === "phone" ? "active" : ""}
              onClick={() => setMode("phone")}
            >
              По телефону
            </button>
            <button
              className={mode === "card" ? "active" : ""}
              onClick={() => setMode("card")}
            >
              По карте
            </button>
          </div>

          <div className="form-row">
            <label>
              {mode === "phone" ? "Номер телефона получателя" : "Номер карты"}
            </label>
            <input
              type={mode === "phone" ? "tel" : "text"}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="form-row">
            <label>Сумма перевода</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {error && <p style={{ color: 'red', margin: '8px 0' }}>{error}</p>}
          {success && <p style={{ color: 'green', margin: '8px 0' }}>{success}</p>}

          <button
            className="login-btn"
            onClick={handleTransfer}
            disabled={submitting}
          >
            {submitting ? 'Выполняем...' : 'Перевести'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransferPage;