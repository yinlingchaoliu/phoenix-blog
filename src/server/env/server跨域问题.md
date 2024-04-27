---
title: 服务端配置跨域CORS
date: 2024-03-24 11:47:50
order: 15
category:
  - server
tag:
  - env
---

### 同源策略

  为了安全性浏览器有一个同源策略, 一个域名下的应用使用许多数据或者请求的获取, 被限制在同一域名, 协议, 端口, 不然浏览器不会允许请求这些资源, 直接请求就发不出去。

  同源的3种行为:

（1） Cookie、LocalStorage 和 IndexDB 无法读取。

（2） DOM 无法获得。

（3） AJAX 请求不能发送。 

  但是随着互联网的发展, 我们确实需要资源或者服务分布到不同的域当中, 比如前后端分离后, 前端应用和后端的API服务器可能就处于不同的域下。

  要跨域去获取数据有3中方法: JSONP, WebSocket, CORS。 这里主要讲CORS的使用与配置。


CORS 使用简介:

  为了满足新时期的需求, W3C拟定了新的标准, "跨域资源共享"（Cross-origin resource sharing）来使得我们可以实现跨域访问。这里需要注意的是, 这个新的协议完全是由 浏览器 和 服务端 来决定的, 而对于前端开发者来说是完全隐藏了细节的, 前端开发者这里不需要增加任何额外的工作, 浏览器会自动的识别请求是否是跨域请求, 从而与服务端完成通信, 所以只需要后端开发者正确的设置后。

### 服务端配置跨域CORS

* SpringBoot2.4.0后 用[allowedOriginPatterns]代替[allowedOrigins]

```java
package com.ruoyi.framework.config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.concurrent.TimeUnit;

/**
 * 通用配置
 * 
 * @author ruoyi
 */
@Configuration
public class ResourcesConfig implements WebMvcConfigurer
{

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 设置允许跨域的路径
        registry.addMapping("/**")
                // 设置允许跨域请求的域名
//                .allowedOrigins("*")
                .allowedOriginPatterns("*")
                // 是否允许证书
                .allowCredentials(true)
                // 设置允许的方法
                .allowedMethods("POST", "GET", "PUT", "OPTIONS", "DELETE")
                // 设置允许的header属性
                .allowedHeaders("*")
                // 跨域允许时间
                .maxAge(3600);
    }

    @Bean
    public CorsFilter corsFilter()
    {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);//允许Cookie
//        config.addAllowedOrigin("*");//允许任何域名
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");//允许任何头
        config.addAllowedMethod("*");//允许任何方法
        config.setMaxAge(18000L);//设置预检请求保持时间，避免频繁发送预检请求

        // 对接口配置跨域设置
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}

```

### nginx 配置跨域
```bash
 server{
        listen      2000;
        server_name  api_server;
        root   path_to_app;
        charset utf8;

        location / {
          add_header 'Access-Control-Allow-Origin' '*';
          add_header 'Access-Control-Allow-Methods' 'POST, GET, PUT, DELETE, OPTIONS';
          add_header 'Access-Control-Max-Age' 1728000;
          add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range';
          add_header 'Access-Control-Expose-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range';

          if ($request_method = 'OPTIONS') 
          {
            return 204;
          }
        }
    }
```

### express服务

```js
// fix cross-domain 跨域问题
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});
```
