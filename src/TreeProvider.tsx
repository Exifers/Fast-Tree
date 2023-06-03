import React, {ReactNode, useState} from 'react';
import {createContext, useContextSelector} from "use-context-selector";

interface TreeContext {
    value: Tree2
    setValue: (value: Tree2) => void
}

const generateInitialTree = (): Tree2 => {
    const tree: Tree2 = {root: '1', nodes: {1: {children: []}}, parents: {1: null}}
    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < 50; i++) {
            Tree2.insertAtPath(tree, Array(i + 1).fill(0), {children: []})
        }
    }
    return tree
}

const TreeContext = createContext<TreeContext | null>(null);

interface TreeProviderProps {
    children: ReactNode
}

export const TreeProvider = ({children}: TreeProviderProps) => {
    const [value, setValue] = useState<Tree2>(generateInitialTree);
    return (
        <TreeContext.Provider value={{value, setValue}}>
            {children}
        </TreeContext.Provider>
    )
}

export const useTree = () => {
    return useContextSelector(TreeContext, ({value}) => value)
}

export const useSetTree = () => {
    return useContextSelector(TreeContext, ({setValue}) => setValue)
}

export const useProperties = (id: string) => {
    const serialized = useContextSelector(TreeContext, ({value}) => {
        // constant
        const {children, ...properties} = Tree2.find(value, id)
        return JSON.stringify(properties)
    })
    return JSON.parse(serialized)
}

export const useChildren = (id: string) => {
    const serialized = useContextSelector(TreeContext, ({value}) => {
        // constant
        const children = Tree2.getChildrenIds(value, id)
        if (children === undefined)
            throw new Error(`id ${id} not found in tree`)
        return JSON.stringify(children)
    })
    return JSON.parse(serialized)
}

interface Node2 {
    children: Array<string>
}

interface Tree2 {
    root: string
    nodes: Record<string, Node2>
    parents: Record<string, string | null>
}

const tree: Tree2 = {
    root: '1',
    nodes: {
        1: {children: ['2', '3', '4']},
        2: {children: []},
        3: {children: []},
        4: {children: []},
    },
    parents: {
        1: null,
        2: '1',
        3: '1',
        4: '1'
    }
}

export namespace Tree2 {
    export const find = (tree: Tree2, id: string): Node2 | undefined =>
        tree.nodes[id]

    export const findByPath = (tree: Tree2, path: number[]): Node2 | undefined => {
        let cur = tree.root
        for (const index of path) {
            const children = getChildrenIds(tree, cur)
            if (children === undefined)
                throw new Error(`Invalid path`)
            cur = children[index]
        }
        return find(tree, cur)
    }

    export const findParent = (tree: Tree2, id: string): [Node2, number] | [null, -1] =>
        tree.parents[id] === null
            ? [null, -1]
            : [
                tree.nodes[tree.parents[id]],
                tree.nodes[tree.parents[id]].children.findIndex(i => i === id)
            ]

    export const getChildren = (tree: Tree2, id: string): Array<Node2> | undefined =>
        find(tree, id)?.children?.map(c => find(tree, c)!)

    export const getChildrenIds = (tree: Tree2, id: string): Array<string> | undefined =>
        find(tree, id)?.children

    export const insertAtPath = (tree: Tree2, path: Array<number>, node: Node2) => {
        if (path.length === 0)
            throw new Error(`Cannot replace root`)
        const parentPath = path.slice(0, path.length - 1)
        const index = path[path.length - 1]

        let cur: string | undefined = tree.root
        for (const i of parentPath) {
            cur = getChildrenIds(tree, cur)?.[i]
            if (cur === undefined)
                throw new Error('Invalid path')
        }

        const parentId = cur
        const parent = find(tree, parentId)
        if (parent === undefined)
            throw new Error('Invalid path')

        const createdId = Math.round(Math.random() * 10000).toString()

        tree.nodes[createdId] = node
        parent.children.splice(index, 0, createdId)
        tree.parents[createdId] = parentId
    }
}