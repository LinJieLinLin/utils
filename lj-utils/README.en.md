# lj-utils

<!-- [![forks](https://img.shields.io/github/forks/LinJieLinLin/utils?style=flat-square&logo=GitHub)](https://github.com/LinJieLinLin/utils) -->
<!-- [![issues](https://img.shields.io/github/issues/LinJieLinLin/utils?style=flat-square&logo=GitHub)](https://github.com/LinJieLinLin/utils/issues) -->

[![stars](https://img.shields.io/github/stars/LinJieLinLin/utils?style=flat-square&logo=GitHub)](https://github.com/LinJieLinLin/utils)
[![Website](https://img.shields.io/badge/ljUtils-up-blue?style=flat-square)](https://linjielinlin.github.io/utils/lj-utils/index.html)
[![release](https://img.shields.io/github/v/release/LinJieLinLin/utils?style=flat-square)](https://github.com/LinJieLinLin/utils/releases)
[![license](https://img.shields.io/github/license/LinJieLinLin/utils?style=flat-square)](https://en.wikipedia.org/wiki/MIT_License)

## Introduction

> lj-utils is a common js library that I have organized, with the following directory structure:

- lj-utils/index: Common JavaScript utility functions and constants, suitable for various front-end frameworks and node applications.
- lj-utils/microApi: API encapsulation based on uniapp mini program development.
- lj-utils/mixins: Vue.js mixin.
- lj-utils/class: Common class.
- lj-utils/directive: Vue.js custom directive.
- lj-utils/scss: Common SCSS style library.
- lj-utils/less: Common style library less version.

## Repository

> github [https://github.com/LinJieLinLin/utils](https://github.com/LinJieLinLin/utils)

> gitee [https://gitee.com/uni-pro/utils](https://gitee.com/uni-pro/utils)

## Installation tutorial (npm/yarn/pnpm)

- npm i lj-utils
- yarn add lj-utils
- pnpm i lj-utils

## Instructions for use:

### esm reference

```js
import { setTitle } from 'lj-utils'
setTitle('hi')
// or
import * as ljUtils from 'lj-utils'
ljUtils.setTitle('hi')
```

### node reference

```js
const ljUtils = require('lj-utils')
```

### Browser reference, mounted on window.f

```html
<head>
  <script src="https://npm.elemecdn.com/lj-utils@latest/index.umd.js"></script>
  <script>
    window.onload = function () {
      console.log(window.f)
    }
  </script>
</head>
```

### Online documentation

> Visit latest: [https://linjielinlin.github.io/utils/lj-utils/index.html](https://linjielinlin.github.io/utils/lj-utils/index.html)

> Or visit [http://lj4.top/utils/lj-utils/index.html](https://lj4.top/utils/lj-utils/index.html)

### If the compilation fails, add the following code to vue.config.js

```js
transpileDependencies: ['lj-utils'],
```

### Automatically import lj-utils/index public functions (unplugin-auto-import/vite)

```ts
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite';
import { ljResolver } from 'lj-utils/resolver.js';
AutoImport({
  ...,
  resolvers: [ljResolver()],
})
```

## Contribution

1. Fork this repository
2. Create a Feat_xxx branch
3. Submit code
4. Create a Pull Request
