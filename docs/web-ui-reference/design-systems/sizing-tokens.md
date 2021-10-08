---
id: sizing-tokens
title: Sizing tokens
sidebar_position: 60
---

Contains the following tokens:

- `baseHeightMultiplier`: This value, multiplied by `designUnit`, sets the base height of most controls. Works with adaptive `density` values.
- `controlCornerRadius`: Sets the corner radius used by controls with backplates.
- `density`: An adjustment to sizing tokens like `baseHeightMultiplier`.
- `designUnit`: The unit size of the Design Grid. Used to calculate height and spacing sizes for controls.

## Configuration

You can adjust any of the defaults in the `_config` folder of your design system.

## Usage

#### Sizing

- `baseHeightMultiplier`: This value, multiplied by `designUnit`, sets the base height of most controls. Works with adaptive `density` values.
- `baseHorizontalSpacingMultiplier` (future): This value, multiplied by `designUnit`, sets the internal horizontal padding of most controls. Works with adaptive `density` values.
- `controlCornerRadius`: Sets the corner radius used by controls with backplates.
- `density` (in process): An adjustment to sizing tokens `baseHeightMultiplier` and `baseHorizontalSpacingMultiplier`.
- `designUnit`: The unit size of the Design Grid. Used to calculate height and spacing sizes for controls.
