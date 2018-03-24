import { Action, Models } from '../../typings/rematch'
import isListener from './isListener'

export default (models: Models): { [key: string]: (type, payload, meta) => Action } =>
    Object.keys(models).reduce((actionCreators, modelName) => {
        const { reducers = {} } = models[modelName]

        Object.keys(reducers)
            .filter((reducerName: string) => !isListener(reducerName))
            .forEach((reducerName: string) => {
                const type = `${modelName}/${reducerName}`
                actionCreators[type] = (payload, meta) => ({
                    type, payload, meta,
                })
            })

        return actionCreators
    }, {})
