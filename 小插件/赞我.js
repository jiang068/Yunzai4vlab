export class ThumbsUpPlugin extends plugin {
  constructor() {
    super({
      name: "赞我功能",
      dsc: "独立实现点点赞的功能",
      event: "message",
      priority: 5000,
      rule: [
        {
          reg: "^(赞我)$", // 只要消息是“赞我”就触发
          fnc: "thumbsUpMe",
        },
        {
          reg: "^(赞我)\\s*.*$", // 支持没有#也支持有空格的“赞我”
          fnc: "thumbsUpMe",
        }
      ],
    });
  }

  /**
   * rule - 赞我
   * @returns
   */
  async thumbsUpMe() {
    try {
      Bot.pickFriend(this.e.user_id).thumbUp(10);
      this.e.reply("给你点了10个赞了喵,确定不回我10个赞喵?");
    } catch (error) {
      console.error("点赞失败：", error);
      this.e.reply("点赞失败，请稍后再试喵~");
    }
  }
}
