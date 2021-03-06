//const { SceneUtils } = require("./js/three");

if ( WEBGL.isWebGLAvailable() === false ) {
	document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}



let scene, camera, renderer, controls;

let land, firTree, oakTree, tipi, fence, bonfire, stone, bigStone, timber,
		stones = [],
		stoneX, stoneY, stoneZ;

const windowWidth = window.innerWidth,
				windowHeight = window.innerHeight;

const windowHalfX = window.innerWidth / 2,
			windowHalfY = window.innerHeight / 2;

//let mouseX = 0;
//let mouseY = 0;

const uniforms = {
	amplitude: { value: 5.0 },
	opacity: { value: .4 },
	color: { value: new THREE.Color( 0xf0fffc ) }
};

const getCustomColor = geometry  => {
	let count = geometry.attributes.position.count;
	let displacement = new THREE.Float32BufferAttribute( count * 3, 3 );
	geometry.addAttribute( 'displacement', displacement );
	let customColor = new THREE.Float32BufferAttribute( count * 3, 3 );
	geometry.addAttribute( 'customColor', customColor );
	let color = new THREE.Color( 0xf0fffc );
	for ( var i = 0, l = customColor.count; i < l; i ++ ) {
			color.setHSL( i / l, 0.8, 0.7 );
			color.toArray( customColor.array, i * customColor.itemSize );
	}
}

const init = () => {
	// Create scene
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, .1, 1000);
	camera.lookAt(scene.position);
	
  	camera.position.set(0, 15, 60);
	
	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	
	// render controls -by shane

	
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.enableDamping = true;
				controls.dampingFactor = 0.25;
				controls.enableZoom = true;
				controls.autorotate =true;
				controls.screenSpacePanning = false;
				controls.minDistance = 10;
				controls.maxDistance = 1500;

				controls.maxPolarAngle = Math.PI / 2.1;
				controls.update();

//LOAD MTL AND OBJ BY SHANE
/*
var mtlLoader = new THREE.MTLLoader();
mtlLoader.load("model/bush_1.mtl", function(materials){
	materials.preload();

	var objLoader = new THREE.OBJLoader();
	objLoader.setMaterials(materials);
	objLoader.load("model/bush_1.obj", function(mesh){
		scene.add(mesh);
	});
	
});

*/




	//controls.listenToKeyEvents( window ); 
	//controls = new THREE.OrbitControls(camera, renderer.domElement);
	//controls.minPolarAngle = Math.PI*.1; // min rotate
  //controls.maxPolarAngle = Math.PI*.5; // max rotate
	//controls.minDistance = 30; // min zoom
 // controls.maxDistance = 100; // max zoom
	
	//drawAxes(); // add axes lines
	setLights();
	initSummer();
	
	document.body.appendChild( renderer.domElement );
	
	// add events listeners
	//document.addEventListener('mousemove', onDocumentMouseMove, false);
	window.addEventListener('resize', onWindowResize);
}

// create summer scene
const initSummer = () => {
	drawLand();
	drawFirTrees();
	drawOakTrees();
	drawTipis();
	drawFence();
	drawBonfire();
	drawSmallStones();
	drawBigStones();
	drawTimber();
}

