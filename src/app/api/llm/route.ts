import { NextResponse } from 'next/server'

interface LLMConfig {
  apiEndpoint: string
  apiKey: string
  model: string
}

export async function POST(request: Request) {
  try {
    const { config, prompt, data } = await request.json()

    if (!config || !prompt || !data || !Array.isArray(data)) {
      return NextResponse.json(
        { error: '请求参数不完整' },
        { status: 400 }
      )
    }

    const results = await Promise.all(
      data.map(async (item) => {
        // 处理提示词中的列名占位符
        let processedPrompt = prompt
        Object.keys(item).forEach(key => {
          const placeholder = `{${key}}`
          if (processedPrompt.includes(placeholder)) {
            const value = typeof item[key] === 'object' ? 
              JSON.stringify(item[key]) : 
              String(item[key])
            processedPrompt = processedPrompt.replace(
              new RegExp(placeholder, 'g'), 
              value
            )
          }
        })
        
        const response = await fetch(config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          },
          body: JSON.stringify({
            model: config.model,
            messages: [
              { role: 'user', content: processedPrompt }
            ]
          })
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`API请求失败: ${response.statusText}\n详细信息: ${errorText}`)
        }

        const result = await response.json()
        return {
          ...item,
          llm_response: result.choices[0]?.message?.content
        }
      })
    )

    return NextResponse.json({ results })
  } catch (error) {
    console.error('LLM处理错误:', error)
    return NextResponse.json(
      { error: '处理过程中发生错误' },
      { status: 500 }
    )
  }
}