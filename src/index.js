import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid/v4';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import * as Styled from './styled';

// Component
import EditIcon from './EditIcon';
import EditItem from './EditItem';
import ComponentItem from './ComponentItem';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};
/**
 * Moves an item from one list to another list.
 */
const copy = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const item = sourceClone[droppableSource.index];

    destClone.splice(droppableDestination.index, 0, { ...item, id: uuid() });
    return destClone;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const ITEMS = [
    {
        id: uuid(),
        content: 'Headline'
    },
    {
        id: uuid(),
        content: 'Copy'
    },
    {
        id: uuid(),
        content: 'Image'
    },
    {
        id: uuid(),
        content: 'Slideshow'
    },
    {
        id: uuid(),
        content: 'Quote'
    }
];

class App extends Component {
    state = {
        list: [],
        darkness: true
    };

    componentDidMount() {}

    componentDidUpdate() {
        console.log(this.state);
    }

    addList = e => {
        this.setState({ list: [] });
    };

    onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        switch (source.droppableId) {
            case destination.droppableId:
                this.setState({
                    [destination.droppableId]: reorder(
                        this.state[source.droppableId],
                        source.index,
                        destination.index
                    )
                });
                break;
            case 'ITEMS':
                this.setState({
                    [destination.droppableId]: copy(
                        ITEMS,
                        this.state[destination.droppableId],
                        source,
                        destination
                    )
                });
                break;
            default:
                this.setState(
                    move(
                        this.state[source.droppableId],
                        this.state[destination.droppableId],
                        source,
                        destination
                    )
                );
                break;
        }
    };

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="ITEMS" isDropDisabled={true}>
                    {(provided, snapshot) => (
                        <Styled.Kiosk
                            ref={provided.innerRef}
                            isDraggingOver={snapshot.isDraggingOver}>
                            {ITEMS.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <ComponentItem
                                            provided={provided}
                                            snapshot={snapshot}
                                            item={item}
                                        />
                                    )}
                                </Draggable>
                            ))}
                        </Styled.Kiosk>
                    )}
                </Droppable>

                <Styled.Content>
                    <EditIcon addList={this.addList} />
                    {Object.keys(this.state).map((list, i) => (
                        <Droppable key={list} droppableId={list}>
                            {(provided, snapshot) => (
                                <Styled.Container
                                    ref={provided.innerRef}
                                    isDraggingOver={snapshot.isDraggingOver}>
                                    {this.state[list].length
                                        ? this.state[list].map(
                                              (item, index) => (
                                                  <Draggable
                                                      key={item.id}
                                                      draggableId={item.id}
                                                      index={index}>
                                                      {(provided, snapshot) => (
                                                          <EditItem
                                                              provided={
                                                                  provided
                                                              }
                                                              snapshot={
                                                                  snapshot
                                                              }
                                                              item={item}
                                                          />
                                                      )}
                                                  </Draggable>
                                              )
                                          )
                                        : !provided.placeholder && (
                                              <Styled.Notice>
                                                  Drop items here
                                              </Styled.Notice>
                                          )}
                                    {provided.placeholder}
                                </Styled.Container>
                            )}
                        </Droppable>
                    ))}
                </Styled.Content>
            </DragDropContext>
        );
    }
}

// Put the things into the DOM!
ReactDOM.render(<App />, document.getElementById('root'));
