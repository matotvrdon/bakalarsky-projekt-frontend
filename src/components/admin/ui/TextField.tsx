type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "date" | "time";
};

export default function TextField({ label, value, onChange, placeholder, type = "text" }: Props) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      <input
        type={type}
        className="admin-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        lang={type === "time" ? "en-GB" : undefined}
      />
    </div>
  );
}

