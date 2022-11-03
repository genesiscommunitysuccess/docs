---
title: 'Layouts'
id: layouts
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Layouts

## Introduction

With Fuse you have full control over your layouts. This is achieved by utilizing two basic layout components (**vertical** & **horizontal**) along with their various parameters. The `verticalLayout` and `horizontalLayout` render their contents vertically and horizontally respectively. 

With layouts you can:

- display your elements in any layout you like by using the vertical and horizontal components
- use default options or override them for more control

## Examples

### Vertical page layout

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
  `verticalLayout` places components top-to-bottom in a column. By default it stretches the children to the entire length but we can explicitly set the width or height to control that.
:::

> The image below shows a `verticalLayout` of two elements with default parameters.

![](/img/vl-em2.PNG)

> The image below shows a `verticalLayout` of two elements. The first element has its width set to 50%.

```kotlin
ui("Vertical Layout") {
    page("Page layout example") {
            verticalLayout(...) {
                entityManager (...) {
                    attributes (
                        "width" to "50%"
                    )
                },
                entityManager (...) {}
            }
        }    
    }
```

![](/img/vl-em-attr.PNG)

### Horizontal page layout

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
  `horizontalLayout` places components left-to-right in a row. By default it stretches the children to the entire length but we can explicitly set the width or height to control that.
:::

> The image below shows a `horizontalLayout` of two elements with default parameters

![](/img/hl-em1.PNG)

> The image below shows a `horizontalLayout` of two elements. The first element has its height set to 50%

```kotlin
ui("Horizontal Layout") {
    page("Page Layout Example") {
            horizontalLayout(...) {
                entityManager (...) {
                    attributes(
                        "height" to "50%"
                    )
                },
                entityManager (...) {}
            }
        }    
    }
}
```

![](/img/hl-em-attr.PNG)


## Component examples

### Vertical implementation

Here we have the implementation of `verticalLayout` within a form:

```kotlin
verticalLayout(...) {
    form(...) {
        verticalLayout(...) {
            input{...},
            input{...}
            }
        }
    button(...) {}
    }
}
```

