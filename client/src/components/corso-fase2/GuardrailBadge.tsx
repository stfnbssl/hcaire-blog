import { GuardrailControl } from '../../data/corso-fase2/types';

interface Props {
  control: GuardrailControl;
  inline?: boolean;
}

export default function GuardrailBadge({ control, inline = false }: Props) {
  return (
    <div className={`corso-guardrail ${inline ? 'corso-guardrail--inline' : ''}`}>
      <span className="corso-guardrail__icon" aria-hidden>ðŸ›¡</span>
      <div className="corso-guardrail__body">
        <div className="corso-guardrail__head">
          <span className="corso-guardrail__code">{control.code}</span>
          <span className="corso-guardrail__label">{control.label}</span>
        </div>
        {(control.text || control.domanda) && (
          <p className="corso-guardrail__text">{control.text ?? control.domanda}</p>
        )}
      </div>
    </div>
  );
}
