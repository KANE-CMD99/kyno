/**
 * 文章分类的固定取值 —— 列表页的筛选 tab 需要一个稳定的集合，所以不做自由输入。
 *
 * 放在这里而不是 `src/db/blog-posts.ts`：那个模块 import 了 `fs`，而两个表单和
 * 列表页的筛选 tab 都是客户端组件 —— 客户端一旦从 db 模块取值，webpack 会把
 * `fs` 拖进浏览器 bundle 并直接构建失败（实测报错：
 * `./src/db/blog-posts.ts  Module not found: Can't resolve 'fs'`）。
 * 本模块零 import，所以客户端可以安全地取值。`src/db/blog-posts.ts` 仍 re-export
 * 本常量，服务端原有的导入路径不受影响。
 */
export const BLOG_CATEGORIES = ["Resume Tips", "Design", "Printables", "Career"] as const;
