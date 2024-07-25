import React from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

class UserCropper extends React.Component {
  constructor(props) {
    super(props)
  }

  confirm = () => { // 确认生成
    return this.cropper.getCroppedCanvas().toDataURL()
  }
  toBlob = name => { // 转换为blob，以便上传
    const code = this.confirm()
    return this.base64ToBlob(code, name)
  }

  /**
   * base64转blob
   * @param {String} code base64数据
   * @param {String} name 文件名
   * @return {blob}
   */
  base64ToBlob(code, name) {
    let parts = code.split(';base64,')
    let contentType = parts[0].split(':')[1]
    let raw = window.atob(parts[1])
    let rawLength = raw.length
    let uInt8Array = new Uint8Array(rawLength)
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }
    return new window.Blob([uInt8Array], { type: contentType, name: name })
  }

  render() {
    return (
      <div style={containerStyle}>
        <div style={cropperContainer}>
          <Cropper
            ref={cropper => {
              this.cropper = cropper
            }}
            src={this.props.file} // 文件
            style={{ height: 328, width: 260 }} // 自定义样式
            aspectRatio={65 / 82} // 设置图片长宽比
            guides={false} // 是否显示九宫格
            preview=".cropper-preview" // 设置预览的dom
          />
          <div className="preview-container">
            <div className="cropper-preview" style={previewStyle} />
          </div>
        </div>
      </div>
    )
  }
}

const containerStyle = {}
const cropperContainer = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end'
}

const previewStyle = {
  width: 130,
  height: 164,
  overflow: 'hidden',
  border: '1px solid #383838'
}

export default UserCropper