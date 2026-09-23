"""Serve and auto-load the Luna Climate dashboard cards.

The cards ship inside the integration as one bundled module. It is served
from the integration's own URL and added as an extra frontend module, so
the cards are available on every dashboard without anyone adding a
resource by hand. The version in the URL busts the browser cache on update.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

BUNDLE = Path(__file__).parent / "frontend" / "luna-climate-cards.js"
URL_BASE = f"/{DOMAIN}_static"
URL = f"{URL_BASE}/luna-climate-cards.js"
_REGISTERED = f"{DOMAIN}_frontend_registered"


def _version() -> str:
    manifest = Path(__file__).parent / "manifest.json"
    try:
        return str(json.loads(manifest.read_text(encoding="utf-8"))["version"])
    except (OSError, ValueError, KeyError):
        return "dev"


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Register the card bundle once per Home Assistant run."""
    if hass.data.get(_REGISTERED):
        return
    if not await hass.async_add_executor_job(BUNDLE.is_file):
        _LOGGER.warning(
            "Luna Climate card bundle missing at %s; the dashboard cards "
            "will not be available", BUNDLE
        )
        return

    version = await hass.async_add_executor_job(_version)
    await hass.http.async_register_static_paths(
        [StaticPathConfig(URL_BASE, str(BUNDLE.parent), cache_headers=True)]
    )
    add_extra_js_url(hass, f"{URL}?v={version}")
    hass.data[_REGISTERED] = True
