import { useState } from "react";
import ResumeUpload from "./components/ResumeUpload";
import CareerGoalForm from "./components/CareerGoalForm";
import ResultsView from "./components/ResultsView";

export default function App() {
  const [collectionName, setCollectionName] = useState(null);
  const [result, setResult] = useState(null);

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Career Advisor</h1>

      {!collectionName && (
        <ResumeUpload onUploaded={setCollectionName} />
      )}

      {collectionName && !result && (
        <CareerGoalForm
          collectionName={collectionName}
          onResult={setResult}
        />
      )}

      {result && <ResultsView advice={result} />}
    </div>
  );
}