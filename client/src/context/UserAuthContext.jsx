import { createContext, useState, useContext, useEffect } from "react";

const USERAUTHCONTEXT = createContext([])
export const useUserAuthContext = () => useContext(USERAUTHCONTEXT)

export const UserAuthContext = ( { children } ) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    return(
        <USERAUTHCONTEXT.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </USERAUTHCONTEXT.Provider>
    )
}