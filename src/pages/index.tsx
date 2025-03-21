import { useState, useEffect } from "react";

type VoteOptions = "rojo" | "azul";

export default function Home() {
  const [votes, setVotes] = useState<Record<VoteOptions, number>>({
    rojo: 0,
    azul: 0,
  });
  const [hasVoted, setHasVoted] = useState(false);

  // Cargar votos desde localStorage cuando el componente se monta
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedVotes = localStorage.getItem("votes");
      if (storedVotes) {
        setVotes(JSON.parse(storedVotes) as Record<VoteOptions, number>);
      }
      setHasVoted(!!localStorage.getItem("hasVoted"));
    }
  }, []);

  // Función para registrar el voto
  const submitVote = (option: VoteOptions) => {
    if (hasVoted) return;

    const newVotes = { ...votes, [option]: votes[option] + 1 };
    setVotes(newVotes);
    localStorage.setItem("votes", JSON.stringify(newVotes));
    localStorage.setItem("hasVoted", "true");
    setHasVoted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md text-center w-96">
        <h1 className="text-2xl font-bold">randomQUESTION</h1>
        <p className="mt-4 text-lg font-semibold">¿Cuál es tu color favorito?</p>

        <div className="mt-6 flex flex-col gap-4">
          {(["rojo", "azul"] as VoteOptions[]).map((color) => {
            const totalVotes = votes.rojo + votes.azul;
            const percentage = totalVotes > 0 ? (votes[color] / totalVotes) * 100 : 0;

            return (
              <button
                key={color}
                onClick={() => submitVote(color)}
                className={`relative px-4 py-2 text-white rounded-lg text-lg ${
                  color === "rojo" ? "bg-red-600" : "bg-blue-600"
                }`}
                disabled={hasVoted}
              >
                {color.charAt(0).toUpperCase() + color.slice(1)} ({votes[color]})
                <div
                  className="absolute left-0 top-0 h-full bg-white/20"
                  style={{ width: `${percentage}%` }}
                />
              </button>
            );
          })}
        </div>

        {hasVoted && <p className="mt-4 text-green-600 font-semibold">Gracias por votar!</p>}
      </div>
    </div>
  );
}
