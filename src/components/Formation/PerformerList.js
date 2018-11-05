import React, { Fragment } from 'react';
import { Row, Col, Icon, Button, Input } from "antd";
import { addDancerToFormation, removeDancerFromFormation, renameFormation } from "../../actions/formationActions"
import { addDancer, removeDancer, renameDancer } from "../../actions/choreoActions";
import { connect } from 'react-redux';
import './PerformerList.css';
import { getChoreo } from '../../selectors/choreo';
import { MinTablet, MobilePortrait } from "../ResponsiveUtils/BreakPoint";

class PerformerList extends React.Component {
  state = {
    editState: false
  };
  addDancerToFormation(name) {
    if (!this.props.activeDancers.includes(name)) {
      console.log("Add dancer to formation: " + name);
      this.props.dispatch(addDancerToFormation(this.props.choreoId, this.props.formationId, name));
    } else {
      console.log("Dancer already on formation");
    }
  }

  removeDancerFromFormation(name) {
    if (this.props.activeDancers.includes(name)) {
      console.log("Remove dancer from formation: " + name);
      this.props.dispatch(removeDancerFromFormation(this.props.choreoId, this.props.formationId, name));
    } else {
      console.log("Dancer already off formation");
    }
  }

  // TODO : move this to proper css
  isActiveDancerStyle(name) {
    if (this.props.activeDancers.includes(name)) {
      return { color: '#24c6dc' }
    } else {
      return { color: 'white' }
    }
  }

  isActiveDancer(name) {
    return this.props.activeDancers.includes(name);
  }

  handleEdit = () => {
    this.setState({
      editState: true
    })
  };

  handleDone = () => {
    this.setState({
      editState: false
    })
  };

  handleAdd = () => {
    // By default, add "Performer {index}" as name of performer
    this.props.dispatch(addDancer(this.props.choreoId,
                                  "Performer " + (this.props.dancers.length + 1)));
  };

  handleRemove = (dancer) => {
    this.props.dispatch(removeDancer(this.props.choreoId, dancer))
  };

  handleEditPerformer = (e, dancer) => {
    console.log(dancer);
    // rename dancer but need to check whether debounce interferes
    this.props.dispatch(renameDancer(this.props.choreoId, dancer, e.target.value));
  };

  handleEditPerformerConfirm = e => {
    e.target.blur();
  };

  render() {
    return (
      <Fragment>
        <MobilePortrait>
          <div className="mp-performer-list">
            {this.props.dancers.map((dancer, key) => {
              let actionIcon;
              if (!this.state.editState) {
                actionIcon = <Icon
                  style={this.isActiveDancerStyle(dancer)}
                  type={this.isActiveDancer(dancer) ? "minus" : "plus"}
                  theme="outlined"
                  onClick={() => this.isActiveDancer(dancer)
                    ? this.removeDancerFromFormation(dancer) : this.addDancerToFormation(dancer)}
                />
              } else {
                actionIcon = <Icon type="delete" theme="outlined" style={{ color: 'red', fontSize: '1.5em', padding: '5px 0'}}
                                   onClick={() => this.handleRemove(dancer)}/>
              }
              return (
                <Row key={dancer}>
                  <Col span={20}>
                  <span className="mp-dancer-item" style={this.isActiveDancerStyle(dancer)}>
                    {key + 1}.
                    {
                      !this.state.editState
                        ? dancer
                        : <Input defaultValue={dancer}
                                 onBlur={(e) => this.handleEditPerformer(e, dancer)}
                                 onPressEnter={this.handleEditPerformerConfirm}/>
                    }

                  </span>
                  </Col>
                  <Col span={4}>
                    {actionIcon}
                  </Col>
                </Row>)
            })}

            <div style={{textAlign: 'center'}}>
              {
                !this.state.editState
                  ? <Button type={"default"} icon="user-delete" ghost block
                            onClick={this.handleEdit}>Edit Performers</Button>
                  : <Fragment>
                    <Button className="add-performer-button" type={"default"} icon="user-add"
                            ghost block onClick={this.handleAdd}>Add Performer</Button>
                    <Button type={"default"} block onClick={this.handleDone}>DONE</Button>
                  </Fragment>
              }
            </div>
          </div>
        </MobilePortrait>
        <MinTablet>
          <div id="performer-list">
            {this.props.dancers.map((dancer, key) => {
              let actionIcon;
              if (!this.state.editState) {
                actionIcon = <Icon
                  style={this.isActiveDancerStyle(dancer)}
                  type={this.isActiveDancer(dancer) ? "minus" : "plus"}
                  theme="outlined"
                  onClick={() => this.isActiveDancer(dancer)
                    ? this.removeDancerFromFormation(dancer) : this.addDancerToFormation(dancer)}
                />
              } else {
                actionIcon = <Icon type="delete" theme="outlined" style={{ color: 'red', fontSize: '1.5em', padding: '5px 0'}}
                                   onClick={() => this.handleRemove(dancer)}/>
              }
              return (
                <Row key={dancer}>
                  <Col span={20}>
                    <span id="dancer-item" style={this.isActiveDancerStyle(dancer)}>
                      {key + 1}.
                      {
                        !this.state.editState
                        ? dancer
                        : <Input defaultValue={dancer}
                                 onBlur={(e) => this.handleEditPerformer(e, dancer)}
                                 onPressEnter={this.handleEditPerformerConfirm}/>
                      }

                    </span>
                  </Col>
                  <Col span={4}>
                    {actionIcon}
                  </Col>
                </Row>)
            })}

            <div style={{textAlign: 'center'}}>
              {
                !this.state.editState
                ? <Button type={"default"} icon="user-delete" ghost block
                          onClick={this.handleEdit}>Edit Performers</Button>
                : <Fragment>
                    <Button className="add-performer-button" type={"default"} icon="user-add"
                            ghost block onClick={this.handleAdd}>Add Performer</Button>
                    <Button type={"default"} block onClick={this.handleDone}>DONE</Button>
                  </Fragment>
              }
            </div>
          </div>
        </MinTablet>
      </Fragment>
    )
  }
}

const mapStateToProps = (state, props) => {
  const choreo = getChoreo(state, props.choreoId)
  return {
    dancers: choreo.dancers,
    activeDancers: choreo.formations[state.UI.activeFormation].dancers.map((dancer) => {
      return dancer.name;
    }),
    formationId: state.UI.activeFormation
  }
};

export default connect(mapStateToProps)(PerformerList);
