import React, {ReactNode, useState} from "react";
import {createContext, useContextSelector} from "use-context-selector";

interface SelectionContext {
    ids: Array<string>
    setIds: (value: Array<string>) => void
}

const SelectionContext = createContext<SelectionContext | null>(null)

interface SelectionProviderProps {
    children: ReactNode
}

export const SelectionProvider = ({children}: SelectionProviderProps) => {
    const [ids, setIds] = useState<Array<string>>([])
    return (
        <SelectionContext.Provider value={{ids, setIds}}>
            {children}
        </SelectionContext.Provider>
    )
}

export const useIsSelected = (id: string) => {
    return useContextSelector(SelectionContext, ({ids}) => ids.includes(id))
}

export const useSelectedId = (): string | null => {
    return useContextSelector(SelectionContext, ({ids}) => ids.length === 1 ? ids[0] : null)
}

export const useSelect = () => {
    const setIds = useContextSelector(SelectionContext, ({setIds}) => setIds)
    return (id: string) => setIds([id])
}