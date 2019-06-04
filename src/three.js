import * as THREE from 'three';

if(process.browser){
	window.THREE = THREE;
	require('three/examples/js/controls/OrbitControls');
	require('three/examples/js/renderers/CSS3DRenderer.js')
}else{
	global.THREE		= THREE
	require('three/examples/js/controls/OrbitControls');
	require('three/examples/js/renderers/CSS3DRenderer.js')
}

export default THREE;
