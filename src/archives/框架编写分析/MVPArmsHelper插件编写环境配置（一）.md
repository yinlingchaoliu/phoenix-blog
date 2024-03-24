---
title: MVPArmsHelper插件编写环境配置（一）
date: 2024-03-24 11:47:50
category:
  - 框架编写分析
tag:
  - archive
---
####导航
[MVPArmsHelper 网络代码自动生成插件](https://www.jianshu.com/p/13006b034211)
[MVPArmsHelper插件编写环境配置（一）](https://www.jianshu.com/p/35d40e172a63)
[MVPArmsHelper插件编写代码编写（二）](https://www.jianshu.com/p/cd0bd74f800b)

#####一、环境配置
1、IntelliJ IDE开发
https://www.jetbrains.com/idea/download/
建议下载 Community 免费版
2、groovy下载
https://groovy.apache.org/download.html
配置
.bash_profile文件添加
```
export PATH=$PATH:/Users/chentong/Android/groovy-2.5.6/bin
$ source .bash_profile
```
新建插件项目
选择IntelliJ Platform Plugin![](https://upload-images.jianshu.io/upload_images/5526061-d025d879a494a9d5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

配置jdk![](https://upload-images.jianshu.io/upload_images/5526061-76433321391c3c7c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

运行项目报错
One of the two will be used. Which one is undefined.
解决方案：https://www.jianshu.com/p/26cefcc04fec

#####二、目录结构
![](https://upload-images.jianshu.io/upload_images/5526061-d7f75f6b81d8df66.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

* .idea: idea的一些配置信息。
* out: 编译生成文件，
* resources/META-INF/plugin.xml: 插件的一些描述信息
* src: 这里就是我们要写代码的地方啦。
* .iml: 项目的一些自动配置信息

####配置插件信息
```
<idea-plugin>
  <id>com.network.helper.mvparmshelper</id>
  <name>ArmMVPHelper</name>
  <version>1.0</version>
  <vendor email="704514698@qq.com" url="https://www.jianshu.com/u/bdcce32c05dd">陈桐</vendor>

  <description>ArmMVP框架 网络代码自动生成工具</description>

  <change-notes>第一版</change-notes>

  <!-- please see http://www.jetbrains.org/intellij/sdk/docs/basics/getting_started/build_number_ranges.html for description -->
  <idea-version since-build="173.0"/>

  <!-- please see http://www.jetbrains.org/intellij/sdk/docs/basics/getting_started/plugin_compatibility.html
       on how to target different products -->
  <!-- uncomment to enable plugin in all products
  <depends>com.intellij.modules.lang</depends>
  -->

  <extensions defaultExtensionNs="com.intellij">
    <!-- Add your extensions here -->
  </extensions>


  <!-- 类似android manifiest -->
  <actions>
    <!-- Add your actions here -->
    <!--<action class="com.network.helper.armmvp"/>-->
      <action id="armnetwork" class="com.network.helper.NetworkHelper" text="ArmMVP Network Helper" description="Arm MVP 网络代码自动生成工具">
          <add-to-group group-id="GenerateGroup" anchor="last"/>
      </action>
  </actions>

</idea-plugin>
```

* id： 插件唯一的id。
* name： 插件显示的名字。
* version： 插件版本
* vendor： 里面分别是你的邮箱，公司网站或个人网站，公司名。
* description： 插件的描述。
* change-notes： 更新文档。
* extensions defaultExtensionNs： 默认依赖的库。
* actions： 注册动作Action类。

####配置Action
新建Action
![](https://upload-images.jianshu.io/upload_images/5526061-d212fa65e344adbd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/5526061-2fb2dae91f08a263.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```
public class NetworkHelper extends AnAction {
    @Override
    public void actionPerformed(AnActionEvent anActionEvent) {

    }
}

```
提供两个方法
1、获得光标下单词
```
public static PsiElement getPsiElement(Editor editor, PsiFile psiFile) {
        if (editor == null || psiFile == null) {
            return null;
        }
        CaretModel caret = editor.getCaretModel();
        PsiElement psiElement = psiFile.findElementAt(caret.getOffset());
        return psiElement;
    }

psiElement.getText();
```
2、获得当前复制内容
```
public static String getSelectedText(Editor editor) {
        if (editor == null) {
            return null;
        }
        return editor.getSelectionModel().getSelectedText();
    }
```

####github 代码
https://github.com/yinlingchaoliu/MVPArmsNetworkHelper
