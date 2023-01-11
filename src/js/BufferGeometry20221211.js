
import * as THREE from "three";
import gsap from "gsap";   // 导入动画库

import * as dat from 'dat.gui';
const gui = new dat.GUI();

/****
 *  
 * 目标: 1. 打造酷炫的三角形
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
    
// 3. 添加物体
//  创建几何体


for(let i=0; i<50;i++){
    // 每一个三角形, 需要3个顶点  每个顶点需要三个值
    const geometry = new THREE.BufferGeometry();
    const positionArray = new Float32Array(9);
    for(let j =0; j<9 ;j++){
        positionArray[j]  = Math.random()*10-5;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));

    let color = new THREE.Color(Math.random(),Math.random(),Math.random())
    const material = new THREE.MeshBasicMaterial({color,transparent:true,opacity:0.5});  // 材质
    const mesh = new THREE.Mesh(geometry,material);
    scene.add(mesh)

}

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
