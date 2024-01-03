import { useSelector } from 'react-redux'
import {
    dndQuizText_selectState,
    dndQuizText_reducerActions,
} from 'src/redux/DNDQuizText'
import * as dndQuizText_thunkActions from 'src/redux/DNDQuizText/dndQuizText.thunk'

export const useDNDQuizText = () => {
    const state = useSelector(dndQuizText_selectState)

    return {
        ...state,
        ...dndQuizText_reducerActions,
        ...dndQuizText_thunkActions,
    }
}
