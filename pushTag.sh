#!/bin/bash
# feat(新功能)、fix(修复 bug)、docs(文档修改)、ci (构建修改)、style(代码格式修改)、refactor(重构代码)、test(测试代码修改)、perf(性能优化)
# 获取最新的 tag
latest_tag=$(git describe --tags $(git rev-list --tags --max-count=1))
# 获取当前时间
current_time=$(date "+%Y-%m-%d %H:%M:%S")
# 获取当前分支名称
branch_name=$(git symbolic-ref --short HEAD)
echo "Please select an option:"
echo "1. push"
echo "2. pushTag"
echo "3. exit"
# 根据用户输入执行不同的动作
read option
case $option in
1)
  git push origin
  ;;
2)
  # 推送 tag 到远程仓库
  git push origin $latest_tag
  echo "tag: $latest_tag at $current_time on branch $branch_name"
  ;;
3)
  echo "exit"
  # 执行动作 3
  ;;
*)
  echo "Invalid option"
  ;;
esac
