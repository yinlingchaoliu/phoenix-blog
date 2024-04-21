---
title: mysql远程开放3306
date: 2024-03-24 11:47:50
order: 6
category:
  - server
tag:
  - env
---

### 阿里安全组开启3306端口

[阿里云开放安全组3306](阿里云开放安全组端口.md)


### mysql 支持远程连接配置 

```bash
vi /etc/my.cnf

[mysqld]
bind-address = 0.0.0.0

vi /etc/mysql/mysql.conf.d/mysqld.cnf

# 注释掉 bind-address
# bind-address = 127.0.0.1

```

### 重启服务

```bash
sudo service mysql restart
```

### 配置mysql权限

```bash
mysql -u root -p

#授权账号远程连接
# ‘root’是错的  会导致数据库 有双引号
grant all privileges on *.* to root@'%'  identified by '111111';

FLUSH PRIVILEGES;
```

### 查询生效的user表

```bash
mysql> select * from mysql.user;
+-----------+------------------+-------------+-------------+-------------+-------------+-------------+-----------+-------------+---------------+--------------+-----------+------------+-----------------+------------+------------+--------------+------------+-----------------------+------------------+--------------+-----------------+------------------+------------------+----------------+---------------------+--------------------+------------------+------------+--------------+------------------------+----------+------------+-------------+--------------+---------------+-------------+-----------------+----------------------+-----------------------+-------------------------------------------+------------------+-----------------------+-------------------+----------------+
| Host      | User             | Select_priv | Insert_priv | Update_priv | Delete_priv | Create_priv | Drop_priv | Reload_priv | Shutdown_priv | Process_priv | File_priv | Grant_priv | References_priv | Index_priv | Alter_priv | Show_db_priv | Super_priv | Create_tmp_table_priv | Lock_tables_priv | Execute_priv | Repl_slave_priv | Repl_client_priv | Create_view_priv | Show_view_priv | Create_routine_priv | Alter_routine_priv | Create_user_priv | Event_priv | Trigger_priv | Create_tablespace_priv | ssl_type | ssl_cipher | x509_issuer | x509_subject | max_questions | max_updates | max_connections | max_user_connections | plugin                | authentication_string                     | password_expired | password_last_changed | password_lifetime | account_locked |
+-----------+------------------+-------------+-------------+-------------+-------------+-------------+-----------+-------------+---------------+--------------+-----------+------------+-----------------+------------+------------+--------------+------------+-----------------------+------------------+--------------+-----------------+------------------+------------------+----------------+---------------------+--------------------+------------------+------------+--------------+------------------------+----------+------------+-------------+--------------+---------------+-------------+-----------------+----------------------+-----------------------+-------------------------------------------+------------------+-----------------------+-------------------+----------------+
| localhost | root             | Y           | Y           | Y           | Y           | Y           | Y         | Y           | Y             | Y            | Y         | Y          | Y               | Y          | Y          | Y            | Y          | Y                     | Y                | Y            | Y               | Y                | Y                | Y              | Y                   | Y                  | Y                | Y          | Y            | Y                      |          |            |             |              |             0 |           0 |               0 |                    0 | auth_socket           | *FD571203974BA9AFE270FE62151AE967ECA5E0AA | N                | 2024-04-19 13:33:48   |              NULL | N              |
| localhost | mysql.session    | N           | N           | N           | N           | N           | N         | N           | N             | N            | N         | N          | N               | N          | N          | N            | Y          | N                     | N                | N            | N               | N                | N                | N              | N                   | N                  | N                | N          | N            | N                      |          |            |             |              |             0 |           0 |               0 |                    0 | mysql_native_password | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | N                | 2024-04-19 13:33:48   |              NULL | Y              |
| localhost | mysql.sys        | N           | N           | N           | N           | N           | N         | N           | N             | N            | N         | N          | N               | N          | N          | N            | N          | N                     | N                | N            | N               | N                | N                | N              | N                   | N                  | N                | N          | N            | N                      |          |            |             |              |             0 |           0 |               0 |                    0 | mysql_native_password | *THISISNOTAVALIDPASSWORDTHATCANBEUSEDHERE | N                | 2024-04-19 13:33:48   |              NULL | Y              |
| localhost | debian-sys-maint | Y           | Y           | Y           | Y           | Y           | Y         | Y           | Y             | Y            | Y         | Y          | Y               | Y          | Y          | Y            | Y          | Y                     | Y                | Y            | Y               | Y                | Y                | Y              | Y                   | Y                  | Y                | Y          | Y            | Y                      |          |            |             |              |             0 |           0 |               0 |                    0 | mysql_native_password | *643B901503606E36CC7E4672BFA38821AA111C13 | N                | 2024-04-19 13:33:48   |              NULL | N              |
| %         | root             | Y           | Y           | Y           | Y           | Y           | Y         | Y           | Y             | Y            | Y         | N          | Y               | Y          | Y          | Y            | Y          | Y                     | Y                | Y            | Y               | Y                | Y                | Y              | Y                   | Y                  | Y                | Y          | Y            | Y                      |          |            |             |              |             0 |           0 |               0 |                    0 | mysql_native_password | *FD571203974BA9AFE270FE62151AE967ECA5E0AA | N                | 2024-04-19 16:05:57   |              NULL | N              |
+-----------+------------------+-------------+-------------+-------------+-------------+-------------+-----------+-------------+---------------+--------------+-----------+------------+-----------------+------------+------------+--------------+------------+-----------------------+------------------+--------------+-----------------+------------------+------------------+----------------+---------------------+--------------------+------------------+------------+--------------+------------------------+----------+------------+-------------+--------------+---------------+-------------+-----------------+----------------------+-----------------------+-------------------------------------------+------------------+-----------------------+-------------------+----------------+
5 rows in set (0.00 sec)
```


