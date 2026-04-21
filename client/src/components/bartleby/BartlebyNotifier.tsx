import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Snackbar, Alert, Button } from '@mui/material';
import { useSubscription } from '../../context/SubscriptionContext';
import { getMyOutputDocuments } from '../../services/bartlebyService';
import type { OutputDocument } from '../../types/bartleby';

const STORAGE_KEY  = 'bartleby_seen_outputs';
const POLL_MS      = 15_000;

function getSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function markSeen(ids: string[]): void {
  try {
    const existing = getSeenIds();
    ids.forEach((id) => existing.add(id));
    const trimmed = Array.from(existing).slice(-200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch { /* non bloccare */ }
}

interface PendingNotification {
  outputId: string;
  title: string;
}

export default function BartlebyNotifier() {
  const { isSignedIn, getToken } = useAuth();
  const { user }                 = useUser();
  const { isBartleby }           = useSubscription();
  const navigate                 = useNavigate();

  const [notification, setNotification] = useState<PendingNotification | null>(null);

  // initialized è persistito in localStorage: sopravvive alle remount e ai cambi di pagina
  const hasInitialized = useRef(false);

  const isAdmin = user?.publicMetadata?.role === 'admin';
  const active  = isSignedIn && (isAdmin || isBartleby);

  const poll = useCallback(async () => {
    if (!active) return;
    try {
      const token   = await getToken();
      if (!token) return;
      const outputs = await getMyOutputDocuments(token);
      if (!outputs.length) {
        hasInitialized.current = true;
        return;
      }

      const seenIds = getSeenIds();

      if (!hasInitialized.current) {
        // Prima esecuzione: marca tutto come visto senza notificare
        markSeen(outputs.map((o: OutputDocument) => o.bartlebyId));
        hasInitialized.current = true;
        return;
      }

      const newOutput = outputs.find((o: OutputDocument) => !seenIds.has(o.bartlebyId));
      if (newOutput) {
        markSeen([newOutput.bartlebyId]);
        setNotification({ outputId: newOutput.bartlebyId, title: newOutput.title });
      }
    } catch { /* polling silenzioso */ }
  }, [active, getToken]);

  useEffect(() => {
    if (!active) return;
    // NON resettare hasInitialized qui: sopravvive ai cambi di pagina perché
    // AppLayout non si smonta. Resettarlo causerebbe la ri-marcatura di tutti
    // gli output come "visti" ogni volta che active cambia (es. durante il loading Clerk).
    poll();
    const interval = setInterval(poll, POLL_MS);
    return () => clearInterval(interval);
  }, [active, poll]);

  const handleView = () => {
    if (!notification) return;
    navigate(`/bartleby/outputs/${notification.outputId}`);
    setNotification(null);
  };

  return (
    <Snackbar
      open={!!notification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      onClose={() => setNotification(null)}
    >
      <Alert
        severity="success"
        onClose={() => setNotification(null)}
        action={
          <Button color="inherit" size="small" onClick={handleView}>
            Visualizza
          </Button>
        }
        sx={{ alignItems: 'center' }}
      >
        Output pronto: <strong>{notification?.title}</strong>
      </Alert>
    </Snackbar>
  );
}
