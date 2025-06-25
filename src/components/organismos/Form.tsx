import { useState } from "react";
import Boton from "../atomos/Boton";

export type FormField = {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  options?: Array<string | { value: string | number; label: string }>;
};

type Props<T extends Record<string, any>> = {
  fields: FormField[];
  onSubmit: (values: T) => void;
  buttonText: string;
  initialValues?: Partial<T>;
  className?: string;
};

const Form = <T extends Record<string, any>>({ fields, onSubmit, buttonText = "Enviar", initialValues = {}, className = "" }: Props<T>) => {
  const [formData, setFormData] = useState<Partial<T>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as T);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 p-4 border rounded-lg shadow-md ${className}`}>
      {fields.map((field) => (
        <div key={field.key} className="flex flex-col">
          <label className={`font-semibold text-emerald-300`}>{field.label}</label>
          {field.type === "select" ? (
            <select
              required={field.required}
              value={formData[field.key] || ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(field.key, e.target.value)}
              className={`border p-2 rounded bg-slate-800 text-white border-slate-700 focus:border-emerald-400 focus:outline-none`}
            >
              <option key="default-option" value="">Seleccione...</option>
              {field.options?.map((option, idx) => {
                if (typeof option === 'string') {
                  return (
                    <option key={`str-${option}-${idx}`} value={option}>
                      {option}
                    </option>
                  );
                } else {
                  return (
                    <option key={`obj-${option.value}`} value={option.value}>
                      {option.label}
                    </option>
                  );
                }
              })}
            </select>
          ) : (
            <input
              type={field.type}
              required={field.required}
              value={formData[field.key] || ""}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className={`border p-2 rounded bg-slate-800 text-white border-slate-700 focus:border-emerald-400 focus:outline-none`}
            />
          )}
          {errors[field.key] && (
            <span className={`text-red-600 text-xs mt-1`}>{errors[field.key]}</span>
          )}
        </div>
      ))}
      <Boton color="primary" variant="shadow" type="submit">
        {buttonText}
      </Boton>
    </form>
  );
};

export default Form;
