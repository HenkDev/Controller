import StraceDiagnosticsManager from '../managers/straceDiagnosticsManager';
import AppUtils from '../utils/appUtils'

const switchStraceForElement = function (props, params, callback) {
    if (AppUtils.getProperty(params, props.fogId) == null) {
        return callback('error', 'Can\'t run strace for element without fog');
    }

    let elementData = {
        element_instance_uuid: AppUtils.getProperty(params, props.instanceId),
        strace: AppUtils.getProperty(params, props.strace)
    };

    return StraceDiagnosticsManager
        .updateOrCreateStraceDiagnostics(elementData)
        .then(AppUtils.onUpdateOrCreate.bind(null, params, props.setProperty, 'Unable to switch STrace for Fog Instance', callback))
};

const pushBufferForElements = function (props, params, callback) {
    let straceData = AppUtils.getProperty(params, props.straceData);
    Object.keys(straceData)
        .forEach((elementId) => {
            StraceDiagnosticsManager.pushBufferByElementId(elementId, straceData[elementId])
        });
    return callback();
};

const popBufferByElementId = function (props, params, callback) {
    let elementId = AppUtils.getProperty(params, props.instanceId);

    return StraceDiagnosticsManager
        .findStraceDiagnosticsAndPopBufferByElementId(elementId)
        .then(AppUtils.onFind.bind(null, params, props.setProperty, 'this instance isn\'t in strace diagnostics list', callback))
};

const getStraceValuesForFog = function (props, params, callback) {
    let fogId = AppUtils.getProperty(params, props.fogId);

    return StraceDiagnosticsManager
        .findStraceDiagnosticsStateByFogId(fogId)
        .then(AppUtils.onFindOptional.bind(null, params, props.setProperty, callback))
};

export default {
    switchStraceForElement: switchStraceForElement,
    pushBufferForElements: pushBufferForElements,
    popBufferByElementId: popBufferByElementId,
    getStraceValuesForFog: getStraceValuesForFog
}