
import * as THREE from "three";
import gsap from "gsap";   // 导入动画库

import * as dat from 'dat.gui';
const gui = new dat.GUI();

/****
 *  
 * 目标: 1. 加载进度
 *       2. loadingManager 管理加载器
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
camera.position.set(0,0,5)
scene.add(camera)


// 单张纹理的加载进度
let ev= {};
ev.onLoad = function () {
    console.log('图片加载完成');
} 
ev.onProgress = function (url,num,total) {
    console.log('图片加载进度',url,num,total);
} 
ev.onError = function () {
    console.log('图片加载失败');
} 

// 设置管理加载器
const  loadingManager  = new THREE.LoadingManager(
    ev.onLoad,
    ev.onProgress,
    ev.onError
)


// 导入纹理
const textureLoader = new THREE.TextureLoader(loadingManager);
const doorColorTextrue =   textureLoader.load('./textures/door/color.jpg');


const doorAlphaTextrue =   textureLoader.load('./textures/door/alpha.jpg');
// Ao环境遮挡贴图
const doorAoTextrue = textureLoader.load('./textures/door/ambientOcclusion.jpg');
// 导入置换贴图
const doorHeightTextrue = textureLoader.load('./textures/door/height.jpg');
// 导入粗糙度贴图
const roughnessTexTrue = textureLoader.load('./textures/door/roughness.jpg');
// 导入金属贴图
const metalnessTexTrue = textureLoader.load('./textures/door/metalness.jpg');
// 法线贴图
const normalTexTrue = textureLoader.load('./textures/door/normal.jpg')

//  添加物体
const cubeGeometry = new THREE.BoxBufferGeometry(1,1,1);
// 材质 
const standardMaterial = new THREE.MeshStandardMaterial({
    color:"#fff000",
    map: doorColorTextrue,
    alphaMap:doorAlphaTextrue,
    transparent:true,
    aoMap:doorAoTextrue,
    aoMapIntensity:1,
    displacementMap:doorHeightTextrue,  // 置换贴图
    displacementScale:0.05,  // 设置凸出程度 0~1
    roughness:1,
    roughnessMap:roughnessTexTrue,
    metalness:1,
    metalnessMap:metalnessTexTrue,
    normalMap:normalTexTrue

})

const cube = new THREE.Mesh(cubeGeometry,standardMaterial);
scene.add(cube);
// 给平面设置第二组uv
cubeGeometry.setAttribute('uv2', new THREE.BufferAttribute(cubeGeometry.attributes.uv.array,2))



// 增加灯光   环境光 ( 四面八方 )
const light = new THREE.AmbientLight(0xffffff,0.5);
scene.add(light);

// 直线光 ( 平行光 ) 
const directionalLight = new THREE.DirectionalLight(0xffffff,0.5);
// 光照射的位置
directionalLight.position.set(10,10,10)
scene.add(directionalLight);


// 添加平面
                                                    // 设置定点数量
const planeGeometry =  new THREE.PlaneBufferGeometry(1,1,200,200);

const  plane = new THREE.Mesh(
    planeGeometry,
    standardMaterial
)

// 给平面设置第二组uv
planeGeometry.setAttribute('uv2', new THREE.BufferAttribute(planeGeometry.attributes.uv.array,2))


plane.position.set(1,0,0)
scene.add(plane);


// 初始化渲染器
const  renderder = new THREE.WebGLRenderer();
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
