import { useState } from "react";

function TransferPage() {
  const [mode, setMode] = useState("phone");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="dashboard">
      <div className="transfer-container">
          <div className="widget transfer-widget">
        <h3>Новый перевод</h3>

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
            {mode === "phone"
              ? "Номер телефона получателя"
              : "Номер карты"}
          </label>

          <input
            type={mode === "phone" ? "tel" : "text"}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder=" "
          />
        </div>

        <div className="form-row">
          <label>Сумма перевода</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder=" "
          />
        </div>

        <button className="login-btn">Перевести</button>
      </div>
    </div>
      </div>
      
  );
}

export default TransferPage;