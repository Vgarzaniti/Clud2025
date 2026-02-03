import { useEffect, useState } from "react";
import { getStoredVote, setStoredVote } from "../utils/voteStorage";

export default function usePersistedVote({
  userId,
  respuestaId,
  backendVote = 0,
}) {
  const [voto, setVoto] = useState(0);

  useEffect(() => {
    if (!userId || !respuestaId) return;

    const localVote = getStoredVote(userId, respuestaId);

    if (localVote !== 0) {
      // 1️⃣ prioridad: localStorage
      setVoto(localVote);
    } else {
      // 2️⃣ fallback: backend
      setVoto(backendVote ?? 0);
    }
  }, [userId, respuestaId, backendVote]);

  const persistVote = (valor) => {
    setVoto(valor);
    setStoredVote(userId, respuestaId, valor);
  };

  return {
    voto,
    setVoto: persistVote,
  };
}
