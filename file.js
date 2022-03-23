/**
 * 文件相关处理
 * @module
 * @author linj
 * @description 文件相关处理
 */
/**
 * 描述
 * @function
 * @description blob转base64
 * @date 2020-03-01
 * @param {any} argBlob 要处理的数据
 * @returns {any} 返回base64
 */
 export const blobToBase64 = async (argBlob) => {
  // eslint-disable-next-line no-undef
  const fileReader = new FileReader()
  // readAsDataURL
  fileReader.readAsDataURL(argBlob)
  fileReader.onload = (e) => {
    return Promise.resolve(e.target.result)
  }
  fileReader.onerror = () => {
    return Promise.reject(new Error('文件流异常'))
  }
}
/**
 * 描述
 * @function
 * @description blobUrl 转 file文件
 * @date 2020-03-01
 * @param {any} argData blobUrl
 * @returns {any} 返回文件流
 */
export const blobUrlToFile = async (argData) => {
  return new Promise(function (resolve, reject) {
    // eslint-disable-next-line no-undef
    var xhr = new XMLHttpRequest()
    xhr.open('GET', argData, true)
    xhr.responseType = 'blob'
    xhr.onload = function (e) {
      if (this.status === 200) {
        return resolve(this.response)
      }
    }
    xhr.error = (err) => {
      return reject(err)
    }
    xhr.send()
  })
}

/**
 * @function
 * @description 图片dataUrl base64转blob对象
 * @param {string} argData dataUrl
 * @returns {blob|boolean}
 */
export const dataURLtoBlob = (argData) => {
  if (!argData.match(/;base64,/)) {
    return false
  }
  var arr = argData.split(',')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = globalThis.atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * @function
 * @description blob转file对象
 * @param {blob} argBlob blob对像
 * @param {string} argName filename
 * @returns {file}
 */
export const blobToFile = (argBlob, argName = Date.now()) => {
  let file = new File([argBlob], argBlob.name || argName, {
    type: argBlob.type,
  })
  return file
}
/**
 * @function
 * @description 下载文件
 * @param {type} argBlob blob对像/file对象/dataUrl/base64
 * @param {type} argName filename
 * @param {type} argDelTime 移除dateUrl时间
 */
export const dlFile = (argData, argName = Date.now(), argDelTime = 10000) => {
  let downNode = globalThis.document.createElement('a')
  downNode.download = argName
  // 字符内容转换为blob地址
  let href = ''
  if (typeof argData === 'string') {
    if (argData.startsWith('blob:')) {
      href = argData
    } else if (argData.startsWith('data:image')) {
      href = argData
    }
    argData = new Blob([argData])
  }
  href = href || URL.createObjectURL(argData)
  downNode.href = href
  setTimeout(() => {
    URL.revokeObjectURL(href)
  }, argDelTime)
  globalThis.document.body.appendChild(downNode)
  downNode.click()
  globalThis.document.body.removeChild(downNode)
}
/**
 * @function
 * @description 获取音视频时长
 * @param {object} argFile 音视频数据，string时为链接
 * @returns {number} 时长单位秒
 */
export const getDuration = async (argFile) => {
  let filePath
  if (typeof argFile === 'string') {
    filePath = argFile
  } else {
    filePath = URL.createObjectURL(argFile)
  }
  return new Promise((resolve, reject) => {
    const audio = new Audio(filePath)
    audio.addEventListener('loadedmetadata', function (e) {
      if (filePath.startsWith('blob:')) {
        URL.revokeObjectURL(filePath)
      }
      const duration = audio.duration
      audio.src = ''
      return resolve(duration)
    })
    setTimeout(() => {
      return reject(new Error('读取时长超时'))
    }, 5000)
  })
}
/**
 * @function
 * @description 动态加载html文件标签
 * @param {type} argUrl 要加载的url
 * @param {type} argType 加载类型 js/css
 * @param {type} argOptions{
 * disCheck:'不检查是否有相同标签'
 * force:'如果有相同标签，先删除再添加'
 * } 是否强制添加
 * @return promise
 */
export const loadFile = (argUrl, argType = 'js', argOptions = {}) => {
  let temId = argType + '-' + argUrl.split('/').pop()
  let head = globalThis.document.getElementsByTagName('head')[0]
  let nodeTag = null
  if (!argOptions.disCheck) {
    let checkTag = globalThis.document.getElementById(temId)
    // 已经存在对应tag
    if (checkTag) {
      if (argOptions.force) {
        head.removeChild(checkTag)
      } else {
        return { msg: '已存在，中断加载！' }
      }
    }
  }
  switch (argType) {
    case 'css':
      nodeTag = globalThis.document.createElement('link')
      nodeTag.type = 'text/css'
      nodeTag.rel = 'stylesheet'
      nodeTag.href = argUrl
      break
    case 'js':
      nodeTag = globalThis.document.createElement('script')
      nodeTag.src = argUrl
      nodeTag.type = 'text/javascript'
      break
    default:
      console.error('暂不支持：' + argType)
      return
  }
  nodeTag.id = temId
  head.appendChild(nodeTag)
  return new Promise((resolve) => {
    if (nodeTag.readyState) {
      nodeTag.onreadystatechange = function () {
        if (
          nodeTag.readyState === 'loaded' ||
          nodeTag.readyState === 'complete'
        ) {
          nodeTag.onreadystatechange = null
          return resolve(argUrl)
        }
      }
    } else {
      // Others
      nodeTag.onload = function () {
        return resolve(argUrl)
      }
    }
  })
}
