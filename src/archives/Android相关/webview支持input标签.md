---
title: webview支持input标签
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---
####webview input说明
安卓webview禁用input，网上查看各种方案，都存在弊端。
经过实践，完整可用调研了支持拍照和图片选择上传。

[1、webview支持input标签](https://www.jianshu.com/p/19084bbc0747)
[2、安卓拍照支持适配7.0 takePhoto](https://www.jianshu.com/p/40670b459e56)

####1、webview 初始化和销毁
```
    //webview初始化
    @SuppressLint("SetJavaScriptEnabled")
    public static void initX5Web(WebView x5Webview) {
        Context context = x5Webview.getContext();
        WebSettings webSetting = x5Webview.getSettings();
        webSetting.setJavaScriptEnabled( true );
        webSetting.setAllowFileAccess( true );
        webSetting.setLayoutAlgorithm( WebSettings.LayoutAlgorithm.NARROW_COLUMNS );
        webSetting.setSupportZoom( false );
        webSetting.setBuiltInZoomControls( false );
        webSetting.setDisplayZoomControls(false);   //不显示webview缩放按钮
        webSetting.setUseWideViewPort( true );
        //多窗口问题
        webSetting.setSupportMultipleWindows( false );
        webSetting.setJavaScriptCanOpenWindowsAutomatically( true );

        //h5数据存储
        webSetting.setAppCacheEnabled( true );
        webSetting.setDomStorageEnabled( true );
        webSetting.setDatabaseEnabled(true);
        webSetting.setAppCachePath(context.getDir("appcache", 0).getPath());

        webSetting.setGeolocationEnabled( true );
        webSetting.setAppCacheMaxSize( Long.MAX_VALUE );
        webSetting.setDatabasePath(context.getDir("databases", 0).getPath());
        webSetting.setGeolocationDatabasePath(context.getDir("geolocation", 0).getPath());
        webSetting.setPluginState( WebSettings.PluginState.ON_DEMAND );
        webSetting.setRenderPriority( WebSettings.RenderPriority.HIGH );
        webSetting.setCacheMode( WebSettings.LOAD_NO_CACHE );
        //sonic
        x5Webview.removeJavascriptInterface("searchBoxJavaBridge_");
        webSetting.setAllowContentAccess(true);
        webSetting.setSavePassword(false);
        webSetting.setSaveFormData(false);
        webSetting.setLoadWithOverviewMode(true);
        webSetting.setDefaultTextEncodingName("utf-8");
        webSetting.setLoadsImagesAutomatically(true);
    }

    //webview销毁方法
    public static void onDestroy(WebView mWebView){
        if (mWebView != null) {
            mWebView.clearHistory();
            ((ViewGroup) mWebView.getParent()).removeView(mWebView);
            mWebView.loadUrl("about:blank");
            mWebView.stopLoading();
            mWebView.setWebChromeClient(null);
            mWebView.setWebViewClient(null);
            mWebView.loadDataWithBaseURL(null, "", "text/html", "utf-8", null);
            mWebView.clearHistory();
            mWebView.destroy();
        }
    }
```

####2、webchrome特别支持

* 1、 initWebChrome
```
    //webview input 特别支持帮助类
    private WebViewUploadFileHelper helper = new WebViewUploadFileHelper(this);

    private void initWebChrome() {
        webview.setWebChromeClient( new InputFileWebChromeClient() );
    }

public class InputFileWebChromeClient extends WebChromeClient {
    //设置 进度条
    @Override
    public void onProgressChanged(WebView view, int newProgress) {
        super.onProgressChanged( view, newProgress );
    }

    // For Android < 3.0
    public void openFileChooser(ValueCallback<Uri> uploadMsg) {
        helper.setUploadMessage( uploadMsg );
        permission( () -> {
            helper.openImageActivity();
        } );
    }

    // For Android 3.0+
    public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType) {
        helper.setUploadMessage( uploadMsg );
        permission( () -> {
            helper.openImageActivity( acceptType );
        } );
    }

    // For Android  > 4.1.1
    public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
        helper.setUploadMessage( uploadMsg );
        permission( () -> {
            helper.openImageActivity( acceptType, capture );
        } );
    }

    // For Android  >= 5.0
    public boolean onShowFileChooser(com.tencent.smtt.sdk.WebView webView,
                                     ValueCallback<Uri[]> filePathCallback,
                                     WebChromeClient.FileChooserParams fileChooserParams) {
        helper.setUploadMessageAboveL( filePathCallback );
        permission( () -> {
            helper.openImageActivity( fileChooserParams.getAcceptTypes(), fileChooserParams.isCaptureEnabled() );
        } );
        return true;
    }

    //==多窗口的问题
    @Override
    public boolean onCreateWindow(WebView view, boolean isDialog,
                                  boolean isUserGesture, Message resultMsg) {
        WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
        transport.setWebView( view );
        resultMsg.sendToTarget();
        return true;
    }
}
```  

* 2 、回调
```
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
       //回调支持
        super.onActivityResult(requestCode, resultCode, data);
        helper.onActivityResult(requestCode, resultCode, data);
    }
```
* 3 、权限
```
    @SuppressLint("CheckResult")
    public void permission(CallBack callBack){
       // 权限支持
        RxPermissions rxPermissions = new RxPermissions( this );
        rxPermissions.request(Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_EXTERNAL_STORAGE)
                .subscribe(grant -> {
                    if (grant) {
                        //全部通过
                        try {
                            if (callBack!=null){
                                callBack.onSucess();
                            }
                        } catch (Throwable throwable) {
                            throwable.printStackTrace();
                        }
                    } else {
                            ToastUtils.show("请同意权限");
                    }
                });
    }

    public interface CallBack{
        void onSucess();
    }

```

#### 3、WebViewUploadFileHelper 帮助类


将input相关方法封装在一个帮助类中，便于多处复用
```java

public class WebViewUploadFileHelper {

    private ValueCallback<Uri> uploadMessage;
    private ValueCallback<Uri[]> uploadMessageAboveL;
    private final static int FILE_CHOOSER_RESULT_CODE = 10011;//文件选择
    private Uri imageUri;
    private Activity activity;

    private WebViewUploadFileHelper() {
    }

    public WebViewUploadFileHelper(Activity activity) {
        this.activity = activity;
    }

    public void setUploadMessage(ValueCallback<Uri> uploadMessage) {
        this.uploadMessage = uploadMessage;
    }

    public void setUploadMessageAboveL(ValueCallback<Uri[]> uploadMessageAboveL) {
        this.uploadMessageAboveL = uploadMessageAboveL;
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode != FILE_CHOOSER_RESULT_CODE) return;

        // 经过上边(1)、(2)两个赋值操作，此处即可根据其值是否为空来决定采用哪种处理方法
        if (uploadMessage != null) {
            chooseBelow( resultCode, data );
        } else if (uploadMessageAboveL != null) {
            chooseAbove( resultCode, data );
        }

    }

    public void openImageActivity() {
        chooseImage( "image/*" );
    }

    public void openImageActivity(String acceptType) {
        chooseImage( acceptType );
    }

    public void openImageActivity(String acceptType, String capture) {
        if (StringUtils.equals( capture, "camera" )) {
            takePhoto();
        } else {
            chooseImage( acceptType );
        }
    }

    public void openImageActivity(String[] acceptType, boolean isCaptureEnabled) {
        if (isCaptureEnabled) {
            takePhoto();
        } else {
            chooseImage( acceptType );
        }
    }

    private void chooseBelow(int resultCode, Intent data) {

        if (RESULT_OK == resultCode) {
            updatePhotos();

            if (data != null) {
                // 这里是针对文件路径处理
                Uri uri = data.getData();
                if (uri != null) {
                    uploadMessage.onReceiveValue( uri );
                } else {
                    uploadMessage.onReceiveValue( null );
                }
            } else {
                // 以指定图像存储路径的方式调起相机，成功后返回data为空
                uploadMessage.onReceiveValue( imageUri );
            }
        } else {
            uploadMessage.onReceiveValue( null );
        }
        uploadMessage = null;
    }

    private void chooseAbove(int resultCode, Intent data) {
        if (RESULT_OK == resultCode) {
            updatePhotos();

            if (data != null) {
                // 这里是针对从文件中选图片的处理
                Uri[] results;
                Uri uriData = data.getData();
                if (uriData != null) {
                    results = new Uri[]{uriData};
                    uploadMessageAboveL.onReceiveValue( results );
                } else {
                    uploadMessageAboveL.onReceiveValue( null );
                }
            } else {
                uploadMessageAboveL.onReceiveValue( new Uri[]{imageUri} );
            }
        } else {
            uploadMessageAboveL.onReceiveValue( null );
        }
        uploadMessageAboveL = null;
    }

    private void updatePhotos() {
        // 该广播即使多发（即选取照片成功时也发送）也没有关系，只是唤醒系统刷新媒体文件
        Intent intent = new Intent( Intent.ACTION_MEDIA_SCANNER_SCAN_FILE );
        intent.setData( imageUri );
        activity.sendBroadcast( intent );
    }

    //调用相机
    private void takePhoto() {
        String fileName = "IMG_" + DateFormat.format( "yyyyMMdd_hhmmss", Calendar.getInstance( Locale.CHINA ) ) + ".jpg";
        // 步骤一：创建存储照片的文件
        String imagePath = activity.getFilesDir() + File.separator + "images" + File.separator + fileName;
        File file = new File( imagePath );
        //创建文件夹
        if (!file.getParentFile().exists())
            file.getParentFile().mkdirs();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            //步骤二：Android 7.0及以上获取文件 Uri
            imageUri = FileProvider.getUriForFile( activity, activity.getPackageName() + ".fileprovider", file );
        } else {
            //步骤三：获取文件Uri
            imageUri = Uri.fromFile( file );
        }

        Intent intent = new Intent();
        intent.addFlags( Intent.FLAG_GRANT_READ_URI_PERMISSION );
        intent.setAction( MediaStore.ACTION_IMAGE_CAPTURE );//设置Action为拍照
        intent.putExtra( MediaStore.EXTRA_OUTPUT, imageUri );//将拍取的照片保存到指定URI
        activity.startActivityForResult( intent, FILE_CHOOSER_RESULT_CODE );
    }

    //图片选择器
    private void chooseImage(String[] acceptType) {
        Intent i = new Intent( Intent.ACTION_GET_CONTENT );
        i.addCategory( Intent.CATEGORY_OPENABLE );
        i.setType( "*/*" );
        i.putExtra( Intent.EXTRA_MIME_TYPES, acceptType );
        activity.startActivityForResult( i, FILE_CHOOSER_RESULT_CODE );
    }

    //图片选择器
    private void chooseImage(String acceptType) {
        Intent i = new Intent( Intent.ACTION_GET_CONTENT );
        i.addCategory( Intent.CATEGORY_OPENABLE );
        if (TextUtils.isEmpty( acceptType )) {
            i.setType( "*/*" );
        } else {
            i.setType( acceptType );
        }
        activity.startActivityForResult( Intent.createChooser( i, "Image Chooser" ), FILE_CHOOSER_RESULT_CODE );
    }

}
```
