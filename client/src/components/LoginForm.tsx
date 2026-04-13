import { useState, FormEvent } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { TextField, Button, Alert, CircularProgress, Paper } from '@mui/material';

export default function LoginForm() {
  const { login }  = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState<string | null>(null);
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login fallito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h2>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 1 }}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Accedi'}
          </Button>
        </form>
      </Paper>
    </div>
  );
}
