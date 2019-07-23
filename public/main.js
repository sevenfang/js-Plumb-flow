import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, HashRouter, Route } from "react-router-dom";
import Test1 from "./Test1";
import Test2 from "./Test2";
import Test3 from "./Test3";
import Test4 from "./Test4";

ReactDOM.render(
    <HashRouter>
        <div>
            <Route exact path="/" component={ Test1 } />
            <Route path="/app" component={ Test2 } />
            <Route path="/a" component={ Test3 } />
            <Route path="/add" component={ Test4 } />
        </div>
    </HashRouter>
    , document.getElementById('root'));