### mysql配置
```bash
# Example MySQL config file for small systems.  
#  
# This is for a system with little memory (<= 64M) where MySQL is only used  
# from time to time and it's important that the mysqld daemon  
# doesn't use much resources.  
#  
# MySQL programs look for option files in a set of  
# locations which depend on the deployment platform.  
# You can copy this option file to one of those  
# locations. For information about these locations, see:  
# http://dev.mysql.com/doc/mysql/en/option-files.html  
#  
# In this file, you can use all long options that a program supports.  
# If you want to know which options a program supports, run the program  
# with the "--help" option.  


# Here follows entries for some specific programs  

# support remote connect port 3306
# The MySQL server   
[mysqld]  
bind-address = 0.0.0.0
default-storage-engine=INNODB  
character-set-server=utf8  
collation-server=utf8_general_ci  
port        = 3306 
socket      = /tmp/mysql.sock  
skip-external-locking  
key_buffer_size = 16K  
max_allowed_packet = 1M  
table_open_cache = 4 
sort_buffer_size = 64K  
read_buffer_size = 256K  
read_rnd_buffer_size = 256K  
net_buffer_length = 2K  
thread_stack = 128K  

# Don't listen on a TCP/IP port at all. This can be a security enhancement,  
# if all processes that need to connect to mysqld run on the same host.  
# All interaction with mysqld must be made via Unix sockets or named pipes.  
# Note that using this option without enabling named pipes on Windows  
# (using the "enable-named-pipe" option) will render mysqld useless!  
#   
#skip-networking  
server-id   = 1 

# Uncomment the following if you want to log updates  
#log-bin=mysql-bin  

# binary logging format - mixed recommended  
#binlog_format=mixed  

# Causes updates to non-transactional engines using statement format to be  
# written directly to binary log. Before using this option make sure that  
# there are no dependencies between transactional and non-transactional  
# tables such as in the statement INSERT INTO t_myisam SELECT * FROM  
# t_innodb; otherwise, slaves may diverge from the master.  
#binlog_direct_non_transactional_updates=TRUE  

# Uncomment the following if you are using InnoDB tables  
#innodb_data_home_dir = /usr/local/mysql/data  
#innodb_data_file_path = ibdata1:10M:autoextend  
#innodb_log_group_home_dir = /usr/local/mysql/data  
# You can set .._buffer_pool_size up to 50 - 80 %  
# of RAM but beware of setting memory usage too high  
#innodb_buffer_pool_size = 16M  
#innodb_additional_mem_pool_size = 2M  
# Set .._log_file_size to 25 % of buffer pool size  
#innodb_log_file_size = 5M  
#innodb_log_buffer_size = 8M  
#innodb_flush_log_at_trx_commit = 1 
#innodb_lock_wait_timeout = 50 

[mysqldump]  
quick  
max_allowed_packet = 16M  

[mysql]  
no-auto-rehash  
# Remove the next comment character if you are not familiar with SQL  
#safe-updates  

[myisamchk]  
key_buffer_size = 8M  
sort_buffer_size = 8M  

[mysqlhotcopy]  
interactive-timeout 

[mysqld]
sql_mode=STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION

```