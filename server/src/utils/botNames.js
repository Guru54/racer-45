const BOT_NAMES = [
  'SpeedyBot',
  'TypeMaster',
  'CodeNinja',
  'FastFingers',
  'KeyboardKing',
  'SwiftTyper',
  'RapidWriter',
  'QuickKeys',
  'TurboTypist',
  'FlashTyper',
  'LightningKeys',
  'ThunderType',
  'RocketFingers',
  'BlazeTyper',
  'NitroWriter',
  'HyperType',
  'VelocityBot',
  'AceTyper',
  'ProKeys',
  'EliteWriter'
];

const getRandomBotName = () => {
  return BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
};

const getRandomBotDifficulty = () => {
  const difficulties = ['easy', 'medium', 'hard'];
  const weights = [0.3, 0.5, 0.2]; // 30% easy, 50% medium, 20% hard
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random <= sum) {
      return difficulties[i];
    }
  }
  
  return 'medium';
};

module.exports = {
  BOT_NAMES,
  getRandomBotName,
  getRandomBotDifficulty
};
