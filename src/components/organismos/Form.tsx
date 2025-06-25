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
  // Log para depurar valores iniciales
  console.log('Form initialValues:', initialValues);
  
  // Asegurarse de que los valores iniciales sean cadenas
  const processedInitialValues: Record<string, string> = {};
  Object.keys(initialValues).forEach(key => {
    const value = initialValues[key];
    processedInitialValues[key] = value !== null && value !== undefined ? String(value) : '';
  });
  
  const [formData, setFormData] = useState<Record<string, string>>(processedInitialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  console.log('Form processed initialValues:', processedInitialValues);
  console.log('Form formData state:', formData);

  const handleChange = (key: string, value: string) => {
    console.log(`Changing field ${key} to value:`, value);
    setFormData((prev) => {
      const newData = { ...prev, [key]: value };
      console.log('Updated formData:', newData);
      return newData;
    });
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitting with data:', formData);
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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                console.log(`Select changed: ${field.key} = ${e.target.value}`);
                handleChange(field.key, e.target.value);
              }}
              className={`border p-2 rounded text-slate-950 focus:border-emerald-400 focus:outline-none`}
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
                  // Asegurarse de que el valor sea una cadena
                  const optionValue = String(option.value);
                  return (
                    <option key={`obj-${optionValue}-${idx}`} value={optionValue}>
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
              className={`border p-2 rounded border-slate-700 focus:border-emerald-400 focus:outline-none`}
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
