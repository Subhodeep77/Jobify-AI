export default function ResultsView({ advice }) {
  if (!advice || advice.message) {
    return <p>{advice?.message || "No results yet."}</p>;
  }

  return (
    <div>
      <h2>Recommended Roles</h2>

      {advice.recommended_roles.map((role, idx) => (
        <div key={idx} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 10 }}>
          <h3>{role.role}</h3>

          <strong>Why you fit:</strong>
          <ul>
            {role.reason.map((r, i) => <li key={i}>{r}</li>)}
          </ul>

          <strong>Missing skills:</strong>
          <ul>
            {role.missing_skills.map((s, i) => <li key={i}>{s}</li>)}
          </ul>

          <strong>Next steps:</strong>
          <ul>
            {role.next_steps.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}