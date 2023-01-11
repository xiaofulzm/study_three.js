
import * as THREE from "three";
import gsap from "gsap";   // 导入动画库

import * as dat from 'dat.gui';
const gui = new dat.GUI();

/****
 *  
 * 目标: 1. BufferGeometry   缓冲区几何体对象
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
const geometry = new THREE.BufferGeometry();

// 32位浮点数组
const vertices = new Float32Array([
    -1.0,-1.0,1.0,
    1.0,-1.0,1.0,
    1.0,1.0,1.0,
    1.0,1.0,1.0,
    -1.0,1.0,1.0,
    -1.0,-1.0,1.0,
]);

// 设置位置   一位数组   3个值为一个坐标
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
console.log(geometry)

const material = new THREE.MeshBasicMaterial({color:0xfff00});  // 材质

// 4. 根据几何体和材质创建物体
const mesh = new THREE.Mesh(geometry,material);

console.log(mesh)
// 修改物体的位置
// mesh.position.set(5,0,0)
// mesh.position.x = 3;
// 缩放
// mesh.scale.set(3,2,1);
// 旋转
// mesh.rotation.set(Math.PI,0,0);

// 5. 添加到场景中
scene.add(mesh)

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

// 设置时钟
const clock = new THREE.Clock();

// 设置动画 
// var animatel =   gsap.to(mesh.position,{x:5,duration:5,repeat:-1});
// gsap.to(mesh.rotation,
//     {
//         x:2*Math.PI,
//         duration:5,
//         ease:"power.inOut",
//         repeat:2, // 设置重复的次数   无限制循环 : -1
//         yoyo:true,  // 往返运动
//         delay:2, //  延迟两秒运动
//         onComplete:()=>{
//             console.log('动画完成了')
//         },
//         onStart:()=>{
//             console.log('动画开始了')
//         }
// });

// window.addEventListener("dblclick",()=>{
//     console.log(animatel)
//     // animatel.isActive() 动画状态
//     if(animatel.isActive()){
//         animatel.pause(); //暂停
//     }else{
//         animatel.resume();  //恢复
//     }
// });


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


// dat.gui  ui界面控制库
//控制物体移动
gui
    .add(mesh.position,"x")
    .min(0)
    .max(5)
    .step(0.01)
    .name("移动X轴坐标")
    .onChange((v)=>{
        console.log("值被修改了",v)
    }).onFinishChange((v)=>{
        console.log("停止修改",v)
    })

// 修改物体的颜色

const params = {
    color:"#ffffff",
    fn:()=>{
        // 执行动画
        gsap.to(mesh.position,{x:8,duration:2,yoyo:true,repeat:-1});
    }
}
//  设置颜色
gui.addColor(params,'color').onChange((e)=>{
    console.log(e)
    mesh.material.color.set(e);
})

gui.add(mesh,"visible").name("是否显示") //控制物体是否显示
// 设置按钮点击触发某个事件

// 创建文件夹
var folder = gui.addFolder("设置立方体");
folder.add(mesh.material,"wireframe");
folder.add(params,"fn").name("执行动画");
