export const BASE_URL = 'http://localhost:3000';
// Для локального запуска с бэкэндом на 3000 порте

export const getDataSheet = (historyItem) => {
  return fetch(`${BASE_URL}/pdf`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Ожидаемый тип контента
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ historyItem })
  })
  .then(async (response) => {
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      // Если тип контента - xlsx, возвращаем весь ответ
      return response;
    } else {
      // Если тип контента не xlsx, обрабатываем его как JSON
      return response.json().then((data) => {
        console.log('Данные JSON', data);
        throw new Error('Получен неверный тип данных');
      });
    }
  });
};
