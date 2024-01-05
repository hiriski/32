/* eslint-disable react-hooks/exhaustive-deps */

import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Helmet } from 'react-helmet'
import { FingoHomeLayout, FingoBaseLayout } from 'src/components/layouts'
import styled from 'styled-components'
import { FingoButton, FingoInput } from 'src/components/core'
import { ReactComponent as AddSvg } from 'src/assets/svg/add.svg'
import toast from 'react-hot-toast'
import { useApp, useDNDQuizText, usePersistedGuest } from 'src/hooks'
import { v4 as uuidv4 } from 'uuid'
import { Col, Form, Row } from 'react-bootstrap'
import { ReactComponent as CloseIcon } from 'src/assets/svg/close.svg'
import { batch, useDispatch } from 'react-redux'
import { Popover, ArrowContainer } from 'react-tiny-popover'

const FOOTER_HEIGHT = 70
const TITLE = 'DND Text Page'
const INITIAL_PLACE_KEY = 'INITIAL_PLACE'

const INITIAL_DATA = {
    _id: '65961f903d9175ad1c9929bf',
    question: 'Lorem ipsum',
    description: null,
    textList: [
        {
            uuid: 'c56fa6c0-cafe-4102-95ba-2770e402cefb',
            label: null,
            width: 100,
            isBlankText: true,
            order: 2,
            _id: '65961f903d9175ad1c9929c1',
        },
        {
            uuid: '29433a87-c79f-4f63-88e8-bd1c7e72127b',
            label: 'consectetur adipiscing elit,',
            width: null,
            isBlankText: false,
            order: 4,
            _id: '65961f903d9175ad1c9929c3',
        },
        {
            uuid: '12876d47-1856-4420-8537-664592f49795',
            label: 'Lorem ipsum dolor',
            width: null,
            isBlankText: false,
            order: 1,
            _id: '65961f903d9175ad1c9929c0',
        },
        {
            uuid: 'c4e430ad-edc2-4a17-90ba-7dd1d8e3548a',
            label: 'Amet',
            width: null,
            isBlankText: false,
            order: 3,
            _id: '65961f903d9175ad1c9929c2',
        },

        {
            uuid: 'f2da0bba-7499-46db-bce4-903b9acffc08',
            label: null,
            width: 100,
            isBlankText: true,
            order: 5,
            _id: '65961f903d9175ad1c9929c4',
        },
        {
            uuid: '0c2c3b51-0b39-4ef7-9547-98fc3fc803f3',
            label: 'tempor incididunt ut labore et dolore magna aliqua.',
            width: null,
            isBlankText: false,
            order: 6,
            _id: '65961f903d9175ad1c9929c5',
        },
    ],
    draggableList: [
        {
            uuid: '6d26b488-1540-4603-815d-b6b7d0dd34df',
            label: 'Sit',
            correctPlaceId: 'c56fa6c0-cafe-4102-95ba-2770e402cefb',
            order: 1,
            _id: '65961f903d9175ad1c9929c6',
        },
        {
            uuid: '65dcd0b9-5c4a-45fd-8d47-804a60cdfa41',
            label: 'sed do eiusmod',
            correctPlaceId: 'f2da0bba-7499-46db-bce4-903b9acffc08',
            order: 2,
            _id: '65961f903d9175ad1c9929c7',
        },
        {
            uuid: '65f147c1-9578-43ba-a19d-76f3d36864d7',
            label: 'Lorem Ipsum',
            correctPlaceId: null,
            order: 3,
            _id: '65961f903d9175ad1c9929c8',
        },
        {
            uuid: 'fe694195-85c5-4535-a9c6-d31f08e238fb',
            label: 'Hello world',
            correctPlaceId: null,
            order: 4,
            _id: '65961f903d9175ad1c9929c9',
        },
        {
            uuid: 'c8b4acc1-4f28-4773-9ca5-f434c603f536',
            label: 'ReactJs',
            correctPlaceId: null,
            order: 5,
            _id: '65961f903d9175ad1c9929ca',
        },
        {
            uuid: '6b3f91b6-71e5-4b61-b788-7f1ccc172762',
            label: 'mongodb',
            correctPlaceId: null,
            order: 6,
            _id: '65961f903d9175ad1c9929cb',
        },
        {
            uuid: 'e02a83b9-df9a-4283-be19-051772d5508f',
            label: 'laravel sail',
            correctPlaceId: null,
            order: 7,
            _id: '65961f903d9175ad1c9929cc',
        },
        {
            uuid: 'df4e6b0f-1f63-4b0f-99dd-edfe9493a011',
            label: 'hello moon',
            correctPlaceId: null,
            order: 8,
            _id: '65961f903d9175ad1c9929cd',
        },
    ],
    explanation: null,
    __v: 0,
}

