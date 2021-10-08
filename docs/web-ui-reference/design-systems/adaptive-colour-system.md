---
id: adaptive-colour-system
title: Adaptive Colour System
sidebar_position: 31
---

Genesis Foundation UI implements an adaptive color system that provides some unique advantages:
* Ensure text meets [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) contrast requirements
* Easily swap from light mode to dark, or anywhere in-between
* Colour theming through palette tinting
* Perceptually uniform UI across background colors

To accomplish these goals, it makes heavy use of algorithmic colours called _recipes_. Recipes are a combination of an algorithm and input values that produce a desired result. Just as you can bake different types of cookies with different combinations of sugar, butter, flour, and salt, you can produce different design system treatments by altering recipe values (measurements) or algorithms (instructions).

The current base recipes are closely related to their algorithm, but that's a convention and not a requirement. What follows is a list of the algorithms, which function on like-named values. For instance, `accentFill` relies on `accentFillRestDelta`, `accentFillHoverDelta`, `accentFillActiveDelta`, and `accentFillFocusDelta`.

Recipes are currently used for color values, but they are not limited to that and their usage will be expanded soon.

#### Common functionality

Most color recipes are based on a `palette`. Currently `fast-components` has built-in support for `accent` and `neutral` palettes.

Most color recipes take a `reference` `Swatch`. This is a core concept of Adaptive UI which allows the recipes to vary based on the containing component's color. For instance, supporting a button with consistent treatment between light and dark modes is done with a single recipe.

Many recipes are "stateful", meaning they support rest, hover, active, and focus states for a component.

**"Fill"** means the recipe is intended to fill a larger area, commonly like a component backplate.

**"Foreground"** means the recipe is intended for text, icons, or other lightweight decorations where you need or want to meet contrast requirements.

**"Stroke"** means the recipe is intended for lines, either outline or divider.

#### Accent algorithms

##### accentFill

Stateful.

Relies on `textColor` and `contrastTarget` to find the closest colors from the supplied palette that can be used for component states. For instance, colors needed to support white text and a 14px font (which requires 4.5:1 contrast).

##### accentForeground

Stateful.

Commonly for link text or icon. Also for smaller elements that might not show up well using `accentFill`, for instance if your accent color is dark purple and you support a dark mode interface.

Like `accentFill` this relies on `textColor` and `contrastTarget` to find the closest colors from the supplied palette that can be used for component states.

##### foregroundOnAccent

Not stateful.

Technically this doesn't _use_ the accent palette, but it's designed to be used _over_ the accent palette. This algorithm simply returns black or white based on the provided `contrastTarget`. It returns white if possible, as a common treatment for an accent button is white text over the accent color.

#### Neutral algorithms

##### neutralDivider

Not stateful.

Used for decorative dividers that do not need to meet contrast requirements.

##### neutralFill

Stateful.

The most basic fill used for buttons or other components.

##### neutralFillContrast

Stateful.

Often Used as a selected state or anywhere you want to draw attention. Meets contrast requirements with the containing background.

##### neutralFillInput

Stateful.

Another basic fill, applied to input elements to allow easy differentiation from other components like buttons.

##### neutralFillStealth

Stateful.

More subtle than `neutralFill` in that the resting state is transparent. Often used for low-priority features to draw less attention.

##### neutralForeground

Not stateful.

Most common recipe, used for plain text or icons.

##### neutralForegroundHint

Not stateful.

Used for subtle text. Meets 4.5:1 minimum contrast requirement.

##### neutralStroke

Stateful.

Used for strong outline, either alone or with a fill.

#### Layers

The layer recipes are used for different sections of an app or site. They are designed to be able to stack, but that is not required. When stacked in sequence, the layers will lighten on top of each other.

The key feature of layering is to support the primary container color for light or dark mode. This produces absolute colors based on the `baseLayerLuminance` value, which sets the luminance for layer one. This is any value between 0 for black or 1 for white.

The difference between each layer is defined with `neutralFillLayerRestDelta`.

Layers are not stateful.

##### neutralFillLayer

The only layer recipe that's relative to the container color instead of absolute. The most common example of this is a Card, which will be one layer color lighter than its container.

##### neutralLayer1, neutralLayer2, neutralLayer3, and neutralLayer4

Absolute layer colors derived from and starting at `baseLayerLuminance`. Layer one is lightest and the values darken as the layer number increases.

##### neutralLayerCardContainer

A special layer to support experiences primarily built with cards, especially in light mode, so cards can be white and the container color can be one layer darker.

##### neutralLayerFloating

A special layer for floating layers, like flyouts or menus. It will be lighter than any other layers if possible, but will also be white in default light mode, as will neutral layer one.

#### Adaptive Color "Don'ts"

The adaptive color system lives entirely in JavaScript, emitting CSS custom properties for styling purposes where appropriate. If you declare the CSS custom property in CSS, the adaptive Color System is unable to know that has happened and components will render with incorrect colors, which can lead to accessibility issues. 

:::warning
You should consider the CSS custom properties emitted by color Design Tokens to be immutable. If you need to change the values for those CSS custom properties, set the value using the `DesignToken.setValueFor()` API.
:::

