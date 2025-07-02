import { Alert, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export default function DnaForm() {
  const [dnaInput, setDnaInput] = useState('');
  const [result, setResult] = useState('');
  const [ratio, setRatio] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setError('');
    setResult('');
    setRatio(null);

    try {
      const dnaArray = JSON.parse(dnaInput);

      if (!Array.isArray(dnaArray) || !dnaArray.every((s) => typeof s === 'string')) {
        throw new Error('Input must be a JSON array of strings');
      }

      const response = await axios.post(`${API_BASE_URL}/mutant`, { dna: dnaArray });
      setResult(response.data.isMutant ? '✅ Mutant DNA detected.' : '🧬 Human DNA detected.');

      // Fetch the updated ratio
      const stats = await axios.get(`${API_BASE_URL}/mutant/stats`);
      setRatio(stats.data.ratio);
    } catch (err: any) {
      setError(err.message || 'Invalid input or server error');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', padding: '2rem' }}>
      <Typography variant="h3">Mutant Detector</Typography>
      <Typography variant="h6" gutterBottom>Check if a DNA is mutant</Typography>
      <Typography style={{ fontSize: '0.9rem', color: '#555', marginBottom: 10 }}>
        Example: ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCACTG"]
      </Typography>

      <TextField
        label="Enter DNA sequence (JSON array of strings)"
        value={dnaInput}
        onChange={(e) => setDnaInput(e.target.value)}
        multiline
        fullWidth
        minRows={5}
        variant="outlined"
        margin="normal"
      />

      <Button variant="contained" color="primary" onClick={handleAnalyze}>
        ANALYZE DNA
      </Button>

      {error && <Alert severity="error" style={{ marginTop: '1rem' }}>{error}</Alert>}
      {result && <Alert severity="success" style={{ marginTop: '1rem' }}>{result}</Alert>}
      {ratio !== null && (
        <Alert severity="info" style={{ marginTop: '0.5rem' }}>
          🧪 Mutant-to-Human Ratio: <strong>{ratio.toFixed(2)}</strong>
        </Alert>
      )}
    </div>
  );
}
