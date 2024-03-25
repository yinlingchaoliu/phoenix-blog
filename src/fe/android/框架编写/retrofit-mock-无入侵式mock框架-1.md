---
title: retrofit-mock-无入侵式mock框架-1
date: 2024-03-24 11:47:50
category:
  - 框架编写分析
tag:
  - archive
---
####导航
[1、retrofit-mock用法](https://www.jianshu.com/p/52df6aa67a5f)
[2、retrofit-mock编写思路(aop)](https://www.jianshu.com/p/9ef526b30b9c)
[3 、retrofit-mock的动态代理及注解](https://www.jianshu.com/p/48fa1ad00084)
4、aspect 原理讲解与注解语法 

##### 1、retrofit-mock框架编写背景需求

项目采用的是MVPArms框架，用的dragger方式注入，retrofiit已经封装在底层了，就是给上层提供服务的。没有显著的点，来插入代码。例如
```
var api = createMocker(service, retrofit) 
```
同样，项目早期，我们很难专门预留出位置，做这样的扩展，如果接手项目或项目中期，可能需要修改网络代码，引入mock，为线上很容易引入潜在问题，
此时，我们核心诉求：
```
1、尽量不修改旧的网路代码。
2、通过反射等手段来hook，但不影响正式包效率
3、mock测试代码与生产代码一致，不需要动业务代码
```

#####  2、编写思路
最初考虑是反射来hook，但是需要有hook点，插入代码
mvparms很难找出这样的点，而且修改create()函数，需要改动代码点很多。所以有没有一种方式在create()函数拦截的方法
我们可以采用新的思路 采用AspectJ插件来进行AOP拦截。
`经过实践，aspect 不能拦截接口方法`
我们可以拦截 create(service) 方法，在拦截方法注入代码进行我们需要的操作


##### 3、RetrofitMock aop
```
@Aspect
public class RetrofitMock {

    private String TAG = "RetrofitMock";

    /** retrofit mock开关*/
    private static volatile boolean enabled = true;

    private static boolean isEnabled() {
        return enabled;
    }

    public static void setEnabled(boolean enabled) {
        RetrofitMock.enabled = enabled;
    }

    @Around("execution(* retrofit2.Retrofit.create(..))")
    public Object aroundJoinPoint(ProceedingJoinPoint joinPoint) throws Throwable {

//        Log.e( TAG, "我终于hook了retrofit" );
        if (!isEnabled()) {
            return joinPoint.proceed();//执行原方法
        }

        Object[] parameterValues = joinPoint.getArgs();
        Retrofit retrofit = (Retrofit) joinPoint.getThis();
        Class service = (Class) parameterValues[0];
        Object api = joinPoint.proceed();

        return Proxy.newProxyInstance( service.getClassLoader(), new Class<?>[]{service}, new MockerHandler( retrofit, api ) );
    }
}
```
切点是（retrofit2.Retrofit.create()）在切点方法里注入代码，就可以实现不修改原有的网络代码实现效果。

如果使Aop失效，可以用RetrofitMock的空方法替换，又不损失效率，如下
```
public class RetrofitMock {
    /** retrofit mock开关*/
    private static volatile boolean enabled = true;
    private static boolean isEnabled() {
        return enabled;
    }
    public static void setEnabled(boolean enabled) {
        RetrofitMock.enabled = enabled;
    }
}
```

如用法示例
```
debugImplementation 'com.github.yinlingchaoliu:retrofit-mock:1.0.1'
releaseImplementation 'com.github.yinlingchaoliu:retrofit-mock-no-op:1.0.1'
```

release版有注解的空实现，生产版本，引入会导致aop失效，又不损失效率

#####4、特别感谢
首先特别感谢[javalong](https://www.jianshu.com/p/ef445d5e9be0),给retrofit-mock提供了好的思路

本文代码
https://github.com/yinlingchaoliu/retrofitMock
