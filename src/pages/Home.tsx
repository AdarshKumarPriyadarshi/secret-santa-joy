import { useState } from "react";
import { generatePairs } from "../services/api";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<Record<string, string> | null>(null);

  async function handleGenerate() {
    const names = input
      .split(",")
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    const pairs = await generatePairs(names);

    // pairs is expected to be an array of objects like: { giver: "", receiver: "" }
    const formatted: Record<string, string> = {};

    pairs.forEach((p: any) => {
      formatted[p.giver] = p.receiver;
    });

    setResult(formatted);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Secret Santa Generator 🎅🎁</h1>

      <textarea
        placeholder="Enter names separated by commas"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "300px", height: "120px" }}
      />

      <br /><br />

      <button
        onClick={handleGenerate}
        style={{ padding: "10px 20px", fontSize: "18px" }}
      >
        Generate
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Assignments:</h2>
          <ul>
            {Object.entries(result).map(([giver, receiver]) => (
              <li key={giver}>
                {giver} → {receiver}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
