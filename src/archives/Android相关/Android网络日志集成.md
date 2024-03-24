---
title: Android网络日志集成
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---
依赖
```
//解决support库问题  android/support/design/widget/CoordinatorLayout
configurations.all {
    resolutionStrategy {
        force 'com.android.support:support-v4:28.0.0'
        force 'com.android.support:design:28.0.0'
    }
}

dependencies {
    //网络日志打印
    implementation "com.squareup.okhttp3:logging-interceptor:3.10.0"
    // https://github.com/jgilfelt/chuck
    debugImplementation ("com.readystatesoftware.chuck:library:1.1.0"){
        exclude group: 'com.android.support' ,module: 'support-v4'
    }
    releaseImplementation "com.readystatesoftware.chuck:library-no-op:1.1.0"
}
```

使用
```
//okhttp添加拦截器
//网络通知
okhttpBuilder.addInterceptor( new ChuckInterceptor( context1 ) );
//打印日志
okhttpBuilder.addInterceptor( getLogging() );

/**
     * 打印日志
     * @return
     */
    private HttpLoggingInterceptor getLogging(){
        HttpLoggingInterceptor.Logger logger = message -> Platform.get().log(Platform.WARN, message, null);
        HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor( logger );
        if(BuildConfig.LOG_DEBUG){
            loggingInterceptor.setLevel( HttpLoggingInterceptor.Level.BODY );
        }else {
            loggingInterceptor.setLevel( HttpLoggingInterceptor.Level.NONE );
        }
        return loggingInterceptor;
    }

```