// create lights
const setLights = () => {
	const light = new THREE.HemisphereLight(0xb8b09c, 0x97c653, 1, 100);
  scene.add(light);
	
	const ambientLight = new THREE.AmbientLight( 0xFFFFFF, .2 );
	scene.add(ambientLight);
	
	const ambientLight2 = new THREE.AmbientLight( 0xFFFFFF, .5 );
	scene.add(ambientLight2);
	
	let directionalLight = new THREE.DirectionalLight( 0xb8b09c, .7, 100);
	directionalLight.position.set(10, 10, 30);
	scene.add( directionalLight );
	
	const spotLight = new THREE.SpotLight( 0xFFFFFF, .1 );
	spotLight.angle = Math.PI / 3;
	spotLight.penumbra = 1;
	spotLight.position.set( 25, 40, 40 );
	spotLight.castShadow = true;
	spotLight.shadow.camera.near = 1.2;
	spotLight.shadow.camera.far = 140;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	scene.add( spotLight );
	
	const spotLight2 = new THREE.SpotLight( 0x83c000, .2 );
	spotLight2.angle = Math.PI / 3;
	spotLight2.penumbra = 1;
	spotLight2.position.set( 23, 17, 40 );
	spotLight2.castShadow = true;
	spotLight2.shadow.camera.near = 1;
	spotLight2.shadow.camera.far = 140;
	spotLight2.shadow.mapSize.width = 1024;
	spotLight2.shadow.mapSize.height = 1024;
	scene.add( spotLight2 );
	
	//scene.add( new THREE.CameraHelper( spotLight.shadow.camera ) );
	//scene.add( new THREE.CameraHelper( spotLight2.shadow.camera ) );
}

// add axes lines
const drawAxes = () => {
	const axesHelper = new THREE.AxesHelper( 100 );
	scene.add(axesHelper);
}

// draw land
const drawLand = () => {
	land = new Land();
	land.group.position.set(0, 0, 0);
	land.group.rotation.x = -1.57;
	scene.add(land.group);
}

// draw christmas trees
const drawFirTrees = () => {
	_drawFirTreesCenter();
	_drawFirTreesRight();
	_drawFirTreesLeft();
}
const _drawFirTreesCenter = () => {
	for (var i = 1; i< 3; i++) {
		firTree = new FirTree();
		firTree.group.position.x = i*2;
		firTree.group.position.y = 13;
		firTree.group.position.z = i*12*-1;
		scene.add(firTree.group);
	}
}
const _drawFirTreesRight = () => {
	for (var i = 1; i< 3; i++) {
		firTree = new FirTree();
		firTree.group.position.x = i*13;
		firTree.group.position.y = 13;
		firTree.group.position.z = i*10*-1;
		scene.add(firTree.group);
	}
}
const _drawFirTreesLeft = () => {
	for (var i = 1; i< 3; i++) {
		firTree = new FirTree();
		firTree.group.position.x = i*15*-1;
		firTree.group.position.y = 13;
		firTree.group.position.z = i*3*-1;
		scene.add(firTree.group);
	}
}

// draw oak trees
const drawOakTrees = () => {
	_drawOakTreeRight();
	_drawOakTreeLeft();
}
const _drawOakTreeRight = () => {
	oakTree = new OakTree();
	oakTree.group.position.x = 10;
	oakTree.group.position.z = -25;
	scene.add(oakTree.group);
}
const _drawOakTreeLeft = () => {
	oakTree = new OakTree();
	oakTree.group.position.x = -25;
	oakTree.group.position.z = 7;
	scene.add(oakTree.group);
}

// draw timber
const drawTimber = () => {
	timber = new Timber();
	timber.group.position.x = -10;
	timber.group.position.y = 2.2;
	timber.group.position.z = -22;
	scene.add(timber.group);
}

// draw Teepee
const drawTipis = () => {
	for (var i = 1; i< 3; i++) {
		tipi = new Tipi();
		tipi.group.position.x = i*10;
		tipi.group.position.y = 9;
		tipi.group.position.z = i*8;
		tipi.group.rotation.y = 1;
		scene.add(tipi.group);
	}
}

// draw fence
const drawFence = () => {
	fence = new Fence();
	fence.group.position.z = 10;
	fence.group.position.x = -15;
	fence.group.rotation.y = .6;
	scene.add(fence.group);
}

// draw bonfire
const drawBonfire = () => {
	bonfire = new Bonfire();
	bonfire.group.position.z = 25;
	bonfire.group.position.x = 5;
	scene.add(bonfire.group);
}

