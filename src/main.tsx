import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {TreeProvider} from "./TreeProvider";
import {SelectionProvider} from "./SelectedIdsProvider";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <TreeProvider>
            <SelectionProvider>
                <App/>
            </SelectionProvider>
        </TreeProvider>
    </React.StrictMode>,
)
