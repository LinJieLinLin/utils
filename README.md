# lj-utils

<!-- [![forks](https://img.shields.io/github/forks/LinJieLinLin/utils?style=flat-square&logo=GitHub)](https://github.com/LinJieLinLin/utils) -->
<!-- [![issues](https://img.shields.io/github/issues/LinJieLinLin/utils?style=flat-square&logo=GitHub)](https://github.com/LinJieLinLin/utils/issues) -->

[![stars](https://img.shields.io/github/stars/LinJieLinLin/utils?style=flat-square&logo=GitHub)](https://github.com/LinJieLinLin/utils)
[![Website](https://img.shields.io/badge/ljUtils-up-blue?style=flat-square)](https://linjielinlin.github.io/utils/lj-utils/index.html)
[![release](https://img.shields.io/github/v/release/LinJieLinLin/utils?style=flat-square)](https://gitee.com/LinJieLinLin/utils/releases)
[![license](https://img.shields.io/github/license/LinJieLinLin/utils?style=flat-square)](https://en.wikipedia.org/wiki/MIT_License)

## 介绍

> lj-utils 为本人整理的 js 通用库，目录结构:

- lj-utils/index：公共 JavaScript 工具函数和常量，适用于各种前端框架和 node 应用程序。
- lj-utils/microApi： 基于 uniapp 小程序开发 API 封装。
- lj-utils/mixins：Vue.js 混入(mixins)。
- lj-utils/class：通用类。
- lj-utils/directive：Vue.js 自定义指令(directive)
- lj-utils/scss：通用的 SCSS 样式库
- lj-utils/less：通用的样式库 less 版本

## 仓库

> github [https://github.com/LinJieLinLin/utils](https://github.com/LinJieLinLin/utils)

> gitee [https://gitee.com/uni-pro/utils](https://gitee.com/uni-pro/utils)

## 安装教程(npm/yarn/pnpm)

- npm i lj-utils
- yarn add lj-utils
- pnpm i lj-utils

## 使用说明:

### esm 引用

```js
import { setTitle } from 'lj-utils'
setTitle('hi')
// 或
import * as ljUtils from 'lj-utils'
ljUtils.setTitle('hi')
```

### node 引用

```js
const ljUtils = require('lj-utils')
```

### 浏览器中引用,挂载在 window.f 中

```html
<head>
  <script src="https://npm.elemecdn.com/lj-utils/index.umd.js"></script>
  <script>
    window.onload = function () {
      console.log(window.f)
    }
  </script>
</head>
```

### 在线文档

> 访问 latest： [https://linjielinlin.github.io/utils/lj-utils/index.html](https://linjielinlin.github.io/utils/lj-utils/index.html)

> 或访问 [http://lj4.top/utils/lj-utils/index.html](https://lj4.top/utils/lj-utils/index.html)

### 若编译失败，在 vue.config.js 添加以下代码

```js
transpileDependencies: ['lj-utils'],
```

### 自动引入 lj-utils/index 公共函数（unplugin-auto-import/vite）

```ts
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite';
import { ljResolver } from 'lj-utils/resolver.js';
AutoImport({
  ...,
  resolvers: [ljResolver()],
})
```

## 参与贡献

1. Fork 本仓库
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request
