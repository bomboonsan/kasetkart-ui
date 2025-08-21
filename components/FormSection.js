export default function FormSection({ title, children }) {
  return (
    <div className="space-y-4">
      <h3
        className={`text-lg font-medium text-gray-900 ${title ? 'border-b border-b-gray-100 pb-2' : ''}`}
      >
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
