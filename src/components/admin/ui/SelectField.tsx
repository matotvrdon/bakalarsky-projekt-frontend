import type { ReactNode } from "react";

type Option = {
  value: string | number;
  label: ReactNode;
};

type Props = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
};

export default function SelectField({ label, value, onChange, options, placeholder }: Props) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      <select
        className="admin-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

