import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { gotoFormation, reorderAndFocusFormation } from "../../actions/choreoActions";
import { getChoreo } from "../../selectors/choreo";
import ResponsiveStageCanvas from "../StageCanvas/ResponsiveStageCanvas";
import { withRouter } from 'react-router-dom';

const getItemStyle = (isDragging, draggableStyle, isActiveFormation) => ({
  userSelect: 'none',
  margin: `0 8px 0 0`,
  // change background colour if dragging
  background: 'transparent',
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: 'transparent',
  display: 'flex',
  padding: 8,
  // overflow: 'auto',
});

class HorizontalSlideList extends React.Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidUpdate() {
    const scrollToIndex = this.props.activeFormationId;
    document.getElementById(scrollToIndex.toString()).scrollIntoView({
      behavior: 'smooth'
    });
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const fromIndex = result.source.index;
    const toIndex = result.destination.index;
    if (fromIndex === toIndex) {
      // Same formation, change focus
      this.props.dispatch(gotoFormation(this.props.choreoId, fromIndex));
    } else {
      // Reorder and change focus
      this.props.dispatch(reorderAndFocusFormation(this.props.choreoId, fromIndex, toIndex));
    }
  }

  handleClick = (index) => {
    this.props.dispatch(gotoFormation(this.props.choreoId, index));
  };

  // TODO: Fix draggableId, should be string. See https://github.com/atlassian/react-beautiful-dnd/issues/950
  render() {
    const { activeFormationId, editable } = this.props;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal" isDropDisabled={!editable}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {this.props.formations.map((item, index) => (
                <div key={index} id={index} onClick={() => this.handleClick(index)}>
                  <Draggable draggableId={index} index={index} isDragDisabled={!editable}>
                    {(provided, snapshot) => {
                      return (<div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style,
                        )}
                      >
                        <div style={{
                          height: '6em',
                          width: '8em',
                          boxShadow: `0px 0px 1.5em 0px rgba(39, 39, 39, 0.75)`,
                          pointerEvents: "None",
                          background: activeFormationId === index ? 'linear-gradient(to right, rgba(36,198,220, 0.7), rgba(81,74,157, 0.7))' : 'transparent',
                          display: 'flex',
                          justifyContent: "center",
                          alignItems: "center"
                        }}>
                        <div style={{
                          height: '5em',
                          width: '7em',
                          pointerEvents: "None",
                          background: '#000',
                        }}>
                          <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={index} preview />
                        </div>
                        </div>
                        <span className="slide-title">{index + 1}. {item.name}</span>
                      </div>)
                    }}
                  </Draggable>
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

function mapStateToProps(state, props) {
  const choreo = getChoreo(state, props.choreoId);
  return {
    activeFormationId: state.UI.activeFormation,
    formations: choreo.formations
  }
}

export default withRouter(connect(mapStateToProps)(HorizontalSlideList));
