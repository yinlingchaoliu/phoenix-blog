---
title: Android中通过外部程序启动App三种方式
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---
唤起三种方式：packagename , action, scheme
####1、通过包名唤醒
```

String packageName="com.chaoliu.wakeapp"
Intent LaunchIntent = getPackageManager().getLaunchIntentForPackage(packageName);
intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
intent.setClassName("B应用包名", "B应用包名.Activity");
startActivity(LaunchIntent);
```

####2、通过自定义action
```

String actionName="com.chaoliu.wakeapp.main"
Intent intent = new Intent();
intent.setAction(actionName);
intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
startActivity(intent);

< intent-filter>
      <action android:name="${actionName}" />
      <category android:name="android.intent.category.DEFAULT"/>
</intent-filter>

```

####3、通过scheme
```java
Intent intent = new Intent();
intent.setData(Uri.parse("scheme://host/path?xx=xx"));
intent.setData(Uri.parse("scheme://ssp?xx=xx"));
intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
startActivity(intent);
 
<intent-filter>
    <data android:scheme="${scheme}" 
                android:host="${host}"
                android:path="${path}"
                android:ssp="${ssp}" />
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
</intent-filter>
```
* "ssp" 是 "scheme-specific part"的缩写，也就是说 URI 中除了 scheme 以外的所有剩下的内容。

通过包名判断是否安装该app
```

    public static boolean isApkInstalled(Context context, String packageName) {
        if (TextUtils.isEmpty(packageName)) {
            return false;
        }
        try {
            ApplicationInfo info = context.getPackageManager().getApplicationInfo(packageName, PackageManager.GET_UNINSTALLED_PACKAGES);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
            return false;
        }
    }

```

跳转应用市场
```
  /**
   * 启动到应用商店app详情界面
   *
   * @param appPkg    目标App的包名
   * @param marketPkg 应用商店包名
   */
   public void launchAppDetail(String appPkg, String marketPkg) {
      try {
          if (TextUtils.isEmpty(appPkg)) return;
          Uri uri = Uri.parse("market://details?id=" + appPkg);
          Intent intent = new Intent(Intent.ACTION_VIEW, uri);
          if (!TextUtils.isEmpty(marketPkg)) {
              intent.setPackage(marketPkg);
          }
          intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
          startActivity(intent);
      } catch (Exception e) {
          e.printStackTrace();
      }
  }

```

* tip:切记：A应用拉起B应用的时候千万不要忘记添加：intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
