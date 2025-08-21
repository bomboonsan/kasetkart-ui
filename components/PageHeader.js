import Button from './Button'

export default function PageHeader({ title, showAddButton = false, onAddClick }) {
  return (
    <div className="text-zinc-900 pt-4 rounded-md">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">{title}</h2>
        {showAddButton && (
          <Button
            onClick={onAddClick}
            variant="secondary"
          >
            เพิ่มรายการ
          </Button>
        )}
      </div>
    </div>
  )
}
