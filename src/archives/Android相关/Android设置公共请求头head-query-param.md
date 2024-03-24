---
title: Android设置公共请求头head-query-param
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---
原理：通过okhttp intercept
```
/**
 * @author chentong
 * @date 2019-2-20
 * 设置公共参数
 * head params query
 */
public class HttpBaseParamsInterceptor implements Interceptor {

    private Map<String, String> queryParamsMap = new HashMap<>();
    private Map<String, String> paramsMap = new HashMap<>();
    private Map<String, String> headerParamsMap = new HashMap<>();
    private List<String> headerLinesList = new ArrayList<>();

    private static final String X_WWW_FORM_URLENCODED = "x-www-form-urlencoded";
    private Builder builder;
    private UpdateHandler updateHandler;

    public HttpBaseParamsInterceptor() {
    }

    @Override
    public Response intercept(Chain chain) throws IOException {

        //每次获取公共数据
        if (updateHandler != null) {
            builder = updateHandler.createNewBuilder();
            reloadBuilder( builder );
        }

        Request request = chain.request();
        Request.Builder requestBuilder = request.newBuilder();

        // 设置header
        Headers.Builder headerBuilder = request.headers().newBuilder();
        if (headerParamsMap.size() > 0) {
            Iterator iterator = headerParamsMap.entrySet().iterator();
            while (iterator.hasNext()) {
                Map.Entry entry = (Map.Entry) iterator.next();
                headerBuilder.add( (String) entry.getKey(), (String) entry.getValue() );
            }
        }

        if (headerLinesList.size() > 0) {
            for (String line : headerLinesList) {
                headerBuilder.add( line );
            }
        }

        requestBuilder.headers( headerBuilder.build() );

        // process queryParams inject whatever it's GET or POST
        if (queryParamsMap.size() > 0) {
            injectParamsIntoUrl( request, requestBuilder, queryParamsMap );
        }

        // process header params end
        //设置param
        //请求体 可以为空
        RequestBody requestBody = request.body();
        boolean hasRequestBody = requestBody != null;

        String contentType = "";

        if (hasRequestBody) {
            //contentType存在空
            if (requestBody.contentType() != null) {
                contentType = requestBody.contentType().toString();
            }
        }

        if (request.method().equals( "POST" ) && contentType.contains( X_WWW_FORM_URLENCODED )) {
            FormBody.Builder formBodyBuilder = new FormBody.Builder();
            if (paramsMap.size() > 0) {
                Iterator iterator = paramsMap.entrySet().iterator();
                while (iterator.hasNext()) {
                    Map.Entry entry = (Map.Entry) iterator.next();
                    formBodyBuilder.add( (String) entry.getKey(), (String) entry.getValue() );
                }
            }

            RequestBody formBody = formBodyBuilder.build();
            String formBodyString = bodyToString( formBody );
            String requestBodyString = bodyToString( requestBody );
            String postBodyString = "";
            if (!TextUtils.isEmpty( requestBodyString ) && !TextUtils.isEmpty( formBodyString )) {
                postBodyString = requestBodyString + "&" + formBodyString;
            } else if (!TextUtils.isEmpty( requestBodyString ) || TextUtils.isEmpty( formBodyString )) {
                postBodyString = requestBodyString;
            } else if (TextUtils.isEmpty( requestBodyString ) && !TextUtils.isEmpty( formBodyString )) {
                postBodyString = formBodyString;
            } else if (TextUtils.isEmpty( requestBodyString ) && TextUtils.isEmpty( formBodyString )) {
                postBodyString = "";
            }
            requestBuilder.post( RequestBody.create( MediaType.parse( "application/x-www-form-urlencoded;charset=UTF-8" ), postBodyString ) );
        } else {
            injectParamsIntoUrl( request, requestBuilder, paramsMap );
        }

        request = requestBuilder.build();
        return chain.proceed( request );
    }

    // func to inject params into url
    private void injectParamsIntoUrl(Request request, Request.Builder requestBuilder, Map<String, String> paramsMap) {
        HttpUrl.Builder httpUrlBuilder = request.url().newBuilder();
        if (paramsMap.size() > 0) {
            Iterator iterator = paramsMap.entrySet().iterator();
            while (iterator.hasNext()) {
                Map.Entry entry = (Map.Entry) iterator.next();
                httpUrlBuilder.addQueryParameter( (String) entry.getKey(), (String) entry.getValue() );
            }
        }

        requestBuilder.url( httpUrlBuilder.build() );
    }

    private String bodyToString(final RequestBody requestBody) {
        if (requestBody == null) return "";
        try {
            Buffer buffer = new Buffer();
            requestBody.writeTo( buffer );
            return buffer.readUtf8();
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * 设置刷新句柄
     * @param updateHandler
     */
    public void setUpdateHandler(UpdateHandler updateHandler) {
        this.updateHandler = updateHandler;
    }

    public interface UpdateHandler {
        Builder createNewBuilder();
    }

    /**
     * 重新加载数据
     * @param builder
     */
    private void reloadBuilder(Builder builder) {
        queryParamsMap.clear();
        paramsMap.clear();
        headerParamsMap.clear();
        headerLinesList.clear();

        queryParamsMap.putAll( builder.queryParamsMap );
        paramsMap.putAll( builder.paramsMap );
        headerParamsMap.putAll( builder.headerParamsMap );
        headerLinesList.addAll( builder.headerLinesList );
    }

    /**
     * 数据要刷新
     */
    public static class Builder {

        private Map<String, String> queryParamsMap = new HashMap<>();
        private Map<String, String> paramsMap = new HashMap<>();
        private Map<String, String> headerParamsMap = new HashMap<>();
        private List<String> headerLinesList = new ArrayList<>();

        public Builder() {
        }

        public Builder addParam(String key, String value) {
            paramsMap.put( key, value );
            return this;
        }

        public Builder addParamsMap(Map<String, String> paramsMap) {
            paramsMap.putAll( paramsMap );
            return this;
        }

        public Builder addHeaderParam(String key, String value) {
            headerParamsMap.put( key, value );
            return this;
        }

        public Builder addHeaderParamsMap(Map<String, String> headerParamsMap) {
            headerParamsMap.putAll( headerParamsMap );
            return this;
        }

        public Builder addHeaderLine(String headerLine) {
            int index = headerLine.indexOf( ":" );
            if (index == -1) {
                throw new IllegalArgumentException( "Unexpected header: " + headerLine );
            }
            headerLinesList.add( headerLine );
            return this;
        }

        public Builder addHeaderLinesList(List<String> headerLinesList) {
            for (String headerLine : headerLinesList) {
                int index = headerLine.indexOf( ":" );
                if (index == -1) {
                    throw new IllegalArgumentException( "Unexpected header: " + headerLine );
                }
                headerLinesList.add( headerLine );
            }
            return this;
        }

        public Builder addQueryParam(String key, String value) {
            queryParamsMap.put( key, value );
            return this;
        }

        public Builder addQueryParamsMap(Map<String, String> queryParamsMap) {
            queryParamsMap.putAll( queryParamsMap );
            return this;
        }

        public Builder build() {
            return this;
        }

    }
}
```

使用
```
    /**
     * 设置http公共参数
     * head query param
     * @return
     */
    private HttpBaseParamsInterceptor getBaseParams(){
        HttpBaseParamsInterceptor interceptor = new HttpBaseParamsInterceptor();
        interceptor.setUpdateHandler( () -> {
            //设置公共参数
            String versionCode =AppUtlis.getVersionCode(MyApplication.getInstance() ).toString();
            String userId = SharePreferenceUtill.getStringData(ContansUtils.USERID_KEY, "");
            HttpBaseParamsInterceptor.Builder  builder = new HttpBaseParamsInterceptor.Builder()
                    .addParam( ContansUtils.USERID_KEY,userId )
                    .addParam("versionCode",versionCode).build();
            return builder;
        } );

        return interceptor;
    }

```
