import { useState } from 'react'
import { useUserAuthContext } from '../context/UserAuthContext'
import { redirect } from 'react-router-dom'

export const Dashboard = () => {
    const {user} = useUserAuthContext()

    return(
        <>
            <h1>Welcome {user.firstName} {user.lastName}</h1>
        </>
    )
}