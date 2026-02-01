import * as THREE from 'three';
// Using the fix for the TWEEN import
import TWEEN from 'https://unpkg.com/three@0.160.0/examples/jsm/libs/tween.module.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

let scene, camera, renderer, controls;
const objects = [];
const targets = { table: [], sphere: [], helix: [], grid: [] };

// --- CONFIGURATION ---

// FIX 1: ONLY the ID, not the full URL
const SPREADSHEET_ID = '1jLxVctOwV6HW1oO1JkANMwtjaJCwrXfVnLhi2La8lUA'; 

// FIX 2: Use "Data Template" (your actual tab name) and go to Col F (Net Worth)
const RANGE = 'Data Template!A2:F'; 

const TOKEN = localStorage.getItem('accessToken');

init();

async function init() {
    const container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 3000;

    scene = new THREE.Scene();

    // 1. Fetch Data
    const data = await fetchData();
    
    // 2. Create Objects
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i]; 

            // FIX 3: CORRECT COLUMN MAPPING based on your screenshot
            // Col A [0] = Name
            // Col B [1] = Photo
            // Col D [3] = Country (using as ID)
            // Col F [5] = Net Worth

            const element = document.createElement('div');
            element.className = 'element';
            element.style.pointerEvents = 'none';

            // Color Logic (Net Worth is now at Index 5)
            const netWorthString = item[5] || "$0"; 
            const netWorth = parseInt(netWorthString.replace(/[^0-9.-]+/g,""));

            if (netWorth > 200000) element.style.backgroundColor = 'rgba(0,128,0,0.85)';
            else if (netWorth > 100000) element.style.backgroundColor = 'rgba(255,165,0,0.85)';
            else element.style.backgroundColor = 'rgba(255,0,0,0.85)';

            // Image (Column B -> Index 1)
            if(item[1]) {
                const img = document.createElement('img');
                img.src = item[1]; 
                element.appendChild(img);
            }

            // Name (Column A -> Index 0)
            const name = document.createElement('div');
            name.className = 'name';
            name.textContent = item[0]; 
            element.appendChild(name);

            // Details/Country (Column D -> Index 3)
            const details = document.createElement('div');
            details.className = 'details';
            details.textContent = item[3]; 
            element.appendChild(details);

            const object = new CSS3DObject(element);
            object.position.x = Math.random() * 4000 - 2000;
            object.position.y = Math.random() * 4000 - 2000;
            object.position.z = Math.random() * 4000 - 2000;
            scene.add(object);
            objects.push(object);
        }
    }

    // 3. Define Layouts
    createTableLayout();
    createSphereLayout();
    createDoubleHelixLayout();
    createGridLayout();

    // 4. Renderer
    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (container) {
        container.appendChild(renderer.domElement);
    } else {
        document.body.appendChild(renderer.domElement);
    }

    // 5. Controls
    controls = new TrackballControls(camera, renderer.domElement);
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    
    // 6. Buttons
    const buttonTable = document.getElementById('table');
    const buttonSphere = document.getElementById('sphere');
    const buttonHelix = document.getElementById('helix');
    const buttonGrid = document.getElementById('grid');

    if(buttonTable) buttonTable.addEventListener('click', () => transform(targets.table, 2000));
    if(buttonSphere) buttonSphere.addEventListener('click', () => transform(targets.sphere, 2000));
    if(buttonHelix) buttonHelix.addEventListener('click', () => transform(targets.helix, 2000));
    if(buttonGrid) buttonGrid.addEventListener('click', () => transform(targets.grid, 2000));

    transform(targets.table, 2000); 
    window.addEventListener('resize', onWindowResize);

    // FIX 4: Start animation last
    animate();
}

async function fetchData() {
    if (!TOKEN) {
        console.error("No Access Token found. Please login.");
        return [];
    }
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}`;
    try {
        const response = await fetch(url, { headers: { 'Authorization': `Bearer ${TOKEN}` } });
        const json = await response.json();
        
        if (json.error) {
            console.error("API Error:", json.error);
            return [];
        }
        return json.values || [];
    } catch (e) {
        console.error("Fetch failed:", e);
        return [];
    }
}

// --- LAYOUTS ---
function createTableLayout() {
    for (let i = 0; i < objects.length; i++) {
        const object = new THREE.Object3D();
        object.position.x = ( ( i % 20 ) * 140 ) - 1330;
        object.position.y = - ( Math.floor( i / 20 ) * 180 ) + 990;
        targets.table.push(object);
    }
}

function createDoubleHelixLayout() {
    const vector = new THREE.Vector3();
    for (let i = 0, l = objects.length; i < l; i++) {
        const phi = i * 0.175 + (i % 2) * Math.PI; 
        const object = new THREE.Object3D();
        object.position.setFromCylindricalCoords(900, phi, -(i * 8) + 450);
        vector.x = object.position.x * 2;
        vector.y = object.position.y;
        vector.z = object.position.z * 2;
        object.lookAt(vector);
        targets.helix.push(object);
    }
}

function createGridLayout() {
    for (let i = 0; i < objects.length; i++) {
        const object = new THREE.Object3D();
        object.position.x = ( ( i % 5 ) * 400 ) - 800;
        object.position.y = ( - ( Math.floor( i / 5 ) % 4 ) * 400 ) + 800;
        object.position.z = ( Math.floor( i / 20 ) * 1000 ) - 2000;
        targets.grid.push(object);
    }
}

function createSphereLayout() {
    const vector = new THREE.Vector3();
    for ( let i = 0, l = objects.length; i < l; i ++ ) {
        const phi = Math.acos( - 1 + ( 2 * i ) / l );
        const theta = Math.sqrt( l * Math.PI ) * phi;
        const object = new THREE.Object3D();
        object.position.setFromSphericalCoords( 800, phi, theta );
        vector.copy( object.position ).multiplyScalar( 2 );
        object.lookAt( vector );
        targets.sphere.push( object );
    }
}

function transform(targets, duration) {
    TWEEN.removeAll();
    for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        const target = targets[i];
        new TWEEN.Tween(object.position)
            .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
        new TWEEN.Tween(object.rotation)
            .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }
    new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(render)
        .start();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    if (controls) controls.update();
}

function render() {
    renderer.render(scene, camera);
}