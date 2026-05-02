import { GuardrailControl } from '../../data/corso-fase2/types';

interface Props {
  control: GuardrailControl;
  inline?: boolean;
}

export default function GuardrailBadge({ control, inline = false }: Props) {
  return (
    <div className={`cf2-guardrail ${inline ? 'cf2-guardrail--inline' : ''}`}>
      <span className="cf2-guardrail__icon" aria-hidden>🛡</span>
      <div className="cf2-guardrail__body">
        <div className="cf2-guardrail__head">
          <span className="cf2-guardrail__code">{control.code}</span>
          <span className="cf2-guardrail__label">{control.label}</span>
        </div>
        {(control.text || control.domanda) && (
          <p className="cf2-guardrail__text">{control.text ?? control.domanda}</p>
        )}
      </div>
    </div>
  );
}
