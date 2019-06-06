# constellation-3d
constellation-3d is for data visualization, it looks like constellations in the 
sky. [Demo](https://bl.ocks.org/deanchen2013/220cdbba695f61d421adcae6cb25b602) 
is here.

# About this component
I created constellation-3d because I use it to show my skills in 
[my portfolio site](http://dadiorchen.com). Like this:

[<img alt="snapshot" src="https://raw.githubusercontent.com/deanchen2013/constellation-3d/master/snapshort.png" width="420" height="219">](https://raw.githubusercontent.com/deanchen2013/constellation-3d/master/snapshort.png)

I think it is suitable for displaying data in which the data nodes have a loose relationship,  such as all the hosts on the Internet, some of them have a connection with others, but some else haven't.  

It is based on [three.js](http://threejs.org) and 
[d3-force-3d](https://github.com/vasturiano/d3-force-3d).

# Features

* 3D

constellation-3d uses a 3d engine [three.js](http://threejs.org), that means you can view the data in 3d space.

* Support HTML/CSS + JSX

You can write HTML/CSS to change the appearance of constellation-3d. In order to let the user write HTML/CSS in js file, I use React 's JSX as a template engine, for more information about JSX, check document [here](https://reactjs.org/docs/introducing-jsx.html). To define the appearance of nodes in constellation-3d, the code is like this:

```js
<div
    style={{
        backgroundColor        : 'red',
        width        : '100px',
        height        : '100px'
        borderRadius        : '50%',
    }}
    >
        {node.name}
</div>
```

# Install
with NPM
```
npm install --save constellation-3d
```
with HTML
```html
    <script src='https://unpkg.com/constellation-3d/dist/main.js' ></script>
    <script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
```
NOTE, to use constellation-3d in html file, you need to surround the js code with script tag which type is 'text/babel', thats because we need
write JSX in code.

```html
<script type="text/babel">
    ...
</script>
```

# API
Settings for behaver and appearance of the component:

| Setting | Type | Default | Description | 
| --- | --- | --- | --- |
| container | DOM object | none | the DOM div element to mount the component/canvas, e.g. document.getElementById('container') |
| isAnimated | boolean | true |  if true, then there is an animation when it shows up |
| backgroundPicture | URL | none | background picture URL, support PNG, JPEG |  
| backgroundPictureRepeatHorizontal | number | none | how many time the picture will be repeated in the horizontal direction on the background |
| backgroundPictureRepeatVertical | number | none | how many time the picture will be repeated in the vertical direction on the background |
| lineColor | number | 0x000000 | the color of the line between two nodes |
| lineDistance | number | 80 | the distance of the line between two nodes |
| textType | 'CSS' \| 'THREE' | 'CSS' | if textType = 'CSS', use CSS+HTML to render the nodes, if = 'THREE', use Three.js 3d model to render the nodes | 
| width | number | none | the width of the component | 
| height | number | none | the height of the component | 
| isTextDirectionFixed | boolean | true | if true, the text of nodes will always keep facing to the camera |
| isAutoRotated | boolean | false | if true, the component will rotate automatically | 
| autoRotationSpeed | number | 1 | the speed of rotation, the larger the value, the faster the speed | 
| cameraType | 'orbit' \| 'perspective' | 'orbit' | 'orbit': the camera will rotate around the constellations; 'perspective' : the constellation will rotate around the camera |
| cameraPerspectivePositionX | number | none | valid in perspective mode, indicates the x-axis coordinates of camera |
| cameraPerspectivePositionY | number | none | valid in perspective mode, indicates the y-axis coordinates of camera |
| cameraPerspectivePositionZ | number | none | valid in perspective mode, indicates the z-axis coordinates of camera |
| cameraPerspectiveAngleX | number | none | valid in perspective mode, the rotation angle of the camera around the x-axis |
| cameraPerspectiveAngleY | number | none | valid in perspective mode, the rotation angle of the camera around the y-axis|
| cameraPerspectiveAngleZ | number | none | valid in perspective mode, the rotation angle of the camera around the z-axis |
| cameraObitPositionX | number | none | valid in orbit mode, indicates the x-axis coordinates of camera |
| cameraObitPositionY | number | none | valid in orbit mode, indicates the y-axis coordinates of camera |
| cameraObitPositionZ | number | none | valid in orbit mode, indicates the z-axis coordinates of camera |
| cameraObitFrustmSize | number | none | in orbit mode, distance from nodes to camera | 
| strengthPushAllAway | number | none | strength pushing all nodes away |
| strengthPullToX | number | none | strength pulling all nodes to X coordination |
| strengthPullToY | number | none | strength pulling all nodes to Y coordination |
| strengthPullToZ | number | none | strength pulling all nodes to Z coordination |
| strengthToBounceOtherAway | number | none | strength bouncing all nodes away |
| textCSS | React component | none | pass into a react component as the template to display a node|
| textMesh | Three.js model | none | pass into a Three.js model as the template to display a node|
| data | JSON | none | the data to display, see below for detail |

## Data format

To display some data, should give constellation-3d a JSON object, the format looks like below:

```js
    [
        {
            name        : 'nameA',
            weight        : 2,
            children        : [
                {
                    name        : 'childA',
                    weight        : 1,
                },{
                    name        : 'childB',
                    wight        : 1,
                }
            ]
        },{
            name        : 'nameB',
            weight        : 3,
        }
    ]
```
description:

  name        : the name of this data node
  
  weight        : the weight of current node, range is [1-10]
  
  children        : children array




