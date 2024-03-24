import { defineUserConfig } from 'vuepress'
import theme from './theme.js'

export default defineUserConfig({
	base: '/',

	lang: 'zh-CN',
	title: '引领潮流',
	description: '知识文档',

	theme,
	// 和 PWA 一起启用
	// shouldPrefetch: false,
})
