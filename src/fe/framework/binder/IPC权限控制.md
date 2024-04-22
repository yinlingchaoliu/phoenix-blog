---
title: IPC权限管理
date: 2024-04-14 11:47:50
order: 7
category:
  - framework
tag:
  - binder
---

### 权限管理
本质: 外部访问通过内部代理，而不是直接访问

### 核心代码

远程调用

```c
status_t IPCThreadState::executeCommand(int32_t cmd)
{
    BBinder* obj;
    RefBase::weakref_type* refs;
    status_t result = NO_ERROR;

    switch ((uint32_t)cmd) {
        case BR_TRANSACTION:
        {
            const pid_t origPid = mCallingPid;
            const uid_t origUid = mCallingUid;
            mCallingPid = tr.sender_pid; //设置调用者pid
            mCallingUid = tr.sender_euid;//设置调用者uid

            reinterpret_cast<BBinder*>(tr.cookie)->transact(tr.code, buffer,
                        &reply, tr.flags);
            mCallingPid = origPid; //恢复原来的pid
            mCallingUid = origUid; //恢复原来的uid
        }
    }
}
```

```java

//作用是清空远程调用端的uid和pid，用当前本地进程的uid和pid替代；
public static final native long clearCallingIdentity();
//作用是恢复远程调用端的uid和pid信息，正好是`clearCallingIdentity`的反过程;
public static final native void restoreCallingIdentity(long token);

```

清空远程调用端的uid和pid
```c
static jlong android_os_Binder_clearCallingIdentity(JNIEnv* env, jobject clazz)
{
    //调用IPCThreadState类的方法执行
    return IPCThreadState::self()->clearCallingIdentity();
}

int64_t IPCThreadState::clearCallingIdentity()
{
    int64_t token = ((int64_t)mCallingUid<<32) | mCallingPid;
    clearCaller();
    return token;
}

void IPCThreadState::clearCaller()
{
    mCallingPid = getpid(); //当前进程pid赋值给mCallingPid
    mCallingUid = getuid(); //当前进程uid赋值给mCallingUid
}

```

```c
static void android_os_Binder_restoreCallingIdentity(JNIEnv* env, jobject clazz, jlong token)
{
    //token记录着uid信息，将其右移32位得到的是uid
    int uid = (int)(token>>32);
    if (uid > 0 && uid < 999) {
        //目前Android中不存在小于999的uid，当uid<999则抛出异常。
        char buf[128];
        jniThrowException(env, "java/lang/IllegalStateException", buf);
        return;
    }
    //调用IPCThreadState类的方法执行
    IPCThreadState::self()->restoreCallingIdentity(token);
}

void IPCThreadState::restoreCallingIdentity(int64_t token)
{
    mCallingUid = (int)(token>>32);
    mCallingPid = (int)token;
}
```

### 代码路径
```markdown
frameworks/base/core/java/android/os/Binder.java
frameworks/base/core/jni/android_util_Binder.cpp
frameworks/native/libs/binder/IPCThreadState.cpp
```