import { type Accessor, createSignal } from 'solid-js';

export interface CreateValidatedStateValue<T> {
  value: Accessor<T>;
  lastValidValue: Accessor<T | undefined>;
  valid: Accessor<boolean>;
}

export type CreateValidatedStateReturnValue<T> = [
  CreateValidatedStateValue<T>,
  (value: T) => void,
];

export function createValidatedState<T>(
  initialValue: T,
  validate: (value: T) => boolean,
  initialValidationState?: boolean
): CreateValidatedStateReturnValue<T> {
  const [value, setValue] = createSignal<T>(initialValue);
  const [lastValidValue, setLastValidValue] = createSignal<T | undefined>(
    validate(initialValue) ? initialValue : undefined
  );
  const [valid, setValid] = createSignal(
    typeof initialValidationState === 'boolean' ? initialValidationState : validate(initialValue)
  );

  const onChange = (val: T) => {
    if (validate(val)) {
      setLastValidValue(() => val);
      setValid(true);
    } else {
      setValid(false);
    }

    setValue(() => val);
  };

  return [{ value, lastValidValue, valid }, onChange];
}
