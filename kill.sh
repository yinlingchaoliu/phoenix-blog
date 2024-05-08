#!/bin/sh

for  (( i=3000;i<=3010;i++))
do
     ./port.sh $i
done


for  (( i=8080;i<=8108;i++))
do
     ./port.sh $i
done


for  (( i=10086;i<=10090;i++))
do
     ./port.sh $i
done
