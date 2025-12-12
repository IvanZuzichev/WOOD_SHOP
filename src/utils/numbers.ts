// utils/numbers.js
export const roundToTenth = (number) => {
  return Math.round(number * 10) / 10;
};

export const formatQuantity = (number) => {
  // Округляем до десятых и убираем лишние нули
  const rounded = roundToTenth(number);
  return parseFloat(rounded.toFixed(1));
};