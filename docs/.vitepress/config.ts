import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "mini-koa2",
  description: "koa2电子书",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: '基础用法',
        items: [
          { text: '快速开始', link: '/1-base/1-quick-start' },
          { text: '路由', link: '/1-base/2-router' },
          { text: '参数解析', link: '/1-base/3-bodyparser' },
          { text: '静态资源', link: '/1-base/4-static' },
          { text: 'cookie', link: '/1-base/5-cookie' },
          { text: '文件', link: '/1-base/6-file' },
        ]
      },
      {
        text: '源码解析',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
        ]
      },
      {
        text: '面试题',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wbccb/mini-koa2' }
    ]
  }
})
