import roxar
from . import xsection


def get_html_context():
    return {
        "repr": [
            {"name": repr.name}
            for repr in project.horizons.representations
            if repr.type is roxar.GeometryType.surface
        ]
    }


def make_xsections(*args):
    print(args)
    return xsection.get_xsection(project, *args)
