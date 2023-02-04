/**
 * 模板设置（二维码链接）
 * 字符串前添加 `[url]` 表示自动生成二维码
 * 字符串前添加 `[img]` 表示使用后面的链接作为二维码图片的地址（支持 base64）
 * 若不添加则默认为 `[url]`
 */
module.exports = {
  Alipay: "https://qr.alipay.com/fkx107738tlkf2dmserum29",
  // 微信赞赏码，也可以使用微信支付二维码扫描后以 `wxp://` 开头的网址，但是不推荐使用微信支付二维码，以免被他人用于非法用途
  WeChat: "[img]" + require("./images/wechatpay.webp"),
  QQ: "https://i.qianbao.qq.com/wallet/sqrcode.htm?m=tenpay&f=wallet&a=1&ac=CAEQxYnKxwgYpbbKngZCIDFiZjM1NjdhODAxMmEwZDhhYTU5OGVjNjFmMGVkNjU4_xxx_sign&u=2297595077"
}