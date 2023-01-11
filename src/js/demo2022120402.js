
import * as THREE from "three";
import gsap from "gsap";   // 导入动画库


/****
 *  
 * 目标: 1. 控制3d物体的移动
 *       2. 控制物体的缩放
 *       3. 跟踪时间clock
 *       4. 掌握gsap设置动画效果
 *          
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
const cubeGeometry = new THREE.BoxGeometry(2,2,2);
const cubeMaterial = new THREE.MeshBasicMaterial({color:0xfff00});  // 材质

// 4. 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry,cubeMaterial);

console.log(cube)
// 修改物体的位置
// cube.position.set(5,0,0)
// cube.position.x = 3;
// 缩放
// cube.scale.set(3,2,1);
// 旋转
// cube.rotation.set(Math.PI,0,0);

// 5. 添加到场景中
scene.add(cube)

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


// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 设置时钟
const clock = new THREE.Clock();

// 设置动画 
var animatel =   gsap.to(cube.position,{x:5,duration:5,repeat:-1});
gsap.to(cube.rotation,
    {
        x:2*Math.PI,
        duration:5,
        ease:"power.inOut",
        repeat:2, // 设置重复的次数   无限制循环 : -1
        yoyo:true,  // 往返运动
        delay:2, //  延迟两秒运动
        onComplete:()=>{
            console.log('动画完成了')
        },
        onStart:()=>{
            console.log('动画开始了')
        }
});

window.addEventListener("dblclick",()=>{
    console.log(animatel)
    // animatel.isActive() 动画状态
    if(animatel.isActive()){
        animatel.pause(); //暂停
    }else{
        animatel.resume();  //恢复
    }
});


function render(){
    // 过去时钟运行的总时长
    // let time = clock.getElapsedTime();
    // let delta = clock.getDelta(); // 两次获取时间的间隔时间
    // let t = time % 5;
    // cube.position.x = t * 1;

    // console.log(time,delta)
    renderder.render(scene,camera);
    requestAnimationFrame(render)
}
render();
