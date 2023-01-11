
import * as THREE from "three";
import gsap from "gsap";   // 导入动画库

import * as dat from 'dat.gui';
const gui = new dat.GUI();

/****
 *  
 *   目标: 灯光与阴影
 *   灯光阴影
 *   1. 材质要满足能够对光照有反应
 *   2. 设置渲染器开启阴影的计算  renderer.shadowMap.enabled = true;
 *   3. 设置光照投射阴影   directionalLight.castShadow = true;
 *   4. 设置物体投射阴影 sphere.castShadow = true;
 *   5. 设置物体接收阴影 plane.receiveShadow = true;
 * 
 ****/ 

// 1. 导出轨道控制器
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

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

// 球几何体
const sphereGeometry = new THREE.SphereBufferGeometry(1,20,20);
const material = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry,material);

sphere.castShadow = true;   // 设置物体投射阴影

scene.add(sphere);

// 平面
const planeGeometry = new THREE.PlaneBufferGeometry(10,10);
const plane = new THREE.Mesh(planeGeometry,material);
plane.position.set(0,-1,0);
plane.rotation.x = -Math.PI / 2;

plane.receiveShadow = true;  // 设置物体接收阴影

scene.add(plane)



// 增加灯光   环境光 ( 四面八方 )
const light = new THREE.AmbientLight(0xffffff,0.5);
scene.add(light);

// 直线光 ( 平行光 ) 
const directionalLight = new THREE.DirectionalLight(0xffffff,0.5);

directionalLight.castShadow = true; // 设置光照投射阴影
// 光照射的位置

directionalLight.position.set(10,10,10)
scene.add(directionalLight);


// 初始化渲染器
const  renderder = new THREE.WebGLRenderer();

renderder.shadowMap.enabled = true; // 设置渲染器开启阴影的计算

// 设置渲染的尺寸大小
renderder.setSize(window.innerWidth,window.innerHeight)
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderder.domElement);

// // 使用渲染器, 通过相机将场景渲染进来
// renderder.render(scene,camera)


// 创建轨道控制器  
const controls = new OrbitControls(camera,renderder.domElement);
//  设置控制器阻尼
controls.enableDamping = true;



// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);





function render(){
    // 过去时钟运行的总时长
    // let time = clock.getElapsedTime();
    // let delta = clock.getDelta(); // 两次获取时间的间隔时间
    // let t = time % 5;
    // mesh.position.x = t * 1;

    // console.log(time,delta)
    controls.update();
    renderder.render(scene,camera);
    requestAnimationFrame(render)
}
render();


// 监听浏览器窗口变化
window.addEventListener("resize",()=>{
    camera.aspect = window.innerWidth / window.innerHeight; // 更新摄像机
    camera.updateProjectionMatrix(); //更新摄像机投影矩阵
    renderder.setSize(window.innerWidth,window.innerHeight); // 更新渲染器
    renderder.setPixelRatio(window.devicePixelRatio);  // 更新像素比
})


// 设置全屏  退出全屏
window.addEventListener("dblclick",()=>{
    const fullsscreenElement = document.fullscreenElement; // 获取全屏元素
    console.log(fullsscreenElement)
    if(!fullsscreenElement){
        renderder.domElement.requestFullscreen();  //  设置全屏
    }else{
        document.exitFullscreen();  // 退出全屏
    }

})
