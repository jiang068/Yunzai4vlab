//导出  类  类名===文件名 继承  插件类  
export class Helloworld extends plugin {
    constructor() {
        super({
            //后端信息
            name: 'nothankfj',//插件名字，可以随便写
            dsc: '自动回复不用谢fj',//插件介绍，可以随便写
            event: 'message',//这个直接复制即可，别乱改
            priority: 250,//执行优先级：数值越低越6
            rule: [
                {
                    //正则表达试
                    reg: '^#?(谢谢fj)(\\s|$)$',/**^#?(草|艹)(\\s|$)*/
                    //函数
                    fnc: 'nothank'
                }
            ]
        });
    };

    //函数
    async nothank(e) {
        e.reply("不用谢");//输出！
        //阻止消息不再往下
        return;
    };
};
