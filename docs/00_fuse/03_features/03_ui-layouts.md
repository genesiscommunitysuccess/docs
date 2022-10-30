---
title: 'UI Layouts'
id: ui-layouts
---

# UI Layouts

## Introduction

With Fuse we can determine our own layouts. This way, we can maintain previous layout designs or if you're adventurous, create new ones. This is achieved by utilizing two basic layout components (Vertical Layout and Horizontal Layout) along with their various parameters. The Vertical and Horizontal layout render their contents vertically and horizontally respectively. 

What layouts allow you to do:

- displaying your elements in any layout you like by using the Vertical and Horizontal compoenents
- determining the numbers of elements you would like to see on your screen
- rely on the default options or override them for more control
- control the amount of space each element takes up

Using the layouts is as easy as updating the syntax to use the components you would like along with the parameters.

The examples below show what layouts can do for us. 




## Laying out pages

```kotlin
ui(EM-Horizontal Layout) {
    page("entity-manager-with-columns") {
            horizontalLayout(
                direction = ROW,
                spacing = 3
            ) {
                entityManager (
                entity = TRADE,
                title = "Trade",
                operations = listOf(ADD)
                ) {
                    columns {
                        counterpartyId
                        instrumentId
                        price
                        tradeStatus renderer TradeStatus

                        actionColumn {
                            button("Cancel") {
                                onClick(Action("Cancelled"))
                                appearance = WARNING
                            }
                         }
                     }
                },
                entityManager (
                entity = TRADE,
                title = "Trade",
                operations = listOf(ADD)
                ) {
                    columns {
                        counterpartyId
                        instrumentId
                        price
                        tradeStatus renderer TradeStatus

                        actionColumn {
                            button("Cancel") {
                                onClick(Action("Cancelled"))
                                appearance = WARNING
                            }
                        }
                    }
                }
            }
        }    
    }
```
![](/img/hl-em1.PNG)

```kotlin
ui(EM-Vertical Layout) {
    page("entity-manager-with-columns") {
            verticalLayout(
                direction = ROW,
                spacing = 3
            ) {
                entityManager (
                entity = TRADE,
                title = "Trade",
                operations = listOf(ADD)
                ) {
                    columns {
                        counterpartyId
                        instrumentId
                        price
                        tradeStatus renderer TradeStatus

                        actionColumn {
                            button("Cancel") {
                                onClick(Action("Cancelled"))
                                appearance = WARNING
                            }
                         }
                     }
                },
                entityManager (
                entity = TRADE,
                title = "Trade",
                operations = listOf(ADD)
                ) {
                    columns {
                        counterpartyId
                        instrumentId
                        price
                        tradeStatus renderer TradeStatus

                        actionColumn {
                            button("Cancel") {
                                onClick(Action("Cancelled"))
                                appearance = WARNING
                            }
                        }
                    }
                }
            }
        }    
    }
```
![](/img/vl-em2.PNG)

## Laying out components

### Vertical Layout

```kotlin
ui("Vertical Layout") {
    page("Layout") {
        VerticalLayout(
            direction = COLUMN,
            spacing = FIVE
        ) {
            div {
                zero-form {
                    ///what's required to display form with (4 inputs as below)
                }
                zero-form {
                    heading("test", headingSize = SIZE_1)
                }
            }
            attributes(
                //in this case the width and height are split equally 
            )

        }
    }
}
```

