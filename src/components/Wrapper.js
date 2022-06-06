import {useDispatch, useSelector} from "react-redux";
import {clearState, exchangeToken, userSelector} from "../app/userSlice";
import {useEffect} from "react";

export const Wrapper = ({children}) => {
    const dispatch = useDispatch();
    const {isError} = useSelector(userSelector);

    useEffect(() => {
        dispatch(exchangeToken({accessToken: localStorage.getItem('accessToken')}));
    }, []);

    useEffect(() => {
        if (isError) {
            dispatch(clearState());
        }
    }, [isError]);

    return children
}