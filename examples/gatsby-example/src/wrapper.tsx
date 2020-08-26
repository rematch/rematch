import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";

export default ({ element }: any) => (
	<Provider store={store}>{element}</Provider>
)