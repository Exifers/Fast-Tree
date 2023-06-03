import {useEffect} from "react";

export const useOnKeyPress = (key: string, callback: (event: KeyboardEvent) => void) => {
    useEffect(() => {
        const listener = (event) => {
            if (event.key === key) {
                callback(event)
            }
        }
        window.addEventListener('keydown', listener)
        return () => {
            window.removeEventListener('keydown', listener)
        }
    }, [key, callback])
}