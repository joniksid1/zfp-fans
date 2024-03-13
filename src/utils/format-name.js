function formatFanName(rawName) {
  const fanNameMappings = {
    'ZFR 1,9-2E': 'zfr_1_9_2e',
    'ZFR 2,2-2E': 'zfr_2_2_2e',
    // 'ZFR 2,25-2E': 'zfr_2_25_2e',
    'ZFR 2,5-2E': 'zfr_2_5_2e',
    'ZFR 2,8-2E': 'zfr_2_8_2e',
    'ZFR 3,1-4E': 'zfr_3_1_4e',
    'ZFR 3,1-4D': 'zfr_3_1_4d',
    'ZFR 3,5-4E': 'zfr_3_5_4e',
    'ZFR 3,5-4D': 'zfr_3_5_4d',
    'ZFR 4-4E': 'zfr_4_4e',
    'ZFR 4-4D': 'zfr_4_4d',
    'ZFR 4,5-4E': 'zfr_4_5_4e',
    'ZFR 4,5-4D': 'zfr_4_5_4d',
    'ZFR 5-4D': 'zfr_5_4d',
    'ZFR 5,6-4D': 'zfr_5_6_4d',
    'ZFR 6,3-4D': 'zfr_6_3_4d',
    // Добавьте другие соответствия по мере необходимости
  };

  return fanNameMappings[rawName] || rawName;
}

export default formatFanName;
