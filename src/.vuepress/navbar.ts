import { navbar } from 'vuepress-theme-hope'

export default navbar([
	'/',
	{
		text: '基本功',
		icon: 'book',
		link: 'basis/',
	},
	{
		text: '前端',
		icon: 'play',
		link: 'fe/',
	},
	// {
	// 	text: '前端',
	// 	icon: 'play',
	// 	prefix: '/fe/',
	// 	children: [
	// 		{
	// 			text: 'android',
	// 			icon: 'lightbulb',
	// 			prefix: 'android/',
	// 			children: ['README.md', { text: 'framework', icon: 'lightbulb', link: 'framework/' }],
	// 		},
	// 		{
	// 			text: '前端基础',
	// 			icon: 'lightbulb',
	// 			prefix: 'basis/',
	// 			children: ['README.md', { text: 'react', icon: 'lightbulb', link: 'react/' }],
	// 		},
	// 	],
	// },
	{
		text: '服务端',
		icon: 'server',
		link: 'server/',
	},
	{
		text: '产品运营',
		icon: 'lightbulb',
		link: 'product/',
	},
	{
		text: '商业探索',
		icon: 'add',
		link: 'bussiness/',
	},
	{
		text: '感悟心得',
		icon: 'eye',
		link: 'insight/',
	},
	{
		text: '归档',
		icon: 'book',
		link: 'archives/',
	},
])
