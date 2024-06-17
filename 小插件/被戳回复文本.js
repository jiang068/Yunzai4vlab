// 实现自定义戳一戳交互功能，  
//支持返回文字图片语音禁言，其中语音需配置ffmpeg
//原项目gitee地址：https://gitee.com/huangshx2001/yunzai-js-plug-in，我做了改动


import plugin from'../../lib/plugins/plugin.js'
import{segment}from'oicq'
import cfg from'../../lib/config/config.js'
import common from'../../lib/common/common.js'
const path=process.cwd()


//在这里设置事件概率,请保证概率加起来小于1，少于1的部分会触发反击
let reply_text = 0.75 //文字回复概率
let reply_img = 0.0 //图片回复概率
let reply_voice = 0.0 //语音回复概率
let mutepick = 0.0 //禁言概率
let example = 0.1 //拍一拍表情概率
//     反击 = 0.15


//定义图片存放路径 默认是Yunzai-Bot/resources/chuochuo
const chuo_path=path+'/resources/chuochuo/';


//图片需要从1开始用数字命名并且保存为jpg或者gif格式，存在Yunzai-Bot/resources/chuochuo目录下
let jpg_number = 34 //输入jpg图片数量
let gif_number = 2 //输入gif图片数量



//回复文字列表
let word_list=[ '被戳晕了……轻一点啦！',
    '救命啊，有变态>_<！！！',
    '哼~~~',
    '你戳谁呢！你戳谁呢！！！           o(´^｀)o',
    '唔，这触感有种被别人拿胡萝卜指着的感觉≥﹏≤',
    '不要再戳了！我真的要被你气死了！！！',
    '怎么会有你这么无聊的人啊！！！(￢_￢)',
    '把嘴张开（抬起脚）',
    '啊……你戳疼我了Ծ‸Ծ',
    '你干嘛！',
    '你是不是喜欢我？',
    '朗达哟？',
    '变态萝莉控！',
    '要戳坏掉了>_<',
    '你你你，你没睡醒吗？一天天就知道戳我',
    '别戳了！在戳就丢你去喂鱼',
    '你戳我干嘛,闲得**吗?',
    '手痒痒,老是喜欢戳人。',
    '你戳我,我咬你!',
    '戳来戳去,真是的... ',
    '戳我也没用,改变不了你可叹的事实。',
    ' (*・ω・)✄╰ひ╯ ',
    '戏精,你戳我有完没完?',
    '戳我干嘛,要不要脸啊你!',
    '戳人家干嘛,难道我长得很好戳?',
    '戳完了,满足你的戳癖了吧!',
    '戳我啊,等会儿我报复,就不止戳一戳那么简单!',
    '你戳我,是想逗我开心吗?',
    '没事找事,真是的',
    '拜托,你能不能消停会?',
    '行了行了,戳完了没?闹腾完了没?',
    '你再戳,我要生气了哦',
    '惹不起,躲得起,您别老戳人家了行不?',
    '戳我一下,告诉我你有完没完',];


let voice_list = [
]

export class chuo extends plugin{
    constructor(){
    super({
        name: '戳一戳',
        dsc: '戳一戳机器人触发效果',
        event: 'notice.group.poke',
        priority: 48,
        rule: [
            {
                /** 命令正则匹配 */
                fnc: 'chuoyichuo'
                }
            ]
        }
    )
}


async chuoyichuo (e){
    logger.info('[戳一戳生效]')
    if(e.target_id == cfg.qq){
        //生成0-100的随机数
        let random_type = Math.random()
        
        //回复随机文字
        if(random_type < reply_text){
            let text_number = Math.ceil(Math.random() * word_list['length'])
            await e.reply(word_list[text_number-1])
        }
        
        
        //回复随机图片
        else if(random_type < (reply_text + reply_img)){

            let photo_number = Math.ceil(Math.random() * (jpg_number + gif_number))
            
            if(photo_number<=jpg_number){
                e.reply(segment.image('file:///' + path + '/resources/chuochuo/'+ photo_number + '.jpg'))
            }
            else{
                photo_number = photo_number - jpg_number
                e.reply(segment.image('file:///' + path + '/resources/chuochuo/'+ photo_number + '.gif'))
            }

        }
        
        //回复随机语音
        else if(random_type < (reply_text + reply_img + reply_voice)){
            let voice_number = Math.ceil(Math.random() * word_list['length'])
            let url = voice_list[voice_number-1]
            await e.reply(segment.record(url))
        }
        
        //禁言
        else if(random_type < (reply_text + reply_img + reply_voice + mutepick)){
            //两种禁言方式，随机选一种
            let mutetype = Math.ceil(Math.random() * 2)
            if(mutetype == 1){
                e.reply('说了不要戳了！')
                await common.sleep(1000)
                await e.group.muteMember(e.operator_id,60);
                await common.sleep(3000)
                e.reply('啧')
                //有这个路径的图话可以加上
                //await e.reply(segment.image('file:///' + path + '/resources/chuochuo/'+'laugh.jpg'))
            }
            else if (mutetype == 2){
                e.reply('不！！')
                await common.sleep(500);
                e.reply('准！！')
                await common.sleep(500);
                e.reply('戳！！')
                await common.sleep(1000);
                await e.group.muteMember(e.operator_id,60)
            }
        }
        
        //拍一拍表情包
        else if(random_type < (reply_text + reply_img + reply_voice + mutepick + example)){
            await e.reply(await segment.image(`http://ovooa.com/API/face_pat/?QQ=${e.operator_id}`))
        }
        
        //反击
        else {
            e.reply('反击！')
            await common.sleep(1000)
            await e.group.pokeMember(e.operator_id)
        }
        
    }
    
}
    
}
