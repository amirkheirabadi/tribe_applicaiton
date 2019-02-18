module.exports = {
  delay: async (delayInms) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  },
  ranomNumber: (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  normalizeValidationError: (messages) => {
    let normalizeMessages = [];
    for (const item of messages) {
      normalizeMessages.push(item.param + ' has ' + item.msg)
    }
    return normalizeMessages
  }
}