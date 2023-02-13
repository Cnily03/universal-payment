# Universal Payment

由静态页面构成的万能支付网页。

Demo: [pay.cnily.top](https://pay.cnily.top)

## 部署

1. 生成并保存各支付平台的收款码并扫描得到的原始内容。

    - 建议使用微信赞赏码而非收款码。
    - 微信支付和 QQ 支付存在限制，不能自动跳转到支付页面。

2. 将仓库拉取至本地并在 `src/template.js` 中配置各支付平台的收款码。

    - 在对应的支付平台后填入收款码扫描得到的原始内容来自动生成图片。
    - 若要使用自定义的收款码图片，可以将图片置于 `src/images/` 目录中并填入 `"[!img]" + require("./images/wechatpay.webp")`，或者填入 `"[!img] https://图片链接.example.com/"` 来使用指定网址的图片。

3. 安装 Node.js 和 npm 并执行下列命令

    ```bash
    npm install
    npm run build
    ```

    来构建页面。

    - 最小化字体文件的功能仅在 Windows 上构建时可用，在其他平台上构建将会产生较大的字体文件。
    - 构建得到的静态页面位于 `dist/` 目录。

4. 将构建得到的静态页面部署于网站上，访问 `/index.html` 即显示支付页面。

## 开发

`src/template.js` 仅为模板，更多文本和链接配置（详细配置）详见 `src/scripts/config.ts` 文件

图标和相应配置位于 `src/icon` 文件夹

其它样式设置位于 `src/stylesheets/config.scss` 文件

### URL 参数

- `auto` 是否开启自动识别 UserAgent 并跳转相应支付平台的网页
- `platform` 显示指定支付平台，可选值为详细配置中正则匹配的常量名，区分大小写
- `type` 显示指定支付平台显示的方式，具有以下可选值 `icon`|`logo`|`select`
