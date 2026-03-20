import axios from 'axios';
import * as vscode from 'vscode';

export interface GeminiResponse {
    candidates: Array<{
        finishReason?: string;
        content: {
            parts: Array<{
                text: string;
            }>;
        };
    }>;
    promptFeedback?: {
        blockReason?: string;
    };
}

export class GeminiService {
    private static readonly DEFAULT_MODEL = 'gemini-3.1-pro-preview';
    private static readonly FALLBACK_MODELS = [
        'gemini-2.5-pro',
        'gemini-3-flash-preview',
        'gemini-3.1-pro-preview',
        'gemini-3-pro-preview'
    ];

    private apiKey: string = '';
    private model: string = GeminiService.DEFAULT_MODEL;
    private readonly baseUrl ='https://generativelanguage.googleapis.com/v1beta/models';
    private readonly baseUrlV1 = 'https://generativelanguage.googleapis.com/v1/models';

    constructor() {
        this.updateConfig();
    }

    public updateConfig(): void {
        const config = vscode.workspace.getConfiguration('vscode-gemini');
        this.apiKey = config.get<string>('apiKey') || '';
        this.model = config.get<string>('model') || GeminiService.DEFAULT_MODEL;
    }

    public async generateContent(prompt: string): Promise<string> {
        if (!this.apiKey) {
            throw new Error('请先在设置中配置Gemini API Key');
        }

        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                // 移除maxOutputTokens限制，让API返回完整回答
            }
        };

        try {
            const response = await this.requestGenerateContent(requestBody);

            if (response.data.candidates && response.data.candidates.length > 0) {
                const content = response.data.candidates[0].content;
                if (content.parts && content.parts.length > 0) {
                    const mergedText = content.parts.map(part => part.text || '').join('').trim();
                    if (mergedText) {
                        return mergedText;
                    }
                }
            }

            if (response.data.promptFeedback?.blockReason) {
                throw new Error(`请求被模型安全策略拦截: ${response.data.promptFeedback.blockReason}`);
            }

            throw new Error('未收到有效的AI响应');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('API Key无效，请检查配置');
                } else if (error.response?.status === 429) {
                    throw new Error('API调用频率过高，请稍后重试');
                } else if (error.code === 'ECONNABORTED') {
                    throw new Error('请求超时，请检查网络连接');
                }
                throw new Error(`API请求失败: ${error.response?.data?.error?.message || error.message}`);
            }
            throw error;
        }
    }

    private async requestGenerateContent(requestBody: unknown) {
        const tryRequest = (baseUrl: string, model: string) => {
            const url = `${baseUrl}/${model}:generateContent?key=${this.apiKey}`;
            return axios.post<GeminiResponse>(url, requestBody, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            });
        };

        const modelsToTry = [
            this.model,
            ...GeminiService.FALLBACK_MODELS.filter(model => model !== this.model)
        ];

        let lastError: unknown;

        for (const model of modelsToTry) {
            try {
                const response = await tryRequest(this.baseUrlV1, model);
                if (model !== this.model) {
                    this.model = model;
                }
                return response;
            } catch (errorV1) {
                if (
                    axios.isAxiosError(errorV1) &&
                    (errorV1.response?.status === 404 || errorV1.response?.status === 400)
                ) {
                    try {
                        const response = await tryRequest(this.baseUrl, model);
                        if (model !== this.model) {
                            this.model = model;
                        }
                        return response;
                    } catch (errorV1beta) {
                        lastError = errorV1beta;
                        if (!this.isModelUnavailableError(errorV1beta)) {
                            throw errorV1beta;
                        }
                        continue;
                    }
                }

                lastError = errorV1;
                if (!this.isModelUnavailableError(errorV1)) {
                    throw errorV1;
                }
            }
        }

        throw lastError;
    }

    private isModelUnavailableError(error: unknown): boolean {
        if (!axios.isAxiosError(error)) {
            return false;
        }

        const status = error.response?.status;
        const message = String(error.response?.data?.error?.message || error.message || '').toLowerCase();

        if (status === 404) {
            return true;
        }

        return message.includes('is not found') || message.includes('not supported for generatecontent');
    }

    public async askAboutCode(code: string, question: string): Promise<string> {
        const prompt = `
请分析代码并回答问题：

代码：
\`\`\`
${code}
\`\`\`

问题：${question}

要求：用中文详细回答问题，提供完整和有用的信息。
        `;

        return this.generateContent(prompt);
    }

    public async explainCode(code: string): Promise<string> {
        const prompt = `
请分析以下代码并用中文解释：

\`\`\`
${code}
\`\`\`

要求：
1. 简洁清晰地说明代码的主要功能
2. 解释关键的实现逻辑
3. 提供完整的分析，但保持语言简洁
        `;

        return this.generateContent(prompt);
    }
} 
