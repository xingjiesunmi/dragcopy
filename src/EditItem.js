import React from 'react';
import * as Styled from './styled';

const EditItem = ({ provided, snapshot, item }) => {
    return (
        <Styled.Item
            ref={provided.innerRef}
            {...provided.draggableProps}
            isDragging={snapshot.isDragging}
            style={provided.draggableProps.style}>
            <Styled.Handle {...provided.dragHandleProps}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                    />
                </svg>
            </Styled.Handle>
            <Styled.Handle {...provided.dragHandleProps}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                    />
                </svg>
            </Styled.Handle>
            {item.content}
        </Styled.Item>
    );
};

export default EditItem;
