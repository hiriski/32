import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Row, Col, ProgressBar, Alert } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useAuth, useReward } from 'src/hooks'
import { FingoButton, FingoModal } from 'src/components/core'
import OtherImg from 'src/assets/images/giftcard/other.jpg'
import 'src/styles/ModalRewardDetail.styles.css'
import { RewardApi } from 'src/api'
import LoadingBox from '../LoadingBox'
import Swal from 'sweetalert2'
import Assets from 'src/assets'
import { useNavigate } from 'react-router-dom'
import { XP_LEVEL_COLORS_DEFAULT } from 'src/constants'
import Confetti from 'react-dom-confetti'
import { ReactComponent as DiamondSvg } from 'src/assets/svg/diamond.svg'
import { ReactComponent as CopySvg } from 'src/assets/svg/baseline-content-copy.svg'
import { ReactComponent as Eye } from 'src/assets/svg/eye.svg'
import { ReactComponent as EyeOff } from 'src/assets/svg/eye-off.svg'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'

const confettiConfig = {
    colors: XP_LEVEL_COLORS_DEFAULT,
    elementCount: 150,
}

const ModalRewardDetail = () => {
    const dispatch = useDispatch()
    const { user } = useAuth()
    const {
        modalDetail,
        reward_setModalDetail,
        modalForm,
        reward_setModalForm,
        reward_adminGetList,
    } = useReward()
    const [redeemSuccess, setRedeemSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [redeemedItem, setRedeemedItem] = useState(null)
    const navigate = useNavigate()
    const [celebrate, setCelebrate] = useState(false)
    const [showPin, setShowPin] = useState(false)
    const copyRef = useRef(null)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleCloseModal = () => {
        dispatch(reward_setModalDetail(false))
    }

    const onClickRedeem = useCallback(async () => {
        Swal.fire({
            title: 'Confirm!',
            html: `Are you sure want to redeem ${modalDetail?.data?.diamondValue} gems ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then(async result => {
            if (result.isConfirmed) {
                setIsLoading(true)
                try {
                    const response = await RewardApi.redeem({
                        itemId: modalDetail.data?._id,
                        variantId: modalDetail.data?.variants?.[0]?._id
                            ? modalDetail.data.variants[0]._id
                            : null,
                        notes: '',
                    })
                    setIsLoading(false)
                    if (response) {
                        setRedeemSuccess(true)
                        if (response?.data?.rewardId) {
                            setRedeemedItem(response.data)
                        }
                        setTimeout(() => {
                            setCelebrate(true)
                        }, [750])
                    }
                } catch (e) {
                    toast.error('Opss.. failed to claim your gift card')
                    setRedeemSuccess(false)
                    setIsLoading(false)
                }
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalDetail.data])

    const onClickEarnPoint = useCallback(() => {
        handleCloseModal()
        navigate('/home')
    }, [navigate])

    const getGiftCardImage = useMemo(() => {
        if (modalDetail.data) {
            console.log('modalDetail.data', modalDetail.data)
            if (modalDetail.data?.imageURL) {
                return modalDetail.data.imageURL
            } else {
                switch (modalDetail.data.type) {
                    case 'amazon':
                        return Assets.GiftCardDefaultAmazon
                    case 'paytm':
                        return Assets.GiftCardDefaultPaytm
                    case 'flipkart':
                        return Assets.GiftCardDefaultFlipkart
                    case 'google play':
                        return Assets.GiftCardDefaultGooglePlay
                    default:
                        return Assets.GiftCardDefaultOther
                }
            }
        } else {
            return OtherImg
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalDetail.data])

    const onClickCopy = () => {
        toast.success('Copied to clipboard.')
    }

    const onClickDelete = useCallback(() => {
        if (modalDetail.data) {
            handleCloseModal()
            Swal.fire({
                title: 'Confirm!',
                html: `Are you sure want to delete Gift Card <strong>${modalDetail.data?.name}</strong> ?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
            }).then(async result => {
                if (result.isConfirmed) {
                    setIsLoading(true)
                    try {
                        const response = await RewardApi.admin_delete({
                            id: modalDetail.data._id,
                        })
                        setIsLoading(false)
                        if (response) {
                            Swal.fire({
                                title: 'Success',
                                text: 'Gift Card deleted successfully!',
                                icon: 'success',
                                showCancelButton: false,
                                confirmButtonColor: '#009c4e',
                                confirmButtonText: 'Ok',
                            }).then(result => {
                                if (result.isConfirmed) {
                                    handleCloseModal()
                                    dispatch(reward_adminGetList())
                                }
                            })
                        }
                    } catch (e) {
                        setIsLoading(false)
                    }
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalDetail.data, modalForm])

    const onClickEdit = useCallback(() => {
        if (modalDetail.data) {
            handleCloseModal()
            dispatch(
                reward_setModalForm({ open: true, data: modalDetail.data })
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalDetail.data, modalForm])

    useEffect(() => {
        if (!modalDetail.open) {
            setIsLoading(false)
            setRedeemSuccess(false)
            setRedeemedItem(null)
            setShowPin(false)
            setCelebrate(false)
        }
    }, [modalDetail.open])

    const getLogo = type => {
        switch (type) {
            case 'amazon':
                return Assets.AmazonLogo
            case 'paytm':
                return Assets.PaytmLogo
            case 'flipkart':
                return Assets.FlipkartLogo
            case 'google play':
                return Assets.GooglePlayLogo
            default:
                return Assets.GiftBoxIcon
        }
    }

    const isAbleToRedeem = useMemo(() => {
        return (
            Boolean(user?.diamond >= modalDetail?.data?.diamondValue) &&
            modalDetail?.data?.variants?.length > 0
        )
    }, [user, modalDetail.data])

    const getProgressBarColor = useMemo(() => {
        if (user?.diamond >= modalDetail?.data?.diamondValue) {
            return 'success'
        } else {
            return 'warning'
        }
    }, [user, modalDetail.data])

    const getPercentageProgressBar = useMemo(() => {
        if (user?.diamond >= modalDetail?.data?.diamondValue) {
            return 100
        } else {
            return (user?.diamond / modalDetail?.data?.diamondValue) * 100
        }
    }, [user, modalDetail.data])

    return (
        <FingoModal
            open={modalDetail.open}
            onClose={handleCloseModal}
            centered
            className='ModalRewardDetail'
        >
            <div className='RewardDetail FingoShapeRadius'>
                {isLoading ? (
                    <LoadingBox height={300} />
                ) : (
                    <>
                        {modalDetail.data && (
                            <>
                                <div className='FingoWaves'>
                                    <div />
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 1440 320'
                                    >
                                        <path
                                            fill='currentColor'
                                            fillOpacity='1'
                                            d='M0,128L60,122.7C120,117,240,107,360,112C480,117,600,139,720,160C840,181,960,203,1080,192C1200,181,1320,139,1380,117.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z'
                                        ></path>
                                    </svg>
                                </div>
                                <div className='HeaderTitle'>
                                    <h2 className='mb-3'>
                                        {redeemSuccess && redeemedItem
                                            ? 'Congratulations!'
                                            : modalDetail.data.name}
                                    </h2>
                                </div>
                                <div className='RewardDetailContent'>
                                    <div className='RewardDetailImg FingoShapeRadius'>
                                        <img
                                            src={getGiftCardImage}
                                            alt={modalDetail.data?.name}
                                        />
                                    </div>

                                    {redeemSuccess && redeemedItem ? (
                                        <div className='RedeemSuccess mb-4'>
                                            <h6 className='mb-2'>
                                                {redeemedItem?.name}
                                            </h6>
                                            <p className='mb-3'>
                                                Here's is the code for your{' '}
                                                {redeemedItem?.currencyValue}{' '}
                                                {redeemedItem?.currencyCode}{' '}
                                            </p>

                                            <div
                                                className='RedeemCode'
                                                onClick={onClickCopy}
                                            >
                                                <p className='RedeemCodeLabel'>
                                                    Code
                                                </p>
                                                <CopyToClipboard
                                                    text={
                                                        redeemedItem?.claimCode
                                                    }
                                                >
                                                    <code>
                                                        {
                                                            redeemedItem?.claimCode
                                                        }
                                                    </code>
                                                </CopyToClipboard>
                                                <CopyToClipboard
                                                    text={
                                                        redeemedItem?.claimCode
                                                    }
                                                >
                                                    <CopySvg
                                                        onClick={onClickCopy}
                                                        className='cp'
                                                    />
                                                </CopyToClipboard>
                                            </div>

                                            {/* pin */}
                                            {redeemedItem.pin && (
                                                <div className='mt-2'>
                                                    <p className='mb-1 text-bold'>
                                                        PIN
                                                    </p>
                                                    <div className='RedeemPin'>
                                                        {/* {redeemedItem?.pin && <></>} */}
                                                        <input
                                                            value={
                                                                redeemedItem.pin
                                                            }
                                                            type={
                                                                showPin
                                                                    ? 'text'
                                                                    : 'password'
                                                            }
                                                        />
                                                        <button
                                                            className='ToggleShowPin'
                                                            onClick={() =>
                                                                setShowPin(
                                                                    !showPin
                                                                )
                                                            }
                                                        >
                                                            {showPin ? (
                                                                <Eye />
                                                            ) : (
                                                                <EyeOff />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            {modalDetail?.data?.variants
                                                ?.length < 1 && (
                                                <Alert variant='danger text-center mb-2'>
                                                    This gift card is not
                                                    available
                                                </Alert>
                                            )}
                                            <Row className='align-items-center justify-space-between'>
                                                <Col xs={8}>
                                                    <div className='RewardDetailLogo'>
                                                        <img
                                                            src={getLogo(
                                                                modalDetail.data
                                                                    ?.type
                                                            )}
                                                            alt='logo'
                                                        />
                                                        <p className='mb-0'>
                                                            {modalDetail.data?.type.toUpperCase()}
                                                        </p>
                                                    </div>
                                                </Col>
                                                <Col xs={4}>
                                                    <div className='RewardDetailCurrency'>
                                                        <p>
                                                            {
                                                                modalDetail.data
                                                                    ?.currencyValue
                                                            }{' '}
                                                            {
                                                                modalDetail.data
                                                                    ?.currencyCode
                                                            }
                                                        </p>
                                                    </div>
                                                </Col>
                                                <Col xs={12} className='mb-3' />
                                                <Col xs={12} className='mb-2'>
                                                    <div className='ProgressBarTextContainer mb-1'>
                                                        <p className='mb-0 RewardDetailRedeemText'>
                                                            REDEEM FOR{' '}
                                                            <DiamondSvg />{' '}
                                                            {
                                                                modalDetail.data
                                                                    .diamondValue
                                                            }
                                                        </p>
                                                        {user.diamond <
                                                            modalDetail.data
                                                                .diamondValue && (
                                                            <p className='mb-0 RewardDetailRedeemText'>
                                                                {user.diamond} /{' '}
                                                                {
                                                                    modalDetail
                                                                        .data
                                                                        .diamondValue
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <ProgressBar
                                                        variant={
                                                            getProgressBarColor
                                                        }
                                                        now={
                                                            getPercentageProgressBar
                                                        }
                                                    />
                                                </Col>
                                                <Col xs={12} className='mb-1'>
                                                    <hr />
                                                </Col>
                                                <Col xs={12} className='mb-3'>
                                                    <h6 className='mb-1'>
                                                        Description
                                                    </h6>
                                                    <p className='mb-0'>
                                                        {modalDetail.data
                                                            .description ?? '-'}
                                                    </p>
                                                    <hr />
                                                </Col>
                                                <Col xs={12} className='mb-3'>
                                                    <h6 className='mb-1'>
                                                        URL
                                                    </h6>
                                                    <p className='mb-0'>
                                                        {modalDetail.data
                                                            .brandUrl ?? '-'}
                                                    </p>
                                                    <hr />
                                                </Col>
                                                <Col xs={12}>
                                                    <FingoButton
                                                        className='mb-4 w-100'
                                                        size='lg'
                                                        color='success'
                                                        disabled={
                                                            !isAbleToRedeem
                                                        }
                                                        onClick={onClickRedeem}
                                                    >
                                                        Redeem
                                                    </FingoButton>
                                                    {!isAbleToRedeem && (
                                                        <p className='text-center'>
                                                            Earn gems to claim
                                                            your gift
                                                        </p>
                                                    )}

                                                    {user?.role === 'admin' && (
                                                        <>
                                                            <hr />
                                                            <Row
                                                                xs={6}
                                                                className='mt-4 mb-4'
                                                            >
                                                                <Col xs={6}>
                                                                    <FingoButton
                                                                        className='w-100'
                                                                        onClick={
                                                                            onClickEdit
                                                                        }
                                                                    >
                                                                        Edit
                                                                    </FingoButton>
                                                                </Col>
                                                                <Col xs={6}>
                                                                    <FingoButton
                                                                        onClick={
                                                                            onClickDelete
                                                                        }
                                                                        style={{
                                                                            width: '100%',
                                                                        }}
                                                                        size='large'
                                                                        color='danger'
                                                                    >
                                                                        Delete
                                                                    </FingoButton>
                                                                </Col>
                                                            </Row>
                                                        </>
                                                    )}
                                                </Col>
                                            </Row>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}
                <div className='Celebrate'>
                    <Confetti active={celebrate} config={confettiConfig} />
                </div>
            </div>
        </FingoModal>
    )
}

export default ModalRewardDetail
