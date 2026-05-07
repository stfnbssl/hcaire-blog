# Fixture per i viewer di output pipeline

Fixture JSON realistiche per smoke-test manuale dei sub-viewer F2 e F3.
Ogni file rispetta lo schema dello step corrispondente
(`Sviluppo Bambino/input/produzioni/<step-folder>/<step>-schema.json`).

## Step coperti

| File                | Step          | Schema sorgente                              |
|---------------------|---------------|----------------------------------------------|
| `f2_step_2a.json`   | f2_step_2a    | `f2-step-2a-verifica-nodi-trasversali`       |
| `f2_step_4b.json`   | f2_step_4b    | `f2-step-4b-ce-prototipica`                  |
| `f2_step_6.json`    | f2_step_6     | `f2-step-6-output-tipo-vuoto`                |
| `f3_step_1.json`    | f3_step_1     | `f3-step-1-nodo-funzione`                    |
| `f3_step_2.json`    | f3_step_2     | `f3-step-2-micro-dispositivo`                |
| `f3_step_3.json`    | f3_step_3     | `f3-step-3-stress-test`                      |
| `f3_step_4.json`    | f3_step_4     | `f3-step-4-coerenza`                         |
| `f3_step_5.json`    | f3_step_5     | `f3-step-5-output-tipo-contestualizzato`     |

## Come usarle

### Smoke-test manuale (consigliato finché non c'è infra Vitest)

1. `npm run dev` nel client.
2. Naviga sulla pagina di un'execution (es. dal Workbench).
3. Per testare uno step senza un'execution reale, importa la fixture in una pagina di sandbox:

```tsx
import fixture from '.../__fixtures__/f3_step_4.json';
import F3OutputViewer from '.../F3OutputViewer';

<F3OutputViewer stepId="f3_step_4" data={fixture} />
```

### Verifica regressioni

Quando arriverà un viewer test runner (vitest), questi file diventano l'input
canonico dei test di rendering: il viewer deve montare senza throw e mostrare
i campi principali.

## Mantenimento

- Una fixture per step. Se cambia lo schema dello step, aggiornare la fixture.
- I dati sono inventati ma plausibili nel dominio "sviluppo del bambino".
- Tenere i campi `minLength` rispettati (es. `motivation` ≥ 20-30 caratteri).