<zero-design-system-provider style={{ justifyContent: 'center' }}>
    <div style={{ flexDirection: 'column', margin: '10px', width: '80%' }}>
        <zero-card id="zero-form-card" style= {{ display: 'flex', flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column">
                <zero-flex-layout class="flex-column spacing-2x">
                    <form style={{ display: 'flex', flexDirection: 'column', padding: '3px' }}>
                        <label htmlFor="i1">Input 1</label>
                        <input type="text" id="i1" name="i1" placeholder="placeholder" style={{ backgroundColor: ' rgba(135, 155, 166, 0.06) ' , borderRadius: '4px', height: '40px', border: '0', marginTop: '4px' }}></input>
                    </form>
                    <form style={{ display: 'flex', flexDirection: 'column', padding: '3px' }}>
                        <label htmlFor="i1">Input 2</label>
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

### Nested implementation

Vertical and horizontal components can also be used together for a more complex structure.

```kotlin
verticalLayout(...) {
    form(...) {
        horizontalLayout(...) {
            verticalLayout(...) {
                input{...},
                input{...}
            },
            verticalLayout(...) {
                input{...},
                input{...}
            }
        }
    },
    button(...) {}
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
                            <label htmlFor="i1">Input 1</label>
                            <input type="text" id="i1" name="i1" placeholder="placeholder" style={{ backgroundColor: ' rgba(135, 155, 166, 0.06) ' , borderRadius: '4px', height: '40px', border: '0', marginTop: '4px' }}></input>
                        </form>
                        <form style={{ display: 'flex', flexDirection: 'column', padding: '3px' }}>
                            <label htmlFor="i2">Input 2</label>
                            <input type="text" id="i2" name="i2" placeholder="placeholder" style={{ backgroundColor: ' rgba(135, 155, 166, 0.06) ' , borderRadius: '4px', height: '40px', border: '0', marginTop: '4px' }}></input>
                        </form>
                    </zero-flex-layout>
                    <zero-flex-layout class="flex-column spacing-2x">
                        <form style={{ display: 'flex', flexDirection: 'column', padding: '3px' }}>
                            <label htmlFor="i3">Input 3</label>
                            <input type="text" id="i3" name="i3" placeholder="placeholder" style={{ backgroundColor: ' rgba(135, 155, 166, 0.06) ' , borderRadius: '4px', height: '40px', border: '0', marginTop: '4px' }}></input>
                        </form>
                        <form style={{ display: 'flex', flexDirection: 'column', padding: '3px' }}>
                            <label htmlFor="i4">Input 4</label>
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

## Alignment Examples
### Vertical Alignment


```kotlin
ui("Vertical Layout") {
    page("Layout") {
        verticalLayout(...) {
            button {...}
            button {...}
            button {...}
        }
    }
}
```

> As mentioned above, children elements of the `verticalLayout` and `horizontalLayout` components, stretch to the entire length by default. For the following examples, we will set the width of the buttons to `13%`.

<zero-design-system-provider style={{ display: 'flex', justifyContent: 'center', borderRadius: '5px' }}>
    <zero-card style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba( 207, 207, 207, 1)' }}>
        <p style={{ color: 'black', padding: '4px', textAlign: 'center', marginTop: '10px'}}>By default the position of the children element will be at the top left. The same as <b><code>LayoutAlignItems.START</code></b> and <b><code>LayoutAlignContent.START</code></b></p>
        <zero-card>
            <zero-flex-layout class="flex-column">
                <zero-button style={{ width: '13%' }}
                >Button 1</zero-button>
                <zero-button style={{ width: '13%' }}
                >Button 2</zero-button>
                <zero-button style={{ width: '13%' }}
                >Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
    </zero-card>
</zero-design-system-provider>

###

| Value | Description | 
| --- | --- | 
|**`LayoutAlignItems.START`** | Positions items at the top left |
| **`LayoutAlignItems.CENTER`** | Centers items along the x-axis |
| **`LayoutAlignItems.END`** | Positions items on the far right |
|**`LayoutAlignContent.START`** | Positions items at the top left |
| **`LayoutAlignContent.CENTER`** | Centers content along the x-axis. It also applies flex-wrap which means, depending on the height of the parent element, the children may take up the height equally distributed among each other. However, if the height is smaller, they would be spread out in a row instead. This applies to the following alignments of content as well |
| **`LayoutAlignContent.END`** | Positions content on the far right.|
| **`LayoutAlignContent.EVENLY`** | Distributes space equally among the content. From the left of the first item, between items and on the right of the last item. |
| **`LayoutAlignContent.AROUND`** | Distributes the space equally between items. The space before the first item, and after the last, is half of that between them. |
| **`LayoutAlignContent.BETWEEN`** | The space is distributed evenly between items, with no space before the first item or after the last. |


<zero-design-system-provider style={{ display: 'flex', justifyContent: 'center' }}>
    <zero-flex-layout class="flex-column" style={{ backgroundColor: 'rgba( 207, 207, 207, 1)' }}>
        <p style={{ color: 'black', marginTop: '15px', textAlign: 'center' }}><b><code>LayoutAlignItems.CENTER</code></b></p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' , height: '25vh' }}>
            <zero-flex-layout class=" flex-column items-center" style={{ height: '0' }}>
                <zero-button style={{ flex: ' 1 1 auto' , width: '13%' }}>Button 1</zero-button>
                <zero-button style={{ flex: ' 1 1 auto' , width: '13%' }}>Button 2</zero-button>
                <zero-button style={{ flex: ' 1 1 auto' , width: '13%' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black',marginTop: '15px', textAlign: 'center' }}>In order to center the children elements both vertically and horizontally, simply add <b><code>LayoutJustify.CENTER</code></b> in addition to <b><code>LayoutAlignItems.CENTER</code></b></p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' , height: '25vh' }}>
            <zero-flex-layout class="flex-column items-center justify-center">
                <zero-button style={{ width: '13%' }}>Button 1</zero-button>
                <zero-button style={{ width: '13%' }}>Button 2</zero-button>
                <zero-button style={{ width: '13%' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black',marginTop: '15px', textAlign: 'center' }}><b><code>LayoutAlignItems.END</code></b></p>
        <zero-card style={{display: 'flex' , flexDirection: 'column'}}>
            <zero-flex-layout class="flex-column items-end">
                <zero-button style={{ width: '13%' }}>Button 1</zero-button>
                <zero-button style={{ width: '13%' }}>Button 2</zero-button>
                <zero-button style={{ width: '13%' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black',marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.CENTER</code></b> (no height set)</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column'}}>
            <zero-flex-layout class="flex-wrap flex-column content-center">
                <zero-button style={{ width: '13%' }}>Button 1</zero-button>
                <zero-button style={{ width: '13%' }}>Button 2</zero-button>
                <zero-button style={{ width: '13%' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black',marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.CENTER</code></b> (height set)</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column'}}>
            <zero-flex-layout class="flex-wrap flex-column content-center" style={{ height: '50px'}}>
                <zero-button style={{ width: '13%' }}>Button 1</zero-button>
                <zero-button style={{ width: '13%' }}>Button 2</zero-button>
                <zero-button style={{ width: '13%' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black',marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.END</code></b> (no height set)</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column'}}>
            <zero-flex-layout class="flex-column flex-wrap content-end">
                <zero-button style={{ width: '13%' }}>Button 1</zero-button>
                <zero-button style={{ width: '13%' }}>Button 2</zero-button>
                <zero-button style={{ width: '13%' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black',marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.END</code></b> (height set)</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column'}}>
            <zero-flex-layout class="flex-column flex-wrap content-end" style={{ height: '50px'}}>
                <zero-button style={{ width: '13%' }}>Button 1</zero-button>
                <zero-button style={{ width: '13%' }}>Button 2</zero-button>
                <zero-button style={{ width: '13%' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black',marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.EVENLY</code></b> (no height set)</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-evenly">
                <zero-button style={{ width: '13%' }} >Button 1</zero-button>
                <zero-button style={{ width: '13%' }}>Button 2</zero-button>
                <zero-button style={{ width: '13%' }}>Button 3</zero-button>
                <zero-button style={{ width: '13%' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black',marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.EVENLY</code></b> (height set at 100px)</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-evenly" style={{ height: '100px' }}>
                <zero-button style={{ width: '13' }} >Button 1</zero-button>
                <zero-button style={{ width: '13' }}>Button 2</zero-button>
                <zero-button style={{ width: '13' }}>Button 3</zero-button>
                <zero-button style={{ width: '13' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black',marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.EVENLY</code></b> (height set at 50px)</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-evenly" style={{ height: '50px' }}>
                <zero-button style={{ width: '13' }} >Button 1</zero-button>
                <zero-button style={{ width: '13' }}>Button 2</zero-button>
                <zero-button style={{ width: '13' }}>Button 3</zero-button>
                <zero-button style={{ width: '13' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black',marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.AROUND</code></b> (no height set)</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-around">
                <zero-button style={{ flex: '1 1 auto' , width: '13' }}>Button 1</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13' }}>Button 2</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13' }}>Button 3</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black',marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.AROUND</code></b> (height set at 100px)</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-around" style={{ height: '100px' }}>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 1</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 2</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 3</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black',marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.AROUND</code></b> (height set at 50px)</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-around" style={{ height: '50px' }}>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 1</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 2</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 3</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black',marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.BETWEEN</code></b> (no height set)</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-between">
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 1</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 2</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 3</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.BETWEEN</code></b> (height set at 100px)</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-between" style={{ height: '100px' }}>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 1</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 2</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 3</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.BETWEEN</code></b> (height set at 50px)</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' }}>
            <zero-flex-layout class="flex-column flex-wrap content-between" style={{ height: '50px' }}>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 1</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 2</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 3</zero-button>
                <zero-button style={{ flex: '1 1 auto' , width: '13%' }}>Button 4</zero-button>
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
            button {...}
            button {...}
            button {...}
        }
    }
}
```
> Button width is set to `27%`. 

<zero-design-system-provider style={{ display: 'flex', justifyContent: 'center', borderRadius: '5px' }}>
    <zero-card style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'rgba( 207, 207, 207, 1)' }}>
        <p style={{ color: 'black', padding: '4px', marginTop: '15px', textAlign: 'center'}}>By default the position of the children element will be at the top left. The same as <b><code>LayoutAlignItems.START</code></b> and <b><code>LayoutAlignContent.START</code></b></p>
        <zero-card>
            <zero-flex-layout class="flex-row">
                <zero-button style={{ width: '27%' }}
                >Button 1</zero-button>
                <zero-button style={{ width: '27%' }}
                >Button 2</zero-button>
                <zero-button style={{ width: '27%' }}
                >Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
    </zero-card>