<>
  <zero-design-system-provider style={{ justifyContent: 'center' }}>
    <div style={{ flexDirection: 'column', marginTop: '10px', marginBottom: '10px'}}>
        <zero-card style= {{ display: 'flex', flexDirection: 'column', backgroundColor: '#3b454b' }}>
            <zero-flex-layout class="flex-column spacing-5x">
                <zero-card id="zero-form-card">
                    <zero-form id="zero-form">
                        <div class="form-controls">
                            <div class="form-group" style={{display: 'flex', flexDirection:'column'}}>
                                <label class="label" for="ASSET_CLASS" style={{paddingBottom: '5px'}}>
                                Input 1
                                </label>
                                <zero-text-field 
                                id="ASSET_CLASS" type="string" 
                                placeholder="placeholder" 
                                current-value="" 
                                appearance="outline" 
                                autocapitalize="off" style={{marginTop: '3px'}}>
                                </zero-text-field>
                            </div>
                            <div class="form-group" style={{display: 'flex', flexDirection:'column'}}>
                                <label class="label" for="ASSET_CLASS" style={{paddingBottom: '5px'}}>
                                Input 2
                                </label>
                                <zero-text-field 
                                id="ASSET_CLASS" type="string" 
                                placeholder="placeholder" 
                                current-value="" 
                                appearance="outline" 
                                autocapitalize="off" style={{marginTop: '3px'}}>
                                </zero-text-field>
                            </div>
                        </div>
                        <div class="form-controls">
                            <div class="form-group" style={{display: 'flex', flexDirection:'column'}}>
                                <label class="label" for="ASSET_CLASS" style={{paddingBottom: '5px'}}>
                                Input 3
                                </label>
                                <zero-text-field 
                                id="ASSET_CLASS" type="string" 
                                placeholder="placeholder" 
                                current-value="" 
                                appearance="outline" 
                                autocapitalize="off" style={{marginTop: '3px'}}>
                                </zero-text-field>
                            </div>
                            <div class="form-group" style={{display: 'flex', flexDirection:'column'}}>
                                <label class="label" for="ASSET_CLASS" style={{paddingBottom: '5px'}}>
                                Input 4
                                </label>
                                <zero-text-field 
                                id="ASSET_CLASS" type="string" 
                                placeholder="placeholder" 
                                current-value="" 
                                appearance="outline" 
                                autocapitalize="off" style={{marginTop: '3px'}}>
                                </zero-text-field>
                            </div>
                        </div>
                    </zero-form>
                </zero-card>
                <zero-card id="zero-form-card">
                    <zero-form id="zero-form">
                        <div class="form-controls">
                            <div class="form-group" style={{display: 'flex', flexDirection:'column'}}>
                                <label class="label" for="ASSET_CLASS" style={{paddingBottom: '5px'}}>
                                Input 1
                                </label>
                                <zero-text-field 
                                id="ASSET_CLASS" type="string" 
                                placeholder="placeholder" 
                                current-value="" 
                                appearance="outline" 
                                autocapitalize="off" style={{marginTop: '3px'}}>
                                </zero-text-field>
                            </div>
                            <div class="form-group" style={{display: 'flex', flexDirection:'column'}}>
                                <label class="label" for="ASSET_CLASS" style={{paddingBottom: '5px'}}>
                                Input 2
                                </label>
                                <zero-text-field 
                                id="ASSET_CLASS" type="string" 
                                placeholder="placeholder" 
                                current-value="" 
                                appearance="outline" 
                                autocapitalize="off" style={{marginTop: '3px'}}>
                                </zero-text-field>
                            </div>
                        </div>
                        <div class="form-controls">
                            <div class="form-group" style={{display: 'flex', flexDirection:'column'}}>
                                <label class="label" for="ASSET_CLASS" style={{paddingBottom: '5px'}}>
                                Input 3
                                </label>
                                <zero-text-field 
                                id="ASSET_CLASS" type="string" 
                                placeholder="placeholder" 
                                current-value="" 
                                appearance="outline" 
                                autocapitalize="off" style={{marginTop: '3px'}}>
                                </zero-text-field>
                            </div>
                            <div class="form-group" style={{display: 'flex', flexDirection:'column'}}>
                                <label class="label" for="ASSET_CLASS" style={{paddingBottom: '5px'}}>
                                Input 4
                                </label>
                                <zero-text-field 
                                id="ASSET_CLASS" type="string" 
                                placeholder="placeholder" 
                                current-value="" 
                                appearance="outline" 
                                autocapitalize="off" style={{marginTop: '3px'}}>
                                </zero-text-field>
                            </div>
                        </div>
                    </zero-form>
                </zero-card>
            </zero-flex-layout>
        </zero-card>
    </div>
  </zero-design-system-provider>
