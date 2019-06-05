//@flow
/*
 * The class for skill constellation
 */
import ReactDOM		from 'react-dom'
import {build, layout}		from './layout.js'
import THREE		from './three.js'
import Constellation3DObject		from './Constellation3DObject.js'

const settingDefault		= {
	isAnimated		: false,
	data		: [
	],
	textType		: 'CSS',
	backgroundColor		: 0xf0f0f0,
	lineColor		: 0x000000,
	lineDistance		: 80,
	cameraType		: 'orbit',
	width		: 800,
	height		: 600,
	cameraPerspectivePositionX		: 300,
	cameraPerspectivePositionY		: 0,
	cameraPerspectivePositionZ		: 0,
	cameraPerspectiveAngleX		: 0,
	cameraPerspectiveAngleY		: -90,
	cameraPerspectiveAngleZ		: 0,
	cameraObitPositionX		: 0,
	cameraObitPositionY		: 0,
	cameraObitPositionZ		: 200,
	cameraObitFrustmSize		: 800,
	strengthPushAllAway		: -500,
	strengthPullToX		: 0.1,
	strengthPullToY		: 0.1,
	strengthPullToZ		: 0.1,
	strengthToBounceOtherAway		: 0.5,
	isTextDirectionFixed		: true,
	isAutoRotated		: true,
	autoRotationSpeed		: 1,
}

export default class SkillConstellation{
	//setting
	setting		: any

	skillConstellationObject		: any

	sceneCSS		: any

	sceneWebGL		: any

	rendererCSS		: any
	
	rendererWebGL		: any

	camera		: any

	isUserInteracting		: boolean

	onMouseDownMouseX		: number

	onMouseDownMouseY		: number

	lon		: number

	onMouseDownLon		: number

	lat		: number

	onMouseDownLat		: number

	phi		: number

	theta		: number

	controls		: any

	constructor(
		setting		: any,
	){
		//bind
		////$FlowFixMe
		this.animate		= this.animate.bind(this)
		//$FlowFixMe
		this.update		= this.update.bind(this)
		//$FlowFixMe
		this.render		= this.render.bind(this)
		//$FlowFixMe
		this.onWindowResize		= this.onWindowResize.bind(this)
		//$FlowFixMe
		this.onPointerStart		= this.onPointerStart.bind(this)
		//$FlowFixMe
		this.onPointerMove		= this.onPointerMove.bind(this)
		//$FlowFixMe
		this.onPointerUp		= this.onPointerUp.bind(this)
		//$FlowFixMe
		this.onDocumentMouseWheel		= this.onDocumentMouseWheel.bind(this)
		//$FlowFixMe
		this.onPointerMove		= this.onPointerMove.bind(this)
		//combine user setting with the default setting
		setting		= Object.assign(
			settingDefault,
			setting
		)
		this.setting		= setting
		this.isUserInteracting		= false
		this.skillConstellationObject		= new Constellation3DObject(setting)

		this.onMouseDownMouseX		= 0
		this.onMouseDownMouseY		= 0
		this.lon		= 0
		this.onMouseDownLon		= 0
		this.lat		= 0
		this.onMouseDownLat		= 0
		this.phi		= 0
		this.theta		= 0
	}

	/*
	 * Just one round of render
	 */
	render(){
			//need to call update to try to move the nodes
			this.update()
			this.rendererCSS.render(this.sceneCSS, this.camera)
			this.rendererWebGL.render(this.sceneWebGL, this.camera)
	}