// draw small stones
const drawSmallStones = () => {
	const nStones = 20;
  const stonesDist = 20;
	for (var i = 1; i< nStones; i++) {
		stone = new SmallStone();
		stoneY = 0;
    stoneX = (Math.cos(Math.PI*Math.random(i))*stonesDist*1.2);
    stoneZ = -(Math.sin(Math.PI*Math.random(i))*stonesDist)/1.2;
		stone.group.position.set(stoneX, stoneY, stoneZ);
		scene.add(stone.group);
		stones.push(stone);
	}
}

// draw big stone
const drawBigStones = () => {
	bigStone = new BigStone();
	scene.add(bigStone.group);
}

// render
const animate = () => {
  requestAnimationFrame(animate);

  render();
}

const render = () => {
  renderer.render(scene, camera);
}

// Objects' classes
class Land {
	constructor() {
		this.group = new THREE.Group();
		
		this.groundMaterial = new THREE.MeshStandardMaterial({
			color: 0x452823,
			roughness: 1
		}); 
		
		this.grassMaterial = new THREE.MeshStandardMaterial({
			color: 0x97c653,
			roughness: 1
		}); 
		
		this.drawGround();
		this.drawGrass();
	}
	
	drawGround() {
		const groundGeometry = new THREE.BoxGeometry(150, 70, 3, 10, 10, 1);
		const ground = new THREE.Mesh(groundGeometry, this.groundMaterial);
		ground.translateZ(-2);
		this.group.add(ground);
	}
	
	drawGrass() {
		const grassGeometry = new THREE.BoxGeometry(150, 70, 1, 10, 10, 1);
		const grass = new THREE.Mesh(grassGeometry, this.grassMaterial);
		grass.receiveShadow = true;
		this.group.add(grass);
	}
}

class Tree {
	constructor() {
		this.group = new THREE.Group();
		
		this.sheetsMaterial = new THREE.MeshStandardMaterial({
			color: 0x5da600,
			roughness: 1,
			flatShading: true
		});
		
		this.treeMaterial = new THREE.MeshStandardMaterial({
			color: 0x983734,
			roughness: 1,
			flatShading: true
		});
	}
}
class FirTree extends Tree {
	constructor() {
		super();
		this.drawSheets();
		this.drawTree();
	}
	
	drawSheets() {
		const sheetsGeometry = new THREE.ConeGeometry(4, 20, 4);
		const sheets = new THREE.Mesh(sheetsGeometry, this.sheetsMaterial);
		sheets.castShadow = true;
		this.group.add(sheets);
	}
	
	drawTree() {
		const treeGeaometry = new THREE.CylinderGeometry(2, 1, 5, 4);
		const tree = new THREE.Mesh(treeGeaometry, this.treeMaterial);
		tree.castShadow = true;
		tree.translateY(-10);
		this.group.add(tree);
	}
}
class OakTree extends Tree {
	constructor() {
		super();
		
		this.drawSheets();
		this.drawTree();
	}
	
	drawSheets() {
		const sheetsGeometry = new THREE.DodecahedronGeometry(7);
		const sheets = new THREE.Mesh(sheetsGeometry, this.sheetsMaterial);
		sheets.castShadow = true;
		sheets.position.y = 15;
		this.group.add(sheets);
	}
	
	drawTree() {
		const treeGeaometry = new THREE.CylinderGeometry(1, .6, 20, 4);
		const tree = new THREE.Mesh(treeGeaometry, this.treeMaterial);
		tree.castShadow = true;
		tree.position.y = 10;
		this.group.add(tree);
	}
}
class Timber extends Tree {
	constructor() {
		super();
		this.drawTimber();
		this.drawBranch();
	}
	
	drawBranch() {
		const branchGeametry = new THREE.ConeGeometry(.5, 2, 5, 5);
		const branch = new THREE.Mesh(branchGeametry, this.treeMaterial);
		branch.castShadow = true;
		branch.position.y = 2.5;
		branch.rotation.z = .2;
		this.group.add(branch);
	}
	
