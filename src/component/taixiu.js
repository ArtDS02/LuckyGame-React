import React, { useState, useEffect } from 'react';
import "../App.css"
import Cookies from 'js-cookie';


function App() {
  const [display, setDisplay] = useState('');
  const [randomNumber, setRandomNumber] = useState('');
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState(parseInt(Cookies.get('budget')));
  const [bet, setBet] = useState('');
  const [loan, setLoan] = useState(parseInt(Cookies.get('loan')));
  const [option, setOption] = useState(1);
  const [img, setImg] = useState(false);
  const [endGame, setEndGame] = useState("");


  useEffect(() => {
    Cookies.set('budget', budget, { expires: 7 });
    if (loan >= 50000 && budget <= 0) {
      setEndGame("../img/over.jpg")
    }
  }, [budget]);

  useEffect(() => {
    Cookies.set('loan', loan, { expires: 7 });
  }, [loan]);

  const handleOption = (value) => () => {
    setOption(value);
    console.log("value: ", value);
  }

  const generateRandomNumbers = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const randomNum1 = Math.floor(Math.random() * 6) + 1;
        const randomNum2 = Math.floor(Math.random() * 6) + 1;
        const randomNum3 = Math.floor(Math.random() * 6) + 1;

        setDisplay(`${randomNum1} ${randomNum2} ${randomNum3}`);
      }, 10);

      setTimeout(() => {
        clearInterval(interval);
        const newRandomNumber1 = Math.floor(Math.random() * 6) + 1;
        const newRandomNumber2 = Math.floor(Math.random() * 6) + 1;
        const newRandomNumber3 = Math.floor(Math.random() * 6) + 1;

        setDisplay(`${newRandomNumber1} ${newRandomNumber2} ${newRandomNumber3}`);
        const result = newRandomNumber1 + newRandomNumber2 + newRandomNumber3;

        if (result < 12) {
          setRandomNumber("Xỉu");
          resolve(2);
        }
        else {
          setRandomNumber("Tài");
          resolve(1);
        }
      }, 3000);
    });
  };

  const compareResult = async () => {
    const parsedBet = parseInt(bet);

    if (isNaN(parsedBet) || parsedBet < 0) {
      setMessage('Đặt tiền đi bạn');
      return;
    }

    setMessage('');
    setBet('');

    try {
      if (parsedBet > budget) {
        setMessage("Không đủ tiền rồi, bốc cái bát đi rồi nói chuyện tiếp");
      } else {
        const result = await generateRandomNumbers();
        console.log("result  ", result);

        if (result === option) {
          setMessage('Gấp đôi đi bạn');
          setBudget(budget + parsedBet);
          Cookies.set('budget', budget + parsedBet, { expires: 7 });

        } else {
          setMessage('Gà');
          setBudget(budget - parsedBet);
          Cookies.set('budget', budget - parsedBet, { expires: 7 });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoanOption = (value) => () => {
    if (loan >= 50000 && budget <= 0) {
      setMessage("Trả nợ trước đi rồi nói tiếp");
    } else {
      setMessage(`Bốc cái bát ${value} thì chú cầm về ${value * 0.8}, nhớ trả không là cụt giò`);
      const valueLoan = value * 1000;
      setBudget(budget + (valueLoan * 0.8));
      setLoan(loan + value * 1000);
    }
  }

  const handlePayLoan = () => {
    console.log("ABC");
    if (budget >= loan) {
      setMessage("Oke hết nợ, chơi tiếp đi chú");
      setBudget(budget - loan);
      setLoan(0);
    } else {
      setMessage("Không đủ tiền mà đòi trả nợ, đá vô cuốn họng m giờ");
      setImg(true);
    }
    console.log("ABC");
  }

  return (
    <div className="container">
      {endGame ? (
        <div>
          <h1>-1 dân chơi, +1 con nợ</h1><br></br>
          <img src={require("../img/over.jpg")} alt="Logo" />
        </div>
      ) : (
        <div className="container">
          <h1>Ngã đâu gấp đôi ở đó</h1>
          <div className='head'>
            <h1>Còn lại: {budget}</h1>
            <h1>Nợ: {loan}</h1>
          </div>
          <br></br>
          <div className="input-area">
            <button
              className={`btn btn-taixiu ${option === 1 ? 'active' : ''}`}
              onClick={handleOption(1)}
            >
              Tài
            </button><br></br>
            <button
              className={`btn btn-taixiu ${option === 2 ? 'active' : ''}`}
              onClick={handleOption(2)}
            >
              Xỉu
            </button>
            <input
              placeholder='Bet bao nhiêu ?'
              value={bet}
              onChange={(event) => setBet(event.target.value)}
              className='input-option'
            />
            <button className="btn btn-taixiu" onClick={compareResult}>Lắc</button>
          </div>
          <div className="result-control">
            {display !== '' && <h2>{display}</h2>}
            {randomNumber && <h1>Kết quả: {randomNumber}</h1>}
          </div>
          <h3>{message}</h3>
          {img ? (
            <img src={require("../img/slap.jpg")} alt="Logo" />
          ) : (
            <div className='bottom-control'>
              <h2>Vòng cấp vốn</h2>
              <div className="loan-control">
                <button className="btn btn-loan" onClick={handleLoanOption(10)}>Bát 10</button>
                <button className="btn btn-loan" onClick={handleLoanOption(20)}>Bát 20</button>
                <button className="btn btn-loan" onClick={handleLoanOption(30)}>Bát 30</button>
                <button className="btn" onClick={handlePayLoan}>Trả nợ</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
