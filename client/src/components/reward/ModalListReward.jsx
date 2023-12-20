import React, { useEffect } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useAuth, useReward } from 'src/hooks'
import { FingoButton, FingoModal } from 'src/components/core'
import LoadingBox from 'src/components/LoadingBox'
import RewardCardItem from './RewardCardItem'
import 'src/styles/ModalListReward.styles.css'

const ModalListReward = () => {
    const dispatch = useDispatch()
    const { isAuthenticated, auth_setOpenModalRegister } = useAuth()
    const {
        openModalListReward,
        reward_setOpenModalListReward,
        listRewardIsLoading: isLoading,
        listRewardData: data,
        reward_getList,
    } = useReward()

    const handleCloseModal = () => {
        dispatch(reward_setOpenModalListReward(false))
    }

    useEffect(() => {
        if (openModalListReward) {
            dispatch(reward_getList())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openModalListReward])

    const onClickSignUp = () => {
        handleCloseModal()
        dispatch(auth_setOpenModalRegister(true))
    }

    return (
        <FingoModal
            open={openModalListReward}
            onClose={handleCloseModal}
            centered
            className='ModalListReward'
        >
            <div className='relative ListRewardContainer FingoShapeRadius'>
                <div className='ListRewardHeader'>
                    <h2 className='mb-1'>Redeem your gems</h2>
                    <p>Select the products you would like to redeem</p>
                </div>
                <hr />
                <div
                    className={`ListReward ${
                        !isAuthenticated ? 'ListForGuest' : ''
                    }`}
                >
                    <Row>
                        {isLoading ? (
                            <Col xs={12}>
                                <LoadingBox height={300} />
                            </Col>
                        ) : (
                            <>
                                {data.length > 0 &&
                                    data.map(x => (
                                        <Col
                                            xs={12}
                                            md={6}
                                            key={x._id}
                                            className='mb-3 px-2'
                                        >
                                            <RewardCardItem data={x} />
                                        </Col>
                                    ))}
                            </>
                        )}
                    </Row>
                    {!isAuthenticated && (
                        <div className='ListRewardSignUp FingoShapeRadius'>
                            <h2>
                                Signup or login <br /> To earn your gift card.
                            </h2>
                            <FingoButton
                                onClick={onClickSignUp}
                                color='primary'
                            >
                                Sign Up
                            </FingoButton>
                        </div>
                    )}
                </div>
            </div>
        </FingoModal>
    )
}

export default ModalListReward