	drawTimber() {
		const timberGeaometry = new THREE.CylinderGeometry(2, 1.5, 7, 9, 2);
		const timber = new THREE.Mesh(timberGeaometry, this.treeMaterial);
		timber.castShadow = true;
		timber.rotation.z = 1.5;
		timber.rotation.y = .5;
		this.group.add(timber);
	}
}

class Tipi {
	constructor() {
		this.group = new THREE.Group();
		
		this.envelopeMaterial = new THREE.MeshStandardMaterial({
			color: 0xB6B19D,
			roughness: 1,
			flatShading: true
		});
		
		this.woodMaterial = new THREE.MeshStandardMaterial({
			color: 0x803829,
			roughness: 1
		});
		
		this.innerMaterial = new THREE.MeshStandardMaterial({
			color: 0x1C1C1C,
			flatShading: true,
			side: THREE.DoubleSide
		});
		
		this.drawEnvelope();
		this.drawWood();
		this.drawInner();
	}
	
	drawEnvelope() {
		const envelopeGeometry = new THREE.ConeGeometry(5, 17, 8);
		const envelope = new THREE.Mesh(envelopeGeometry, this.envelopeMaterial);
		envelope.castShadow = true;
		envelope.receiveShadow = true;
		this.group.add(envelope);
		
		const bigPatternGeometry = new THREE.TorusGeometry(2.5, .3, 4, 8);
		const bigPattern = new THREE.Mesh(bigPatternGeometry, this.woodMaterial);
		bigPattern.rotation.x = 1.6;
		bigPattern.rotation.z = 1.5;
		this.group.add(bigPattern);
		
		const smallPatternGeometry = new THREE.TorusGeometry(1, .3, 4, 8);
		const smallPattern = new THREE.Mesh(smallPatternGeometry, this.woodMaterial);
		smallPattern.position.y = 5;
		smallPattern.rotation.x = 1.6;
		smallPattern.rotation.z = 1.5;
		this.group.add(smallPattern);
	}
	
	drawWood() {
		const woodBigGeometry = new THREE.ConeGeometry(.1, 8, 10);
		const woodBig = new THREE.Mesh(woodBigGeometry, this.woodMaterial);
		woodBig.translateY(10);
		woodBig.castShadow = true;
		woodBig.receiveShadow = true;
		this.group.add(woodBig);
		
		const woodMediumGeometry = new THREE.ConeGeometry(.1, 5, 10);
		const woodMedium = new THREE.Mesh(woodMediumGeometry, this.woodMaterial);
		woodMedium.translateY(10.5);
		woodMedium.translateZ(-1);
		woodMedium.rotation.x = -.4;
		woodMedium.castShadow = true;
		woodMedium.receiveShadow = true;
		this.group.add(woodMedium);
		
		const woodSmallGeometry = new THREE.ConeGeometry(.1, 3, 10);
		const woodSmall = new THREE.Mesh(woodSmallGeometry, this.woodMaterial);
		woodSmall.translateX(-.7);
		woodSmall.translateY(9.5);
		woodSmall.translateZ(.5);
		woodSmall.rotation.z = .5;
		woodSmall.rotation.x = .4;
		woodSmall.castShadow = true;
		woodSmall.receiveShadow = true;
		this.group.add(woodSmall);
	}
	
	drawInner() {
		const darkInnerGeometry = new THREE.ConeGeometry(2, 5, 3, 1);
		const darkInner = new THREE.Mesh(darkInnerGeometry, this.innerMaterial);
		darkInner.position.x = -3.4;
		darkInner.position.y = -6;
		darkInner.position.z = 1.3;
		darkInner.rotation.y = -.12;
		darkInnerGeometry.vertices[0].x += .4;
		this.group.add(darkInner);
	}
}

class Fence {
	constructor() {
		this.group = new THREE.Group();
		
		this.woodMaterial = new THREE.MeshStandardMaterial({
			color: 0xC28E58,
			roughness: 1,
			flatShading: true
		});
		
		this.drawWoods();
	}
	
