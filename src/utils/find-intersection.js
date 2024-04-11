export const findIntersection = (arr1, arr2, fanModel) => {
  const tolerance = 10; // Отклонение при поиске
  let potentialIntersections = [];
  let pointer1 = 0;
  let pointer2 = 0;

  while (pointer1 < arr1.length && pointer2 < arr2.length) {
    const point1 = arr1[pointer1];
    const point2 = arr2[pointer2];

    if (Math.abs(point1.x - point2.x) <= tolerance && Math.abs(point1.y - point2.y) <= tolerance) {
      potentialIntersections.push({
        fanModel, // Добавляем fanModel здесь
        x: Math.round((point1.x + point2.x) / 2),
        y: Math.round((point1.y + point2.y) / 2),
        delta: Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y) // Суммарное отклонение
      });
      pointer1++;
      pointer2++;
    } else if (point1.x < point2.x) {
      pointer1++;
    } else {
      pointer2++;
    }
  }

  // Если не найдено ни одного совпадения, возвращаем точку с минимальным отклонением
  if (potentialIntersections.length === 0 && arr1.length > 0 && arr2.length > 0) {
    return [{
      fanModel,
      x: arr1[0].x,
      y: arr1[0].y
    }];
  }

  // Выбираем из потенциальных пересечений ту, которая имеет минимальное суммарное отклонение
  const bestMatch = potentialIntersections.reduce((prev, current) => {
    return (prev.delta < current.delta) ? prev : current;
  });

  // Обеспечиваем, что fanModel присутствует в каждом возвращаемом значении
  bestMatch.fanModel = fanModel;

  return [bestMatch]; // Возвращаем массив с лучшим совпадением
};
