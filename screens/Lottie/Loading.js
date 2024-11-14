import React from 'react'
import LottieView from 'lottie-react-native'
import animations from '../../constants/animations'

const Loading = () => {
    return (
        <LottieView
            source={animations.loading}
            style={{ width: '100%', height: '100%' }}
            autoPlay
            loop
        />
    )
}
export default Loading