const FormTextInput = ({ onSubmit, editValues }) => {
    const [values, setValues] = useState({
        uuid: null,
        label: '',
        width: null,
        isBlankText: false,
    })

    console.log('editValues', editValues)

    const onChange = (prop, value) => {
        setValues({
            ...values,
            [prop]: value,
        })
    }

    const disabledSaveBtn = useMemo(() => {
        if (values.isBlankText && !values.width) return true
        else if (!values.isBlankText && !values.label) return true
        else return false
    }, [values.label, values.width, values.isBlankText])

    const _onSubmit = () => {
        const submitValues = {
            uuid: editValues ? values.uuid : uuidv4(),
            isBlankText: values.isBlankText,
            label: values.isBlankText ? null : values.label,
            width: values.isBlankText ? values.width : null,
        }
        if (typeof onSubmit === 'function') {
            onSubmit(submitValues)
        }
    }

    useEffect(() => {
        if (editValues) {
            setValues({
                uuid: editValues.uuid,
                label: editValues.label,
                width: editValues.width,
                isBlankText: editValues.isBlankText,
            })
        }
    }, [editValues])

    return (
        <FormTextInputBox>
            <Row>
                <Col xs={12}>
                    <InputGroup>
                        <FingoInput
                            size='lg'
                            name='value'
                            value={values.label}
                            onChange={e => onChange('label', e.target.value)}
                            placeholder='Please input text...'
                            as='textarea'
                            rows={2}
                            disabled={values.isBlankText}
                        />
                    </InputGroup>
                </Col>
                <Col xs={6}>
                    <Form.Check
                        onChange={e =>
                            onChange('isBlankText', e.target.checked)
                        }
                        type='checkbox'
                        label='isBlankText'
                    />
                </Col>
                <Col xs={6}>
                    {values.isBlankText && (
                        <FingoInput
                            size='lg'
                            name='width'
                            value={values.width}
                            onChange={e => onChange('width', e.target.value)}
                            placeholder='Width blank text'
                        />
                    )}
                </Col>
                <Col xs={12}>
                    <FingoButton
                        disabled={disabledSaveBtn}
                        className='text-center'
                        style={{ minWidth: 200 }}
                        onClick={_onSubmit}
                        enableHoverEffect={false}
                    >
                        Save
                    </FingoButton>
                </Col>
            </Row>
        </FormTextInputBox>
    )
}

