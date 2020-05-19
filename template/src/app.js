import "bootstrap";
import "./scss/app.scss";
import "./scss/rms_select.scss";
declare var rms: any;


function createSelector(domId, selType, configKey, single = false) {
    let selector = rms.createSelector(domId, [selType], { single: single });

    rms.onPluginLoaded((config) => {
        // Get previously-saved selections.
        if (configKey in config) {
            // Update the selector
            selector.setSelection(config[configKey]);
        }
    });
    // setSelectionEnd

    // getSelectionStart
    rms.onPluginSave(function () {
        // Get the selection and save it to the config dictionary.
        return { [configKey]: selector.getSelection() };
    });
    // getSelectionEnd
    return selector;
}


const wellselector = createSelector(
    "traj_sel",
    "trajectories",
    "trajectories",
    true
);
wellselector.onSelectionChanged((sel) => {
    updateImage();
});
horselector.onSelectionChanged((sel) => {
    updateImage();
});
