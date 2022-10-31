---
title: 'UI Layouts'
id: ui-layouts
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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

<Tabs>
<TabItem value="vertical" label="Vertical Layout" default>

```kotlin
ui(Vertical Layout) {
    page("entity-manager") {
            verticalLayout(
                direction = COLUMN,
                spacing = 3
            ) {
                entityManager (...) {},
                entityManager (...) {}
            }
        }    
    }
```
![](/img/vl-em2.PNG)


## Laying out components

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


:::tip
  Vertical Layout places components top-to-bottom in a column.By default it stretches the children to the entire length but we can explicitly set the width to control that.
:::


```kotlin
ui("Vertical Layout") {
    page("Layout") {
        VerticalLayout(
            direction = COLUMN,
            spacing = FIVE
        ) {
            div {
                zero-button {
                    ///what's required to display form with (4 inputs as below)
                }
                zero-button {
                    heading("test", headingSize = SIZE_1)
                }
                zero-button {
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

<zero-design-system-provider style={{ display: 'flex', justifyContent: 'center' }}>
    <zero-card style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#3b454b' }}>
        <zero-card>
        <zero-flex-layout class="flex-column">
            <zero-button
            >Button 1</zero-button>
            <zero-button
            >Button 2</zero-button>
            <zero-button
            >Button 3</zero-button>
        </zero-flex-layout>
        </zero-card>
        <zero-card>
        <p>width = 100px</p>
        <zero-flex-layout class="flex-column">
            <zero-button style={{ flex: '1 1 auto' , width: '100px' }}
            >Button 4</zero-button>
            <zero-button style={{ flex: '1 1 auto' , width: '100px' }}
            >Button 5</zero-button>
            <zero-button style={{ flex: '1 1 auto' , width: '100px' }}
            >Button 6</zero-button>
        </zero-flex-layout>
        </zero-card>
    </zero-card>
</zero-design-system-provider>

##
### Vertical Alignment

<zero-design-system-provider style={{ display: 'flex', justifyContent: 'center' }}>
    <zero-flex-layout class="flex-column spacing-3x" style={{ backgroundColor: ' #91A3B0' }}>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column">
                <zero-button appearance="neutral"style={{ flex: '1 1 auto' }}>Button 1</zero-button>
                <zero-button appearance="outline" style={{ flex: '1 1 auto' }}>Button 2</zero-button>
                <zero-button appearance="accent" style={{ flex: '1 1 auto' }}>Button 2</zero-button>
            </zero-flex-layout>
        </zero-card>
        <zero-card style={{ display: 'flex' ,  flexDirection: 'column' , height: '150px' }}>
            <zero-flex-layout class="flex-column" style={{ height: '0' }}>
                <zero-button appearance="outline" style={{ flex: '1 1 auto' , width: '100px' }}>Button 1</zero-button>
                <zero-button appearance="outline" style={{ flex: '1 1 auto' ,  width: '100px' }}>Button 2</zero-button>
            </zero-flex-layout>
        </zero-card>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' , height: '150px' }}>
        <h6>items-center</h6>
            <zero-flex-layout class=" flex-column items-center" style={{ height: '0' }}>
                <zero-button appearance="accent" style={{ flex: ' 1 1 auto' , width: '100px' }}>Button 1</zero-button>
                <zero-button appearance="accent" style={{ flex: ' 1 1 auto' , width: '100px' }}>Button 2</zero-button>
            </zero-flex-layout>
        </zero-card>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' , height: '30vh' }}>
            <h6 style={{ color: 'white', padding: '2px' }}>items-center- using justify center will align the contents along the y-axis here.
                Removed flex 1 1 auto and height</h6>
            <zero-flex-layout class="flex-column items-center justify-center">
                <zero-button appearance="accent" style={{ width: '100px' }}>Button 1</zero-button>
                <zero-button appearance="accent" style={{ width: '100px' }}>Button 2</zero-button>
            </zero-flex-layout>
        </zero-card>
        <zero-card style={{display: 'flex' , flexDirection: 'column' }}>
            <h6>items-end</h6>
            <zero-flex-layout class="flex-column items-end">
                <zero-button style={{ flex: ' 1 1 auto' , width: '100px' }}>Button 1</zero-button>
                <zero-button style={{ flex: ' 1 1 auto' , width: '100px' }}>Button 2</zero-button>
            </zero-flex-layout>
        </zero-card>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <h6>content-start - also default </h6>
            <zero-flex-layout class="flex-column flex-wrap content-start">
                <zero-button appearance="outline" style={{ flex: '1 1 auto' , width: '100px' }}>Button 1</zero-button>
                <zero-button appearance="outline" style={{ flex: '1 1 auto' , width: '100px' }}>Button 2</zero-button>
            </zero-flex-layout>
        </zero-card>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <h6>content-end</h6>
            <zero-flex-layout class="flex-column flex-wrap content-end" >
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 1</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 2</zero-button>
            </zero-flex-layout>
            </zero-card>
            <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <h6>content-center - vl</h6>
            <zero-flex-layout class="flex-wrap flex-column content-center">
                <zero-button appearance="accent" style={{ flex: '1 1 auto' , width: '100px' }}>Button 1</zero-button>
                <zero-button appearance="accent" style={{ flex: '1 1 auto' , width: '100px' }}>Button 2</zero-button>
            </zero-flex-layout>
            </zero-card>
            <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <h6>content-evenly - vl</h6>
            <zero-flex-layout class="flex-column flex-wrap content-evenly" style={{ height: '100px' }}>
                <zero-button appearance="outline" style={{ flex: '1 1 auto' , width: '100px' }} >Button 1</zero-button>
                <zero-button appearance="outline" style={{ flex: '1 1 auto' , width: '100px' }}>Button 2</zero-button>
                <zero-button appearance="outline" style={{ flex: '1 1 auto' , width: '100px' }}>Button 3</zero-button>
                <zero-button appearance="outline" style={{ flex: '1 1 auto' , width: '100px' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <h6>content-around - vl</h6>
            <zero-flex-layout class="flex-column flex-wrap content-around" style={{ height: '100px' }}>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 1</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 3</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 4</zero-button>
            </zero-flex-layout>
            </zero-card>
            <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <h6>content-between - vl</h6>
            <zero-flex-layout class="flex-column flex-wrap content-between" style={{ height: '100px' }}>
                <zero-button appearance="outline" style={{ flex: '1 1 auto' , width: '100px' }}>Button 1</zero-button>
                <zero-button appearance="outline" style={{ flex: '1 1 auto' , width: '100px' }}>Button 2</zero-button>
                <zero-button appearance="outline" style={{ flex: '1 1 auto' , width: '100px' }}>Button 3</zero-button>
                <zero-button appearance="outline" style={{ flex: '1 1 auto' , width: '100px' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
    </zero-flex-layout>
</zero-design-system-provider>

###

| Value | Description | 
| --- | --- | 
| **items-start** | rendedcdddddddddddddddddddddrs |
| **center** | rendedcdddddddddddddddddddddrs |
| **evenly** | rendedcdddddddddddddddddddddrs |
| **around** | rendedcdddddddddddddddddddddrs |
| **between** | rendedcdddddddddddddddddddddrs |


</TabItem>
<TabItem value="horizontal" label="Horizontal Layout">

```kotlin
ui(Vertical Layout) {
    page("entity-manager") {
            horizontalLayout(
                direction = COLUMN,
                spacing = 3
            ) {
                entityManager (...) {},
                entityManager (...) {}
            }
        }    
    }
    }
```
![](/img/hl-em1.PNG)

## Laying out components

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

##
### Horizontal Alignment

:::tip

  Vertical Layout places components top-to-bottom in a column.By default it stretches the children to the entire length but we can explicitly set the width to control that.
:::
<!-- 
![](/img/vl-em.PNG) -->
<!-- ![](/img/vl-em2.PNG) -->

</TabItem>
</Tabs>