const DNDQuizTextPage = () => {
    const { app_isDarkTheme } = useApp()
    const dispatch = useDispatch()

    const [data, setData] = useState(INITIAL_DATA)

    const clickMeButtonRef = useRef()

    const { dndQuizText_adminGetList } = useDNDQuizText()

    const getData = useCallback(() => {
        dispatch(dndQuizText_adminGetList())
    }, [])

    useEffect(() => {
        getData()
    }, [])

    const INITIAL_TARGET_PLACES = {
        [INITIAL_PLACE_KEY]: {
            id: INITIAL_PLACE_KEY,
            list: [],
        },
    }
    const [values, setValues] = useState([])
    const [listDroppable, setListDroppable] = useState(INITIAL_TARGET_PLACES)
    const [textList, setTextList] = useState([])
    const [draggableList, setDraggableList] = useState([])
    const [isPopoverOpen, setIsPopoverOpen] = useState(textList.map(x => false))
    const [isOpenPopoverEdit, setIsOpenPopoverEdit] = useState(
        textList.map(x => false)
    )
    const [openPopoverAddDraggable, setOpenPopoverAddDraggable] = useState(false)
    const [editValues, setEditValues] = useState(null)

    const listTestSortedByOrder = useMemo(() => {
        // Use .map() to create a new array with the order
        const newArray = textList.map(obj => ({ ...obj }))
        // Use .sort() to sort the new array
        return newArray.sort((a, b) => a.order - b.order)
    }, [textList])

    const initialize = () => {
        setTextList(INITIAL_DATA.textList)
        setDraggableList(INITIAL_DATA.draggableList)
    }

    const onClickReset = () => {
        initialize()
    }

    const onClickAddDroppable = () => {
        const id = uuidv4()
        setListDroppable({
            ...listDroppable,
            [id]: {
                id: id,
                list: [],
            },
        })
    }

    const onClickDeleteDroppable = droppableId => {
        const currentListDroppable = Object.values(listDroppable)
        const filteredListDroppable = currentListDroppable.filter(
            x => x.id !== droppableId
        )
        const result = filteredListDroppable.reduce(function (acc, cur, i) {
            acc[cur.id] = cur
            return acc
        }, {})

        setListDroppable(result)
    }

    // const onClickAdd = useCallback(() => {
    //     if (inputValue) {
    //         const newValue = {
    //             id: uuidv4(),
    //             label: inputValue,
    //         }
    //         // prettier-ignore
    //         listDroppable[INITIAL_PLACE_KEY].list = [...listDroppable[INITIAL_PLACE_KEY].list, newValue]

    //         setInputValue('')
    //     }
    // }, [inputValue, listDroppable])

    const onDragEnd = ({ source, destination }) => {
        // Make sure we have a valid destination
        if (destination === undefined || destination === null) return null

        // Make sure we're actually moving the item
        // prettier-ignore
        if (source.droppableId === destination.droppableId && destination.index === source.index) {
            return null
        }

        console.log('source.droppableId', source.droppableId)
        console.log('destination.droppableId', destination.droppableId)

        // Set start and end variables
        const start = listDroppable[source.droppableId]
        const end = listDroppable[destination.droppableId]

        // If start is the same as end, we're in the same column
        if (start === end) {
            // Move the item within the list
            // Start by making a new list without the dragged item
            const newList = start.list.filter((_, idx) => idx !== source.index)

            // Then insert the item at the right location
            newList.splice(destination.index, 0, start.list[source.index])

            // Then create a new copy of the column object
            const newCol = {
                id: start.id,
                list: newList,
            }

            // Update the state
            setListDroppable(state => ({ ...state, [newCol.id]: newCol }))
            return null
        } else {
            // If start is different from end, we need to update multiple listDroppable
            // Filter the start list like before
            const newStartList = start.list.filter(
                (_, idx) => idx !== source.index
            )

            // Create a new start column
            const newStartCol = {
                id: start.id,
                list: newStartList,
            }

            // Make a new end list array
            const newEndList = end.list

            // Insert the item into the end list
            newEndList.splice(destination.index, 0, start.list[source.index])

            // Create a new end column
            const newEndCol = {
                id: end.id,
                list: newEndList,
            }

            console.log('newStartCol,', newStartCol)
            console.log('newEndCol,', newEndCol)

            // Update the state
            setListDroppable(state => ({
                ...state,
                [newStartCol.id]: newStartCol,
                [newEndCol.id]: newEndCol,
            }))
            return null
        }
    }

    const onClickDelete = (source, paramIndex) => {
        // prettier-ignore
        const updatedValue = listDroppable[source].list.filter((_, index) => index !== paramIndex)
        // prettier-ignore
        listDroppable[source].list = updatedValue

        setListDroppable({
            ...listDroppable,
        })
    }

    const onClickDeleteItem = paramIndex => {
        const newTextListItem = listTestSortedByOrder.filter(
            (_, index) => index !== paramIndex
        )

        if (newTextListItem.length === 0) {
            setTextList([
                {
                    uuid: uuidv4(),
                    label: '',
                    width: null,
                    isBlankText: false,
                    order: 1,
                },
            ])
        } else {
            setTextList(newTextListItem)
        }
    }

    const onClickDeleteDraggableItem = paramIndex => {
        const newDraggableList = draggableList.filter(
            (_, index) => index !== paramIndex
        )
        if (newDraggableList.length === 0) {
            setDraggableList([
                {
                    uuid: uuidv4(),
                    label: '',
                    width: null,
                    isBlankText: false,
                    order: 1,
                },
            ])
        } else {
            setDraggableList(newDraggableList)
        }
    }

    const isDisableSaveBtn = useMemo(() => {
        return listDroppable[INITIAL_PLACE_KEY].list.length > 0
    }, [listDroppable])

    const onClickSave = () => {
        toast.error('Still development to save to db')
    }

    const onClickAddText = (e, paramIndex) => {
        e.preventDefault()
        setTimeout(() => {
            setIsPopoverOpen(
                isPopoverOpen.map((_, index) => paramIndex === index)
            )
        }, 250)
    }

    const onClickEditText = (e, paramIndex, values) => {
        e.preventDefault()
        setEditValues(values)
        setTimeout(() => {
            setIsOpenPopoverEdit(
                isPopoverOpen.map((_, index) => paramIndex === index)
            )
        }, 250)
    }

    const onSubmit = (values, paramIndex) => {
        console.log('VALUES-->>>', values)
        setIsPopoverOpen(listTestSortedByOrder.map(x => false))

        const newValues = listTestSortedByOrder.splice(paramIndex, 1, values)
        console.log('newValues', newValues)

        // setTextList()
    }

    useEffect(() => {
        initialize()
    }, [])

    return (
        <FingoBaseLayout>
            <Helmet>
                <title>DND Quiz Text</title>
            </Helmet>
            <DragDropContext onDragEnd={onDragEnd}>
                <Container>
                    <Form>
                        <DraggableHeader>
                            <h2 className='text-center mb-2'>{TITLE}</h2>
                            <h4 className='text-center mb-0'>Drag and Drop</h4>
                        </DraggableHeader>
                        <FormWrapper></FormWrapper>

                        {/* prettier-ignore */}
                        <ListTextWrapper>
                            <Droppable direction='horizontal' droppableId="TEXT_LIST">
                                {(provided, snapshot) => {
                                    return (
                                        <ListTextBox {...provided.droppableProps} ref={provided.innerRef} className={`${app_isDarkTheme ? 'dark' : ''}`}>
                                            {listTestSortedByOrder.length > 0 ? (
                                                listTestSortedByOrder.map((x, index) => {
                                                    return (
                                                        <Fragment key={String(index)}>
                                                            <Draggable draggableId={x.uuid} index={index}>
                                                                {(provided, snapshot) => {
                                                                    // console.log('snapshot', snapshot)
                                                                    return (
                                                                        <ListTextItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`${x.isBlankText ? 'isBlankText' : ''}`}>
                                                                            {x.isBlankText ? (
                                                                                <span style={{width: x.width ?? 20}}></span>
                                                                            ) : (
                                                                                <Popover ref={clickMeButtonRef} isOpen={isOpenPopoverEdit[index]} positions={['top', 'right', 'left', 'bottom']} padding={10} clickOutsideCapture={true} onClickOutside={e => {
                                                                                    if (e.target) {
                                                                                        setIsOpenPopoverEdit(listTestSortedByOrder.map(x => false))
                                                                                    }}}
                                                                                    content={({position, childRect, popoverRect}) => (
                                                                                        <ArrowContainer position={position} childRect={childRect} popoverRect={popoverRect} arrowColor={'blue'} arrowSize={10} arrowStyle={{opacity: 1}}>
                                                                                            <FormTextInput onSubmit={values => onSubmit(values, index)} editValues={editValues} />
                                                                                        </ArrowContainer>
                                                                                    )}
                                                                                >
                                                                                    <span id={x.uuid} onClick={e => onClickEditText(e, index, x)}>{x.label}</span>
                                                                                </Popover>
                                                                            )}
                                                                            <DeleteTextItemBtn className='DeleteTextItemBtn' onClick={() => onClickDeleteItem(index)}>
                                                                                <CloseIcon />
                                                                            </DeleteTextItemBtn>
                                                                        </ListTextItem> 
                                                                    )
                                                                }}
                                                            </Draggable>
                                                            {/* prettier-ignore */}
                                                            <Popover ref={clickMeButtonRef} isOpen={isPopoverOpen[index]} positions={['top', 'right', 'left', 'bottom']} padding={10} clickOutsideCapture={true}
                                                                    onClickOutside={e => {
                                                                        if (e.target) {
                                                                            setIsPopoverOpen(listTestSortedByOrder.map(x => false))
                                                                        }
                                                                    }}
                                                                content={({position, childRect, popoverRect}) => (
                                                                    <ArrowContainer
                                                                        position={position}
                                                                        childRect={childRect}
                                                                        popoverRect={popoverRect}
                                                                        arrowColor={'blue'}
                                                                        arrowSize={10}
                                                                        arrowStyle={{opacity: 1}}
                                                                    >
                                                                        <FormTextInput onSubmit={values => onSubmit(values, index)} />
                                                                    </ArrowContainer>
                                                                )}
                                                            >
                                                                <AddBtnText onClick={e => onClickAddText(e, index)}>+</AddBtnText>
                                                            </Popover>
                                                        </Fragment>
                                                    )
                                                })
                                            ) : (
                                                <ListTextEmpty>
                                                    Please add text
                                                </ListTextEmpty>
                                            )}
                                        </ListTextBox>
                                    )
                                }}
                            </Droppable>
                        </ListTextWrapper>

                        {/* prettier-ignore */}
                        <DraggableWrapper>
                            <DroppablePlaceContainer>
                                <DraggableHeaderTitle>
                                    <h2>Draggable List</h2>
                                </DraggableHeaderTitle>
                                <Droppable direction='horizontal' droppableId="DRAGGABLE_LIST">
                                    {(provided, snapshot) => {
                                        return (
                                            <DraggableBox {...provided.droppableProps} ref={provided.innerRef} className={`${app_isDarkTheme ? 'dark' : ''}`}>
                                                {draggableList.length > 0 ? (
                                                    draggableList.map((x, index) => {
                                                        return (
                                                            <Fragment key={String(index)}>
                                                                <Draggable draggableId={x.uuid} index={index}>
                                                                    {(provided, snapshot) => {
                                                                        // console.log('snapshot', snapshot)
                                                                        return (
                                                                            <DraggableItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                                 <span id={x.uuid} onClick={e => onClickEditText(e, index, x)}>{x.label}</span> 
                                                                                <DeleteTextItemBtn className='DeleteTextItemBtn' onClick={() => onClickDeleteDraggableItem(index)}>
                                                                                    <CloseIcon />
                                                                                </DeleteTextItemBtn>
                                                                            </DraggableItem> 
                                                                        )
                                                                    }}
                                                                </Draggable>
                                                            </Fragment>
                                                        )
                                                    })
                                                ) : (
                                                    <ListTextEmpty>
                                                        Please add text
                                                    </ListTextEmpty>
                                                )}
                                            </DraggableBox>
                                        )
                                    }}
                                </Droppable>
                            </DroppablePlaceContainer>
                            <div className='w-100 text-center'>
                                <FingoButton
                                    size="sm"
                                    className='text-center'
                                    style={{ minWidth: 200 }}
                                    onClick={onClickAddDroppable}
                                >
                                    + Add Draggable
                                </FingoButton>
                            </div>
                        </DraggableWrapper>
                    </Form>
                </Container>
            </DragDropContext>
            <FormFooter>
                <Row>
                    <Col xs={12} md={6}>
                        <FingoButton
                            className='text-center'
                            style={{ minWidth: 200 }}
                            onClick={onClickSave}
                            disabled={isDisableSaveBtn}
                        >
                            Save
                        </FingoButton>
                    </Col>
                    <Col xs={12} md={6}>
                        <FingoButton
                            className='text-center'
                            style={{ minWidth: 160 }}
                            color='danger'
                            onClick={onClickReset}
                        >
                            Reset
                        </FingoButton>
                    </Col>
                </Row>

                {/* {availableValues.length === 0 && (
                    <FingoButton
                        color='success'
                        style={{ minWidth: 240 }}
                        enableHoverEffect={false}
                    >
                        Save
                    </FingoButton>
                )} */}
            </FormFooter>
        </FingoBaseLayout>
    )
}