	drawWoods() {
		this._drawWoodTop();
		this._drawWoodBottom();
		this._drawWoodLeft();
		this._drawWoodRight();
	}
	
	_drawWoodTop() {
		const woodGeometry_top = new THREE.CylinderGeometry(.3, .4, 20, 5);
		const wood_top = new THREE.Mesh(woodGeometry_top, this.woodMaterial);
		wood_top.castShadow = true;
		wood_top.receiveShadow = true;
		wood_top.position.set(10, 5.3, 0);
		wood_top.rotation.z = -1.6;
		this.group.add(wood_top);
	}
	
	_drawWoodBottom() {
		const woodGeometry_bottom = new THREE.CylinderGeometry(.6, .5, 20, 5);
		const wood_bottom = new THREE.Mesh(woodGeometry_bottom, this.woodMaterial);
		wood_bottom.castShadow = true;
		wood_bottom.receiveShadow = true;
		wood_bottom.position.set(10, 3, 0);
		wood_bottom.rotation.z = -1.45;
		this.group.add(wood_bottom);
	}
	
	_drawWoodLeft() {
		const woodGeometry_left = new THREE.CylinderGeometry(.7, .3, 8, 4);
		const wood_left = new THREE.Mesh(woodGeometry_left, this.woodMaterial);
		wood_left.castShadow = true;
		wood_left.receiveShadow = true;
		wood_left.position.set(2, 3, -1);
		this.group.add(wood_left);
	}
	
	_drawWoodRight() {
		const woodGeometry_right = new THREE.CylinderGeometry(.7, .3, 8, 4);
		const wood_right = new THREE.Mesh(woodGeometry_right, this.woodMaterial);
		wood_right.castShadow = true;
		wood_right.receiveShadow = true;
		wood_right.position.set(17, 3, -1);
		this.group.add(wood_right);
	}
}

class Bonfire {
	constructor() {
		this.group = new THREE.Group();
		
		this.woodMaterial = new THREE.MeshStandardMaterial({
			color: 0xC28E58,
			roughness: 1
		});
		
		this.fireMaterial = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
			blending: THREE.AdditiveBlending,
			transparent: true
		})
		
		this.fire = this._drawFire();
		this.group.add(this.fire);
		
		this.animate();
		this.drawWoods();
	}
	
	animate() {
		TweenMax.to(this.fire.position, 1, {
      y: 1,
      repeat: Infinity,
      yoyo: true,
      ease: Sine.easeInOut
    });
		TweenMax.to(this.fire.rotation, 1, {
      y: Math.PI,
      repeat: Infinity,
      ease: Power0.easeNone
    });
	}
	
	drawWoods() {
		this._drawWoodLower();
		this._drawWoodMiddle();
		this._drawWoodHigher();
	}
	
	_drawWoodLower() {
		const woodGeometry_lower = new THREE.BoxGeometry(1.6, .7, 8);
		const wood_lower = new THREE.Mesh(woodGeometry_lower, this.woodMaterial);
		wood_lower.castShadow = true;
		wood_lower.receiveShadow = true;
		wood_lower.position.set(0, .7, 0);
		wood_lower.rotation.y = -.6;
		this.group.add(wood_lower);
	}
	
	_drawWoodMiddle() {
		const woodGeometry_middle = new THREE.CylinderGeometry(.3, .4, 10, 4);
		const wood_middle = new THREE.Mesh(woodGeometry_middle, this.woodMaterial);
		wood_middle.castShadow = true;
		wood_middle.receiveShadow = true;
		wood_middle.position.set(0, 1.5, 0);
		wood_middle.rotation.z = 1.72;
		this.group.add(wood_middle);
	}
	
	_drawWoodHigher() {
		const woodGeometry_higher = new THREE.BoxGeometry(1.3, .7, 8);
		const wood_higher = new THREE.Mesh(woodGeometry_higher, this.woodMaterial);
		wood_higher.castShadow = true;
		wood_higher.receiveShadow = true;
		wood_higher.position.set(0, 2.2, 0);
		wood_higher.rotation.y = .6;
		wood_higher.rotation.x = .4;
		this.group.add(wood_higher);
	}
	
	_drawFire() {
		const groupFire = new THREE.Group();
		
		const fireGeometry = new THREE.OctahedronBufferGeometry(1);
		const fire = new THREE.Mesh(fireGeometry, this.fireMaterial);
		getCustomColor(fireGeometry);
		fire.position.y = 5;
		groupFire.add(fire);
		
		const fireGeometry2 = new THREE.OctahedronBufferGeometry(1.5);
		const fire2 = new THREE.Mesh(fireGeometry2, this.fireMaterial);
		getCustomColor(fireGeometry2);
		fire2.position.y = 5;
		groupFire.add(fire2);
		
		const fireGeometry3 = new THREE.OctahedronBufferGeometry(2);
		const fire3 = new THREE.Mesh(fireGeometry3, this.fireMaterial);
		getCustomColor(fireGeometry3);
		fire3.position.y = 5;
		groupFire.add(fire3);
		
		return groupFire;
	}
}

