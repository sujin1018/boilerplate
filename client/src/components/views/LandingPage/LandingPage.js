import React, { useEffect } from 'react'
import axios from 'axios';

function LandingPage() {

    useEffect(() => {
        axios.get('/api/hello') //get request를 서버에 보냄
        .then(response => console.log(response.data)) // 서버에서 돌아오는 response를 보여줌
    }, [])

    return (
        <div>
            LandingPage
        </div>
    )
}

export default LandingPage