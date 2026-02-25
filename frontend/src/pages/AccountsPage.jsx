import { useState } from "react";

function AccountsPage() {
  const [amount, setAmount] = useState(50000);
  const [term, setTerm] = useState(12);
  const [allowTopUp, setAllowTopUp] = useState(false);
  const [allowWithdraw, setAllowWithdraw] = useState(false);

  const rates = {
    1: 0.14,
    3: 0.135,
    6: 0.1456,
    12: 0.13,
  };

  let rate = rates[term];

  if (allowTopUp) rate -= 0.005;
  if (allowWithdraw) rate -= 0.005;

  const finalAmount = Math.round(amount * (1 + rate * (term / 12)));

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Ваши счета и вклады</h1>

      {/* Открытые счета */}
      <div className="dashboard-grid">
        <div className="widget">
          <h3>Вклад 1</h3>
          <p className="widget-value">245 000 ₽</p>
          <p>Доходность: 8%</p>
        </div>

        <div className="widget">
          <h3>Вклад 2</h3>
          <p className="widget-value">80 500 ₽</p>
          <p>Доходность: 7%</p>
        </div>
      </div>

      {/* Открытие нового счета */}
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
              value={[1,3,6,12].indexOf(term)+1}
              onChange={(e) => {
                const map = [1, 3, 6, 12];
                setTerm(map[e.target.value - 1]);
              }}
            />
            <p>{term} мес.</p>
          </div>

          <div className="switch-row">
            <label>
              <input
                type="checkbox"
                checked={allowTopUp}
                onChange={() => setAllowTopUp(!allowTopUp)}
              />
              Пополнение
            </label>

            <label>
              <input
                type="checkbox"
                checked={allowWithdraw}
                onChange={() => setAllowWithdraw(!allowWithdraw)}
              />
              Снятие
            </label>
          </div>

          <div className="result">
            <p>Ставка: {(rate * 100).toFixed(2)}%</p>
            <p>Итоговая сумма: {finalAmount.toLocaleString()} ₽</p>
          </div>

          <button className="login-btn">Открыть вклад</button>

        </div>
      </div>
    </div>
  );
}

export default AccountsPage;