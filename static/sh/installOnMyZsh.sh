# 这个脚本是一个 shell 脚本，用于安装 Oh-My-Zsh，一个流行的 Zsh 配置管理框架。脚本接受多个命令行参数，包括要使用的主题、要安装的插件列表以及一个选项，用于跳过依赖项的安装。

# 脚本首先定义了一个 check_dist 函数，该函数返回正在使用的 Linux 发行版的 ID。然后定义了另一个 check_version 函数，该函数返回版本 ID。稍后将使用这些函数来确定要安装的依赖项。

# install_dependencies 函数根据正在使用的发行版和版本安装所需的依赖项。它首先调用 check_dist 和 check_version 来确定发行版和版本。然后使用 case 语句根据发行版安装依赖项。如果脚本没有以 root 用户身份运行，则使用 sudo 运行安装命令。

# zshrc_template 函数生成将由 Oh-My-Zsh 使用的 .zshrc 文件。它接受主目录、要使用的主题和要安装的插件列表。它设置了与区域设置和终端相关的几个环境变量，然后将 ZSH 环境变量设置为 Oh-My-Zsh 安装目录的路径。它将 ZSH_THEME 变量设置为指定的主题，如果没有指定主题，则设置为 powerlevel10k/powerlevel10k。它将 plugins 变量设置为要安装的插件列表。然后附加任何由 ZSHRC_APPEND 变量指定的其他配置，并源化 oh-my-zsh.sh 脚本。

# if [ "$INSTALL_DEPENDENCIES" = true ]; then 语句检查是否应安装依赖项。如果是，则调用 install_dependencies 函数安装所需的依赖项。然后，脚本将当前目录更改为 /tmp，并检查是否已安装 Oh-My-Zsh。如果没有安装，则使用 curl 下载并运行 Oh-My-Zsh 安装脚本。接下来，脚本生成插件列表，并将每个插件克隆到 ~/.oh-my-zsh/custom/plugins 目录中。然后，脚本处理主题。如果指定了主题 URL，则将主题克隆到 ~/.oh-my-zsh/custom/themes 目录中。否则，脚本将使用 powerlevel10k 主题。最后，脚本使用 zshrc_template 函数生成 .zshrc 文件，并将其保存到用户主目录中。如果使用 powerlevel10k 主题，则脚本还将调用 powerline10k_config 函数生成 powerlevel10k 主题的配置。

# 安装git curl zsh locales

set -e

THEME=default
PLUGINS=""
ZSHRC_APPEND=""
INSTALL_DEPENDENCIES=true

while getopts ":t:p:a:x" opt; do
  case ${opt} in
  t)
    THEME=$OPTARG
    ;;
  p)
    PLUGINS="${PLUGINS}$OPTARG "
    ;;
  a)
    ZSHRC_APPEND="$ZSHRC_APPEND\n$OPTARG"
    ;;
  x)
    INSTALL_DEPENDENCIES=false
    ;;
  \?)
    echo "Invalid option: $OPTARG" 1>&2
    ;;
  :)
    echo "Invalid option: $OPTARG requires an argument" 1>&2
    ;;
  esac
done
shift $((OPTIND - 1))

echo
echo "Installing Oh-My-Zsh with:"
echo "  THEME   = $THEME"
echo "  PLUGINS = $PLUGINS"
echo

check_dist() {
  (
    . /etc/os-release
    echo "$ID"
  )
}

check_version() {
  (
    . /etc/os-release
    echo "$VERSION_ID"
  )
}

install_dependencies() {
  DIST=$(check_dist)
  VERSION=$(check_version)
  echo "###### Installing dependencies for $DIST"

  if [ "$(id -u)" = "0" ]; then
    Sudo=''
  elif which sudo; then
    Sudo='sudo'
  else
    echo "WARNING: 'sudo' command not found. Skipping the installation of dependencies. "
    echo "If this fails, you need to do one of these options:"
    echo "   1) Install 'sudo' before calling this script"
    echo "OR"
    echo "   2) Install the required dependencies: git curl zsh"
    return
  fi

  case $DIST in
  alpine)
    $Sudo apk add --update --no-cache git curl zsh
    ;;
  amzn)
    $Sudo yum update -y
    $Sudo yum install -y git curl zsh
    $Sudo yum install -y ncurses-compat-libs # this is required for AMZN Linux (ref: https://github.com/emqx/emqx/issues/2503)
    ;;
  *)
    $Sudo apt-get update
    $Sudo apt-get -y install git curl zsh locales
    if [ "$VERSION" != "14.04" ]; then
      $Sudo apt-get -y install locales-all
    fi
    $Sudo locale-gen en_US.UTF-8
    ;;
  esac
}

zshrc_template() {
  _HOME=$1
  _THEME=$2
  shift
  shift
  _PLUGINS=$*

  if [ "$_THEME" = "default" ]; then
    _THEME="powerlevel10k/powerlevel10k"
  fi

  cat <<EOM
export LANG='en_US.UTF-8'
export LANGUAGE='en_US:en'
export LC_ALL='en_US.UTF-8'
export TERM=xterm

##### Zsh/Oh-my-Zsh Configuration
export ZSH="$_HOME/.oh-my-zsh"

ZSH_THEME="${_THEME}"
plugins=($_PLUGINS)

EOM
  printf "$ZSHRC_APPEND"
  printf "\nsource \$ZSH/oh-my-zsh.sh\n"
}

powerline10k_config() {
  cat <<EOM
POWERLEVEL9K_SHORTEN_STRATEGY="truncate_to_last"
POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(user dir vcs status)
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=()
POWERLEVEL9K_STATUS_OK=false
POWERLEVEL9K_STATUS_CROSS=true
EOM
}

if [ "$INSTALL_DEPENDENCIES" = true ]; then
  install_dependencies
fi

cd /tmp

# Install On-My-Zsh
if [ ! -d "$HOME"/.oh-my-zsh ]; then
  sh -c "$(curl https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)" "" --unattended
fi

# Generate plugin list
plugin_list=""
for plugin in $PLUGINS; do
  if [ "$(echo "$plugin" | grep -E '^http.*')" != "" ]; then
    plugin_name=$(basename "$plugin")
    git clone "$plugin" "$HOME"/.oh-my-zsh/custom/plugins/"$plugin_name"
  else
    plugin_name=$plugin
  fi
  plugin_list="${plugin_list}$plugin_name "
done

# Handle themes
if [ "$(echo "$THEME" | grep -E '^http.*')" != "" ]; then
  theme_repo=$(basename "$THEME")
  THEME_DIR="$HOME/.oh-my-zsh/custom/themes/$theme_repo"
  git clone "$THEME" "$THEME_DIR"
  theme_name=$(
    cd "$THEME_DIR"
    ls *.zsh-theme | head -1
  )
  theme_name="${theme_name%.zsh-theme}"
  THEME="$theme_repo/$theme_name"
fi

# Generate .zshrc
zshrc_template "$HOME" "$THEME" "$plugin_list" >"$HOME"/.zshrc

# Install powerlevel10k if no other theme was specified
if [ "$THEME" = "default" ]; then
  git clone --depth 1 https://github.com/romkatv/powerlevel10k "$HOME"/.oh-my-zsh/custom/themes/powerlevel10k
  powerline10k_config >>"$HOME"/.zshrc
fi