const Container = styled.div`
    width: 100%;
    padding: 0 20px;
    display: flex;
    flex-wrap: nowrap;
    padding-bottom: ${FOOTER_HEIGHT}px;
`

const DraggableWrapper = styled.div`
    padding: 10px;
`

const DraggableHeader = styled.div`
    margin-bottom: 1rem;
    h2 {
        font-size: 1.6rem;
        font-weight: 700;
    }
    h4 {
        font-size: 1.2rem;
        font-weight: 700;
    }
`

const DroppablePlaceContainer = styled.div`
    display: block;
    position: relative;
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
    width: 480px;

    .DroppablePlaceItem-1 {
        /* transform: translate(220px, -200px); */
    }

    .DroppablePlaceItem-2 {
        /* transform: translate(0px, -180px); */
    }

    .DroppablePlaceItem-3 {
        /* transform: translate(220px, -380px); */
    }
`

const StyledDroppablePlaceItemContainer = styled.div`
    padding: 10px;
    width: 240px;
    position: relative;
`

const StyledDroppablePlaceItem = styled.div`
    padding: 1rem;
    width: 100%;
    min-height: 240px;
    border-radius: 0.3rem;
    background-color: #f9fffa;
    border: 2px dashed #9ecfab;
    &.dark {
        background-color: #1b2926;
        border: 2px dashed #1b2b25;
    }
    &:hover {
        .DeleteDroppableBtn {
            transform: scale(1);
        }
    }

    &.isDraggingOver {
        background-color: #fbf7e9;
        border: 2px dashed #e37b20;
    }
`

