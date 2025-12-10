import { useState } from "react";

export function useForm<T extends Record<string, any>>(initialState: T) {
  const [formData, setFormData] = useState<T>(initialState);

  const setFormValues = (values: Partial<T>) =>
    setFormData((prev) => ({ ...prev, ...values }));

  const bindInput = (name: keyof T) => ({
    name,
    value: formData[name],
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value,
      }));
    },
  });

  const bindSelect = (name: keyof T) => ({
    value: formData[name],
    onValueChange: (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
  });

  const resetForm = () => setFormData(initialState);

  return {
    formData,
    setFormData,
    bindInput,
    bindSelect,
    resetForm,
    setFormValues,
  };
}