	/*
	 * create DOM element & three geometry and mount them
	 * this is an async fn
	 */
	async init(){
		await this.skillConstellationObject.init()
		/*
		 * camera
		 */
		this.initCamera()
		this.sceneCSS		= new THREE.Scene()
		this.rendererCSS		= new THREE.CSS3DRenderer()
		this.rendererCSS.setSize(this.setting.width, this.setting.height)
		this.rendererCSS.domElement.style.position		= 'absolute'
		this.setting.container.appendChild(this.rendererCSS.domElement)
		/*
		 * the scene 2
		 */
		this.sceneWebGL		= new THREE.Scene()
		this.sceneWebGL.background = new THREE.Color( 0xf0f0f0 );
		this.rendererWebGL		= new THREE.WebGLRenderer({
			antialias		: true,
		})
		this.rendererWebGL.setPixelRatio( window.devicePixelRatio );
		this.rendererWebGL.setSize( this.setting.width, this.setting.height);
		this.setting.container.appendChild( this.rendererWebGL.domElement );
		if(this.setting.backgroundPicture){
			console.log('to load background picture')
			if(
				typeof this.setting.backgroundPicture === 'string' &&
				this.setting.backgroundPicture.startsWith('#')
			){
				this.sceneWebGL.background		= new THREE.Color(
					this.setting.backgroundPicture
				)
			}else{
				var texture = new THREE.TextureLoader().load( this.setting.backgroundPicture );
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set(
					this.setting.backgroundPictureRepeatHorizontal,
					this.setting.backgroundPictureRepeatVertical,
				);
				this.sceneWebGL.background		= texture
			}
		}else{
			this.sceneWebGL.background		= new THREE.Color(this.setting.backgroundColor)
		}
		this.sceneCSS.add(this.skillConstellationObject.groupAllCSS)
		this.sceneWebGL.add(this.skillConstellationObject.groupAllWebGL)
		/*
		 * for perspective camera, should move it away from camera
		 */
		if(this.setting.cameraType === 'perspective'){
			const awayVector3		= new THREE.Vector3(
				this.setting.cameraPerspectivePositionX,
				this.setting.cameraPerspectivePositionY,
				this.setting.cameraPerspectivePositionZ,
			)
			const awayEuler		= new THREE.Euler(
				this.setting.cameraPerspectiveAngleX * THREE.Math.DEG2RAD, 
				this.setting.cameraPerspectiveAngleY * THREE.Math.DEG2RAD, 
				this.setting.cameraPerspectiveAngleZ * THREE.Math.DEG2RAD, 
			)
			this.skillConstellationObject.groupAllCSS.position.copy(awayVector3)
			this.skillConstellationObject.groupAllWebGL.position.copy(awayVector3)
			this.skillConstellationObject.groupAllCSS.rotation.copy(awayEuler)
			this.skillConstellationObject.groupAllWebGL.rotation.copy(awayEuler)
		}
		/*
		 * helper
		 */
//		const axesHelper		= new THREE.AxesHelper(500)
//		this.sceneWebGL.add(axesHelper)
//		const cameraHelper		= new THREE.CameraHelper(this.camera)
//		this.sceneWebGL.add(cameraHelper)
//		var gridHelper = new THREE.GridHelper( 100, 10 );
//		this.sceneWebGL.add( gridHelper );
//		var radius = 100;
//		var radials = 160;
//		var circles = 8;
//		var divisions = 64;
//		var helper = new THREE.PolarGridHelper( radius, radials, circles, divisions );
//		this.sceneWebGL.add( helper );

		//console.log('nodes:', nodes)
	}

	initCamera(){
		if(this.setting.cameraType === 'orbit'){
			//the camera & controller
			var frustumSize = this.setting.cameraObitFrustmSize;
			//use this to make the coordination is a square 
			var aspect = this.setting.width / this.setting.height;
			this.camera = new THREE.OrthographicCamera( 
				frustumSize * aspect / - 2, 
				frustumSize * aspect / 2, 
				frustumSize / 2, 
				frustumSize / - 2, 
				1, 
				1000 
			);
			this.camera.position.set(
				this.setting.cameraObitPositionX,
				this.setting.cameraObitPositionY,
				this.setting.cameraObitPositionZ,
			)
			this.controls		= new THREE.OrbitControls(this.camera)
			//inertia
			this.controls.enableDamping		= true
			this.controls.dampingFactor		= 0.1
			if(this.setting.isAutoRotated){
				this.controls.autoRotate		= true
				this.controls.autoRotateSpeed		= this.setting.autoRotationSpeed
			}
		}else{
			this.camera = new THREE.PerspectiveCamera( 
				75, 
				this.setting.width / this.setting.height, 
				1, 
				1100 
			);
			this.camera.target = new THREE.Vector3( 0, 0, 0 );
			//$FlowFixMe
			document.addEventListener( 'mousedown', this.onPointerStart, false );
			//$FlowFixMe
			document.addEventListener( 'mousemove', this.onPointerMove, false );
			//$FlowFixMe
			document.addEventListener( 'mouseup', this.onPointerUp, false );
			//$FlowFixMe
			document.addEventListener( 'wheel', this.onDocumentMouseWheel, false );
			//$FlowFixMe
			document.addEventListener( 'touchstart', this.onPointerStart, false );
			//$FlowFixMe
			document.addEventListener( 'touchmove', this.onPointerMove, false );
			//$FlowFixMe
			document.addEventListener( 'touchend', this.onPointerUp, false );
			//
			////$FlowFixMe
			document.addEventListener( 'dragover', function ( event ) {
				event.preventDefault();
				event.dataTransfer.dropEffect = 'copy';
			}, false );
			//$FlowFixMe
			document.addEventListener( 'dragenter', function () {
				//$FlowFixMe
				document.body.style.opacity = 0.5;
			}, false );

			document.addEventListener( 'dragleave', function () {
				//$FlowFixMe
				document.body.style.opacity = 1;
			}, false );
			//$FlowFixMe
			document.addEventListener( 'drop', function ( event ) {
//				event.preventDefault();
//				var reader = new FileReader();
//				//$FlowFixMe
//				reader.addEventListener( 'load', function ( event ) {
//					material.map.image.src = event.target.result;
//					material.map.needsUpdate = true;
//				}, false );
//				reader.readAsDataURL( event.dataTransfer.files[ 0 ] );
//				//$FlowFixMe
//				document.body.style.opacity = 1;
			}, false );
			//
			window.addEventListener( 'resize', this.onWindowResize, false );
		}
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.rendererCSS.setSize( window.innerWidth, window.innerHeight );
		this.rendererWebGL.setSize( window.innerWidth, window.innerHeight );
	}

