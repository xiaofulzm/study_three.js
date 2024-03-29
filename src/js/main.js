
import * as THREE from "three";
import gsap from "gsap";   // 导入动画库

import * as dat from 'dat.gui';
const gui = new dat.GUI();

/****
 *  
 *   目标: 点光源
 *       
 ****/

// 1. 导出轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 1. 创建场景
const scene = new THREE.Scene();

// 2. 创建相机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
);
// 设置相机位置
camera.position.set(0, 0, 10)
scene.add(camera)

// 球几何体
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, material);

sphere.castShadow = true;   // 设置物体投射阴影

scene.add(sphere);

// 平面
const planeGeometry = new THREE.PlaneBufferGeometry(50, 50);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;

plane.receiveShadow = true;  // 设置物体接收阴影

scene.add(plane)



// 增加灯光   环境光 ( 四面八方 )
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

// 点光源
const smallBall = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.1,20,20),
    new THREE.MeshBasicMaterial({color:0xff0000})
)
smallBall.position.set(2,2,2);

// 点光源
const pointLight = new THREE.PointLight(0xff0000,1);

pointLight.castShadow = true; // 设置光照投射阴影

// 设置阴影贴图的模糊度
pointLight.shadow.radius = 20;
// 设置阴影贴图的分辨率
pointLight.shadow.mapSize.set(512,512)

pointLight.decay = 0;

// 光照射的位置
// pointLight.position.set(2,2,2)
// scene.add(pointLight);

// 设置小球的点光源
smallBall.add(pointLight);
scene.add(smallBall);



gui
    .add(sphere.position, 'x')
    .min(-5)
    .max(5)
    .step(0.1)

gui
    .add(pointLight, 'distance')
    .min(0)
    .max(5)
    .step(0.001)


// 初始化渲染器
const renderder = new THREE.WebGLRenderer();

renderder.shadowMap.enabled = true; // 设置渲染器开启阴影的计算
renderder.physicallyCorrectLights = true; // 设置物理上正确的光照模式

// 设置渲染的尺寸大小
renderder.setSize(window.innerWidth, window.innerHeight)
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderder.domElement);

// // 使用渲染器, 通过相机将场景渲染进来
// renderder.render(scene,camera)


// 创建轨道控制器  
const controls = new OrbitControls(camera, renderder.domElement);
//  设置控制器阻尼
controls.enableDamping = true;



// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const clock = new THREE.Clock();


function render() {
    // 过去时钟运行的总时长
    let time = clock.getElapsedTime();
    smallBall.position.x = Math.sin(time)*3;
    smallBall.position.z = Math.cos(time)*3;
    smallBall.position.y = 2 + Math.sin(time);
  
    controls.update();
    renderder.render(scene, camera);
    requestAnimationFrame(render)
}
render();


// 监听浏览器窗口变化
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight; // 更新摄像机
    camera.updateProjectionMatrix(); //更新摄像机投影矩阵
    renderder.setSize(window.innerWidth, window.innerHeight); // 更新渲染器
    renderder.setPixelRatio(window.devicePixelRatio);  // 更新像素比
})


// 设置全屏  退出全屏
window.addEventListener("dblclick", () => {
    const fullsscreenElement = document.fullscreenElement; // 获取全屏元素
    console.log(fullsscreenElement)
    if (!fullsscreenElement) {
        renderder.domElement.requestFullscreen();  //  设置全屏
    } else {
        document.exitFullscreen();  // 退出全屏
    }

})
