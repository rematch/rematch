import { Models } from '../../typings/rematch';
import isListener from './isListener';

export default (models: Models): { [key: string]: Function } =>
    Object.keys(models).reduce((actionCreators, modelName) => {
        const { reducers = {} } = models[modelName];

        Object.keys(reducers)
            .filter(reducerName => !isListener(reducerName))
            .forEach(reducerName => {
                const type = `${modelName}/${reducerName}`;

                // We have to dynamically create the function like this,
                // so that the argument name is not minified.
                const createCreator = new Function('type', `
                    return function(payload) {
                        return { type, payload };
                    }
                `);

                actionCreators[type] = createCreator(type);
            });

        return actionCreators;
    }, {});
