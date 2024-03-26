---
title: 服务端
icon: lightbulb
---

## 定制若依
https://gitee.com/yinlingchaoliu/ruo-yi-cloud-micro

<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">RuoYi v3.6.2</h1>
<h4 align="center">基于 Vue/Element UI 和 Spring Boot/Spring Cloud & Alibaba 前后端分离的分布式微服务架构</h4>
<p align="center">
	<a href="https://gitee.com/y_project/RuoYi-Cloud/stargazers"><img src="https://gitee.com/y_project/RuoYi-Cloud/badge/star.svg?theme=dark"></a>
	<a href="https://gitee.com/y_project/RuoYi-Cloud"><img src="https://img.shields.io/badge/RuoYi-v3.6.2-brightgreen.svg"></a>
	<a href="https://gitee.com/y_project/RuoYi-Cloud/blob/master/LICENSE"><img src="https://img.shields.io/github/license/mashape/apistatus.svg"></a>
</p>

## 平台简介

若依是一套全部开源的快速开发平台，毫无保留给个人及企业免费使用。

* 采用前后端分离的模式，微服务版本前端(基于 [RuoYi-Vue](https://gitee.com/y_project/RuoYi-Vue))。
* 后端采用Spring Boot、Spring Cloud & Alibaba。
* 注册中心、配置中心选型Nacos，权限认证使用Redis。
* 流量控制框架选型Sentinel，分布式事务选型Seata。
* 本文定制 [https://gitee.com/yinlingchaoliu/ruo-yi-cloud-micro](https://gitee.com/yinlingchaoliu/ruo-yi-cloud-micro)。


#### 友情链接 [若依/RuoYi-Cloud](https://gitee.com/zhangmrit/ruoyi-cloud) Ant Design版本。

## spring boot 特点
1) 会装载当前目录下所有的config component mapper domain
2) 项目产物由jar包和配置2部分组成
3) 微服务壳化  (微服务 = 简单业务 + 壳)
4) 支持单体服务与微服务快速切换


## 系统结构

~~~
com.ruoyi     
├── ruoyi-ui              // 前端框架 [1024]
├── ruoyi-all-server      // 服务 all in one [9000]
│    └── ruoyi-nacos.yml                       // nacos配置
│    └── ruoyi-auth-server-deps                // 用户认证能力
│    └── ruoyi-file-server-deps                // 文件上传能力
│    └── ruoyi-gen-server-deps                 // 代码生成能力
│    └── ruoyi-job-server-deps                 // 定时任务能力
│    └── ruoyi-system-server-deps              // 系统服务能力
├── ruoyi-cloud           // 微服务壳
│       └── ruoyi-cloud-bootstrap              // 微服务壳
│       └── ruoyi-cloud-gateway                // 网关壳
│       └── ruoyi-cloud-admin                  // 监控壳
├── ruoyi-dependencies    // bom 依赖管理 做依赖精简
│       └── ruoyi-dependencies-framework              // 通用插件依赖
│       └── ruoyi-dependencies-thirdpart              // 三方插件依赖
│       └── ruoyi-dependencies-domain                 // 领域能力依赖
│       └── ruoyi-dependencies-api                    // 业务api依赖
│       └── ruoyi-dependencies-biz                    // 业务能力依赖
├── ruoyi-framework       // 插件模块 独立且互不依赖  开发中...
│       └── ruoyi-spring-boot-starter-nacos           // 注册插件
│       └── ruoyi-spring-boot-starter-web             // web插件
│       └── ruoyi-spring-boot-starter-mybatis         // mybatis + 多数据源
│       └── ruoyi-spring-boot-starter-redis           // 缓存服务
│       └── ruoyi-spring-boot-starter-dubbo           // rpc插件
│       └── ruoyi-spring-boot-starter-feign           // rpc插件
│       └── ruoyi-spring-boot-starter-xxljob          // xxljob
│       └── ruoyi-spring-boot-starter-seata           // seata
│       └── ruoyi-spring-boot-starter-security        // security 开发中
├── ruoyi-third         // 第三方能力 独立且互不依赖 开发中...
│       └── ruoyi-third-pay                           // 三方支付
│       └── ruoyi-third-weixin                        // 微信
│       └── ruoyi-third-excel                         // excel
├── ruoyi-domain      // 通用业务领域模块 domain: 模型 domain-biz: 业务模型 随时可取代的
│       └── ruoyi-domain-resp                         // resp bean
│       └── ruoyi-domain-user                         // 用户模型
│       └── ruoyi-domain-exception                    // 通用异常
│       └── ruoyi-domain-log                          // 通用日志
│       └── ruoyi-domain-biz-log                      // 日志定制实现
│       └── ruoyi-domain-biz-web                      // web业务封装+列表
│       └── ruoyi-domain-biz-tools                    // 常用工具
│       └── ruoyi-domain-biz-security                 // 用户权限
│       └── ruoyi-domain-biz-datascope                // 数据权限
├── ruoyi-visual          // 图形化管理模块
│       └── ruoyi-visual-nacos                        // 注册中心 [8848]
│       └── ruoyi-visual-monitor                      // 监控中心 [9100]
│       └── ruoyi-visual-sentinel-dashboard           // 稳流监控 [8718]
│       └── ruoyi-visual-xxl-job-admin                // 任务监控 [9900]
│       └── ruoyi-visual-seata-server                 // 事务监控 [7091]
├── ruoyi-gateway         // 网关模块 [8080]
├── ruoyi-modules         // 公共模块
│       └── ruoyi-auth                                 //认证中心 [9200]
│         └── ruoyi-auth-server
│         └── ruoyi-auth-web
│       └── ruoyi-system                              // 系统模块 [9201]
│         └── ruoyi-system-api
│         └── ruoyi-system-server
│         └── ruoyi-system-web
│       └── ruoyi-file                                // 文件服务 [9205]
│         └── ruoyi-file-api
│         └── ruoyi-file-server
│         └── ruoyi-file-web
│       └── ruoyi-gen                                 // 代码生成 [9202]
│         └── ruoyi-gen-server
│         └── ruoyi-gen-web
│       └── ruoyi-job                                 // 定时任务 [9203]
│         └── ruoyi-job-server
│         └── ruoyi-job-web
│       └── ruoyi-xxl-job                             // 分布任务 [9204]
│         └── ruoyi-xxl-job-server
│         └── ruoyi-xxl-job-web
├── ruoyi-modules-member    // 会员模块 按照业务划分
│       └── ruoyi-modules-member-bom                  // 会员依赖
│       └── ruoyi-modules-member-api                  // api接口
│       └── ruoyi-modules-member-domain               // 日志打印
│           └── ruoyi-modules-member-domain-user      // 用户模块
│           └── ruoyi-modules-member-domain-address   // 会员地址
│           └── ruoyi-modules-member-domain-vip       // 会员vip
│           └── ruoyi-modules-member-domain-strategy  // 会员策略
│       └── ruoyi-modules-member-server               // 会员能力
│       └── ruoyi-modules-member-web                  // 会员服务 [9400]
├──pom.xml                // 公共依赖
~~~

