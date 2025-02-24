'use client'

import * as React from "react"
import { FileUpload } from "@/components/file-upload"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { LLMProcessPanel } from "@/components/ui/llm-process-panel"
import exampleData from '../../example.json'

export default function Home() {
  const [data, setData] = React.useState<any[]>([])
  const [columns, setColumns] = React.useState<any[]>([])
  const [selectedRows, setSelectedRows] = React.useState<any[]>([])
  const [hasChanges, setHasChanges] = React.useState(false)
  const [showLLMPanel, setShowLLMPanel] = React.useState(false)
  const [lastPrompt, setLastPrompt] = React.useState("")

  const handleLLMProcess = async (config: any, prompt: string) => {
    setLastPrompt(prompt)
    try {
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          config,
          prompt,
          data: selectedRows
        })
      })
    
      if (!response.ok) {
        throw new Error('处理请求失败')
      }
    
      const { results } = await response.json()
      
      // 更新处理后的数据
      const updatedData = data.map(item => {
        const selectedIndex = selectedRows.findIndex(row => 
          Object.keys(row).every(key => 
            key !== 'llm_result' && 
            JSON.stringify(row[key]) === JSON.stringify(item[key])
          )
        )
        if (selectedIndex !== -1) {
          return { ...item, llm_result: results[selectedIndex].llm_response }
        }
        return item
      })
    
      setData(updatedData)
      
      // 添加结果列
      if (!columns.find(col => col.accessorKey === 'llm_result')) {
        setColumns([
          ...columns,
          {
            accessorKey: 'llm_result',
            header: 'LLM处理结果',
            cell: ({ row }) => {
              const value = row.getValue('llm_result')
              return typeof value === 'object' ? JSON.stringify(value) : String(value)
            },
          },
        ])
      }
      
      setHasChanges(true)
      // 移除自动隐藏面板的代码
      // setShowLLMPanel(false)
    } catch (error) {
      console.error('LLM处理错误:', error)
      alert('处理过程中发生错误')
    }
  }

  const [newColumnName, setNewColumnName] = React.useState('')
  const [sourceColumn, setSourceColumn] = React.useState('')
  const [targetColumn, setTargetColumn] = React.useState('')

  const handleAddColumn = (columnName: string) => {
    if (!columns.find(col => col.accessorKey === columnName)) {
      const newColumn = {
        accessorKey: columnName,
        header: columnName,
        cell: ({ row }) => {
          const value = row.getValue(columnName)
          return typeof value === 'object' ? JSON.stringify(value) : String(value)
        },
      }
      setColumns([...columns, newColumn])
      
      const updatedData = data.map(item => ({
        ...item,
        [columnName]: ''
      }))
      setData(updatedData)
      setHasChanges(true)
    }
  }

  const handleCopyColumn = (source: string, target: string) => {
    const updatedData = data.map(item => ({
      ...item,
      [target]: item[source]
    }))
    setData(updatedData)
    setHasChanges(true)
  }

  React.useEffect(() => {
    if (data.length === 0) {
      handleFileSelect(exampleData)
    }
  }, [])

  const handleFileSelect = (jsonData: any) => {
    if (!Array.isArray(jsonData)) {
      jsonData = [jsonData]
    }
    setData(jsonData)

    // 从数据中提取列定义
    if (jsonData.length > 0) {
      const sampleData = jsonData[0]
      const cols = Object.keys(sampleData).map((key) => ({
        accessorKey: key,
        header: key,
        cell: ({ row }) => {
          const value = row.getValue(key)
          return typeof value === 'object' ? JSON.stringify(value) : String(value)
        },
      }))
      setColumns(cols)
    }
  }

  const handleRowSelect = (rows: any[]) => {
    setSelectedRows(rows)
    setShowLLMPanel(rows.length > 0)
  }

  const handleDataChange = (updatedData: any[]) => {
    setData(updatedData)
    setHasChanges(true)
  }

  const handleSaveChanges = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'modified_data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setHasChanges(false)
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold text-center">数据处理工作台</h1>
      
      {data.length === 0 ? (
        <FileUpload onFileSelect={handleFileSelect} />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">数据预览</h2>
            <div className="flex gap-2">
              {hasChanges && (
                <Button onClick={handleSaveChanges}>
                  保存修改
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setData([])
                  setColumns([])
                  setSelectedRows([])
                  setHasChanges(false)
                  setShowLLMPanel(false)
                }}
              >
                上传新文件
              </Button>
            </div>
          </div>

          <div className="flex gap-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">新增列</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="输入新列名"
                  className="px-2 py-1 border rounded text-foreground bg-background hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    if (newColumnName.trim()) {
                      handleAddColumn(newColumnName.trim())
                      setNewColumnName('')
                    }
                  }}
                >
                  添加
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">复制列值</h3>
              <div className="flex gap-2">
                <select
                  className="px-2 py-1 border rounded text-foreground bg-background hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={sourceColumn}
                  onChange={(e) => setSourceColumn(e.target.value)}
                >
                  <option value="">选择源列</option>
                  {columns.map((col) => (
                    <option key={col.accessorKey} value={col.accessorKey}>
                      {col.header}
                    </option>
                  ))}
                </select>
                <select
                  className="px-2 py-1 border rounded text-foreground bg-background hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={targetColumn}
                  onChange={(e) => setTargetColumn(e.target.value)}
                >
                  <option value="">选择目标列</option>
                  {columns.map((col) => (
                    <option key={col.accessorKey} value={col.accessorKey}>
                      {col.header}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (sourceColumn && targetColumn) {
                      handleCopyColumn(sourceColumn, targetColumn)
                      setSourceColumn('')
                      setTargetColumn('')
                    }
                  }}
                >
                  复制
                </Button>
              </div>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={data}
            onRowSelect={handleRowSelect}
            onDataChange={handleDataChange}
          />
        </div>
      )}
      
      {showLLMPanel && (
        <LLMProcessPanel
          selectedRows={selectedRows}
          onProcess={handleLLMProcess}
          onCancel={() => setShowLLMPanel(false)}
          initialPrompt={lastPrompt}
        />
      )}
    </div>
  )
}
