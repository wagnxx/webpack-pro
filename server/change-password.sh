#!/bin/sh

IP=""
NAME=""
PASSWORD=""
NEWPASSWORD=""

while getopts "H:U:P:N:" arg; do # 冒号后面表示需要的参数
  case $arg in
  H)
    IP=$optarg
    ;;
  U)
    NAME=$optarg
    ;;

  P)
    PASSWORD=$optarg
    ;;

  N)
    NEWPASSWORD=$optarg
    ;;

  ?)
    echo "含有未知参数"
    exit 1
    ;;
  esac
done

echo `ip:$IP \n name:$NAME \n password:$PASSWORD \n newPassword:$NEWPASSWORD`
