const generateHistory = (basePrice, days = 60) => {
  const history = [];
  let price = Number(basePrice);

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);

    const drift = (Math.random() - 0.45) * 0.035;
    price = Math.max(5, Number((price * (1 + drift)).toFixed(2)));

    history.push({
      date,
      price,
      volume: Math.floor(250000 + Math.random() * 6000000),
    });
  }

  return history;
};

module.exports = generateHistory;

