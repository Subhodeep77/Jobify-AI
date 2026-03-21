import { useState } from "react";
import { getCareerAdvice } from "../api/api";

export default function CareerGoalForm({ collectionName, onResult }) {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!goal) return;

    setLoading(true);
    const result = await getCareerAdvice(goal, collectionName);
    setLoading(false);

    if (result.success) {
      onResult(result.advice);
    }
  };

  return (
    <div>
      <h2>Career Goal</h2>
      <input
        type="text"
        placeholder="e.g. Backend Developer roles"
        value={goal}
        onChange={e => setGoal(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Get Advice"}
      </button>
    </div>
  );
}