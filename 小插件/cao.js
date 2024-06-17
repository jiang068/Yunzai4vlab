//导出  类  类名===文件名 继承  插件类  
export class Helloworld extends plugin {
    constructor() {
        super({
            //后端信息
            name: 'cao',//插件名字，可以随便写
            dsc: '自动回复草',//插件介绍，可以随便写
            event: 'message',//这个直接复制即可，别乱改
            priority: 250,//执行优先级：数值越低越6
            rule: [
                {
                    //正则表达试
                    reg: '^#?(草|靠)(\\s|$)$',/**^#?(草|艹)(\\s|$)*/
                    //函数
                    fnc: 'cao'
                }
            ]
        });
    };

    //函数
    async cao(e) {
        e.reply("草");//输出！
        //阻止消息不再往下
        return;
    };
};
