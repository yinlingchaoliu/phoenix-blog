---
title: github gpg生成秘钥
date: 2024-04-15 11:47:50
category:
  - git相关
tag:
  - git相关
---

github 采用gpg生成秘钥

解决方法：

### 生成key
```bash
gpg --default-new-key-algo rsa4096 --gen-key


pub   rsa4096 2024-05-08 [SC] [有效至：2026-05-08]
      0EF91DB916621AA8A658304ABAB65E6FAFFB5278
uid                      xxx <xxxxx@mail.com>
 
```

### 导出公钥

```bash
# 导出公钥
 gpg --armor --export 0EF91DB916621AA8A658304ABAB65E6FAFFB5278

-----BEGIN PGP PUBLIC KEY BLOCK-----

mQINBGY7XDYBEADJUFk6YxrfpsgQgW0eKJIY6QAVJZ88GRGQk30dsv9J+bQViRgA
PsCquiqfWRWXLRSbxYQS/QiafAAbM/ZYzk0rqehkdjrTegOmgzUpl7/z/dk36JsE
llqvR0/Ja17zhbRMX0uA4k/b+epII1iHAhEaYS7FV1Rjh1FUsiWLzDBLOSaLUTyo
o0RtwXS8VdpNHpaQZmyJ7KgTDlDNWXfkqnvdG2Ls8SUO7680pkd99t73yuNofqIu
dX+bRPftqNntTzFxFjcVJ/s23TBnolv5V4KIhEQc2l+tVPw+CW6Ny8D1cbkxo4Qc
AJHxXDZ1ygz9EZX+xntfBy7gllk+If2X0bdCQpbFCFqrgphZeU2nuHxvp2kC6zH2
6hxRQ2W21xfHVUQa0qRIEpMS3gbNVwVbZfygNrAwRZrnTu40pRP2OIFWvQe8AZY6
9Fyly6u4+J5yCkDgTlFFngqkcvhQxhpWtV2HJtMxWxoxreeSWN7Pl2bGHoD9ADTa
gb13/mV28K4F9oKB8HGCfPhbkcnQI0sq/VwYrPPgq4CMTyTxFP8Tmr+U81y0dwmb
GFumy2P/4nNTC0C9V8C2vAtRJ2OA1ShJC99nS3x0sAdlIcF0SfZf2xNlb5Fy/8kJ
KyGtqOdvl3lKmdygPwsAPnkTBy0sTZ53jNSg+pej1t3ml6giXnT/SQU8PQARAQAB
tBbpmYjmoZAgPGhlYXQxM0BxcS5jb20+iQJXBBMBCABBFiEEDvkduRZiGqimWDBK
urZeb6/7UngFAmY7XDYCGwMFCQPCZwAFCwkIBwICIgIGFQoJCAsCBBYCAwECHgcC
F4AACgkQurZeb6/7UnjCERAAqiKGIq1sQxbTUU6Yr1aVSZos8XFcWUrB5dQySxLd
q1nWwXZTn7nENUwuxeeE/X2r0o0TXTeBU3amYXbB/6yRYJgNa9Lf8pvCB0kMaOAk
EzxOAaF6WXfNhTCFkMqEYjgGkopZqRUleEanbeDXnNm7Y7Vktiuykr8Q6Ctvb6/6
3gRB+ubt40IWz/tyMrmVyFrAupduIkK3Lhj234q07CFgqSRrSytZwe2ANC6lQAwn
u9ztpBgIY6yt/Q4eCEK5yd9lmEI5GmdaNwJOSYdXtUSpmwnsSaagFmQkzuy6IvaS
dSwNMTnWOLTahkpahKYFTYpVCwbJAyAqofHxfFz1fgDxcRbmnO4yIK0pqt+78Z5A
A4jGXVnah+rKhG7OeVWlpkCIcm7ewB4CeGWTxs2yDb6cmJRUO6aqKH3xXFkXTXbb
3zxuXJD435gA5yPGgLo9BGSOhgE8JWXTbxk6MQ/VquPhoF/rLK+JmgrtuYJ1qAui
SRAXfyGUojdSMZEh2uN6o+2sjyyexIdEaNgOWVIndLbIJKhqcnW6mlA4fgZhH2fm
lBFs3rqhC5VJn5EL4VPlwIfSbOL9Q0eHet5M1FUCgi2n+B0bcN85yK/IZIv9wH+D
I9XekmiPJTRu2RFOANQ71ZU9LL7zXsG6hrZY+8lP0zYNK5dtALQDQMfPYEr26N90
U54=
=3ds1
-----END PGP PUBLIC KEY BLOCK-----
```

### 仓库镜像管理(gitee->github同步)
```
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
```