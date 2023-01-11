
import * as THREE from "three";
import gsap from "gsap";   // 导入动画库

import * as dat from 'dat.gui';
const gui = new dat.GUI();

/****
 *  
 * 目标: 1. 材质与纹理
 *       2. 纹理常用属性
 *       3. 纹理显示算法与mipmap
 *       4. 透明材质与透明纹理
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

// 导入纹理
const textureLoader = new THREE.TextureLoader();
const doorColorTextrue =   textureLoader.load('./textures/door/color.jpg');

const doorAlphaTextrue =   textureLoader.load('./textures/door/alpha.jpg');



console.log(doorColorTextrue)
// 常用属性
// 设置纹理偏移
// doorColorTextrue.offset.x= 0.5  //  0-1
// doorColorTextrue.offset.y= 0.5  //  0-1
// doorColorTextrue.offset.set(0.5,0.5);  //  0-1
// 设置旋转的中心点
// doorColorTextrue.center.set(0.5,0.5);
// // 纹理旋转
// doorColorTextrue.rotation = Math.PI / 4;
// 设置纹理的重复
/*
    wrapS/wrapT : 这个值定义了纹理贴图在水平方向上将如何包裹，在UV映射中对应于U
    默认值是THREE.ClampToEdgeWrapping，即纹理边缘将被推到外部边缘的纹素。
    其它的两个选项分别是
    1. THREE.RepeatWrapping(纹理将简单地重复到无穷大)
    2. THREE.MirroredRepeatWrapping(纹理将重复到无穷大，在每次重复时将进行镜像)
*/
// doorColorTextrue.repeat.set(2,3);
// doorColorTextrue.wrapS = THREE.RepeatWrapping;
// doorColorTextrue.wrapT = THREE.RepeatWrapping;

//  纹理显示设置
// doorColorTextrue.minFilter = THREE.NearestFilter;
// doorColorTextrue.magFilter = THREE.NearestFilter;
// doorColorTextrue.magFilter = THREE.LinearFilter;
// doorColorTextrue.minFilter = THREE.LinearFilter;


//  添加物体
const cubeGeometry = new THREE.BoxBufferGeometry(1,1,1);
// 材质 
const basicMaterial = new THREE.MeshBasicMaterial({
    color:"#fff000",
    map: doorColorTextrue,
    // alphaMap:doorAlphaTextrue,
    transparent:true,
    opacity:0.3,
    side:THREE.BackSide
})

const cube = new THREE.Mesh(cubeGeometry,basicMaterial);
scene.add(cube);

// 添加平面
const  plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1,1),
    basicMaterial
)



plane.position.set(3,0,0)
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
