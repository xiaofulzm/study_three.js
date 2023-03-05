// 照片转3D场景
import * as THREE from "three";

// 场景
const scene = new THREE.Scene();

// 相机  透视相机
const camera = new THREE.PerspectiveCamera(90,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.set(0,0,4);

//  渲染器
let renderder = new THREE.WebGLRenderer({antialias:true});
renderder.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderder.domElement);


// 加载纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/assets/build.jpg');
const depthTexture = textureLoader.load('/assets/build_depth.jpg');


console.log(texture,depthTexture);

// 创建平面
const geometry = new THREE.PlaneGeometry(19.2,12);
// 材质
// const material = new THREE.MeshBasicMaterial({map:texture});

// 鼠标位置
const mouse = new THREE.Vector2();

// 着色器材质
const material = new THREE.ShaderMaterial({
    uniforms:{
        // uTime: { value: 0 }, 自动
        uTexture:{value:texture},  // 图片
        uDepthTexture:{value:depthTexture}, // 深度图
        uMouse:{value:mouse},
    },
    // 顶点着色器
    vertexShader:`
        varying vec2 vUv;
        void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
    `,
    // 片源着色器
     // float x = vUv.x + (uMouse.x+sin(uTime))*0.01*depthValue;  // 自动 
            //float y = vUv.y + (uMouse.y+cos(uTime))*0.01*depthValue;
    fragmentShader:`
        uniform sampler2D uTexture;
        uniform sampler2D uDepthTexture;
        uniform vec2 uMouse;
        varying vec2 vUv;
        uniform float uTime;
        void main() {
            vec4 color = texture2D(uTexture,vUv);
            vec4 depth = texture2D(uDepthTexture,vUv);
            float depthValue = depth.r;
            float x = vUv.x + uMouse.x*0.01*depthValue;
            float y = vUv.y + uMouse.y*0.01*depthValue;
            vec4 newColor = texture2D(uTexture,vec2(x,y));
            gl_FragColor = newColor;
        }
    `
})

const plane = new THREE.Mesh(geometry,material);
scene.add(plane);

// 渲染
requestAnimationFrame(function animate(){
    material.uniforms.uMouse.value = mouse;
    // material.uniforms.uTime.value = performance.now() / 1000; // 自动
    requestAnimationFrame(animate);
    renderder.render(scene,camera);
})


window.addEventListener("mousemove",(e)=>{
    mouse.x = (e.clientX/window.innerWidth)*2-1;
    mouse.y = -(e.clientY/window.innerHeight)*2+1;
})