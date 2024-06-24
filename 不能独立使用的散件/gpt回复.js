import { gpt, getPersonality } from '../utils/getdate.js';
import setting from "../model/setting.js";

// 一个gpt3.5回复插件
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

        // 初始化消息历史记录
        this.messageHistory = [];
    }

    get GPTconfig() {
        return setting.getConfig("GPTconfig");
    }

    // 处理以“GPT”开头的消息
    async gptans(e) {
        // 检查是否配置了 GPTKey
        if (!this.GPTconfig.GPTKey) {
            logger.info('未配置GPTKey');
            return false;
        }

        // 确保 e.msg 是字符串并进行匹配
        const messageMatch = typeof e.msg === 'string' && e.msg.match(/^GPT\s+([\s\S]+)$/);
        if (!messageMatch) {
            logger.error('消息格式错误或正则匹配失败');
            return false;
        }

        // 提取“GPT”后的内容，保留格式，包括换行符
        const message = messageMatch[1];

        // 检查消息长度，调整为适合代码的长度，例如 1000 字符
        if (message.length > 1000) {  // 调整为更大的限制
            e.reply('消息过长，请控制在1000字符以内。', true);
            return false;
        }

        // 检测是否包含代码，简单检测多行内容
        const isCode = /[\r\n]+/.test(message);
        let formattedMessage;

        if (isCode) {
            // 如果检测到多行内容（可能是代码），则使用 Markdown 的代码块标记
            formattedMessage = `\`\`\`\n${message}\n\`\`\``;
        } else {
            // 否则直接使用原内容
            formattedMessage = message;
        }

        // 更新消息历史记录，保留原始格式
        this.messageHistory.push({ "role": "user", "content": formattedMessage });

        // 清理历史记录，保留最近25条
        if (this.messageHistory.length > 25) {
            this.messageHistory = this.messageHistory.slice(-25);
        }

        let gptmsg = await getPersonality();
        // 将历史记录插入上下文，而不是覆盖
        gptmsg.push(...this.messageHistory);

        // 日志记录
        logger.info(`发送给 GPT 的消息: ${JSON.stringify(gptmsg)}`);

        try {
            const content = await gpt(gptmsg);

            if (content === true) {
                logger.info('[GPT]key或url配置错误');
                return false;
            }

            // 将 GPT 的回复添加到历史记录中
            this.messageHistory.push({ "role": "assistant", "content": content });

            // 发送回复
            e.reply(content, true);
        } catch (error) {
            logger.error('调用GPT API出错', error);
            return false;
        }

        return true;
    }
}
