import * as React from "react"
import { Textarea } from "./textarea"

interface EditableCellProps {
  value: any
  row: any
  column: any
  onValueChange: (value: any) => void
}

export function EditableCell({
  value: initialValue,
  row,
  column,
  onValueChange,
}: EditableCellProps) {
  const [value, setValue] = React.useState(initialValue)
  const [isEditing, setIsEditing] = React.useState(false)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = React.useCallback(() => {
    setIsEditing(false)
    if (value !== initialValue) {
      onValueChange(value)
    }
  }, [value, initialValue, onValueChange])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      setValue(initialValue)
      setIsEditing(false)
    }
  }, [initialValue])

  if (isEditing) {
    return (
      <div className="w-full h-full">
        <Textarea
          value={typeof value === 'object' ? JSON.stringify(value) : String(value)}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full min-h-[4rem] p-2 rounded resize-none cursor-text hover:bg-muted/50"
          autoFocus
        />
      </div>
    )
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="w-full h-full cursor-pointer hover:bg-muted/50 p-2 rounded overflow-hidden relative group"
      title={typeof value === 'object' ? JSON.stringify(value) : String(value)}
    >
      <div className="line-clamp-3 whitespace-pre-wrap break-words group-hover:opacity-0 transition-opacity">
        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
      </div>
      <div className="absolute left-0 right-0 top-0 bottom-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity p-2 overflow-auto whitespace-pre-wrap break-words">
        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
      </div>
    </div>
  )
}