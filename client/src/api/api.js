const BASE_URL = "http://localhost:5000/api";

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${BASE_URL}/resume/upload`, {
    method: "POST",
    body: formData
  });

  return res.json();
}

export async function getCareerAdvice(goal, collectionName) {
  const res = await fetch(`${BASE_URL}/jobs/career-advisor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ goal, collectionName })
  });

  return res.json();
}