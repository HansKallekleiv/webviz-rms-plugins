import os
import base64
import io
import matplotlib

matplotlib.use("agg")
import matplotlib.pyplot as plt
import xtgeo
from xtgeo.plot import XSection


def get_xsection(project, horizons, wells, datatype, surface_fill=False, logrun="log"):
    print('wells', wells)
    for well in wells:
        print('well',well)
        mywell = xtgeo.well_from_roxar(project, well[1], logrun=logrun)

    surfaces = []
    for horizon in horizons:
        horizon = horizon[1]
        try:
            mysurf = xtgeo.surface_from_roxar(project, horizon, datatype)
            surfaces.append(mysurf)
        except RuntimeError:
            pass
    return plot(mywell, surfaces, surface_fill)


def z_range_plot(xtg_well, zmin=1700):

    try:
        xtg_well.zonelogname = "ZONELOG"
        df = xtg_well.get_zonation_points()
        min_tvd = df["Z_TVDSS"].iloc[0] - 50
        max_tvd = df["Z_TVDSS"].iloc[-1] + 50
    except:
        max_tvd = xtg_well.dataframe["Z_TVDSS"].max() + 50
        min_tvd = xtg_well.dataframe["Z_TVDSS"].max() - 150
        if min_tvd > zmin:
            min_tvd = zmin

    return [min_tvd, max_tvd]


def plot(xtg_well, surfaces, surface_fill):
    plot = XSection(
        zmin=z_range_plot(xtg_well)[0],
        zmax=z_range_plot(xtg_well)[1],
        well=xtg_well,
        surfaces=surfaces,
        #        outline=faultpol,
    )
    colors = "/project/fmu/users/hakal/tmp/output/xsections/data/rms_colortables/zonation.rmscolors"
    plot.canvas(
        title="Gullfaks Cook well Xsections", subtitle=xtg_well.name, figscaling=1.2
    )

    print(colors)

    plot.legendsize = "10"
    # plot.colormap = "tab20"
    plot.colormap_zonelog = colors

    plot.plot_well()
    plot.plot_surfaces(fill=surface_fill, colormap=colors)
    #    plot.plot_surfaces(surfaces=gridsurfaces, colormap="summer")
    plot.plot_wellmap()
    plot.plot_map()

    return plot_to_image_string(plot)


def plot_to_image_string(plot):
    buf = io.BytesIO()
    plot.savefig(buf, fformat="svg")
    buf.seek(0)
    return f"data:image/svg+xml;base64, {base64.b64encode(buf.read()).decode('ascii')}"
