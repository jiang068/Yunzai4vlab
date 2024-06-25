import fetch from 'node-fetch';

// 定义别名对象，给她起名字！！！
const aliases = {
    "nickname1": "小艾",
    //"nickname2": "小乐",
    //"nickname3": "其它别名"
};

export class greetings extends plugin {
    constructor() {
        super({
            name: "GPT回复",
            event: "message",
            priority: 4996,
            rule: []
        });

        // 动态生成正则表达式并设置规则
        this.rule = [
            {
                reg: this.generateRegex(), // 使用动态生成的正则表达式
                fnc: 'gptans'
            },
        ];

        // 直接在代码中设置 API Key
        this.config = {
            GPTKey: 'your-gpt-key',                                                // 在这里直接配置 API Key！！！
            GPTUrl: 'https://api.chatanywhere.tech/v1/chat/completions',           // 在这里配置服务商地址
            GPTModel: 'gpt-3.5-turbo',                                             // 模型名称
            DefaultPersonalitySwitch: true,
            DefaultPersonality: [
                { "role": "system", "content": "你是一只猫娘，语气词用喵。" }         //撰写人物预设，我写的是猫娘
            ],
            CustomPersonality: []
        };
    }

    // 动态生成正则表达式
    generateRegex() {
        const aliasesRegex = Object.keys(aliases).map(alias => aliases[alias]).join('|');
        return new RegExp(`^(GPT|${aliasesRegex})([\\s\\S]*)$`, 'i');
    }

    // 获取个性化配置
    async getPersonality() {
        const Config = this.config;
        return Config.DefaultPersonalitySwitch ? Config.DefaultPersonality : Config.CustomPersonality;
    }

    // 调用GPT API
    async gpt(messages, GPTKey = null, GPTUrl = null, GPTModel = null) {
        const Config = this.config;
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

    // 处理以“GPT”或别名开头的消息
    async gptans(e) {
        if (!this.config.GPTKey) {
            console.log('未配置GPTKey');
            return false;
        }

        const regex = this.generateRegex();
        const messageMatch = typeof e.msg === 'string' && e.msg.match(regex);
        if (!messageMatch) {
            console.error('消息格式错误或正则匹配失败');
            return false;
        }

        const alias = Object.keys(aliases).find(alias => aliases[alias].toLowerCase() === messageMatch[1].toLowerCase());
        if (!alias) {
            console.error('未知别名');
            return false;
        }

        const message = messageMatch[2].trim(); // 使用匹配的第二组内容
        if (message.length > 1000) {
            e.reply('消息过长，请控制在1000字符以内喵。', true);
            return false;
        }

        const isCode = /[\r\n]+/.test(message);
        let formattedMessage = isCode ? `\`\`\`\n${message}\n\`\`\`` : message;

        let gptmsg = [];

        try {
            const personality = await this.getPersonality();
            gptmsg = Array.isArray(personality) ? personality : [];
        } catch (error) {
            console.error('获取个性化配置出错', error);
            gptmsg = [];
        }

        gptmsg.push({ "role": "user", "content": formattedMessage });

        console.log(`发送给 GPT 的消息: ${JSON.stringify(gptmsg)}`);

        try {
            const content = await this.gpt(gptmsg);

            if (content === true) {
                console.log('[GPT]key或url配置错误');
                return false;
            }

            e.reply(content, true);
        } catch (error) {
            console.error('调用GPT API出错', error);
            e.reply('调用 GPT API 时发生错误喵。', true); // 在回复中处理错误
            return false;
        }

        return true;
    }
}
