export const BASE_URL = 'http://localhost:3000';

const fetchDataSheetOrCommercial = (historyItem, endpoint, acceptType) => {
  return fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': acceptType, // Ожидаемый тип контента
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ historyItem })
  })
    .then(async (response) => {
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes(acceptType)) {
        // Если тип контента соответствует ожидаемому, возвращаем весь ответ
        return response;
      } else {
        // Если тип контента не соответствует ожидаемому, обрабатываем его как JSON
        return response.json().then((data) => {
          console.log('Данные JSON', data);
          throw new Error('Получен неверный тип данных');
        });
      }
    });
};

export const getCommercial = (historyItem) => {
  return fetchDataSheetOrCommercial(historyItem, 'offer', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
};

export const getDataSheet = (historyItem) => {
  return fetchDataSheetOrCommercial(historyItem, 'data-sheet', 'application/pdf');
};

export const getFanModels = () => {
  return fetch(`${BASE_URL}/models`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Не удалось получить модели вентиляторов');
      }
      return response.json();
    })
    .then((data) => data.modelsArray)
    .catch((error) => {
      console.error('Ошибка при запросе данных моделей вентиляторов на сервер:', error.message);
      throw error;
    });
};

export const getFanDataPoints = () => {
  return fetch(`${BASE_URL}/data-points`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Не удалось получить данные точек графиков вентиляторов');
      }
      return response.json();
    })
    .then((data) => data.fanData)
    .catch((error) => {
      console.error('Ошибка при запросе данных точек графиков вентиляторов на сервер:', error.message);
      throw error;
    });
};
