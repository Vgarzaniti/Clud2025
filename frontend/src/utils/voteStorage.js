
const key = (userId) => `votos_usuario_${userId}`;

export const getStoredVotes = (userId) => {
  try {
    return JSON.parse(localStorage.getItem(key(userId))) || {};
  } catch {
    return {};
  }
};

export const getStoredVote = (userId, respuestaId) => {
  const votos = getStoredVotes(userId);
  return votos[respuestaId] ?? 0;
};

export const setStoredVote = (userId, respuestaId, valor) => {
  const votos = getStoredVotes(userId);
  votos[respuestaId] = valor;
  localStorage.setItem(key(userId), JSON.stringify(votos));
};

export const clearStoredVotes = (userId) => {
  localStorage.removeItem(key(userId));
};