</zero-design-system-provider>

###

| Value | Description | 
| --- | --- | 
| **`LayoutAlignItems.START`** | Positions items at the top left. |
| **`LayoutAlignItems.CENTER`** | Centers items along the y-axis. |
| **`LayoutAlignItems.END`** | Positions items at the bottom left. |
| **`LayoutAlignContent.START`** | Positions content at the top left. |
| **`LayoutAlignContent.CENTER`** | Centers content along the y-axis. 
| **`LayoutAlignContent.END`** | Positions content at the bottom left.|
| **`LayoutAlignContent.EVENLY`** | Distributes space equally among the content. From the top of the first item, between items and on the bottom. |
| **`LayoutAlignContent.AROUND`** | Distributes the space equally between items. The space before the first item, and after the last, is half of that between items. |
| **`LayoutAlignContent.BETWEEN`** | The space is distributed evenly between items, with no space before the first item or after the last. |


<zero-design-system-provider style={{ display: 'flex', justifyContent: 'center' }}>
    <zero-flex-layout class="flex-column spacing-1x" style={{ backgroundColor: 'rgba( 207, 207, 207, 1)' }}>
        <p style={{ color: 'black', marginTop: '20px', textAlign: 'center' }}><b><code>LayoutAlignItems.CENTER</code></b></p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' , height: '20vh' }}>
            <zero-flex-layout class=" flex-row items-center">
                <zero-button style={{ width: '27%' }}>Button 1</zero-button>
                <zero-button style={{ width: '27%' }}>Button 2</zero-button>
                <zero-button style={{ width: '27%' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', marginTop: '15px', textAlign: 'center' }}>In order to center the children elements both vertically and horizontally, simply add <b> <code>LayoutJustify.CENTER</code></b> in addition to <b><code>LayoutAlignItems.CENTER</code></b>.</p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column' , height: '20vh' }}>
            <zero-flex-layout class="flex-row items-center justify-center">
                <zero-button style={{ width: '27%' }}>Button 1</zero-button>
                <zero-button style={{ width: '27%' }}>Button 2</zero-button>
                <zero-button style={{ width: '27%' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', marginTop: '15px', textAlign: 'center' }}><b><code>LayoutAlignItems.END</code></b></p>
        <zero-card style={{display: 'flex' , flexDirection: 'column', height: '20vh'}}>
            <zero-flex-layout class="flex-row items-end">
                <zero-button style={{ width: '27%' }}>Button 1</zero-button>
                <zero-button style={{ width: '27%' }}>Button 2</zero-button>
                <zero-button style={{ width: '27%' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.CENTER</code></b></p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column', height: '20vh'}}>
            <zero-flex-layout class="flex-wrap flex-row content-center">
                <zero-button style={{ width: '27%' }}>Button 1</zero-button>
                <zero-button style={{ width: '27%' }}>Button 2</zero-button>
                <zero-button style={{ width: '27%' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.END</code></b></p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column', height: '20vh'}}>
            <zero-flex-layout class="flex-row flex-wrap content-end">
                <zero-button style={{ width: '27%' }}>Button 1</zero-button>
                <zero-button style={{ width: '27%' }}>Button 2</zero-button>
                <zero-button style={{ width: '27%' }}>Button 3</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.EVENLY</code></b></p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column', height: '20vh' }}>
            <zero-flex-layout class="flex-row flex-wrap content-evenly">
                <zero-button style={{ width: '27%' }}>Button 1</zero-button>
                <zero-button style={{ width: '27%' }}>Button 2</zero-button>
                <zero-button style={{ width: '27%' }}>Button 3</zero-button>
                <zero-button style={{ width: '27%' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.AROUND</code></b></p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column', height: '20vh' }}>
            <zero-flex-layout class="flex-row flex-wrap content-around">
                <zero-button style={{ width: '27%' }}>Button 1</zero-button>
                <zero-button style={{ width: '27%' }}>Button 2</zero-button>
                <zero-button style={{ width: '27%' }}>Button 3</zero-button>
                <zero-button style={{ width: '27%' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
        <p style={{ color: 'black', marginTop: '15px',  textAlign: 'center' }}><b><code>LayoutAlignContent.BETWEEN</code></b></p>
        <zero-card style={{ display: 'flex' , flexDirection: 'column', height: '20vh' }}>
            <zero-flex-layout class="flex-row flex-wrap content-between">
                <zero-button style={{ width: '27%' }}>Button 1</zero-button>
                <zero-button style={{ width: '27%' }}>Button 2</zero-button>
                <zero-button style={{ width: '27%' }}>Button 3</zero-button>
                <zero-button style={{ width: '27%' }}>Button 4</zero-button>
            </zero-flex-layout>
        </zero-card>
    </zero-flex-layout>
</zero-design-system-provider>

</TabItem>
</Tabs>
