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
      className="flex flex-col items-center gap-6 p-10 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50/80 hover:border-gray-400 transition-all duration-300 bg-gray-50/40"
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <div className="flex flex-col items-center gap-3">
        <Upload className="w-12 h-12 text-gray-600 animate-pulse" />
        <span className="text-xl font-medium text-gray-700">上传 JSON 文件</span>
        <p className="text-sm text-gray-500">点击或拖拽文件到此处</p>
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
        className="mt-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-[0_4px_20px_-5px_rgba(59,130,246,0.5)]"
        onClick={(e) => {
          e.stopPropagation()
          document.getElementById('file-upload')?.click()
        }}
      >
        选择文件
      </Button>
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}