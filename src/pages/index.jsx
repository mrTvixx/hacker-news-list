import React, { memo } from "react";
import { Switch, Route } from "react-router-dom";

import MainPage from "./MainPage";
import ObjectPage from './ObjectPage';


const App = () => (
  <Switch>
    <Route path="/:id">
      <ObjectPage />
    </Route>
    <Route path="/">
      <MainPage />
    </Route>
  </Switch>
);

export default memo(App);
