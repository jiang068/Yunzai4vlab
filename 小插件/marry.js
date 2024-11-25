import puppeteer from "puppeteer";

export class MarriagePlugin extends plugin {
    constructor() {
        super({
            name: '[MarriagePlugin] Marriage and Divorce',
            dsc: 'Marriage and divorce system',
            event: 'message',
            priority: 5000,
            rule: [
                {
                    reg: "^(#|/)?(结婚|娶老婆|娶老公|今日老婆|今日老公)$",
                    fnc: 'marry',
                },
                {
                    reg: "^(#|/)?(离婚|休妻|悔婚)$",
                    fnc: 'divorce',
                }
            ]
        });
    }

    async marry(e) {
        const date_time = formatDate(new Date());
        let [randomSpouse, selfMember] = await getRandomSpouse(e);

        let marryRecord = {
            lastMarryDate: date_time,
            lastMarry: randomSpouse,
        };

        await redis.set(`MarriagePlugin:${e.group_id}_${e.user_id}_marry`, JSON.stringify(marryRecord));

        let replyMessage = `${randomSpouse.nickname}成为了你的新伴侣喵~`;
        let imageUrl = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${randomSpouse.user_id}`;

        await sendMarryMessage(e, replyMessage, imageUrl);
        return true;
    }

    async divorce(e) {
        await redis.del(`MarriagePlugin:${e.group_id}_${e.user_id}_marry`);

        let [newSpouse, selfMember] = await getRandomSpouse(e);
        let date_time = formatDate(new Date());

        let marryRecord = {
            lastMarryDate: date_time,
            lastMarry: newSpouse,
        };

        await redis.set(`MarriagePlugin:${e.group_id}_${e.user_id}_marry`, JSON.stringify(marryRecord));

        let replyMessage = `离婚成功喵~你的新伴侣是：${newSpouse.nickname}喵~`;
        let imageUrl = `https://q1.qlogo.cn/g?b=qq&s=0&nk=${newSpouse.user_id}`;

        await sendMarryMessage(e, replyMessage, imageUrl);
        return true;
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function getRandomSpouse(e) {
    let mmap = await e.group.getMemberMap();
    let arrMember = Array.from(mmap.values());
    let excludeUserIds = [String(e.self_id), String(e.user_id), '2854196310'];
    let filteredArrMember = arrMember.filter(member => !excludeUserIds.includes(String(member.user_id)));
    let randomSpouse = filteredArrMember[Math.floor(Math.random() * filteredArrMember.length)];
    const selfMember = arrMember.find(member => member.user_id === String(e.user_id));
    return [randomSpouse, selfMember];
}

async function sendMarryMessage(e, replyMessage, imageUrl) {
    e.reply([replyMessage, segment.image(imageUrl)], true);
}
