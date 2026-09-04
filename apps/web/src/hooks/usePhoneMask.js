import { useState, useCallback } from 'react';

export function usePhoneMask(initialValue = '+998') {
  const [value, setValue] = useState(initialValue);
  const [rawValue, setRawValue] = useState('');

  const formatPhone = useCallback((input) => {
    const digits = input.replace(/\D/g, '');
    
    if (!digits.startsWith('998')) {
      if (digits.length === 0) return '+998';
      return '+998' + digits;
    }
    
    const rest = digits.slice(3);
    if (rest.length === 0) return '+998';
    if (rest.length <= 2) return `+998 ${rest}`;
    if (rest.length <= 5) return `+998 ${rest.slice(0, 2)} ${rest.slice(2)}`;
    if (rest.length <= 7) return `+998 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`;
    if (rest.length <= 9) return `+998 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5, 7)} ${rest.slice(7)}`;
    return `+998 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5, 7)} ${rest.slice(7, 9)}`;
  }, []);

  const handleChange = useCallback((e) => {
    const input = e.target.value;
    const formatted = formatPhone(input);
    setValue(formatted);
    
    const digits = input.replace(/\D/g, '');
    const uzDigits = digits.startsWith('998') ? digits.slice(3) : digits;
    setRawValue(uzDigits);
  }, [formatPhone]);

  const reset = useCallback(() => {
    setValue('+998');
    setRawValue('');
  }, []);

  const isComplete = rawValue.length === 9;

  return {
    value,
    rawValue,
    formattedValue: value,
    isComplete,
    handleChange,
    reset,
    setValue: (v) => {
      const formatted = formatPhone(v);
      setValue(formatted);
      const digits = v.replace(/\D/g, '');
      const uzDigits = digits.startsWith('998') ? digits.slice(3) : digits;
      setRawValue(uzDigits);
    }
  };
}