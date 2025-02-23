import * as React from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { isValidJSON } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect: (data: any) => void
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [error, setError] = React.useState<string | null>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      if (!isValidJSON(text)) {
        setError("Invalid JSON file")
        return
      }

      const data = JSON.parse(text)
      setError(null)
      onFileSelect(data)
    } catch (err) {
      setError("Error reading file")
    }
  }

  return (
    <div 
      className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <div className="flex items-center gap-2">
        <Upload className="w-8 h-8 text-gray-500" />
        <span className="text-lg font-medium">上传 JSON 文件</span>
      </div>
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <Button 
        variant="default" 
        size="lg"
        className="mt-2 font-semibold shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        选择文件
      </Button>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}