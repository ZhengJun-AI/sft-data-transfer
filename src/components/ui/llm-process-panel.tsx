import * as React from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Textarea } from "./textarea"
import config from "@/config/config"
import { LLMConfig } from "@/types/llm"

interface LLMProcessPanelProps {
  selectedRows: any[]
  onProcess: (config: LLMConfig, prompt: string) => void
  onCancel: () => void
  initialPrompt?: string
}

export function LLMProcessPanel({
  selectedRows,
  onProcess,
  onCancel,
  initialPrompt = "",
}: LLMProcessPanelProps) {
  const [prompt, setPrompt] = React.useState(initialPrompt)
  const [isProcessing, setIsProcessing] = React.useState(false)

  // 当initialPrompt改变时更新prompt状态
  React.useEffect(() => {
    setPrompt(initialPrompt)
  }, [initialPrompt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    const llmConfig = {
      apiEndpoint: process.env.NEXT_PUBLIC_LLM_API_ENDPOINT,
      apiKey: process.env.NEXT_PUBLIC_LLM_API_KEY,
      model: process.env.NEXT_PUBLIC_LLM_MODEL,
    }
    try {
      await onProcess(llmConfig, prompt)
      // 移除清空提示词的代码，保持当前提示词不变
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background relative">
      {isProcessing && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="text-sm text-muted-foreground">处理中...</div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">LLM处理配置</h3>
        <span className="text-sm text-muted-foreground">
          已选择 {selectedRows.length} 项
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="prompt">处理提示词</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="请输入提示词，使用{列名}引用特定列的内容"
              className="min-h-[100px]"
              disabled={isProcessing}
            />
            <p className="text-sm text-muted-foreground">
              提示：使用 {'{列名}'} 格式引用数据中的特定列内容，例如："请将{'{title}'}翻译成英文"
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel} disabled={isProcessing}>取消</Button>
            <Button onClick={handleSubmit} disabled={isProcessing}>
              {isProcessing ? "处理中..." : "处理"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}