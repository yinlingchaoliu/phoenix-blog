---
title: 从无到有手写ButterKnife框架-1
date: 2024-03-24 11:47:50
category:
  - 框架编写分析
tag:
  - archive
---
#####导航
一、[代码的演进](https://www.jianshu.com/p/a96de1aa4e29)
二、[butterKnife反射调用](https://www.jianshu.com/p/f8856e913224)
三、[javapoet自动生成模板代码](https://www.jianshu.com/p/cdf417e52cab)
四、[apt与注解](https://www.jianshu.com/p/43eb69b2beeb)
五、[注解支持多层继承](https://www.jianshu.com/p/a91cbfb8b1a1)
六、[apt调试](https://www.jianshu.com/p/8418ef144b29)
七、[javapoet语法](https://www.jianshu.com/p/2da1ca9d8ffa)

#####1、前言
反射解决了调用相同模板，调用方式统一的问题

如下代码:
```
 unbinder = new FirstActivity_ViewBinding(FirstActivity.this, getWindow().getDecorView());

 unbinder = new Demo1Activity_ViewBinding( Demo1Activity.this,getWindow().getDecorView() );
```
如果代码命名非常规范的话，初始化控件的代码调用，项目中会频繁出现,如果不想这样重复的写来写去。可以考虑用到反射

butterknife解决方案通用写法
```
全部这样搞定
ButterKnife.bind( this );
ButterKnife.bind( this ,view);

ButterKnife.unbind(unbind);
```

一般写法
* 1、现写约束接口
* 2、反射调用初始化
由于初始化控件，构造方法就足够了。
约束接口，只关心释放即可

```
//约束接口
public interface Unbinder {
    @UiThread
    void unbind();

    //空方法
    Unbinder EMPTY = new Unbinder() {
        @Override public void unbind() { }
    };
}
```

#####2、震撼butterKnife核心代码不足100行
```
/**
 * 精简的butterknife框架
 * @author chentong
 */
public class ButterKnife {
    //缓存模板类，键值对（模板类、对应构造方法）
    private static final Map<Class<?>, Constructor<? extends Unbinder>> BINDINGS = new LinkedHashMap<>();
    
    //对象不能new 
    private ButterKnife() {
        throw new AssertionError( "No instances." );
    }

    //绑定方法
    @NonNull
    @UiThread
    public static Unbinder bind(@NonNull Activity target) {
        View sourceView = target.getWindow().getDecorView();
        return createBinding( target, sourceView );
    }

    @NonNull
    @UiThread
    public static Unbinder bind(@NonNull Object target, @NonNull View source) {
        return createBinding( target, source );
    }

    private static Unbinder createBinding(Object target, View source) {

        Class<?> targetClass = target.getClass();
        //寻找模板类的构造方法
        Constructor<? extends Unbinder> constructor = findBindingConstructorForClass( targetClass );
        if (constructor == null) {
            return Unbinder.EMPTY;
        }

        //实例化
        try {
            //实例化，就可以给控件赋值
            return constructor.newInstance( target, source);
        }catch (Exception e){
            throw new RuntimeException("Unable to invoke " + constructor, e);
        }
    }

    private static Constructor<? extends Unbinder> findBindingConstructorForClass(Class<?> targetClass) {
        //查缓存 避免频繁用到反射
        Constructor<? extends Unbinder> binderConstructor = BINDINGS.get( targetClass );
        if (binderConstructor != null) {
            return binderConstructor;
        }

        String clazzName = targetClass.getName();
        if (clazzName.startsWith( "android." ) || clazzName.startsWith( "java." )) {
            //系统方法错误
            return null;
        }

        try {
            //反射类加载 加载模板
            Class<?> bindingClass = targetClass.getClassLoader().loadClass( clazzName + "_ViewBinding" );
            binderConstructor = (Constructor<? extends Unbinder>) bindingClass.getConstructor( targetClass, View.class );
        }catch (ClassNotFoundException e){
            binderConstructor = findBindingConstructorForClass(targetClass.getSuperclass());
        }catch (Exception e){
            return null;
        }

        if (binderConstructor!=null){
            BINDINGS.put( targetClass, binderConstructor );
        }
        return binderConstructor;
    }

    //释放函数
    @NonNull
    @UiThread
    public static void unbind(Unbinder target) {
        if (target != null && target != Unbinder.EMPTY) {
            target.unbind();
        }
    }

}
```

统一都可以写成这样
```
    TextView helloTv;

    private Unbinder unbinder;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate( savedInstanceState );
        setContentView( R.layout.activity_main );

        unbinder = ButterKnife.bind( this );

        helloTv.setOnClickListener( v->{
            Toast.makeText( this,"hello butterknife",Toast.LENGTH_SHORT ).show();
        } );

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        ButterKnife.unbind( unbinder );
    }
```

#####从无到有手写butterKnife框架
https://github.com/yinlingchaoliu/JavaPoetDemo
