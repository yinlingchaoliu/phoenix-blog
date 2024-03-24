---
title: MVPArmsHelper插件编写代码编写（二）
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

####一、插件编写流程
1、触发Action事件，获得复制内容（见上一）
2、弹框补充信息
3、生成对应模板信息
4、动态插入文件

####一、弹框补充对应信息
新建--》GUI Form
生成文件继承JFrame
如安卓代码一般编写
拖拽的时候自动生成控件ID

####二、生成对应模板信息类![](https://upload-images.jianshu.io/upload_images/5526061-6ccb721e05c7d788.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
详见ArmsConstant.java

三、动态插入文件
核心是PSI 程序结构接口，通俗讲java像xml一样解析
http://www.jetbrains.org/intellij/sdk/docs/basics/architectural_overview/psi.html?search=Psi

修改project文件
常见三个点
1、寻找文件
2、java文件加载、解析、
3、新文件写入内容(非java)

1、寻找文件
```
//api
FilenameIndex.getFilesByName(project, name, scope);

//真实封装
public static PsiFile getFileByName(PsiFile psiFile, String fileName) {
        Project project = psiFile.getProject();
        PsiFile[] psiFiles = FilenameIndex.getFilesByName(project, fileName, new EverythingGlobalScope(psiFile.getProject()));
        if (psiFiles.length != 0) {
            return psiFiles[0];
        }
        return null;
    }

```
2、java文件加载、解析、
```
//psiFile转psiClass
    public static PsiClass getPsiClass(PsiFile psiFile) {
        String fullName = psiFile.getName();
        String className = fullName.split("\.")[0];
        PsiClass[] psiClasses = PsiShortNamesCache.getInstance(psiFile.getProject()).getClassesByName(className, new EverythingGlobalScope(psiFile.getProject()));
        return psiClasses[0];
    }
```
```
//插入文件
PsiElementFactory factory = PsiFileUtils.getFactory(psiFile);
String  content = ArmConstant.getPageContractView(entity);
psiClass.add(factory.createMethodFromText(content,psiClass));
```

//新建文件写入
```
directory.createFile(entity.getClearResponseBean()+".java");
        PsiFile file = directory.findFile(entity.getClearResponseBean()+".java");
        VirtualFile vf= file.getVirtualFile();
        String  content = ArmConstant.getBeanStr(entity);
        ToastUtil.show(content);
        try {
            vf.setBinaryContent(content.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
```

####部署
编译后可以生成插件![](https://upload-images.jianshu.io/upload_images/5526061-59a0158c5e087b89.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


####github 代码
https://github.com/yinlingchaoliu/MVPArmsNetworkHelper