const DeleteDroppableBtn = styled.div`
    border: none;
    outline: none;
    padding: 0;
    height: 28px;
    width: 28px;
    border-radius: 28px;
    background-color: red;
    color: white;
    position: absolute;
    top: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default !important;
    transform: scale(0);
    transition: all 0.2s;
    svg {
        width: 16px;
        height: auto;
    }
`

const FormWrapper = styled.div`
    width: 320px;
    padding: 1.2rem;
`

const InitialPlaceBox = styled.div`
    min-height: 200px;
    border-radius: 0.3rem;
    background-color: #fafcff;
    border: 2px dashed #a3d1eb;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem;
    margin-bottom: 0.8rem;

    &.dark {
        background-color: #1a1f21;
        border: 2px dashed #1a1e21;
    }
`

const InputGroup = styled.div`
    width: 100%;
    display: flex;
    position: relative;
    margin-bottom: 1.2rem;
`

const ItemContainer = styled.div`
    width: 170px;
`

const FormFooter = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    height: ${FOOTER_HEIGHT}px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`

const Button = styled.button`
    position: absolute;
    top: 3px;
    right: 3px;
    border: none;
    outline: 0;
    padding: 0;
    width: 50px;
    height: 37px;
    background-color: #007bff;
    color: #fff;
    border-radius: 8px;
    svg {
        width: 22px;
        height: auto;
    }
