---
title: EventBus源码分析
date: 2024-03-24 11:47:50
category:
  - 框架编写分析
tag:
  - archive
---
###EventBus源码分析
####1、源码分析要点
EventBus是观察者模式，是一对多，一般源码分析的重点在register方法上，分析的核心应在在消息队列上PendingPostQueue

1、消息队列
```
PendingPostQueue{
    void enqueue(PendingPost pendingPost)//加入消息
    PendingPost poll()//取出消息
}
```

2、处理消息核心 五种策略
```
interface Poster {
    void enqueue(Subscription subscription, Object event);//加入消息    
}
```
####1、Poster消息队列存取
```
class XXXPoster implements Runnable, Poster {

    public void enqueue(Subscription subscription, Object event) {
        //插入消息
        PendingPost pendingPost = PendingPost.obtainPendingPost(subscription, event);
        queue.enqueue(pendingPost);
        //运行
        eventBus.getExecutorService().execute(this);
    }

    @Override
    public void run() {
        //取出消息
        PendingPost pendingPost = queue.poll();
        //处理消息
        eventBus.invokeSubscriber(pendingPost);
    }

}
```

####2、register消费者注册列表
```
public void register(Object subscriber) {
        Class<?> subscriberClass = subscriber.getClass();
        //获得该类注解信息列表
        List<SubscriberMethod> subscriberMethods = subscriberMethodFinder.findSubscriberMethods(subscriberClass);
        synchronized (this) {
            for (SubscriberMethod subscriberMethod : subscriberMethods) {
                subscribe(subscriber, subscriberMethod);
            }
        }
    }
``` 

```
private void subscribe(Object subscriber, SubscriberMethod subscriberMethod) {
        Class<?> eventType = subscriberMethod.eventType;
        Subscription newSubscription = new Subscription(subscriber, subscriberMethod);
        //注册事件列表
        CopyOnWriteArrayList<Subscription> subscriptions = subscriptionsByEventType.get(eventType);
        if (subscriptions == null) {
            subscriptions = new CopyOnWriteArrayList<>();
            subscriptionsByEventType.put(eventType, subscriptions);
        }
        
        //注册该类
        List<Class<?>> subscribedEvents = typesBySubscriber.get(subscriber);
        if (subscribedEvents == null) {
            subscribedEvents = new ArrayList<>();
            typesBySubscriber.put(subscriber, subscribedEvents);
        }
        subscribedEvents.add(eventType);
    }
```

找该类所有注解方法
```
    List<SubscriberMethod> findSubscriberMethods(Class<?> subscriberClass) {
        List<SubscriberMethod> subscriberMethods = METHOD_CACHE.get(subscriberClass);
        subscriberMethods = findUsingReflection(subscriberClass);
        return subscriberMethods;
    }
```

//寻找注解实现
```
private void findUsingReflectionInSingleClass(FindState findState) {
        Method[] methods;
        try {
            // This is faster than getMethods, especially when subscribers are fat classes like Activities
            methods = findState.clazz.getDeclaredMethods();
        } catch (Throwable th) {
            methods = findState.clazz.getMethods();
            findState.skipSuperClasses = true;
        }
        for (Method method : methods) {
            int modifiers = method.getModifiers();
            if ((modifiers & Modifier.PUBLIC) != 0 && (modifiers & MODIFIERS_IGNORE) == 0) {
                Class<?>[] parameterTypes = method.getParameterTypes();
                if (parameterTypes.length == 1) {
                    Subscribe subscribeAnnotation = method.getAnnotation(Subscribe.class);
                    if (subscribeAnnotation != null) {
                        Class<?> eventType = parameterTypes[0];
                        if (findState.checkAdd(method, eventType)) {
                            ThreadMode threadMode = subscribeAnnotation.threadMode();
                            findState.subscriberMethods.add(new SubscriberMethod(method, eventType, threadMode,
                                    subscribeAnnotation.priority(), subscribeAnnotation.sticky()));
                        }
                    }
                }
            }
    }
```

####3、post放入消息流程
```
post(event)-->postSingleEvent()-->postSingleEventForEventType()-->postToSubscription()-->XXXPoster.enqueue(subscription, event)
```
1、通过event寻找注册类
```
private void postSingleEvent(Object event, PostingThreadState postingState) throws Error {
        Class<?> eventClass = event.getClass();
        boolean subscriptionFound = false;
            List<Class<?>> eventTypes = lookupAllEventTypes(eventClass);
            int countTypes = eventTypes.size();
            for (int h = 0; h < countTypes; h++) {
                Class<?> clazz = eventTypes.get(h);
                subscriptionFound |= postSingleEventForEventType(event, postingState, clazz);
            }
}
```

通过event寻找该注册类函数清单，发送
```
private boolean postSingleEventForEventType(Object event, PostingThreadState postingState, Class<?> eventClass) {
        CopyOnWriteArrayList<Subscription> subscriptions;
        synchronized (this) {
            //通过发送事件类型寻找注册表
            subscriptions = subscriptionsByEventType.get(eventClass);
        }
            //遍历整个列表发送消息
            for (Subscription subscription : subscriptions) {
                postingState.event = event;
                postingState.subscription = subscription;
                //处理消息
                postToSubscription(subscription, event, postingState.isMainThread); 
            }
            return true;
        }
        return false;
    }
```

####4、普通post与postSticky区别
1、postSticky 缓存最新的一个事件
2、register后，postSticky 自动触发一遍该类的缓存的事件
```
public void postSticky(Object event) {
        synchronized (stickyEvents) {
            stickyEvents.put(event.getClass(), event);
        }
        post(event);
    }
```

```
private void subscribe(Object subscriber, SubscriberMethod subscriberMethod) {
    if (subscriberMethod.sticky) {
        Object stickyEvent = stickyEvents.get(eventType);
        checkPostStickyEventToSubscription(newSubscription, stickyEvent);
    }
}
```

####定制化RxBus
#####设计rxbus重点
1、调用方式与EventBus一致，降低使用成本
2、rxjava是观察者模式，可以替换Eventbus消息队列和处理消息的策略模式
3、支持线程安全
4、支持黏性事件
