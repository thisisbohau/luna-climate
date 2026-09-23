"""Tunable numbers: per-zone temperatures and control parameters."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from homeassistant.components.number import (
    NumberDeviceClass,
    NumberEntity,
    NumberEntityDescription,
    NumberMode,
)
from homeassistant.const import EntityCategory, UnitOfTemperature, UnitOfTime
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import (
    GLOBAL_PRECOMFORT_TIMEOUT,
    SET_AWAY_TEMP,
    SET_BOOST_OFFSET,
    SET_HYSTERESIS,
    SET_MIN_CYCLE,
    SET_NIGHT_TEMP,
    ZONE_MAX_TEMP,
    ZONE_MIN_TEMP,
)
from .engine import LunaEngine, ZoneConfig
from .entity import LunaGlobalEntity, LunaZoneEntity


@dataclass(frozen=True, kw_only=True)
class LunaNumberDescription(NumberEntityDescription):
    """Description of one tunable number."""

    setting_key: str


ZONE_NUMBERS: tuple[LunaNumberDescription, ...] = (
    LunaNumberDescription(
        key="away_temp",
        translation_key="away_temp",
        setting_key=SET_AWAY_TEMP,
        icon="mdi:home-export-outline",
        device_class=NumberDeviceClass.TEMPERATURE,
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        native_min_value=ZONE_MIN_TEMP,
        native_max_value=ZONE_MAX_TEMP,
        native_step=0.5,
        mode=NumberMode.BOX,
    ),
    LunaNumberDescription(
        key="night_temp",
        translation_key="night_temp",
        setting_key=SET_NIGHT_TEMP,
        icon="mdi:weather-night",
        device_class=NumberDeviceClass.TEMPERATURE,
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        native_min_value=ZONE_MIN_TEMP,
        native_max_value=ZONE_MAX_TEMP,
        native_step=0.5,
        mode=NumberMode.BOX,
    ),
    LunaNumberDescription(
        key="boost_offset",
        translation_key="boost_offset",
        setting_key=SET_BOOST_OFFSET,
        icon="mdi:thermometer-plus",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        native_min_value=0.5,
        native_max_value=8.0,
        native_step=0.5,
        mode=NumberMode.BOX,
        entity_category=EntityCategory.CONFIG,
    ),
    LunaNumberDescription(
        key="hysteresis",
        translation_key="hysteresis",
        setting_key=SET_HYSTERESIS,
        icon="mdi:arrow-expand-vertical",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        native_min_value=0.1,
        native_max_value=2.0,
        native_step=0.1,
        mode=NumberMode.BOX,
        entity_category=EntityCategory.CONFIG,
    ),
    LunaNumberDescription(
        key="min_cycle",
        translation_key="min_cycle",
        setting_key=SET_MIN_CYCLE,
        icon="mdi:timer-lock-outline",
        native_unit_of_measurement=UnitOfTime.MINUTES,
        native_min_value=0,
        native_max_value=60,
        native_step=1,
        mode=NumberMode.BOX,
        entity_category=EntityCategory.CONFIG,
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: Any,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the tunable numbers."""
    engine: LunaEngine = entry.runtime_data.engine
    entities: list[NumberEntity] = [
        LunaZoneNumber(engine, zone, description)
        for zone in engine.zones.values()
        for description in ZONE_NUMBERS
    ]
    entities.append(LunaPrecomfortTimeout(engine))
    async_add_entities(entities)


class LunaZoneNumber(LunaZoneEntity, NumberEntity):
    """One tunable value belonging to a zone."""

    entity_description: LunaNumberDescription

    def __init__(
        self,
        engine: LunaEngine,
        zone: ZoneConfig,
        description: LunaNumberDescription,
    ) -> None:
        """Set up the number."""
        super().__init__(engine, zone, description.key)
        self.entity_description = description

    @property
    def native_value(self) -> float:
        """Current value."""
        return float(
            self.store.setting(self.zone.zone_id, self.entity_description.setting_key)
        )

    async def async_set_native_value(self, value: float) -> None:
        """Store a new value and re-apply control."""
        self.store.set_setting(
            self.zone.zone_id, self.entity_description.setting_key, value
        )
        await self.async_persist()


class LunaPrecomfortTimeout(LunaGlobalEntity, NumberEntity):
    """How long precomfort suppresses away mode if nobody arrives."""

    _attr_translation_key = "precomfort_timeout"
    _attr_icon = "mdi:map-marker-radius-outline"
    _attr_native_unit_of_measurement = UnitOfTime.MINUTES
    _attr_native_min_value = 15
    _attr_native_max_value = 480
    _attr_native_step = 5
    _attr_mode = NumberMode.BOX
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, engine: LunaEngine) -> None:
        """Set up the timeout number."""
        super().__init__(engine, GLOBAL_PRECOMFORT_TIMEOUT)

    @property
    def native_value(self) -> float:
        """Current timeout in minutes."""
        return float(self.store.global_setting(GLOBAL_PRECOMFORT_TIMEOUT))

    async def async_set_native_value(self, value: float) -> None:
        """Store a new timeout."""
        self.store.set_global_setting(GLOBAL_PRECOMFORT_TIMEOUT, value)
        await self.async_persist()
