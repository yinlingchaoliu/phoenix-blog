---
title: Android-app冷启动
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---
####Android App启动流程：
```
冷启动app：Application:attachBaseContext()------>Application:onCreate()----->Activity:onCreate()
```

***Application:attachBaseContext()***
```
MultiDex.install();
```

***Application:onCreate()***
*第三方sdk初始化放在异步线程中
方案：
1、Thread 、AsyncTask、Handler
2、IntentService初始化

```
/**
 * 第三方sdk启动
 */
public class InitializeService extends IntentService {

    private static final String ACTION_INIT_WHEN_APP_CREATE = "com.app.start";
    private static String TAG = InitializeService.class.getSimpleName();

    public InitializeService() {
        super(TAG);
    }

    public InitializeService(String name) {
        super(name);
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        if (intent != null) {
            final String action = intent.getAction();
            if (ACTION_INIT_WHEN_APP_CREATE.equals(action)) {
                performInit();
            }
        }
    }

    private void performInit() {
        //此处进行第三方sdk初始化
        //融360
        Context applicationContext = MyApplication.getInstance();
        CrawlerManager.initSDK(applicationContext);//初始化SDK
        CrawlerManager.getInstance().setDebug(true);
        /**
         * webView 内核初始化
         * 说明WebView 初处初始化耗时 250ms 左右。
         */
//        WebView mWebView=new WebView(new MutableContextWrapper(applicationContext));
    }

    public static void start(Context context) {
        Intent intent = new Intent(context, InitializeService.class);
        intent.setAction(ACTION_INIT_WHEN_APP_CREATE);
        context.startService(intent);
    }
}

//xml
        <service
            android:name=".app.service.InitializeService"
            android:exported="false"/>
```
***Activity:onCreate()***
在onCreate之前设置透明主题或者闪屏页
给用户秒开的视觉效果

 ```
    <!-- 透明主题 -->
    <style name="No_Splash_Light" parent="Theme.AppCompat.Light">
        <item name="android:windowBackground">@android:color/transparent</item>
        <item name="android:windowIsTranslucent">true</item>
        <item name="android:windowContentOverlay">@null</item>
    </style>

    <!-- 闪屏页主题 -->
    <style name="SplashTheme" parent="AppTheme">
        <item name="android:windowBackground">@mipmap/flash_icon</item>
        <item name="android:windowIsTranslucent">false</item>
        <item name="android:windowFullscreen">true</item>
    </style>
```
在Activiy.onCreate()方法中加载视图之前设置回原来主题
```
setTheme( R.style.AppTheme );
```

####性能测试工具
项目地址：[https://github.com/JakeWharton/hugo](https://github.com/JakeWharton/hugo)

####参考
https://blog.csdn.net/u012811342/article/details/77568718
https://blog.csdn.net/u012124438/article/details/56340949
https://www.jianshu.com/p/f5514b1a826c
