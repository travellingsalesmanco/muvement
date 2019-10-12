import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { gotoFormation, reorderAndFocusFormation } from "../../actions/choreoActions";
import { getChoreo } from "../../selectors/choreo";
import ResponsiveStageCanvas from "../StageCanvas/ResponsiveStageCanvas";
import { withRouter } from 'react-router-dom';

class VerticalSlideList extends React.Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  componentDidUpdate() {
    const scrollToIndex = this.props.activeFormationId;
    document.getElementById(scrollToIndex.toString()).scrollIntoView({
      behavior: 'instant'
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

  render() {
    const getItemStyle = (isDragging, draggableStyle) => ({
      userSelect: 'none',
      margin: `0 0 8px 0`,
      // change background colour if dragging
      background: isDragging ? 'linear-gradient(to bottom, #24c6dc, #514a9d)' : 'transparent',
      // styles we need to apply on draggables
      ...draggableStyle,
    });

    const getListStyle = isDraggingOver => ({
      background: 'transparent',
      width: '100%'
    });

    // TODO: Fix draggableId, should be string. See https://github.com/atlassian/react-beautiful-dnd/issues/950
    const { editable } = this.props;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable" isDropDisabled={!editable}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {this.props.formations.map((item, index) => (
                <div key={index} id={index} className={index === this.props.activeFormationId ? 'linear-gradient-bg' : null}
                     onClick={() => this.handleClick(index)}>
                  <Draggable draggableId={index.toString()} index={index} isDragDisabled={!editable}>
                    {(provided, snapshot) => {
                      return (<div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <div style={{ height: '9em', width: '100%', pointerEvents:"None"}}>
                          <ResponsiveStageCanvas choreoId={this.props.choreoId} formationId={index} preview/>
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

export default withRouter(connect(mapStateToProps)(VerticalSlideList));