//@flow
import {build, layout}		from './layout.js'
import ReactDOM		from 'react-dom'
import THREE		from './three.js'

export default class Constellation3DObject{
	setting		: any

	//the nodes of every skill 
	nodes		: any

	//the links between two skill nodes
	links		: any

	//the d3 force for layout the nodes/links
	force		: any

	groupAllCSS		: any

	groupAllWebGL		: any


	constructor(setting : any){
		this.setting		= setting
		console.info('constructed a Constellation.')
	}

	async init(){
		const setting		= this.setting
		this.groupAllCSS		= new THREE.Group()
		this.groupAllWebGL		= new THREE.Group()
		//hide them first
		this.groupAllCSS.scale.set(0, 0, 0)
		this.groupAllWebGL.scale.set(0, 0, 0)
		//to build data
		const {nodes, links}		= build(this.setting.data)
		this.nodes		= nodes
		this.links		= links
		let orbitNodes		= 0
//		this.nodes.forEach(node => {
//			if(node.level === 0){
//				orbitNodes++
//				if(orbitNodes === 1){
//					//$FlowFixMe
//					node.fz		= 0
//				}else if(orbitNodes > 1 && orbitNodes <= 8){
//					//$FlowFixMe
//					node.fz		= - this.setting.lineDistance
//				}else if(orbitNodes > 8 && orbitNodes <= 27){
//					//$FlowFixMe
//					node.fz		= - this.setting.lineDistance * 2
//				}else if(orbitNodes > 27 && orbitNodes <= 64){
//					//$FlowFixMe
//					node.fz		= - this.setting.lineDistance * 3
//				}else if(orbitNodes > 64 ){
//					//$FlowFixMe
//					node.fz		= - this.setting.lineDistance * 4
//				}
//			}
//		})
		//fix the 0 node
		////$FlowFixMe
//		nodes[0].fx		= 0
//		//$FlowFixMe
//		nodes[0].fy		= 0
		//$FlowFixMe
		this.force		= layout(
			nodes, 
			links, 
			this.setting.isAnimated,
			this.setting.lineDistance,
			this.setting.strengthPushAllAway,
			this.setting.strengthPullToX,
			this.setting.strengthPullToY,
			this.setting.strengthPullToZ,
			this.setting.strengthToBounceOtherAway,
		)

		/*
		 * create CSS object
		 */
		for(let node of this.nodes){
			//this is the first time
			if(this.setting.textType === 'CSS'){
	//						const elementDOM		= document.createElement('div')
	//						elementDOM.className		= 'dot'
	//						const object3D		= new THREE.CSS3DObject(elementDOM)
	//						object3D.position.set(
	//							node.x,
	//							node.y,
	//							node.z
	//						)
				//the text label
				const elementDOM		= document.createElement('div')
				const textElement		= this.setting.textCSS(node)
				await new Promise(resolve => {
					ReactDOM.render(
						textElement,
						elementDOM,
						resolve(true)
					)
				})
				//console.log('textElement:', textElement)
				//console.log('elementDOM:', elementDOM)
				const textObject3D		= new THREE.CSS3DObject(elementDOM)
				textObject3D.position.set(
					node.x,
					node.y,
					node.z
				)
	//						scene.add(object3D)
				this.groupAllCSS.add(textObject3D)
				//add ref to node
				node.object		= textObject3D
			}else{
				//load font
				var loader = new THREE.FontLoader();
				console.log('begin load...')
				const font		= await new Promise(resolve => {
					loader.load( '/static/fonts/helvetiker_regular.typeface.json', function ( font ) {
						console.log('load finish!')
						resolve( font );
					} );
				})
				//set the position of textMesh to center of itself
				const textMesh		= this.setting.textMesh(node, font)
				const box3		= new THREE.Box3().setFromObject(textMesh)	
				const target		= new THREE.Vector3()
				box3.getSize(target)
				//console.log('text size:', target)
				textMesh.position.set(
					-target.x / 2,
					-target.y / 2,
					0
				)
				const group		= new THREE.Group()
				group.add(textMesh)
				group.position.set(
					node.x,
					node.y,
					node.z
				)
				this.groupAllWebGL.add(group)
				//add ref to node
				node.object		= group
				//console.log('textMesh:', textMesh)
	//				//help
	//				var box = new THREE.BoxHelper( textMesh, 0x000000 );
	//				sceneWebGL.add( box );
			}
		}

		for(let link of this.links){
				//line/link
				const lineMaterial		= new THREE.LineBasicMaterial(
					{
						color		: this.setting.lineColor,
						linewidth		: 5,
					}
				)
				const lineGeometry		= new THREE.Geometry()
				lineGeometry.vertices.push(new THREE.Vector3(
					link.source.x,
					link.source.y,
					link.source.z
				))
				lineGeometry.vertices.push(new THREE.Vector3(
					link.target.x,
					link.target.y,
					link.target.z
				))
				const line		= new THREE.Line(lineGeometry, lineMaterial)
				this.groupAllWebGL.add(line)
				link.object		= line
		}
	}

	/*
	 * To start force to animate the component
	 */
	explode(){
		this.groupAllCSS.scale.set(1, 1, 1)
		this.groupAllWebGL.scale.set(1, 1, 1)
		this.force.restart()
	}

	update(){
		//to create DOM, and amount to scene
		this.nodes.forEach((node :any)=> {
			if(node.object){
				//existed, just update position
				node.object.position.set(
					node.x,
					node.y,
					node.z
				)
			}else{
			}
		})
		//console.log('links:', links)
		this.links.forEach((link : any) => {
			if(link.object){
				//important! Need to inform engine to update the line
				link.object.geometry.verticesNeedUpdate		= true
				link.object.geometry.vertices[0].set(
					link.source.x,
					link.source.y,
					link.source.z
				)
				link.object.geometry.vertices[1].set(
					link.target.x,
					link.target.y,
					link.target.z
				)
			}else{
			}
		})
	}

}
