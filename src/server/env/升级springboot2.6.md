---
title: 升级sringboot2.6
date: 2024-03-24 11:47:50
order: 16
category:
  - server
tag:
  - env
---

### 升级sringboot2.6

升级springboot版本从2.2到2.6.6后，同时使用swagger3，启动后报错

Failed to start bean ‘documentationPluginsBootstrapper’; nested exception is java.lang.NullPointerException

```yml
spring.mvc.pathmatch.matching-strategy=ant_path_matcher
```

```xml
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>2.6.6</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>


            <!-- Swagger3依赖 -->
            <dependency>
                <groupId>io.springfox</groupId>
                <artifactId>springfox-boot-starter</artifactId>
                <version>3.0.0</version>
                <exclusions>
                    <exclusion>
                        <groupId>io.swagger</groupId>
                        <artifactId>swagger-models</artifactId>
                    </exclusion>
                    <exclusion>
                        <groupId>org.mapstruct</groupId>
                        <artifactId>mapstruct</artifactId>
                    </exclusion>
                </exclusions>
            </dependency>
```
