---
title: 'Layouts'
id: layouts
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Layouts

## Introduction

With Fuse we can determine our own layouts. This way, we can reimplement our existing layout designs or if we're adventurous, create new ones. This is achieved by utilizing two basic layout components (vertical & horizontal layout) along with their various parameters. The vertical and horizontal layout render their contents vertically and horizontally respectively. 

With layouts you can:

- display your elements in any layout you like by using the vertical and horizontal components
- use default options or override them for more control

Using the layouts is as easy as updating the syntax to use the components you would like along with the parameters.

The examples below show what layouts can do for us. 

## Laying out pages

### Vertically

```kotlin
ui("Vertical Layout") {
    page("Page layout example") {
            verticalLayout(...) {
                entityManager (...) {},
                entityManager (...) {}
            }
        }    
    }
```

:::tip
  Vertical layout places components top-to-bottom in a column. By default it stretches the children to the entire length but we can explicitly set the width or height to control that.
:::

> The image below shows a vertical layout of two elements with default parameters.

![](/img/vl-em2.PNG)

> The image below shows a vertical layout of two elements. The first element has its width set to 50%.

![](/img/vl-em-attr.PNG)

### Horizontally

```kotlin
ui("Horizontal Layout") {
    page("Page Layout Example") {
            horizontalLayout(...) {
                entityManager (...) {},
                entityManager (...) {}
            }
        }    
    }
}
```

:::tip
  Horizontal layout places components left-to-right in a row. By default it stretches the children to the entire length but we can explicitly set the width or height to control that.
:::

> The image below shows a horizontal layout of two elements with default parameters

![](/img/hl-em1.PNG)

> The image below shows a horizontal layout of two elements. The first element has its height set to 50%


![](/img/hl-em-attr.PNG)

## Laying out components

### Vertical implementation

The example below implements a form vertically

```kotlin
ui("Vertical Layout") {
    page("Layout") {
        verticalLayout(...) {
                form {
                    verticalLayout(...) {
                        div {}
                        div {}
                }
            }
        }
    }
}
```

