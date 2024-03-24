---
title: aop-singleClick-双击去重
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---
####使用方法
引用依赖
```
apply plugin: 'android-aspectjx'

aspectjx {
    enabled true
}

classpath 'com.hujiang.aspectjx:gradle-android-plugin-aspectjx:2.0.4'
```

使用范例
```
//从此就有去重功能
@ SingleClick
void testClick(){

}

```
####代码示例

* SingleClick注解
```
/**
 * 防止View被连续点击
 */
@Retention(RetentionPolicy.CLASS)
@Target(ElementType.METHOD)
public @interface SingleClick {
}
```

* SingleClickAspect
```
/**
 * 防止View被连续点击,间隔时间600ms
 *
 * @author chentong
 * @date 18/3/29
 */
@Aspect
public class SingleClickAspect {
    private static long lastClickTime;
   @Pointcut("execution(@com.xxx.app.aop.annotation.aspect.SingleClick * *(..))")
    //方法切入点
    public void methodAnnotated() {
    }

    @Around("methodAnnotated()")//在连接点进行方法替换
    public void aroundJoinPoint(ProceedingJoinPoint joinPoint) throws Throwable {
        if (!isFastDoubleClick()) {
            joinPoint.proceed();//执行原方法
        }
    }

    public  boolean isFastDoubleClick() {
        long time = System.currentTimeMillis();
        long timeD = time - lastClickTime;
        if (0 < timeD && timeD < 600) {
            return true;
        }
        lastClickTime = time;
        return false;
    }

}
```
