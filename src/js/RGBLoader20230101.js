
import * as THREE from "three";
import gsap from "gsap";   // 导入动画库

import * as dat from 'dat.gui';
const gui = new dat.GUI();

import {RGBELoader} from  "three/examples/jsm/loaders/RGBELoader";
// 加载hdr环境图
const rgbeLoader = new RGBELoader();

// EquirectangularReflectionMapping 和 EquirectangularRefractionMapping 
// 用于等距圆柱投影的环境贴图，也被叫做经纬线映射贴图。
// 等距圆柱投影贴图表示沿着其水平中线360°的视角，以及沿着其垂直轴向180°的视角。
// 贴图顶部和底部的边缘分别对应于它所映射的球体的北极和南极。
rgbeLoader.loadAsync('./textures/hdr/002.hdr').then((texture)=>{
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;

})

/****
 *  
 * 目标: 1. 环境贴图
 *       2. 场景贴图与加载HDR图
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


// 设置  cube纹理加载器
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTExture =  cubeTextureLoader.load([
    './textures/environmentMaps/1/px.jpg',
    './textures/environmentMaps/1/nx.jpg',
    './textures/environmentMaps/1/py.jpg',
    './textures/environmentMaps/1/ny.jpg',
    './textures/environmentMaps/1/pz.jpg',
    './textures/environmentMaps/1/nz.jpg'
])

const sphereGeometry = new THREE.SphereBufferGeometry(1,20,20);
const material= new THREE.MeshStandardMaterial({
    metalness:0.7,
    roughness:0.1,
    // envMap:envMapTExture
});


const spher =  new THREE.Mesh(sphereGeometry,material);
scene.add(spher);

// 给场景添加背景
scene.background = envMapTExture;
// 给场景中所有的物体 默认添加环境贴图
scene.environment = envMapTExture;

// 增加灯光   环境光 ( 四面八方 )
const light = new THREE.AmbientLight(0xffffff,0.5);
scene.add(light);

// 直线光 ( 平行光 ) 
const directionalLight = new THREE.DirectionalLight(0xffffff,0.5);
// 光照射的位置
directionalLight.position.set(10,10,10)
scene.add(directionalLight);


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
