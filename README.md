# constellation-3d
constellation-3d is for data visualization, it looks like constellations in the 
sky. [Demo](https://bl.ocks.org/deanchen2013/220cdbba695f61d421adcae6cb25b602?ssss123d1) 
is here.

# About this component
I create constellation-3d because I use it to show my skills in 
[my portfolio site](http://dadiorchen.com). Like this:

[picture]

[picture]

I think it is suitable to show data in which the data nodes have a loose 
relationship,  such as all the hosts on the Internet, some of them have a 
connection with others, but some else haven't.  

It is based on [three.js](http://threejs.org) and 
[d3-force-3d](https://github.com/vasturiano/d3-force-3d).

# Features
* 3d
It uses 3d engine underhood, so you can view the data in a 3d space.

* Support HTML/CSS + JSX
It renders nodes in HTML/CSS way and supports JSX, that is, you can change the outlook of the data nodes with arbitrary HTML/CSS code, and support syntax of JSX.

# Install
with NPM
```
npm install --save constellation-3d
```
with HTML
```html
    <script src='https://unpkg.com/constellation-3d@1.0.6/dist/main.js' ></script>
    <script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
```

# API
The setting for config the behaver and outlook of the component:
| Setting | Type | Default | Description | 
| --- | --- | --- | --- |
| container | DOM object | none | the DOM div element to mount all the component/canvas, e.g. document.getElementById('container') |
| isAnimated | boolean | true |  if true, then there is an animation when it show up |
| backgroundPicture | URL | none | background picture URL, support PNG, JPEG |  
| backgroundPictureRepeatHorizontal | number | none | how many time the picture will be repeated in the horizontal direction on the background |
| backgroundPictureRepeatVertical | number | none | how many time the picture will be repeated in the vertical direction on the background |
| lineColor | number | 0x000000 | the color of the line between two  nodes |
| lineDistance | number | 80 | the distance of the line between two  nodes |

text type = 'CSS', use CSS+HTML to show text skill node, with setting:textCSS
             * text type = 'THREE', use 3D model to show text skill node, with setting: textMesh
             */
            textType        : 'CSS',
            /*
             * the width of the component
             */
            width        : 500,
            /*
             * the height of the component
             */
            height        : 400,
            /*
             * if true, the text will always keep facing to the camera
             */
            isTextDirectionFixed        : true,
            /*
             * if true, the camera will rotate automatically
             */
            isAutoRotated        : false,
            /*
             * the speed of camera rotation
             */
            autoRotationSpeed        : 1,
            /*
             * cameraType    = 'perspective' : the camera is first person view
             * cameraType    = 'orbit'        : the camera is third person view
             */
            cameraType        : 'orbit',
            /*
             * in perspective mode, the position of camera, for X,Y,Z coordination
             */
            cameraPerspectivePositionX        : 300,
            cameraPerspectivePositionY        : 0,
            cameraPerspectivePositionZ        : 0,
            /*
             * in perspective mode, the angle of camera, for X,Y,Z coordination
             */
            cameraPerspectiveAngleX        : 0,
            cameraPerspectiveAngleY        : -90,
            cameraPerspectiveAngleZ        : 0,
            /*
             * in orbit mode, the position of camera, for X,Y,Z coordination
             */
            cameraObitPositionX        : 0,
            cameraObitPositionY        : 0,
            cameraObitPositionZ        : 200,
            /*
             * in orbit mode, the distance to camera, the bigger the number, the far
             * away to the camera
             */
            cameraObitFrustmSize        : 400,
            /*
             * strength to push all skill nodes away
             */
            strengthPushAllAway        : -657,
            /*
             * strength to pull all skill nodes to X coordination
             */
            strengthPullToX        : 0.1,
            /*
             * strength to pull all skill nodes to y coordination
             */
            strengthPullToY        : 0.1,
            /*
             * strength to pull all skill nodes to z coordination
             */
            strengthPullToZ        : 0.1,
            /*
             * strength to bounce all nodes away
             */
            strengthToBounceOtherAway        : 0.78,
            /*
             * this is the setting for show a skill node in CSS/HTML way
             */
            textCSS        : (node) => {
                return (
                    <div
                    style={{
                        backgroundColor        : colors(node.group),
                            width        : (node.weight< 5 ? 6 : 10) + 'px',
                            height        : (node.weight< 5 ? 6 : 10) + 'px',
                            borderRadius        : '50%',
                    }}
                    >
                    <div
                    style={{
                        position        : 'absolute',
                            color        : 'white',
                            top        : (node.weight< 5 ? 6 : 10) + 2 + 'px' ,
                            fontSize        : (node.weight< 5 ? 6 : 10) ,
                    }}
                    >
                    {node.name}
                    </div>
                    </div>

                )
            },
            /*
             * this is the setting for show a skill node in three.js d3 way
             */
            textMesh        : (node, font) =>{
                //WebGL text
                const textGeometry = new THREE.TextGeometry( node.name, {
                    font: font,
                    size: 28 * (node.weight/10),
                    height: 5 * (node.weight/10),
                    //                    curveSegments: 12,
                    //                    bevelEnabled: true,
                    //                    bevelThickness: 8,
                    //                    bevelSize: 8,
                    //                    bevelOffset: 0,
                    //                    bevelSegments: 5
                } );
                const textMaterial        = new THREE.MeshNormalMaterial({
                    color        : 0x00ffff,
                })
                return new THREE.Mesh(textGeometry, textMaterial)
            },
            /*
             * the skill data
             *     name        :        the skill name
             *     weight        : the weight for skill, range from 1 to 10
             */
            data        : [
                //{{{
                {
                    name        : 'Javascript',
                    weight        : 8,
                    children        : [
                        {
                            name        : 'React',
                            weight        : 8,
                            children        : [
                                {
                                    name        : 'Redux',
                                    weight        : 3,
                                },{
                                    name        : 'Flow',
                                    weight        : 3,
                                },{
                                    name        : 'Jest',
                                    weight        : 5,
                                },{
                                    name        : 'Next.js',
                                    weight        : 3,
                                }
                            ],
                        },{
                            name        : 'D3',
                            weight        : 6,
                        },{
                            name        : 'Three.js',
                            weight        : 3,
                        },{
                            name        : 'Node.js',
                            weight        : 6,
                        }
                    ],
                },{
                    name        : 'Java',
                    weight        : 6,
                    children        : [
                        {
                            name        : 'spring',
                            weight        : 5,
                        }
                    ]
                },{
                    name        : 'git',
                    weight        : 4,
                },{
                    name        : 'TDD',
                    weight        : 8,
                    children        : [
                        {
                            name        : 'Trello',
                            weight        : 3,
                        },{
                            name        : 'Agile programming',
                            weight        : 5,
                        },{
                            name        : 'Pomodoro Technique',
                            weight        : 3,
                        }
                    ],
                }
                //}}}
            ]
        }

