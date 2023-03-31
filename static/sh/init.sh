sp=$(echo $SHELL | awk -F/ '{print $NF}')
shellConfig="$HOME/.${sp}rc"
echo "export SHELL_CONFIG=$shellConfig" >>$shellConfig
source $shellConfig
