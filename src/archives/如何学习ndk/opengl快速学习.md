---
title: opengl快速学习
date: 2024-03-24 11:47:50
category:
  - 如何学习ndk
tag:
  - archive
---
####前言
https://juejin.im/post/5e00bc2051882512454b44f3

opengl学习方法

* 1）原理
原理便于系统理解opengl

* 2）通用封装方法
封装是基于整体性理解，用面向对象思想封装，增加复用性同时，也增加易用性

* 3）实战范例
实战范例目的是新手在项目基础上修改，通过直观效果，更容易理解opengl
案例：https://github.com/yinlingchaoliu/HowToLearnNdk
模块：opengl

####opengl原理及思考

#####1、 opengl的安卓支持 
 * 1、Android为opengl提供特定视图GLSurfaceView，可以单独运行在一个单独线程中，提供渲染方法setRenderer来设置渲染器

    实现特定渲染器，可以让图像效果多样化
GLSurfaceView. Renderer 

    渲染器
```
    public interface Renderer {
       //视图创建时调用  初始化工作
        void onSurfaceCreated(GL10 gl, EGLConfig config);
        //视图改变时调用  主流程绘制工作
        void onSurfaceChanged(GL10 gl, int width, int height);
        //视图绘制时调用  实时监测工作
        void onDrawFrame(GL10 gl);
    }
```

* 2、opengl坐标
OpenGL 都会把手机屏幕映射到 [-1，1] 的范围内。也就是说：屏幕的左边对应 X 轴的 -1 ，屏幕的右边对应 +1，屏幕的底边会对应 Y 轴的 -1，而屏幕的顶边就对应 +1,屏幕中心[0,0]

* 3、基本图元
点、线、三角形 
其他所有图形都是基于三种图元完成，矩形视为两个三角形拼成

#####2、基本思考
`编写代码时刻要考虑，视图与逻辑分离作为第一原则`
1、图像基本组成要素是一样的，要抽象出来增加复用性
2、图像修改，要通过回调来操作，避免业务代码写到图像代码中，增加可读性
3、每种图形GLSurfaceView，Renderer代码中，避免过多全局变量，如果渲染器或图形视图过于复杂，要分开写

#####opengl 整体渲染流程

* ######1、渲染管线及流程

  1）渲染管线也称为渲染流水线或像素流水线或像素管线，是显示芯片内部（GPU）处理图形信号相互独立的并行处理单元。现阶段显卡分为顶点渲染和像素渲染

![opengl渲染管线处理流程](https://upload-images.jianshu.io/upload_images/5526061-33fa4c366e9dc108.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

顶点着色器 ：根据顶点坐标，建立图形模型。
片段着色器：图形填上颜色。

目前手机上opengl使用渲染管线，围绕形状绘制和着色展开工作

* 1、读取顶点数据-内存拷贝
将顶点坐标通过内存拷贝传递给渲染管线
Java层传递
```
   // 声明一个字节缓冲区 FloatBuffer
   private FloatBuffer floatBuffer;
   // 定义顶点数据
   float[] vertexData = new float[16];
   // FloatBuffer 初始化工作并放入顶点数据
   floatBuffer = ByteBuffer
       .allocateDirect(vertexData.length * Constant.BYTES_PRE_FLOAT)
       .order(ByteOrder.nativeOrder())
       .asFloatBuffer()
       .put(vertexData);
```

* 2、执行顶点着色器和组装图元
用GLSL语言定义着色
```
attribute vec4 a_Position;
void main()
{
    gl_Position = a_Position; //接收顶点坐标
    gl_PointSize = 30.0; //点大小
}
```
顶点坐标    a_Position
特殊全局变量 gl_Position 和 gl_PointSize
实战：要提供通用ShapeUtil工具类，便于快速着色

* 3、光栅化图元
OpenGL 就是通过 光栅化 技术的过程把每个点、直线及三角形分解成大量的小片段，它们可以映射到移动设备显示屏的像素上，从而生成一幅图像

* 4、执行片段着色器
片段着色器的主要目的就是告诉 GPU 每个片段的最终颜色应该是什么

```
precision mediump float; //精度
uniform vec4 u_Color; //颜色
void main()
{
    gl_FragColor = u_Color;
}
```
颜色的全局变量 ：gl_FragColor
java层颜色赋值：u_Color
精度：mediump
片段着色之后，自动写入缓存，显示在屏幕上

 #####2、opengl代码编写完整流程
* 1、编译OpenGL程序
四步流程
1、编译着色器
2、创建opengl程序和着色器链接
3、验证OpenGL程序
4、使用opengl程序

```
public class ShaderHelper {

  //编译着色器
  public static int compileShader(int type, String shaderCode);
  
//创建 OpenGL 程序和着色器链接
  public static int linkProgram(int vertexShaderId, int fragmentShaderId) ;

  //验证OpenGL程序
  public static boolean validateProgram(int programObjectId) ;

  //使用open程序
  public static void  glUseProgram(int program)；
}
```
* 2、绘制Renderer渲染器
* 3、GLSurfaceView与
特别注意

```
创建opengl必须在onSurfaceCreated()方法中，才能生效
```
