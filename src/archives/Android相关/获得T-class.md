---
title: 获得T-class
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---

获得T.class
```
Class < T >  entityClass  =  (Class < T > ) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[ 0 ];
```

获得return T.class
```
private Type getReturnTye(Method method){
     return ((ParameterizedType)(method.getGenericReturnType())).getActualTypeArguments()[0];
}
```
