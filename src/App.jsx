import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BudgetUploader() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://budget-backend-1gug.onrender.com/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.status === "success") {
        setSummary(data);
      } else {
        setError(data.message || "Unknown error occurred.");
      }
    } catch (err) {
      setError("Failed to upload. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Upload Your Budget PDF</h1>
      <Input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <Button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Processing..." : "Upload PDF"}
      </Button>

      {error && <p className="text-red-600 font-medium">{error}</p>}

      {summary && (
        <Card className="mt-4">
          <CardContent>
            <h2 className="font-semibold text-lg">Summary</h2>
            <p>Total Transactions: {summary.total_transactions}</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              {summary.raw_transactions.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