<zero-design-system-provider style={{ justifyContent: 'center' }}>
    <div style={{ flexDirection: 'column', margin: '10px', width: '80%' }}>
        <zero-card id="zero-form-card" style= {{ display: 'flex', flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column">
                <zero-flex-layout class="flex-column spacing-2x">
                    <form style={{ display: 'flex', flexDirection: 'column', padding: '3px' }}>
                        <label for="i1">Input 1</label>
                        <input type="text" id="i1" name="i1" placeholder="placeholder" style={{ backgroundColor: ' rgba(135, 155, 166, 0.06) ' , borderRadius: '4px', height: '40px', border: '0', marginTop: '4px' }}></input>
                    </form>
                    <form style={{ display: 'flex', flexDirection: 'column', padding: '3px' }}>
                        <label for="i1">Input 2</label>
                        <input type="text" id="i1" name="i1" placeholder="placeholder" style={{ backgroundColor: ' rgba(135, 155, 166, 0.06) ' , borderRadius: '4px', height: '40px', border: '0', marginTop: '4px' }}></input>
                    </form>
                </zero-flex-layout>
                <div style={{ display: 'flex', justifyContent: 'right'}}>
                    <zero-button appearance="primary-gradient" style={{ width: '100px', display: 'flex', justifyContent: 'right' }}>Submit</zero-button>
                </div>
            </zero-flex-layout>
        </zero-card>
    </div>
</zero-design-system-provider>

### Horizontally & Vertical

Vertical and horizontal components can also be used together for a more complex layout.

```kotlin
ui("Vertical Layout") {
    page("Layout") {
        verticalLayout(...) {
            horizontalLayout(...) {
                verticalLayout(...) {
                    form {}
                    form {}
                }
                verticalLayout(...) {
                    form {}
                    form {}
                }
            }
            button {...}
        }
    }
}
```

<zero-design-system-provider style={{ justifyContent: 'center' }}>
    <div style={{ flexDirection: 'column', margin: '10px', width: '80%' }}>
        <zero-card id="zero-form-card" style= {{ display: 'flex', flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column">
                <zero-flex-layout class="flex-row spacing-2x">
                    <zero-flex-layout class="flex-column spacing-2x" >
                        <form style={{ display: 'flex', flexDirection: 'column', padding: '3px' }}>
                            <label for="i1">Input 1</label>
                            <input type="text" id="i1" name="i1" placeholder="placeholder" style={{ backgroundColor: ' rgba(135, 155, 166, 0.06) ' , borderRadius: '4px', height: '40px', border: '0', marginTop: '4px' }}></input>
                        </form>
                        <form style={{ display: 'flex', flexDirection: 'column', padding: '3px' }}>
                            <label for="i2">Input 2</label>
                            <input type="text" id="i2" name="i2" placeholder="placeholder" style={{ backgroundColor: ' rgba(135, 155, 166, 0.06) ' , borderRadius: '4px', height: '40px', border: '0', marginTop: '4px' }}></input>
                        </form>
                    </zero-flex-layout>
                    <zero-flex-layout class="flex-column spacing-2x">
                        <form style={{ display: 'flex', flexDirection: 'column', padding: '3px' }}>
                            <label for="i3">Input 3</label>
                            <input type="text" id="i3" name="i3" placeholder="placeholder" style={{ backgroundColor: ' rgba(135, 155, 166, 0.06) ' , borderRadius: '4px', height: '40px', border: '0', marginTop: '4px' }}></input>
                        </form>
                        <form style={{ display: 'flex', flexDirection: 'column', padding: '3px' }}>
                            <label for="i4">Input 4</label>
                            <input type="text" id="i4" name="i4" placeholder="placeholder" style={{ backgroundColor: ' rgba(135, 155, 166, 0.06) ' , borderRadius: '4px', height: '40px', border: '0', marginTop: '4px' }}></input>
                        </form>
                    </zero-flex-layout>
                </zero-flex-layout>
                <div style={{ display: 'flex', justifyContent: 'right'}}>
                    <zero-button appearance="primary-gradient" style={{ width: '100px', display: 'flex', justifyContent: 'right' }}>Submit</zero-button>
                </div>
            </zero-flex-layout>
        </zero-card>
    </div>
</zero-design-system-provider>

###

Now that we've seen some basic examples of page and component layouts, let's dive a little deeper.
Not only can we determine the direction of our elements but also their positioning within a given space. 
Click on the tabs below for more details.

<Tabs>
<TabItem value="vertical" label="Vertical Layout" default >

### Vertical Alignment


```kotlin
ui("Vertical Layout") {
    page("Layout") {
        verticalLayout(...) {
            div {
                button {...}
                button {...}
                button {...}
            }
        }
    }
}
```

> As mentioned above, children elements of the vertical and horizontal layout components, stretch to the entire length by default. For the following examples, we will set the width of the buttons to `100px`.

<zero-design-system-provider style={{ display: 'flex', justifyContent: 'center', borderRadius: '5px' }}>
    <zero-card style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba( 207, 207, 207, 1)' }}>
        <p style={{ color: 'black', padding: '4px'}}>By default the position of the children element will be at the top left. The same as <b>items-tart</b> and <b>content-start</b></p>
        <zero-card>
            <zero-flex-layout class="flex-column">
                <zero-button style={{ width: '100px' }}
                >Button 1</zero-button>
                <zero-button style={{ width: '100px' }}
                >Button 2</zero-button>
                <zero-button style={{ width: '100px' }}
                >Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
    </zero-card>
</zero-design-system-provider>

###

| Value | Description | 
| --- | --- | 
| **items-start** | Positions items at the top left |
| **items-center** | Centers items along the x-axis |
| **items-end** | Positions items on the far right |
| **content-start** | Positions items at the top left |
| **content-center** | Centers content along the x-axis. It also applies flex-wrap which means, depending on the height of the parent element, the children may take up the height equally distributed among each other. However, if the height is smaller, they would be spread out in a row instead. This applies to the following alignments of content as well |
| **content-end** | Positions content on the far right.|
| **content-evenly** | Distributes space equally among the content. From the left of the first item, between items and on the right of the last item |
| **content-around** | Distributes the space equally between items. The space before the first item, and after the last, is half of that between items. |
| **content-between** | The space is distributed evenly between items, with no space before the first item or after the last. |


<zero-design-system-provider style={{ display: 'flex', justifyContent: 'center' }}>
    <zero-flex-layout class="flex-column spacing-1x" style={{ backgroundColor: 'rgba( 207, 207, 207, 1)' }}>
        <p style={{ color: 'black', padding: '4px'}}>items-center</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' , height: '25vh' }}>
            <zero-flex-layout class=" flex-column items-center" style={{ height: '0' }}>
                <zero-button style={{ flex: ' 1 1 auto' , width: '100px' }}>Button 1</zero-button>
                <zero-button style={{ flex: ' 1 1 auto' , width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ flex: ' 1 1 auto' , width: '100px' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>In order to center the children elements both vertically and horizontally, simply add <b>justify-center</b> in addition to <b>items-center</b>.</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' , height: '25vh' }}>
            <zero-flex-layout class="flex-column items-center justify-center">
                <zero-button style={{ width: '100px' }}>Button 1</zero-button>
                <zero-button style={{ width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ width: '100px' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', paddingLeft: '4px'}}>items-end</p>
        <zero-card style={{display: 'flex' , flexDirection: 'column'}}>
            <zero-flex-layout class="flex-column items-end">
                <zero-button style={{ width: '100px' }}>Button 1</zero-button>
                <zero-button style={{ width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ width: '100px' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-center</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column'}}>
            <zero-flex-layout class="flex-wrap flex-column content-center">
                <zero-button style={{ width: '100px' }}>Button 1</zero-button>
                <zero-button style={{ width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ width: '100px' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-center - height set</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column'}}>
            <zero-flex-layout class="flex-wrap flex-column content-center" style={{ height: '50px'}}>
                <zero-button style={{ width: '100px' }}>Button 1</zero-button>
                <zero-button style={{ width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ width: '100px' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-end</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column'}}>
            <zero-flex-layout class="flex-column flex-wrap content-end">
                <zero-button style={{ width: '100px' }}>Button 1</zero-button>
                <zero-button style={{ width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ width: '100px' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-end - height set</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column'}}>
            <zero-flex-layout class="flex-column flex-wrap content-end" style={{ height: '50px'}}>
                <zero-button style={{ width: '100px' }}>Button 1</zero-button>
                <zero-button style={{ width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ width: '100px' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-evenly - no height set</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-evenly">
                <zero-button style={{ width: '100px' }} >Button 1</zero-button>
                <zero-button style={{ width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ width: '100px' }}>Button 3</zero-button>
                <zero-button style={{ width: '100px' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-evenly - height set at 100px</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-evenly" style={{ height: '100px' }}>
                <zero-button style={{ width: '100px' }} >Button 1</zero-button>
                <zero-button style={{ width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ width: '100px' }}>Button 3</zero-button>
                <zero-button style={{ width: '100px' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-evenly - height set at 50px</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-evenly" style={{ height: '50px' }}>
                <zero-button style={{ width: '100px' }} >Button 1</zero-button>
                <zero-button style={{ width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ width: '100px' }}>Button 3</zero-button>
                <zero-button style={{ width: '100px' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-around - no height set</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-around">
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 1</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 3</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-around - height set at 100px</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-around" style={{ height: '100px' }}>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 1</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 3</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-around - height set at 50px</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-around" style={{ height: '50px' }}>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 1</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 3</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-between - no height set</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-between">
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 1</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 3</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-between - height set at 100px</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-between" style={{ height: '100px' }}>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 1</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 3</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-between - height set at 50px</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-between" style={{ height: '50px' }}>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 1</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 2</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 3</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '100px' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
    </zero-flex-layout>
</zero-design-system-provider>

###



</TabItem>
<TabItem value="horizontal" label="Horizontal Layout">

### Horizontal Alignment

```kotlin
ui("Horizontal Layout") {
    page("Layout") {
        horizontalLayout(...) {
            div {
                button {...}
                button {...}
                button {...}
            }
        }
    }
}
```

<zero-design-system-provider style={{ display: 'flex', justifyContent: 'center', borderRadius: '5px' }}>
    <zero-card style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba( 207, 207, 207, 1)' }}>
        <p style={{ color: 'black', padding: '4px'}}>Button width is set to 200px. By default the position of the children element will be at the top left. The same as <b>items-start</b> and <b>content-start</b></p>
        <zero-card>
            <zero-flex-layout class="flex-row">
                <zero-button style={{ width: '200px' }}
                >Button 1</zero-button>
                <zero-button style={{ width: '200px' }}
                >Button 2</zero-button>
                <zero-button style={{ width: '200px' }}
                >Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
    </zero-card>
</zero-design-system-provider>

###

| Value | Description | 
| --- | --- | 
| **items-start** | Positions items at the top left |
| **items-center** | Centers items along the y-axis |
| **items-end** | Positions items at the bottom left |
| **content-start** | Positions items at the top left |
| **content-center** | Centers content along the y-axis. 
| **content-end** | Positions content at the bottom left.|
| **content-evenly** | Distributes space equally among the content. From the top of the first item, between items and on the bottom |
| **content-around** | Distributes the space equally between items. The space before the first item, and after the last, is half of that between items. |
| **content-between** | The space is distributed evenly between items, with no space before the first item or after the last. |


<zero-design-system-provider style={{ display: 'flex', justifyContent: 'center' }}>
    <zero-flex-layout class="flex-column spacing-1x" style={{ backgroundColor: 'rgba( 207, 207, 207, 1)' }}>
        <p style={{ color: 'black', padding: '4px'}}>items-center</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' , height: '20vh' }}>
            <zero-flex-layout class=" flex-row items-center">
                <zero-button style={{ width: '200px' }}>Button 1</zero-button>
                <zero-button style={{ width: '200px' }}>Button 2</zero-button>
                <zero-button style={{ width: '200px' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>In order to center the children elements both vertically and horizontally, simply add <b>justify-center</b> in addition to <b>items-center</b>.</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' , height: '20vh' }}>
            <zero-flex-layout class="flex-row items-center justify-center">
                <zero-button style={{ width: '200px' }}>Button 1</zero-button>
                <zero-button style={{ width: '200px' }}>Button 2</zero-button>
                <zero-button style={{ width: '200px' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', paddingLeft: '4px'}}>items-end</p>
        <zero-card style={{display: 'flex' , flexDirection: 'column', height: '20vh'}}>
            <zero-flex-layout class="flex-row items-end">
                <zero-button style={{ width: '200px' }}>Button 1</zero-button>
                <zero-button style={{ width: '200px' }}>Button 2</zero-button>
                <zero-button style={{ width: '200px' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-center</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column', height: '20vh'}}>
            <zero-flex-layout class="flex-wrap flex-row content-center">
                <zero-button style={{ width: '200px' }}>Button 1</zero-button>
                <zero-button style={{ width: '200px' }}>Button 2</zero-button>
                <zero-button style={{ width: '200px' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-end</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column', height: '20vh'}}>
            <zero-flex-layout class="flex-row flex-wrap content-end">
                <zero-button style={{ width: '200px' }}>Button 1</zero-button>
                <zero-button style={{ width: '200px' }}>Button 2</zero-button>
                <zero-button style={{ width: '200px' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-evenly</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column', height: '20vh' }}>
            <zero-flex-layout class="flex-row flex-wrap content-evenly">
                <zero-button style={{ width: '200px' }}>Button 1</zero-button>
                <zero-button style={{ width: '200px' }}>Button 2</zero-button>
                <zero-button style={{ width: '200px' }}>Button 3</zero-button>
                <zero-button style={{ width: '200px' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-around</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column', height: '20vh' }}>
            <zero-flex-layout class="flex-row flex-wrap content-around">
                <zero-button style={{ width: '200px' }}>Button 1</zero-button>
                <zero-button style={{ width: '200px' }}>Button 2</zero-button>
                <zero-button style={{ width: '200px' }}>Button 3</zero-button>
                <zero-button style={{ width: '200px' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', padding: '4px'}}>content-between</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column', height: '20vh' }}>
            <zero-flex-layout class="flex-row flex-wrap content-between">
                <zero-button style={{ width: '200px' }}>Button 1</zero-button>
                <zero-button style={{ width: '200px' }}>Button 2</zero-button>
                <zero-button style={{ width: '200px' }}>Button 3</zero-button>
                <zero-button style={{ width: '200px' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
    </zero-flex-layout>
</zero-design-system-provider>

</TabItem>
</Tabs>
