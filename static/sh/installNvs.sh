#!bin/bash
# https://github.com/jasongin/nvs
export NVS_HOME="$HOME/.nvs"
git clone https://github.com/jasongin/nvs "$NVS_HOME" --depth 1
. "$NVS_HOME/nvs.sh" install

nvs remote taobao https://npm.taobao.org/mirrors/node/
nvs remote default taobao
nvs add lts
nvs use lts
nvs link lts
corepack enable

if [ -z ${SHELL_CONFIG+x} ]; then
  SHELL_CONFIG="$HOME/.bashrc"
fi

saveConfig() {
  cat <<EOM

# nvs config https://github.com/jasongin/nvs
export NVS_HOME="$HOME/.nvs"
[ -s "$NVS_HOME/nvs.sh" ] && . "$NVS_HOME/nvs.sh"
EOM
}
saveConfig >>$SHELL_CONFIG
