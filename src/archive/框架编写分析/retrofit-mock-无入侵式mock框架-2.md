---
title: retrofit-mock-无入侵式mock框架-2
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

#####1、retrofit-mock编写思路（动态代理基础上，再动态代理）
retrofit核心代码 精简省略不必要代码
```
public <T> T create(final Class<T> service) {
    return (T) Proxy.newProxyInstance(service.getClassLoader(), new Class<?>[] { service },
        new InvocationHandler() {
          private final Object[] emptyArgs = new Object[0];
              @Override public @Nullable Object invoke(Object proxy, Method method,
              @Nullable Object[] args) throws Throwable {
              return loadServiceMethod(method).invoke(args != null ? args : emptyArgs);
          }
        });
  }
```

retrofit 核心是采用反向代理生成 T 的实体类

同样我们可以在这个生成实体类的基础上，再次动态代理，hook 调用函数

```
//获得值
T api = retrofit.create(Api.class);
//根据api实例，用反向代理，
Proxy.newProxyInstance( service.getClassLoader(), new Class<?>[]{service}, new MockerHandler( retrofit, api ) );
```
在实例api的基础上，再次动态代理
```
public class MockerHandler<T> implements InvocationHandler {
    private Retrofit retrofit;
    private T api;
    public MockerHandler(Retrofit retrofit, T api) {
        this.retrofit = retrofit;
        this.api = api;
    }
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        //method 方法就是对应的Api接口方法,
        //可以在此处一通骚操作，处理retrofit
        return method.invoke( api, args );
}
```

#####2、运行时注解，避免不必要手写代码，配置化操作
```
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
public @interface MOCK {
    String value() default "";
    boolean enable() default true;
}
```
对retrofit对应Api.class 接口方法一通操作
```
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {

        boolean isMockExist = method.isAnnotationPresent( MOCK.class );

        //如果注解不存在 正常走流程
        if (!isMockExist) {
            return invoke( method, args );
        }

        MOCK mock = method.getAnnotation( MOCK.class );

        //如果mock 设置为false 正常返回
        if (!mock.enable()) {
            return invoke( method, args );
        }

        String value = mock.value().trim();

        //如果http开头 替换成url 正常请求
        if (value.startsWith( "http" )) { //网络请求数据
            preLoadServiceMethod( method, value );
            return invoke( method, args );
        } else if (value.endsWith( ".json" )) { //本地数据
            String mockResponseJson = readAssets( value );
            Object responseObj = retrofit.nextResponseBodyConverter( null, getReturnTye( method ), method.getDeclaredAnnotations() ).convert( ResponseBody.create( MediaType.parse( "application/json" ), mockResponseJson ) );
            return (retrofit.nextCallAdapter( null, method.getGenericReturnType(), method.getAnnotations() )).adapt( new MockerCall( responseObj ) );
        } else { //其他情况正常请求
            return invoke( method, args );
        }
    }

  private Object invoke(Method method, Object[] args) throws InvocationTargetException, IllegalAccessException {
        if (args == null) {
            return method.invoke( api );
        } else {
            return method.invoke( api, args );
        }
    }
```

#####3、修改网络请求地址
```
//修改url地址
    private void preLoadServiceMethod(Method method, String relativeUrl) {
        try {
            Method loadServiceMethod = retrofit.getClass().getDeclaredMethod( "loadServiceMethod", Method.class );
            loadServiceMethod.setAccessible( true );
            //获得serviceMethod的值
            Object serviceMethod = loadServiceMethod.invoke( retrofit, method );
            //反射修改实体类中的值
            fixRetrofit240( serviceMethod, relativeUrl );
            fixRetrofit250( serviceMethod, relativeUrl );
        } catch (Exception e) {

        }
    }

    //eg : serviceMethod.relativeUrl = relativeUrl
    //针对retrofit 2.4.0版本做适配
    private void fixRetrofit240(Object serviceMethod, String relativeUrl) {
        try {
            Field relativeUrlField = serviceMethod.getClass().getDeclaredField( "relativeUrl" );
            relativeUrlField.setAccessible( true );
            relativeUrlField.set( serviceMethod, relativeUrl );
        } catch (Exception e) {

        }
    }

    //eg: serviceMethod.requestFactory.relativeUrl = relativeUrl
    //针对retrofit 2.5.0版本做适配
    private void fixRetrofit250(Object serviceMethod, String relativeUrl) {
        try {
            Field requestFactoryField = serviceMethod.getClass().getDeclaredField( "requestFactory" );
            requestFactoryField.setAccessible( true );
            Object requestFactory = requestFactoryField.get( serviceMethod );
            Field relativeUrlField = requestFactory.getClass().getDeclaredField( "relativeUrl" );
            relativeUrlField.setAccessible( true );
            relativeUrlField.set( requestFactory, relativeUrl );
        } catch (Exception e) {

        }
    }
```

#####4、特别感谢
首先特别感谢[javalong](https://www.jianshu.com/p/ef445d5e9be0),给retrofit-mock提供了好的思路

本文代码
https://github.com/yinlingchaoliu/retrofitMock
