import React, { useRef, useState, useEffect } from 'react'
import { useParams, useLocation, useSearchParams } from 'react-router-dom'
import Axios from 'src/api/axios'
import { Link, useNavigate } from 'react-router-dom'
import { Badge, Card, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import Navbar from '../components/Navbar'
import Confetti from 'react-dom-confetti'
import { Howl } from 'howler'
import Sound from '../sounds/success-1.mp3'
import { FingoHomeLayout } from 'src/components/layouts'
import { AuthAPI } from 'src/api'
import { useApp, useAuth } from 'src/hooks'
import { batch, useDispatch } from 'react-redux'
import FingoModalLevelUp from 'src/components/FingoModalLevelUp'
import 'src/styles/FingoLessonComplete.styles.css'
import { FingoButton } from 'src/components/core'
import StartFilled from 'src/assets/images/star-filled.png'
import StartFilledFade from 'src/assets/images/star-filled-fade.png'
import { ReactComponent as DiamondSvg } from 'src/assets/svg/diamond.svg'
import 'src/styles/ScorePage.styles.css'

const ScorePage = () => {
    const dispatch = useDispatch()
    const { user, auth_syncAndGetUser } = useAuth()
    const { app_setModalLevelUp } = useApp()
    const { skillName, category, subcategory } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [skillDetails, setSkillDetails] = useState({})
    const role = useRef('')
    const allSubCategories = useRef([])
    const totalSubCategories = useRef(-1)
    const subCategoryIndex = useRef(-1)

    const data = location.state?.data
    console.log('data', data)

    const [xp, setXP] = useState(0)
    const [diamondEarned, setDiamondEarned] = useState(0)
    const [celebrate, setCelebrate] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()
    const [newUserLimit, setNewUserLimit] = useState(false)

    const confettiConfig = {
        angle: 90,
        spread: 360,
        startVelocity: 30,
        elementCount: 100,
        dragFriction: 0.12,
        duration: 3000,
        stagger: 3,
        width: '10px',
        height: '10px',
        perspective: '500px',
        colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
    }

    const sound = new Howl({
        src: [Sound], // Replace with the path to your sound file
    })

    useEffect(() => {
        // Log to check if the sound file is loaded
        console.log('Sound loaded:', sound.state())

        // Ensure that the sound is loaded before playing
        sound.once('load', () => {
            console.log('Sound loaded:', sound.state())

            if (celebrate) {
                // Play the sound when celebrate state changes to true
                sound.play()
            }
        })

        // Load the sound
        sound.load()

        // Clean up the Howler.js sound object when the component is unmounted
        return () => {
            sound.unload()
        }
    }, [celebrate])

    const getSkillBySkillName = newUser => {
        Axios({
            method: 'GET',
            withCredentials: true,
            url: `/server/skills/${skillName}`,
            params: {
                newUser: newUser,
            },
        }).then(res => {
            setSkillDetails(res.data.data[0])
            allSubCategories.current = res.data.data[0].sub_categories.filter(
                function (sub_category) {
                    return sub_category.category === category
                }
            )
            totalSubCategories.current = allSubCategories.current.length
            for (var i = 0; i < totalSubCategories.current; i++) {
                if (allSubCategories.current[i].sub_category === subcategory) {
                    subCategoryIndex.current = i
                    break
                }
            }
        })
    }

    const getAllScores = newUser => {
        Axios({
            method: 'GET',
            withCredentials: true,
            url: `/server/allscores`,
            params: {
                newUser: newUser,
            },
        }).then(res => {
            // console.log("all scores ", res.data);
        })
    }

    const calculateDiamondEarned = paramsScore => {
        if (paramsScore && paramsScore.length > 0) {
            let diamondEarned = 0
            // sample paramsScore = [1, 0, 1, 0, 1]
            const correctAnswers = paramsScore.filter(s => s > 0)

            // all correct
            if (paramsScore.length === correctAnswers.length) {
                diamondEarned = 3
            }
            // upto 2 wrong answers
            else if (correctAnswers.length + 2 >= paramsScore.length) {
                diamondEarned = 2
            }
            // upto 3 wrong answers
            else if (correctAnswers.length + 3 >= paramsScore.length) {
                diamondEarned = 1
            } else {
                diamondEarned = 0
            }
            setDiamondEarned(diamondEarned)
        }
    }

    const getUserInfo = async () => {
        auth_syncAndGetUser().then(result => {
            if (result?._id) {
                setXP(result?.xp?.current)
                // setDiamondEarned()
                role.current = result?.role
                // Put logic to show modal level up here
                if (
                    parseInt(user?.xp?.total) < parseInt(result?.xp?.total) &&
                    parseInt(user?.xp?.level) < parseInt(result?.xp?.level)
                ) {
                    dispatch(
                        app_setModalLevelUp({
                            open: true,
                            data: result?.xp,
                        })
                    )
                }
            }
        })
    }

    useEffect(() => {
        const newUser = searchParams.get('newUser')
        if (newUser === 'true') {
            const storedScores =
                JSON.parse(sessionStorage.getItem('scores')) || []

            const matchingScores = storedScores.filter(
                scoreItem =>
                    scoreItem.skill === skillName &&
                    scoreItem.category === category
            )

            if (matchingScores.length >= 5) {
                const score = matchingScores.reduce(
                    (acc, item) => acc + item.score,
                    0
                )
                const points = matchingScores.reduce(
                    (acc, item) => acc + item.points,
                    0
                )

                setNewUserLimit(true)
            } else {
                setCelebrate(true)
                getSkillBySkillName(newUser)
                getAllScores(newUser)

                const storedXp = sessionStorage.getItem('xp')
                if (storedXp) {
                    setXP(parseInt(storedXp, 10))
                }
            }
        } else {
            getUserInfo()
            calculateDiamondEarned(data.score.current)
            if (!newUser && Boolean(user)) {
                setCelebrate(true)
                getSkillBySkillName()
                getAllScores()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    const renderStarImg = activeCount => {
        return (
            <>
                {Array(3)
                    .fill('')
                    .map((i, index) => (
                        <div key={String(index)}>
                            <img
                                src={
                                    activeCount > index
                                        ? StartFilled
                                        : StartFilledFade
                                }
                                alt='star'
                            />
                        </div>
                    ))}
            </>
        )
    }

    const renderStar = _score => {
        const correctAnswers = _score.filter(i => i > 0)
        if (_score.length === correctAnswers.length) return renderStarImg(3)
        else if (_score.length === correctAnswers.length + 1)
            return renderStarImg(2)
        else if (_score.length === correctAnswers.length + 2)
            return renderStarImg(1)
        else return renderStarImg()
    }

    return (
        <FingoHomeLayout>
            <Helmet>
                <title>Score page</title>
            </Helmet>
            <div>
                <div className='FingoLessonCompleteHeader'>
                    <h2 className='text-center'>
                        {skillName.split('_').join(' ')} {'->'}{' '}
                        {category.split('_').join(' ')} {'->'}{' '}
                        {subcategory.split('_').join(' ')}
                    </h2>
                </div>

                {data ? (
                    <>
                        {newUserLimit ? (
                            <>
                                <Card.Header className='congratulation-card-header'>
                                    If you want to continue please Register
                                </Card.Header>
                                <Card.Body>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Link to='/auth/register'>
                                            <Button variant='success'>
                                                Register
                                            </Button>
                                        </Link>
                                    </div>
                                </Card.Body>
                            </>
                        ) : (
                            <div className='FingoLessonComplete'>
                                <div className='confetti-container'>
                                    <Confetti
                                        active={celebrate}
                                        config={confettiConfig}
                                    />
                                </div>
                                <div className={`StarContainer count-3`}>
                                    {data?.score?.current &&
                                        renderStar(data.score.current)}
                                </div>

                                <div className='FingoLessonCompleteContent'>
                                    <h2>You earned</h2>
                                    <h6>🍌{xp}</h6>
                                    <h6 className='ScorePageDiamondText'>
                                        <DiamondSvg /> {diamondEarned}
                                    </h6>
                                    <div className='relative flex flex-column mt-4'>
                                        {subCategoryIndex.current + 1 <
                                            totalSubCategories.current && (
                                            <>
                                                <FingoButton
                                                    color='white'
                                                    onClick={() => {
                                                        const newUserQueryParam =
                                                            searchParams.get(
                                                                'newUser'
                                                            )
                                                                ? '?newUser=true'
                                                                : ''
                                                        navigate(
                                                            `/skills/${skillName}/${category}/${
                                                                allSubCategories
                                                                    .current[
                                                                    subCategoryIndex.current +
                                                                        1
                                                                ].sub_category
                                                            }/information/${0}${newUserQueryParam}`
                                                        )
                                                    }}
                                                >
                                                    Next: Start with{' '}
                                                    {allSubCategories.current[
                                                        subCategoryIndex.current +
                                                            1
                                                    ].sub_category
                                                        .split('_')
                                                        .join(' ')}
                                                </FingoButton>
                                            </>
                                        )}
                                        {subCategoryIndex.current + 1 ===
                                            totalSubCategories.current && (
                                            <>
                                                <FingoButton
                                                    color='white'
                                                    onClick={() => {
                                                        navigate(
                                                            `/skills/${skillName}/${category}`
                                                        )
                                                    }}
                                                >
                                                    Go Back!!
                                                </FingoButton>{' '}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    'Loading'
                )}
                <br />
                <br />
            </div>
            <FingoModalLevelUp isFormScorePage={true} />
        </FingoHomeLayout>
    )
}

export default ScorePage
