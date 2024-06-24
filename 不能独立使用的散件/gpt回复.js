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
                    reg: '^GPT\\s+(.+)$', 
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
        const messageMatch = typeof e.msg === 'string' && e.msg.match(/^GPT\s+(.+)$/);
        if (!messageMatch) {
            logger.error('消息格式错误或正则匹配失败');
            return false;
        }

        // 提取“GPT”后的内容，并删除其中的空格
        const message = messageMatch[1].replace(/\s+/g, '');
        
        // 检查消息长度
        if (message.length > 100) {  // 假设限制为100字符
        e.reply('消息过长，请控制在100字符以内。', true);
        return false;
        }


        // 更新消息历史记录
        this.messageHistory.push({ "role": "user", "content": message });

        // 清理历史记录，保留最近25条
        if (this.messageHistory.length > 25) {
            this.messageHistory = this.messageHistory.slice(-25);
        }

        let arr2 = [
            { "role": "user", "content": '' }
        ];

        let gptmsg = await getPersonality();
        gptmsg.push(...arr2, ...this.messageHistory);

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