</>
```

### Horizontal Layout

```kotlin
ui("Horizontal Layout") {
    page("Layout") {
        horizontalLayout(
            direction = COLUMN,
            spacing = FIVE
        ) {
            div {
                div {
                    heading("test", headingSize = SIZE_1)
                }
                div {
                    heading("test", headingSize = SIZE_1)
                }
            }
            attributes(
                <!-- "width" to "100px",
                "height" to "100px" -->
            )

        }
    }
}
```

<>
  <zero-design-system-provider style={{ justifyContent: 'center' }}>
    <div style={{ flexDirection: 'column', marginTop: '10px', marginBottom: '10px'}}>
        <zero-card style= {{ display: 'flex', flexDirection: 'column', backgroundColor: '#3b454b' }}>
            <zero-flex-layout class="flex-row spacing-5x">
                <zero-card id="zero-form-card">
                    <zero-form id="zero-form">
                        <div class="form-controls">
                            <div class="form-group" style={{display: 'flex', flexDirection:'column'}}>
                                <label class="label" for="ASSET_CLASS" style={{paddingBottom: '5px'}}>
                                Input 1
                                </label>
                                <zero-text-field 
                                id="ASSET_CLASS" type="string" 
                                placeholder="placeholder" 
                                current-value="" 
                                appearance="outline" 
                                autocapitalize="off" style={{marginTop: '3px'}}>
                                </zero-text-field>
                            </div>
                            <div class="form-group" style={{display: 'flex', flexDirection:'column'}}>
                                <label class="label" for="ASSET_CLASS" style={{paddingBottom: '5px'}}>
                                Input 2
                                </label>
                                <zero-text-field 
                                id="ASSET_CLASS" type="string" 
                                placeholder="placeholder" 
                                current-value="" 
                                appearance="outline" 
                                autocapitalize="off" style={{marginTop: '3px'}}>
                                </zero-text-field>
                            </div>
                        </div>
                        <div class="form-controls">
                            <div class="form-group" style={{display: 'flex', flexDirection:'column'}}>
                                <label class="label" for="ASSET_CLASS" style={{paddingBottom: '5px'}}>
                                Input 3
                                </label>
                                <zero-text-field 
                                id="ASSET_CLASS" type="string" 
                                placeholder="placeholder" 
                                current-value="" 
                                appearance="outline" 
                                autocapitalize="off" style={{marginTop: '3px'}}>
                                </zero-text-field>
                            </div>
                            <div class="form-group" style={{display: 'flex', flexDirection:'column'}}>
                                <label class="label" for="ASSET_CLASS" style={{paddingBottom: '5px'}}>
                                Input 4
                                </label>
                                <zero-text-field 
                                id="ASSET_CLASS" type="string" 
                                placeholder="placeholder" 
                                current-value="" 
                                appearance="outline" 
                                autocapitalize="off" style={{marginTop: '3px'}}>
                                </zero-text-field>
                            </div>
                        </div>
                    </zero-form>
                </zero-card>
                <zero-card id="zero-form-card">
                    <zero-form id="zero-form">
                        <div class="form-controls">
                            <div class="form-group" style={{display: 'flex', flexDirection:'column'}}>
                                <label class="label" for="ASSET_CLASS" style={{paddingBottom: '5px'}}>
                                Input 1
                                </label>
                                <zero-text-field 
                                id="ASSET_CLASS" type="string" 
                                placeholder="placeholder" 
                                current-value="" 
                                appearance="outline" 
                                autocapitalize="off" style={{marginTop: '3px'}}>
                                </zero-text-field>
                            </div>
                            <div class="form-group" style={{display: 'flex', flexDirection:'column'}}>
                                <label class="label" for="ASSET_CLASS" style={{paddingBottom: '5px'}}>
                                Input 2
                                </label>
                                <zero-text-field 
                                id="ASSET_CLASS" type="string" 
                                placeholder="placeholder" 
                                current-value="" 
                                appearance="outline" 
                                autocapitalize="off" style={{marginTop: '3px'}}>
                                </zero-text-field>
                            </div>
                        </div>
                        <div class="form-controls">
                            <div class="form-group" style={{display: 'flex', flexDirection:'column'}}>
                                <label class="label" for="ASSET_CLASS" style={{paddingBottom: '5px'}}>
                                Input 3
                                </label>
                                <zero-text-field 
                                id="ASSET_CLASS" type="string" 
                                placeholder="placeholder" 
                                current-value="" 
                                appearance="outline" 
                                autocapitalize="off" style={{marginTop: '3px'}}>
                                </zero-text-field>
                            </div>
                            <div class="form-group" style={{display: 'flex', flexDirection:'column'}}>
                                <label class="label" for="ASSET_CLASS" style={{paddingBottom: '5px'}}>
                                Input 4
                                </label>
                                <zero-text-field 
                                id="ASSET_CLASS" type="string" 
                                placeholder="placeholder" 
                                current-value="" 
                                appearance="outline" 
                                autocapitalize="off" style={{marginTop: '3px'}}>
                                </zero-text-field>
                            </div>
                        </div>
                    </zero-form>
                </zero-card>
            </zero-flex-layout>
        </zero-card>
    </div>
  </zero-design-system-provider>
</>
```


<!-- 
![](/img/vl-em.PNG) -->
<!-- ![](/img/vl-em2.PNG) -->



