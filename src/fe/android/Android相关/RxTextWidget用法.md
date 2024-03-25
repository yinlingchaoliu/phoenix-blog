---
title: RxTextWidget用法
date: 2024-03-24 11:47:50
category:
  - Android相关
tag:
  - archive
---

RxTextWidget用法

一组控件数据
```
        textViewList.add( occupationTv );
        textViewList.add( regionTv );
        textViewList.add( workUnitEt );
        textViewList.add( detailedAddressEt );
        RxTextWidget.ObserveTv( textViewList, enable -> {
            nextBtn.setEnabled( enable );
        } );
```

单个控件
```
        RxTextWidget.ObserveTv(smsCodeEt, enable -> {
            nextBtn.setEnabled(enable);
        });
```

实现代码
```
/**
 *
 * 基于RxAndroid的库
 * @author chentong
 * 监测多个edittextview
 *
 */
public class RxTextWidget {

    private static final BehaviorSubject<String> editTextOnTextChanged(final TextView editText) {
        final BehaviorSubject<String> subject = BehaviorSubject.create();

        editText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                subject.onNext(s.toString());
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });
        // 初始化数据
        subject.onNext(editText.getText().toString());

        return subject;
    }

    @SuppressLint("CheckResult")
    private void Observon(BehaviorSubject<String> subject, Consumer<String> action) {
        subject.observeOn(AndroidSchedulers.mainThread()).subscribe(action);
    }

    private static List<BehaviorSubject<String>> getObsList(List<TextView> list) {
        List<BehaviorSubject<String>> obsList = new ArrayList<BehaviorSubject<String>>();
        for (TextView et : list) {
            TextView edittext = (TextView) et;
            obsList.add(editTextOnTextChanged(edittext));
        }
        return obsList;
    }

    @SuppressLint("CheckResult")
    private static void Observe(List<BehaviorSubject<String>> obsList, Consumer<Boolean> action) {

        Observable.combineLatest(obsList, new Function<Object[],Boolean>() {
            @Override
            public Boolean apply(Object[] objects) throws Exception {
                for (Object obj : objects) {
                    String s = (String) obj;
                    if (TextUtils.isEmpty(s)) {
                        return false;
                    }
                }
                return true;
            }

        }).observeOn(AndroidSchedulers.mainThread()).subscribe(action);

    }

    /**
     * 监测edittext  list
     * @param list
     * @param action
     */
    public static void ObserveTv(List<TextView> list, Consumer<Boolean> action){
        List<BehaviorSubject<String>>  behaviorSubjectList =  RxTextWidget.getObsList(list);
        RxTextWidget.Observe(behaviorSubjectList, action);
    }

    public static void ObserveTv(TextView textView, Consumer<Boolean> action){
        List<TextView> editTextList = new ArrayList<>(  );
        editTextList.add( textView );
        ObserveTv(editTextList , action);
    }

}

```