class Stone {
	constructor() {
		this.group = new THREE.Group();
		
		this.stoneMaterial = new THREE.MeshStandardMaterial({
			color: 0xA69673,
			roughness: 1, 
			flatShading: true
		});
		
	}
}
class SmallStone extends Stone {
	constructor() {
		super();
		this.drawStone();
	}
	
	drawStone() {
		const stoneGeometry = new THREE.DodecahedronGeometry(Math.random(4), 0);
		const stone = new THREE.Mesh(stoneGeometry, this.stoneMaterial)
		stone.position.y = 1;
		stone.castShadow = true;
		this.group.add(stone);
	}
}
class BigStone extends Stone {
	constructor() {
		super();
		this.drawStones();
	}
	
	drawStones() {
		this._drawStone_1();
		this._drawStone_2();
		this._drawStone_3();
	}
	
	_drawStone_1() {
		const stoneGeometry = new THREE.SphereGeometry(5, 4, 2, 0, 6.3, 0, 1.6);
		const stone = new THREE.Mesh(stoneGeometry, this.stoneMaterial);
		stone.position.y = .3;
		stone.position.x = 25;
		stoneGeometry.vertices[0].y -= 1.5;
		stone.castShadow = true;
		this.group.add(stone);
	}
	
	_drawStone_2() {
		const stoneGeometry = new THREE.SphereGeometry(4, 4, 2, 0, 6.3, 0, 1.6);
		const stone = new THREE.Mesh(stoneGeometry, this.stoneMaterial);
		stone.position.y = .3;
		stone.position.x = -5;
		stone.position.z = -5;
		stoneGeometry.vertices[0].y -= .6;
		stoneGeometry.vertices[3].y += 1.2;
		stoneGeometry.vertices[4].y += 1.2;
		stone.castShadow = true;
		this.group.add(stone);
	}
	
	_drawStone_3() {
		const stoneGeometry = new THREE.SphereGeometry(6, 4, 2, 0, 6.3, 0, 1.8);
		const stone = new THREE.Mesh(stoneGeometry, this.stoneMaterial);
		stone.position.y = .6;
		stone.position.x = -25;
		stone.position.z = -25;
		stoneGeometry.vertices[0].y -= 1.6;
		stoneGeometry.vertices[2].y += 1.2;
		stoneGeometry.vertices[3].y += 1.2;
		stone.castShadow = true;
		this.group.add(stone);
	}
}

// update size canvas if window resize
const onWindowResize = () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
};

// change camera view if mouse move

function onDocumentMouseMove(event) {
	mouseX = (event.clientX - windowHalfX) / 100;
	mouseY = (event.clientY - windowHalfY) / 100;
}


init();
animate();