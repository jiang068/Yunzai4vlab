import fetch from 'node-fetch';

export class greetings extends plugin {
    constructor() {
        super({
            name: "GPT回复",
            event: "message",
            priority: 4996,
            rule: [
                {
                    reg: '^GPT\\s+([\\s\\S]+)$',
                    fnc: 'gptans'
                },
            ]
        });

        // 在代码中设置 API Key
        this.config = {
            GPTKey: 'your-gpt-key', // 在这里直接配置 API Key；具体见https://github.com/chatanywhere/GPT_API_free/
            GPTUrl: 'https://api.chatanywhere.tech/v1/chat/completions',  //这里配置你的GPT服务的API地址
            GPTModel: 'gpt-3.5-turbo' ,                           //这里配置你的GPT模型种类
            DefaultPersonalitySwitch: true,
            DefaultPersonality: [
                { "role": "system", "content": "你是一只猫娘，语气词用喵。" }  //这里更改你的GPT的人格预设
            ],
            CustomPersonality: []
        };

        this.messageHistory = [];
    }

    // 获取个性化配置
    async getPersonality() {
        const Config = this.config;
        if (Config.DefaultPersonalitySwitch) {
            return Config.DefaultPersonality;
        } else {
            return Config.CustomPersonality || [];
        }
    }

    // 调用GPT API
    async gpt(messages, GPTKey = null, GPTUrl = null, GPTModel = null) {
        const Config = this.config;

        // 使用配置中的值
        GPTKey = GPTKey || Config.GPTKey;
        GPTUrl = GPTUrl || Config.GPTUrl;
        GPTModel = GPTModel || Config.GPTModel;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GPTKey}`,
                'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "model": GPTModel,
                "messages": messages
            })
        };

        try {
            const response = await fetch(GPTUrl, requestOptions);
            const result = await response.json();
            if (!response.ok) {
                console.error(`API错误: ${result.error.message}`);
                return `调用 GPT API 时发生错误喵: ${result.error.message}`;
            }
            return result.choices[0].message.content;
        } catch (error) {
            console.error('调用GPT API出错', error);
            return '调用 GPT API 时发生错误喵。';
        }
    }

    // 处理以“GPT”开头的消息
    async gptans(e) {
        if (!this.config.GPTKey) {
            console.log('未配置GPTKey');
            return false;
        }

        const messageMatch = typeof e.msg === 'string' && e.msg.match(/^GPT\s+([\s\S]+)$/);
        if (!messageMatch) {
            console.error('消息格式错误或正则匹配失败');
            return false;
        }

        const message = messageMatch[1];

        if (message.length > 1000) {                             //这里配置最多多少字
            e.reply('消息过长，请控制在1000字符以内喵。', true);
            return false;
        }

        const isCode = /[\r\n]+/.test(message);
        let formattedMessage = isCode ? `\`\`\`\n${message}\n\`\`\`` : message;

        this.messageHistory.push({ "role": "user", "content": formattedMessage });

        if (this.messageHistory.length > 25) {                              //这里配置最多缓存多少条历史消息，缓存重启后失效
            this.messageHistory = this.messageHistory.slice(-25);
        }

        let gptmsg = [];

        try {
            const personality = await this.getPersonality();
            gptmsg = Array.isArray(personality) ? personality : [];
        } catch (error) {
            console.error('获取个性化配置出错', error);
            gptmsg = [];
        }

        gptmsg.push(...this.messageHistory);

        console.log(`发送给 GPT 的消息: ${JSON.stringify(gptmsg)}`);

        try {
            const content = await this.gpt(gptmsg);

            if (content === true) {
                console.log('[GPT]key或url配置错误喵。');
                return false;
            }

            this.messageHistory.push({ "role": "assistant", "content": content });

            e.reply(content, true);
        } catch (error) {
            console.error('调用GPT API出错', error);
            e.reply('调用 GPT API 时发生错误喵。', true); // 在回复中处理错误
            return false;
        }

        return true;
    }
}
