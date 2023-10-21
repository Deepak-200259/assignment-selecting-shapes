import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import gsap from "gsap";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui: dat.GUI = new dat.GUI();

// Canvas
const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");

// Scene
const scene: THREE.Scene = new THREE.Scene();

//ObjectNames

const objectsNames: Record<string, string> = {
	CUBE: "Cube",
	CYLINDER: "Cylinder",
	ICOSAHEDRON: "Icosahedron",
};

//Folder Names
const folderNames: Record<string, string> = {
	lightsFolder: "Light Settings",
	ambientLightFolder: "Ambient Light Settings",
	directionalLightFolder: "Directional Light Settings",
	cubeFolder: "Cube Dimensions",
	cylinderFolder: "Cylinder Dimensions",
	icoSahedronFolder: "Icosahedron Dimensions",
};

/**
 * Lights
 */
const lightSettings: dat.GUI = gui.addFolder(folderNames.lightsFolder);
lightSettings.close();

// Ambient light
const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
lightSettings.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(
	0xffffff,
	0.5,
);
directionalLight.position.set(3, 2, 5);
lightSettings.add(directionalLight, "intensity").min(0).max(1).step(0.001);
lightSettings.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
lightSettings.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
lightSettings.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
scene.add(directionalLight);

/**
 * Objects
 */

//CUBE
let cubeGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
let cubeMaterial: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({
	color: 0xff0000,
});
let cube: THREE.Mesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.name = objectsNames.CUBE;
cube.position.x = -6;
scene.add(cube);

//CYLINDER
let cylinderGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
	0.5,
	0.5,
	1,
	128,
	10,
);
let cylinderMaterial: THREE.MeshStandardMaterial =
	new THREE.MeshStandardMaterial({ color: 0x00ff00 });
let cylinder: THREE.Mesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.name = objectsNames.CYLINDER;
scene.add(cylinder);

//ICOSAHEDRON
let icoSahedronGeometry: THREE.IcosahedronGeometry =
	new THREE.IcosahedronGeometry(1, 5);
let icoSahedronMaterial: THREE.MeshStandardMaterial =
	new THREE.MeshStandardMaterial({ color: 0x0000ff });
let icoSahedron: THREE.Mesh = new THREE.Mesh(
	icoSahedronGeometry,
	icoSahedronMaterial,
);
icoSahedron.name = objectsNames.ICOSAHEDRON;
icoSahedron.position.x = 6;
scene.add(icoSahedron);

/**
 * Sizes
 */
const sizes: { width: number; height: number } = {
	width: window.innerWidth,
	height: window.innerHeight,
};

//Handling Resizing of Screen Code

window.addEventListener("resize", (): void => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */

const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
	65,
	sizes.width / sizes.height,
	0.1,
	100,
);
camera.position.x = 0;
camera.position.y = 4;
camera.position.z = 10;
scene.add(camera);

// Controls

const controls: OrbitControls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const update = (): void => {
	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call update again on the next frame
	window.requestAnimationFrame(update);
};

update();

// Cube Settings

const setCubeSettings = (cube: THREE.Mesh): void => {
	const cubeFolder: dat.GUI = gui.addFolder(folderNames.cubeFolder);
	cubeFolder
		.add(cube.scale, "y", 0.1, 2)
		.name("Height")
		.onChange((value: number): void => {
			cube.scale.y = value;
		});

	cubeFolder
		.add(cube.scale, "x", 0.1, 2)
		.name("Width")
		.onChange((value: number): void => {
			cube.scale.x = value;
		});

	cubeFolder
		.add(cube.scale, "z", 0.1, 2)
		.name("Depth")
		.onChange((value: number): void => {
			cube.scale.z = value;
		});
};

// Cylinder Settings

const setCylinderSettings = (cylinder: THREE.Mesh): void => {
	const cylinderFolder: dat.GUI = gui.addFolder(folderNames.cylinderFolder);

	cylinderFolder.add(cylinder.scale, "y", 0.1, 2).name("Height");
	cylinderFolder
		.add(cylinder.geometry.parameters, "radiusTop", 0.1, 2)
		.name("Top Radius")
		.onChange((value: number): void => {
			// Update the top radius by changing the geometry
			const newGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
				value,
				cylinder.geometry.parameters.radiusBottom,
				cylinder.scale.y,
				16,
				1,
			);
			cylinder.geometry = newGeometry;
		});
	cylinderFolder
		.add(cylinder.geometry.parameters, "radiusBottom", 0.1, 2)
		.name("Bottom Radius")
		.onChange((value: number): void => {
			const newGeometry: THREE.CylinderGeometry = new THREE.CylinderGeometry(
				cylinder.geometry.parameters.radiusTop,
				value,
				cylinder.scale.y,
				16,
				1,
			);
			cylinder.geometry = newGeometry;
		});
};

