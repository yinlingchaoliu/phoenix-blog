import { sidebar } from 'vuepress-theme-hope'

export default sidebar({
	'/basis': 'structure',
	'/fe': 'structure',
	'/server': 'structure',
	'/product': 'structure',
	'/bussiness': 'structure',
	'/insight': 'structure',
	'/': [
		'',
		{
			text: '基本功',
			icon: 'book',
			prefix: 'basis/',
			children: 'structure',
		},
		{
			text: '前端',
			icon: 'book',
			prefix: 'fe/',
			children: 'structure',
		},
		{
			text: '后端',
			icon: 'book',
			prefix: 'server/',
			children: 'structure',
		},
		{
			text: '产品运营',
			icon: 'book',
			prefix: 'product/',
			children: 'structure',
		},
		{
			text: '商业探索',
			icon: 'book',
			prefix: 'bussiness/',
			children: 'structure',
		},
		{
			text: '感悟心得',
			icon: 'book',
			prefix: 'insight/',
			children: 'structure',
		},
		{
			text: '案例',
			icon: 'laptop-code',
			prefix: 'demo/',
			link: 'demo/',
			children: 'structure',
		},
		{
			text: '文档',
			icon: 'book',
			prefix: 'guide/',
			children: 'structure',
		},
		{
			text: '归档',
			icon: 'book',
			prefix: 'archives/',
			children: 'structure',
		},
	],
})
