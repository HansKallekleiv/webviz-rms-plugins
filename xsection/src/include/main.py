
from . import xsection
import importlib
importlib.reload(xsection)

def run(config):
    """Administrator function

    """
    xsection.make_xsections(project, config["trajectories"], config["horizons"], config["representations"])