# 本框架与RuoYi-Cloud-Micro遵循开发思想 借鉴 RuoYi-Cloud-Plus 和 yudao-cloud

| 功能                               | 本框架                                                                                                                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 组件化项目                         | 遵循Unix哲学 do one thing and do it well 每一种能力, 都是独立积木                                                                                                              |
| ruoyi-nacos                        | 采用springboot 方式 启动 nacos服务                                                                                                                                             |
| ruoyi-spring-boot-starter-nacos    | nacos client端依赖                                                                                                                                                             |
| ruoyi-sentinel                     | 哨兵服务 采用服务方式启动    分布式限流熔断                                                                                                                                    |
| ruoyi-spring-boot-starter-sentinel | 哨兵客户端 引入支持限流能力  分布式限流熔断                                                                                                                                    |
| ruoyi-spring-boot-starter-web      | 支持web能力 ,采用Undertow 基于 XNIO 的高性能容器                                                                                                                               |
| ruoyi-spring-boot-starter-redis    | 支持redis能力  redisson + lock4j 分布式锁                                                                                                                                      |
| ruoyi-spring-boot-starter-mybatis  | mybatis-plus 多数据源  数据连接池及监控  主从 雪花ID                                                                                                                           |
| ruoyi-spring-boot-starter-feign    | 快速http restful 调用 sidecar首选                                                                                                                                              |
| ruoyi-spring-boot-starter-dubbo    | dubbo3 api式rpc调用                                                                                                                                                            |
| 分布式配置中心                     | 采用 Alibaba Nacos 源码集成便于调试扩展与二次开发 框架还为其增加了各种监控                                                                                                     |
| 服务网关                           | 采用 SpringCloud Gateway 框架扩展了多种功能<br/>例如:内网鉴权、请求体缓存、跨域配置、请求响应日志等                                                                            |
| 负载均衡                           | 采用 SpringCloud Loadbalancer 扩展支持了开发团队路由 便于多团队开发调试                                                                                                        |
| RPC远程调用                        | 采用 全新 Apache Dubbo 3.X 历史悠远不用多说                                                                                                                                    |
| 分布式限流熔断                     | 采用 Alibaba Sentinel 源码集成便于调试扩展与二次开发 框架还为其增加了各种监控                                                                                                  |
| 分布式事务                         | 采用 Alibaba Seata 源码集成对接了Nacos与各种监控 简化了搭建部署流程                                                                                                            |
| Web容器                            | 采用 Undertow 基于 XNIO 的高性能容器                                                                                                                                           |
| 权限认证                           | 采用 Sa-Token、Jwt 静态使用功能齐全 低耦合 高扩展                                                                                                                              |
| 权限注解                           | 采用 Sa-Token 支持注解 登录校验、角色校验、权限校验、二级认证校验、HttpBasic校验、忽略校验<br/>角色与权限校验支持多种条件 如 `AND` `OR` 或 `权限 OR 角色` 等复杂表达式         |
| 关系数据库支持                     | 原生支持 MySQL、Oracle、PostgreSQL、SQLServer<br/>可同时使用异构切换                                                                                                           |
| 缓存数据库                         | 支持 Redis 5-7 支持大部分新功能特性 如 分布式限流、分布式队列                                                                                                                  |
| Redis客户端                        | 采用 Redisson Redis官方推荐 基于Netty的客户端工具<br/>支持Redis 90%以上的命令 底层优化规避很多不正确的用法 例如: keys被转换为scan<br/>支持单机、哨兵、单主集群、多主集群等模式 |
| 缓存注解                           | 采用 Spring-Cache 注解 对其扩展了实现支持了更多功能<br/>例如 过期时间 最大空闲时间 组最大长度等 只需一个注解即可完成数据自动缓存                                               |
| ORM框架                            | 采用 Mybatis-Plus 基于对象几乎不用写SQL全java操作 功能强大插件众多<br/>例如多租户插件 分页插件 乐观锁插件等等                                                                  |
| SQL监控                            | 采用 p6spy 可输出完整SQL与执行时间监控                                                                                                                                         |
| 数据分页                           | 采用 Mybatis-Plus 分页插件<br/>框架对其进行了扩展 对象化分页对象 支持多种方式传参 支持前端多排序 复杂排序                                                                      |
| 数据权限                           | 采用 Mybatis-Plus 插件 自行分析拼接SQL 无感式过滤<br/>只需为Mapper设置好注解条件 支持多种自定义 不限于部门角色                                                                 |
| 数据脱敏                           | 采用 注解 + jackson 序列化期间脱敏 支持不同模块不同的脱敏条件<br/>支持多种策略 如身份证、手机号、地址、邮箱、银行卡等 可自行扩展                                               |
| 数据加解密                         | 采用 注解 + mybatis 拦截器 对存取数据期间自动加解密<br/>支持多种策略 如BASE64、AES、RSA、SM2、SM4等                                                                            |
| 数据翻译                           | 采用 注解 + jackson 序列化期间动态修改数据 数据进行翻译<br/>支持多种模式: `映射翻译` `直接翻译` `其他扩展条件翻译` 接口化两步即可完成自定义扩展 内置多种翻译实现               |
| 多数据源框架                       | 采用 dynamic-datasource 支持世面大部分数据库<br/>通过yml配置即可动态管理异构不同种类的数据库 也可通过前端页面添加数据源<br/>支持spel表达式从请求头参数等条件切换数据源         |
| 多数据源事务                       | 采用 dynamic-datasource 支持多数据源不同种类的数据库事务回滚                                                                                                                   |
| 数据库连接池                       | 采用 HikariCP Spring官方内置连接池 配置简单 以性能与稳定性闻名天下                                                                                                             |
| 数据库主键                         | 采用 雪花ID 基于时间戳的 有序增长 唯一ID 再也不用为分库分表 数据合并主键冲突重复而发愁                                                                                         |
| WebSocket协议                      | 基于 Spring 封装的 WebSocket 协议 扩展了Token鉴权与分布式会话同步 不再只是基于单机的废物                                                                                       |
| 序列化                             | 采用 Jackson Spring官方内置序列化 靠谱!!!                                                                                                                                      |
| 分布式幂等                         | 参考美团GTIS防重系统简化实现(细节可看文档)                                                                                                                                     |
| 分布式任务调度                     | 采用 Xxl-Job 天生支持分布式 统一的管理中心                                                                                                                                     |
| 分布式日志中心                     | 采用 ELK 业界成熟解决方案 实时收集所有服务的运行日志 快速发现定位问题                                                                                                          |
| 分布式搜索引擎                     | 采用 ElasticSearch、Easy-Es 以 Mybatis-Plus 方式操作 ElasticSearch                                                                                                             |
| 分布式消息队列                     | 采用 SpringCloud-Stream 支持 Kafka、RocketMQ、RabbitMQ                                                                                                                         |
| 文件存储                           | 采用 Minio 分布式文件存储 天生支持多机、多硬盘、多分片、多副本存储<br/>支持权限管理 安全可靠 文件可加密存储                                                                    |
| 云存储                             | 采用 AWS S3 协议客户端 支持 七牛、阿里、腾讯 等一切支持S3协议的厂家                                                                                                            |
| 短信                               | 支持 阿里、腾讯 只需在yml配置好厂家密钥即可使用 接口化支持扩展其他厂家                                                                                                         |
| 邮件                               | 采用 mail-api 通用协议支持大部分邮件厂商                                                                                                                                       |
| 接口文档                           | 采用 SpringDoc、javadoc 无注解零入侵基于java注释<br/>只需把注释写好 无需再写一大堆的文档注解了                                                                                 |
| 校验框架                           | 采用 Validation 支持注解与工具类校验 注解支持国际化                                                                                                                            |
| Excel框架                          | 采用 Alibaba EasyExcel 基于插件化<br/>框架对其增加了很多功能 例如 自动合并相同内容 自动排列布局 字典翻译等                                                                     |
| 工具类框架                         | 采用 Hutool、Lombok 上百种工具覆盖90%的使用需求 基于注解自动生成 get set 等简化框架大量代码                                                                                    |
| 服务监控框架                       | 采用 SpringBoot-Admin 基于SpringBoot官方 actuator 探针机制<br/>实时监控服务状态 框架还为其扩展了在线日志查看监控                                                               |
| 全方位监控报警                     | 采用 Prometheus、Grafana 多样化采集 多模板大屏展示 实时报警监控 提供详细的搭建文档                                                                                             |
| 链路追踪                           | 采用 Apache SkyWalking 还在为请求不知道去哪了 到哪出了问题而烦恼吗<br/>用了它即可实时查看请求经过的每一处每一个节点                                                            |
| 代码生成器                         | 只需设计好表结构 一键生成所有crud代码与页面<br/>降低80%的开发量 把精力都投入到业务设计上<br/>框架为其适配MP、SpringDoc规范化代码 同时支持动态多数据源代码生成                  |
| 部署方式                           | 支持 Docker 编排 一键搭建所有环境 让开发人员从此不再为搭建环境而烦恼                                                                                                           |
| 项目路径修改                       | 提供详细的修改方案文档 并为其做了一些改动 非常简单即可修改成自己想要的                                                                                                         |
| 国际化                             | 基于请求头动态返回不同语种的文本内容 开发难度低 有对应的工具类 支持大部分注解内容国际化                                                                                        |
| 代码单例测试                       | 提供单例测试 使用方式编写方法与maven多环境单测插件                                                                                                                             |
| Demo案例                           | 提供框架功能的实际使用案例 单独一个模块提供了很多很全                                                                                                                          |


