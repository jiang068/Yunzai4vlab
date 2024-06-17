//别人发问号的时候机器人的质问
//导出  类  类名===文件名 继承  插件类  
export class Helloworld extends plugin {
    constructor() {
        super({
            //后端信息
            name: 'wen',//插件名字，可以随便写
            dsc: '自动回复?',//插件介绍，可以随便写
            event: 'message',//这个直接复制即可，别乱改
            priority: 250,//执行优先级：数值越低优先级越高
            rule: [
                {
                    //正则表达试
                    reg: '^([？]|[?])+$',/*实例：*^#?(草|艹)(\\s|$)*/
                    //函数
                    fnc: 'wen'
                }
            ]
        });
    };

    //函数
    async wen(e) {
        e.reply("为什么要发？是有什么不明白吗？还是说你不会自己去找答案？");//输出！
        //阻止消息不再往下
        return;
    };
};