// IcoSahedron Settings

const setIcosahedronSettings = (icoSahedron: THREE.Mesh): void => {
	const icosahedronSphere: dat.GUI = gui.addFolder(
		folderNames.icoSahedronFolder,
	);
	icosahedronSphere
		.add(icoSahedron.scale, "x", 0.1, 2)
		.name("Radius")
		.onChange((value: number): void => {
			icoSahedron.scale.set(value, value, value);
		});
	icosahedronSphere
		.add({ subdivisions: 5 }, "subdivisions", 1, 10, 1)
		.name("Subdivisions")
		.onChange((value: number): void => {
			// Update the number of subdivisions by creating a new geometry
			const newGeometry: THREE.IcosahedronGeometry =
				new THREE.IcosahedronGeometry(1, value);
			icoSahedron.geometry = newGeometry;
		});
};

// Removes Folders

const removeFolders = (): void => {
	for (let i = 0; i < gui.folders.length; i++) {
		if (gui.folders[i]._title === folderNames.cubeFolder) {
			gui.folders[i].destroy();
		} else if (gui.folders[i]._title === folderNames.cylinderFolder) {
			gui.folders[i].destroy();
		} else if (gui.folders[i]._title === folderNames.icoSahedronFolder) {
			gui.folders[i].destroy();
		}
	}
};

// Select Mesh
const addBorder = (mesh: THREE.Mesh) => {
	const outlineMaterial: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({
		color: 0x00ff00,
		side: THREE.BackSide,
		wireframe: true,
	});

	const outlineMesh: THREE.Mesh = new THREE.Mesh(
		mesh.geometry,
		outlineMaterial,
	);
	outlineMesh.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
	outlineMesh.scale.set(mesh.scale.x, mesh.scale.y, mesh.scale.z);
	outlineMesh.scale.multiplyScalar(1.05); // Slightly larger than the original mesh
	scene.add(outlineMesh);
	if (mesh.name === objectsNames.CUBE) {
		setCubeSettings(mesh);
	} else if (mesh.name === objectsNames.CYLINDER) {
		setCylinderSettings(mesh);
	} else if (mesh.name === objectsNames.ICOSAHEDRON) {
		setIcosahedronSettings(mesh);
	}
	return outlineMesh;
};

// Unselect Mesh

const removeBorder = (outlineMesh: THREE.Mesh): void => {
	setDefaultPosition();
	removeFolders();
	scene.remove(outlineMesh);
	outlineMesh.geometry.dispose();
	outlineMesh.material.dispose();
};

const setTweenAnimation = (mesh: THREE.Mesh) => {
	gsap.to(camera.position, {
		duration: 0.5,
		x: mesh.position.x,
		y: mesh.position.y + 0.5,
		z: mesh.position.z + 4.5,
		onUpdate: (): void => {
			camera.lookAt(mesh.position);
			controls.target = new THREE.Vector3(
				mesh.position.x,
				mesh.position.y,
				mesh.position.z,
			);
			// Update the camera's lookAt during the animation
		},
	});
};

const setDefaultPosition = (): void => {
	gsap.to(camera.position, {
		duration: 0.5,
		x: 0,
		y: 1,
		z: 12,
		onUpdate: (): void => {
			camera.lookAt(0, 0, 0); // Update the camera's lookAt during the animation
			controls.target = new THREE.Vector3(0, 0, 0);
		},
	});
};

// RayCaster Setup

const mouse: THREE.Vector2 = new THREE.Vector2();
const rayCaster: THREE.RayCaster = new THREE.Raycaster();
let selectedMesh: THREE.Mesh = null;
window.addEventListener("dblclick", (event: MouseEvent) => {
	// Calculate the mouse position in normalized device coordinates
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	// Update the picking ray
	rayCaster.setFromCamera(mouse, camera);

	// Find intersected objects
	const intersects: THREE.Intersection[] = rayCaster.intersectObjects(
		scene.children,
	);

	if (intersects.length > 0) {
		// If there is an intersection, select the first object
		const selectedObject: THREE.Object3D = intersects[0].object;

		if (selectedMesh !== null) {
			// If there was a previous selection, remove the border
			removeBorder(selectedMesh);
		}

		// Add a border to the selected mesh
		selectedMesh = addBorder(selectedObject);
		setTweenAnimation(selectedObject);
	} else if (selectedMesh !== null) {
		// If no mesh is clicked, but there was a previous selection, remove the border
		removeBorder(selectedMesh);
		selectedMesh = null;
	}
});