	onPointerStart( event : any ) {
		this.isUserInteracting = true;
		var clientX = event.clientX || event.touches[ 0 ].clientX;
		var clientY = event.clientY || event.touches[ 0 ].clientY;
		this.onMouseDownMouseX = clientX;
		this.onMouseDownMouseY = clientY;
		this.onMouseDownLon = this.lon;
		this.onMouseDownLat = this.lat;
	}

	onPointerMove( event : any) {
		if ( this.isUserInteracting === true ) {
			var clientX = event.clientX || event.touches[ 0 ].clientX;
			var clientY = event.clientY || event.touches[ 0 ].clientY;
			this.lon = ( this.onMouseDownMouseX - clientX ) * 0.1 + this.onMouseDownLon;
			this.lat = ( clientY - this.onMouseDownMouseY ) * 0.1 + this.onMouseDownLat;
		}
	}

	onPointerUp() {
		this.isUserInteracting = false;
	}

	onDocumentMouseWheel( event : any ) {
		var fov = this.camera.fov + event.deltaY * 0.05;
		this.camera.fov = THREE.Math.clamp( fov, 10, 75 );
		this.camera.updateProjectionMatrix();
	}

	/*
	 * update the nodes & links, if it is the first time, create object
	 * for nodes & links, if not, update the position of them
	 */
	update(){
		this.skillConstellationObject.update()

		/*
		 * rotate the text to towards the camera
		 */
		this.skillConstellationObject.nodes.forEach((node :any)=> {
			if(node.object){
				if(
					this.setting.cameraType === 'orbit' && 
					this.setting.isTextDirectionFixed
				){
		//					node.object.lookAt(
		//						this.camera.position.x,
		//						node.object.position.y,
		//						this.camera.position.z,
		//					)
					/*
					 * node rotate along the Y axes with angle a, a === camera angle a 
					 * alone Y
					 */
					node.object.rotation.set(
							this.camera.rotation.x,
							this.camera.rotation.y,
							this.camera.rotation.z,
						)
				}
			}else{
			}
		})
		if(this.setting.cameraType === 'perspective'){
			if ( this.isUserInteracting === false ) {
				//this.lon += 0.1;
			}
			this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
			this.phi = THREE.Math.degToRad( 90 - this.lat );
			this.theta = THREE.Math.degToRad( this.lon );
			this.camera.target.x = 500 * Math.sin( this.phi ) * Math.cos( this.theta );
			this.camera.target.y = 500 * Math.cos( this.phi );
			this.camera.target.z = 500 * Math.sin( this.phi ) * Math.sin( this.theta );
			this.camera.lookAt( this.camera.target );
		}

		if(
			this.setting.cameraType === 'orbit'  &&
			this.controls
		){
			this.controls.update()
		}
	}

	/*
	 * loop for every tick of render
	 */
	animate(){
		try{
			//slow down
			//setTimeout(() => {
				requestAnimationFrame(this.animate)
			//}, 2000)
			this.render()
		}catch(e){
			console.error('get error in animate:', e)
		}
	}

	explode(){
		this.skillConstellationObject.explode()
	}

}
