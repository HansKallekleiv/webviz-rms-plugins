import "bootstrap";
import "./scss/app.scss";
import "./scss/rms_select.scss";
declare var rms: any;

var horselector, wellselector;

window.updateImage = function updateImage() {
    const horizons = horselector.getSelection().objects;
    const trajs = wellselector.getSelection().objects;
    const reprs = document.getElementById("repr_sel");
    const logrun = document.getElementById("log_run").value;
    const repr = reprs.options[reprs.selectedIndex].value;
    const surface_fill = document.getElementById("surface_fill").checked;
    var pic = document.getElementById("pic");
    rms.uipy
        .make_xsections(horizons, trajs, repr, surface_fill, logrun)
        .then((img) => {
            pic.src = img;
        });
};

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

horselector = createSelector("horizon_sel", "horizons", "horizons");
wellselector = createSelector(
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