`

const ListTextWrapper = styled.div`
    margin-bottom: 5rem;
`

const ListTextBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
`

const ListTextItem = styled.div`
    display: inline-flex;
    font-size: 16px;
    font-weight: 700;
    height: 30px;
    position: relative;
    padding: 0.1rem 0.2rem;
    border-radius: 0.3rem;
    line-height: 1.6;

    &.isBlankText {
        cursor: pointer;
        span {
            display: inline-block;
            border-bottom: 1px solid #007bff;
            font-size: 20px;
        }
    }

    &:hover {
        background-color: #ecf5fe;
        .DeleteTextItemBtn {
            transform: scale(1);
        }
    }
`

const DeleteTextItemBtn = styled.div`
    border: none;
    outline: none;
    padding: 0;
    height: 18px;
    width: 18px;
    border-radius: 18px;
    background-color: red;
    color: white;
    position: absolute;
    top: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default !important;
    transform: scale(0);
    transition: all 0.2s;
    svg {
        width: 13px;
        height: auto;
    }
`

const ListTextEmpty = styled.div``

const AddBtnText = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background-color: #007bff;
    color: #fff;
    border-radius: 6px;
    cursor: pointer;
    margin: 0 0.2rem;
    position: relative;
    transition: all 0.2s;
    opacity: 0.1;
    &:hover {
        opacity: 1;
    }
`

const DraggableBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
`

const DraggableHeaderTitle = styled.div`
    margin-bottom: 1.2rem;
    text-align: center;
    h2 {
        font-size: 20px;
        font-weight: 700;
    }
`

const DraggableItem = styled.div`
    display: inline-flex;
    font-size: 16px;
    font-weight: 700;
    height: 30px;
    position: relative;
    padding: 0.2rem 0.4rem;
    border-radius: 0.3rem;
    border: 1px solid #007bff;
    background-color: #e4f1ff;
    margin: 0.3rem;
    line-height: 1.3;

    .DeleteTextItemBtn {
        top: 5px;
        right: 2px;
    }

    &:hover {
        background-color: #daecff;
        .DeleteTextItemBtn {
            transform: scale(1);
        }
    }
`

const FormTextInputBox = styled.div`
    background-color: #fff;
    width: 320px;
    min-height: 200px;
    -webkit-box-shadow: 0px 10px 33px 0px rgba(0, 0, 0, 0.12);
    -moz-box-shadow: 0px 10px 33px 0px rgba(0, 0, 0, 0.12);
    box-shadow: 0px 10px 33px 0px rgba(0, 0, 0, 0.12);
    border-radius: 0.5rem;
    padding: 1rem 1.4rem;
`

export default DNDQuizTextPage
