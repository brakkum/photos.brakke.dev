import { BrowserRouter, Route, Switch } from "react-router-dom";
import * as serviceWorker from './serviceWorker';
import FileBrowser from "./FileBrowser";
import ReactDOM from 'react-dom';
import "bulma/css/bulma.css";
import React from 'react';
import './index.css';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route
                path="/:dir*"
                render={match => <FileBrowser {...match} />}
            />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
