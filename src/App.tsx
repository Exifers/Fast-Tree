import './App.css'
import {Tree2, useChildren, useSetTree, useTree} from "./TreeProvider";
import React from "react";
import {useIsSelected, useSelect, useSelectedId} from "./SelectedIdsProvider";
import {useOnKeyPress} from "./hooks/useOnKeyPress";
import produce from "immer";

interface RecursiveTreeProps {
    id: string,
    level?: number
}

const RecursiveTree = (React.memo || ((e) => e))(({id, level = 0}: RecursiveTreeProps) => {
    const select = useSelect()
    const isSelected = useIsSelected(id)
    const children = useChildren(id)

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        if (!isSelected)
            select(id)
    }

    return (
        <div style={{border: `2px solid ${isSelected ? 'blue' : 'black'}`, padding: 16, margin: 16}}
             onClick={handleClick}>
            {id}<br/>
            {level}
            {children.map(child => (
                <RecursiveTree key={child} id={child} level={level + 1}/>
            ))}
        </div>
    )
})

const App = React.memo(() => {
    const tree = useTree()
    const setTree = useSetTree()
    const selectedId = useSelectedId()

    useOnKeyPress('d', () => {
        setTree(produce(tree, draft => {
            if (selectedId === null)
                return
            const [parent, index] = Tree2.findParent(draft, selectedId)
            if (parent === null || index === -1)
                return
            console.log(parent)
            const id = Math.round(Math.random() * 100000).toString()
            parent.children.splice(index, 0, id)
            draft.nodes[id] = {id, children: []}
            draft.parents[id] = draft.parents[selectedId]
        }))
    })

    return (
        <div className="App">
            <RecursiveTree id={tree.root}/>
        </div>
    )
})

export default App
