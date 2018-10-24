import React from 'react';
import { Card, Upload, Icon, message } from 'antd';
import './ChoreoHomeScreen.css';
import ImageAddIcon from "../../icons/ImageAddIcon";
import GradientSVG from '../../icons/GradientSVG';
import { storage } from "../../firebase";
import { connect } from 'react-redux';
import { updateChoreoImage } from "../../actions/choreoActions";

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

class ChoreoPicture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  handleChange = (info, choreoId) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // TODO: shift this to higher component to keep this pure
      this.props.dispatch(updateChoreoImage(choreoId, info.file.response));
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    const uploadButton = (
      <div>
        {
          this.state.loading
            ? <Icon type={'loading'} style={{ color: '#24c6dc', fontSize: '30px' }} />
            : <ImageAddIcon className="add-choreo-pic-icon" />
        }
      </div>
    );
    const { choreoId, imageUrl } = this.props;
    return (
      <div>
        <GradientSVG
          startColor="#24c6dc"
          endColor="#514a9d"
          idCSS="cool-gradient"
        />
        <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={(req) => storage.addChoreoImage(req.file, choreoId).then((link) => {
              req.onSuccess(link);
            })}
            beforeUpload={beforeUpload}
            onChange={(info) => this.handleChange(info, choreoId)}
          >
            {imageUrl ? <img src={imageUrl} style={{ width: '100%' }} alt="avatar" /> : uploadButton}
          </Upload>
        </div>
      </div>
    );
  }
}

export default connect()(ChoreoPicture);
