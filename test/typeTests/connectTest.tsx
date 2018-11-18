import { createModel, ModelReducers } from '@rematch/core';
import { init, RematchRootState } from '@rematch/core'
import * as React from 'react';
import {connect, DispatchProp} from 'react-redux';
export interface ModelState {
    readonly elements: string;
};

const model1 = createModel({
    state: {
		elements: ""
    },
    reducers: {
		init(state: ModelState, urlToLoadDataFrom: string): ModelState {
			return {
				...state,
			};
		}
	}
});


const store = init({
	models: {
		model1
	}
});

type Store = typeof store;
type Dispatch = typeof store.dispatch;


const mapDispatchToProps = (dispatch: Dispatch) => ({
    init: dispatch.model1.init
})
interface FooProps {
	x: string
}

class FooComponent extends React.PureComponent<FooProps & ReturnType<typeof mapDispatchToProps>> {
    public render(): JSX.Element {
        return <div></div>
    }

}
/////////////////////////////////////
// ACTUAL TESTCASE FOLLOWS HERE
/////////////////////////////////////

// this is what *should* work, but does not.
const Test = connect(null, mapDispatchToProps)(FooComponent);

// this does not work either
// const Test = connect(null, mapDispatchToProps as any)(FooComponent);

// this DOES work but is ugly
// const Test = connect(null, mapDispatchToProps as any)(FooComponent) as unknown as React.ComponentClass<FooProps>;
const assert = <Test x="hallo" />
