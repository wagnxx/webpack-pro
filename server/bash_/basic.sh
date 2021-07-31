# !/bin/bash

#  变量 --------------------------------------------------
# echo "Hello Wold !"

# for file in $(ls ); do
#   echo $file
# done

# string="alibaba is a great company"
# echo ${string:1:4} #输出liba

# echo length: ${#string}

# string_=xxxxxxxx

# echo $string_

# 数组 -------------------------------------------------

# array_name=(val0 val1 val val3)

# echo ${array_name[@]}

# echo array_name length is : ${#array_name[@]}
# echo array_name length is : ${#array_name[*]}
# echo array_name[2] length is : ${#array_name[2]}

# 参数 ------------------------------------------------

# echo "Shell 传递参数实例！";
# echo "执行的文件名：$0";
# echo "第一个参数为：$1";
# echo "第二个参数为：$2";
# echo "第三个参数为：$3";

# echo "参数个数: $#"
# echo "当前进程id: $$"

# echo "所有参数：$*"

# echo "Shell 传递参数实例！";
# echo "第一个参数为：$1";

# echo "参数个数为：$#";
# echo "传递的参数作为一个字符串显示：$*";

# 预算符 -----------------------------------------

# echo 符号 结果
# echo +  ：`  expr 2 + 3`
# echo -  ：`  expr 2 - 3`
# echo -  ：`  expr 2 - 3`

# a=10
# b=20

# if [ $a -eq $b ]; then
#   echo "a === b"
# else
#   echo "a !== b"
# fi
# for loop in 1 2 3 4 5
# do
#     echo "The value is: $loop"
# done

# echo '按下 <CTRL-D> 退出'
# echo -n '输入你最喜欢的电影名: '
# while read FILM
# do
#     echo "是的！$FILM 是一部好电影"
# done



# 函数

# demoFun(){
#     echo "这是我的第一个 shell 函数!"
# }
# echo "-----函数开始执行-----"
# demoFun
# echo "-----函数执行完毕-----"

# funWithParam(){
#     echo "第一个参数为 $1 !"
#     echo "第二个参数为 $2 !"
#     echo "第十个参数为 $10 !"
#     echo "第十个参数为 ${10} !"
#     echo "第十一个参数为 ${11} !"
#     echo "参数总数有 $# 个!"
#     echo "作为一个字符串输出所有参数 $* !"
# }
# funWithParam 1 2 3 4 5 6 7 8 9 34 73


# 文件引入

CURPATH=$(cd "$(dirname "$0")"; pwd)

# echo $CURPATH

. $CURPATH/test1.sh
# source ./test1.sh
echo url:$url