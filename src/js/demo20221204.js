

import * as THREE from "three";

/****
 * 了解three.js基本的场景 
 * */ 


// 1. 创建场景
const scene =  new THREE.Scene();

// 2. 创建相机
const camera  =  new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
);
// 设置相机位置
camera.position.set(0,0,10)
scene.add(camera)
    
// 3. 添加物体
//  创建几何体
const cubeGeometry = new THREE.BoxGeometry(1,1,1);
const cubeMaterial = new THREE.MeshBasicMaterial({color:0xfff00});  // 材质

// 4. 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry,cubeMaterial);

// 5. 添加到场景中
scene.add(cube)

// 初始化渲染器
const  renderder = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderder.setSize(window.innerWidth,window.innerHeight)
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderder.domElement);

// 使用渲染器, 通过相机将场景渲染进来
renderder.render(scene,camera)

