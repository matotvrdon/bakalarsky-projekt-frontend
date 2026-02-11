type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
};

export default function TextAreaField({ label, value, onChange, placeholder, rows = 6 }: Props) {
  return (
    <div className="admin-field admin-field--full">
      <label className="admin-label">{label}</label>
      <textarea
        className="admin-input"
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
