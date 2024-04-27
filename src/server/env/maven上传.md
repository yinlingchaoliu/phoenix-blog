---
title: maven上传
date: 2024-03-24 11:47:50
order: 17
category:
  - server
tag:
  - env
---

### maven上传

私服
```xml
    <!-- aliyun  私服 上传仓库 -->
    <distributionManagement>
        <repository>
            <id>rdc-releases</id>
            <url>https://repo.rdc.aliyun.com/repository/2398024-release-VBrnHs/</url>
        </repository>
        <snapshotRepository>
            <id>rdc-snapshots</id>
            <url>https://repo.rdc.aliyun.com/repository/2398024-snapshot-ze8pIw/</url>
        </snapshotRepository>
    </distributionManagement>
```

maven库上传 从common 开始