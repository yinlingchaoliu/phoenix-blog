---
title: H5接入支付宝支付，android适配url拦截alipays---platformapi
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---

####1、问题背景：
问题：商城H5接入支付宝支付，点击白屏
解决方案：需要移动端配合拦截指定url(alipays://platformapi)，并唤起支付宝

####2、代码实现
webview拦截
```
       //覆盖WebView默认通过第三方或者是系统浏览器打开网页的行为，使得网页可以在WebView中打开
        webview.setWebViewClient( new WebViewClient(){
            @Override
            public boolean shouldOverrideUrlLoading(WebView webView, String url) {
                //调用
                if (AlipayUtil.isAlipay( url )){
                    AlipayUtil.goAlipays( getActivity(), url );
                    return true;
                }
                return super.shouldOverrideUrlLoading( webView, url );
            }
        });
```


封装工具
```
@Keep
public class AlipayUtil {

    //拦截特定支付标识
    public static boolean isAlipay(String url) {
        if (StringUtils.startsWith( url, "alipays:" ) || StringUtils.startsWith( url, "alipay" )) {
            return true;
        }
        return false;
    }

    public static void goAlipays(Activity activity, String url) {
        //判断是否安装支付宝
        if (checkAliPayInstalled( activity )){
            goUrl( activity, url );
        }else {
            //安装下载支付宝
            updateAlipayDialog(activity);
        }
    }

  //直接隐式调用
    private static void goUrl(Activity activity, String url){
        Intent intent = new Intent( Intent.ACTION_VIEW, Uri.parse( url ) );
        activity.startActivity( intent );
    }

    //判断是否安装支付宝app
    private static boolean checkAliPayInstalled(Context context) {
        Uri uri = Uri.parse( "alipays://platformapi/startApp" );
        Intent intent = new Intent( Intent.ACTION_VIEW, uri );
        ComponentName componentName = intent.resolveActivity( context.getPackageManager() );
        return componentName != null;
    }

    private static volatile CustomDialog updateDialog = null;

    //安装alipay支付宝  弹框和文案根据实际情况定制
    private static synchronized void updateAlipayDialog(Context context) {
        updateDialog = new CustomDialog.Builder( context ).setMessage( "未检测到支付宝客户端，请安装后重试" )
                .setNegativeButton( "取消", (dialogInterface, i) -> {
                    updateDialog.dismiss();
                    updateDialog = null;
                } ).setPositiveButton( "立即安装", (dialogInterface, i) -> {
                    Uri alipayUrl = Uri.parse("https://d.alipay.com");
                    context.startActivity(new Intent(Intent.ACTION_VIEW, alipayUrl));
                    updateDialog.dismiss();
                    updateDialog = null;
                } ).build();

        if (updateDialog != null) {
            updateDialog.show();
        }
    }

}
```
