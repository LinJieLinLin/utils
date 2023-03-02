# lj-utils

## 介绍

lj-utils 为本人整理的通用库：

lj-utils/index 公共 JS,

lj-utils/microApi uniapp、小程序相关

lj-utils/mixins vueMixins

lj-utils/class class

lj-utils/directive vueDirective

lj-utils/scss 通用样式

## 仓库

> github [https://github.com/LinJieLinLin/utils](https://github.com/LinJieLinLin/utils)

> gitee [https://gitee.com/uni-pro/utils](https://gitee.com/uni-pro/utils)

## 安装教程(npm/yarn/pnpm)

- npm i lj-utils
- yarn add lj-utils
- pnpm i lj-utils

## 使用说明:

### 按需 import 引入，如 import {sleep} from 'lj-utils/index'/'lj-utils/microApi'...,根据文档用多少引多少

> 访问 latest： [https://linjielinlin.github.io/utils/lj-utils/index.html](https://linjielinlin.github.io/utils/lj-utils/index.html)

> 或访问 [http://lj4.top/utils/lj-utils/index.html](http://lj4.top/lj-utils/index.html)

### 若编译失败，在 vue.config.js 添加以下代码

```js
transpileDependencies: ['lj-utils'],
```

### 自动引入 lj-utils/index 公共函数（unplugin-auto-import/vite）

```js
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