# 本框架项目特色

| 功能              | 本框架特色                                              |
| ----------------- | ------------------------------------------------------- |
| common模块tools化 | common 按照工具类型拆分 上层业务不是必须依赖 而是可选项 |
| common-domain     | 最简单通用resp响应(后续还要精简,减少不必要pom依赖)      |
| spring boot模块   | 每次只做一件事 并做好                                   |
| 积木化            | 提供最小核心能力集合, 引用何种能力 由当前微服务决定     |
| 监控能力微服务化  | nacos sentinel spring-boot-admin xxl-job 微服务一样启动 |
| api四大元素       | api 含 四类元素 rpc , service ,bean , constants         |
| api归属业务层模块 | api模块属于业务层，common, framework模块不容许引用      |


## 架构图


## 内置功能

1.  用户管理：用户是系统操作者，该功能主要完成系统用户配置。
2.  部门管理：配置系统组织机构（公司、部门、小组），树结构展现支持数据权限。
3.  岗位管理：配置系统用户所属担任职务。
4.  菜单管理：配置系统菜单，操作权限，按钮权限标识等。
5.  角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。
6.  字典管理：对系统中经常使用的一些较为固定的数据进行维护。
7.  参数管理：对系统动态配置常用参数。
8.  通知公告：系统通知公告信息发布维护。
9.  操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。
10. 登录日志：系统登录日志记录查询包含登录异常。
11. 在线用户：当前系统中活跃用户状态监控。
12. 定时任务：在线（添加、修改、删除)任务调度包含执行结果日志。
13. 代码生成：前后端代码的生成（java、html、xml、sql）支持CRUD下载 。
14. 系统接口：根据业务代码自动生成相关的api接口文档。
15. 服务监控：监视当前系统CPU、内存、磁盘、堆栈等相关信息。
16. 在线构建器：拖动表单元素生成相应的HTML代码。
17. 连接池监视：监视当前系统数据库连接池状态，可进行分析SQL找出系统性能瓶颈。

## 在线体验

- admin/admin123  
- 陆陆续续收到一些打赏，为了更好的体验已用于演示服务器升级。谢谢各位小伙伴。

演示地址：http://ruoyi.vip  
文档地址：http://doc.ruoyi.vip
