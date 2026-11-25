import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface Props {
  modelUrl: string;
}

export default function FoodViewer3D({ modelUrl }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#2C2C2C');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xf5f0e8, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xc17b3f, 2.0);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x8b9e6e, 1.0);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    const pivot = new THREE.Group();
    scene.add(pivot);

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 1.8 / maxDim;
        gltf.scene.scale.setScalar(scale);
        gltf.scene.position.sub(center.multiplyScalar(scale));
        pivot.add(gltf.scene);
      },
      undefined,
      () => {
        const geometry = new THREE.TorusKnotGeometry(0.65, 0.22, 100, 16);
        const material = new THREE.MeshStandardMaterial({
          color: 0xc17b3f,
          roughness: 0.35,
          metalness: 0.2,
        });
        pivot.add(new THREE.Mesh(geometry, material));
      }
    );

    let isDragging = false;
    let prevX = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      prevX = e.clientX;
      pivot.rotation.y += dx * 0.01;
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        pivot.rotation.y += 0.004;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
    };
  }, [modelUrl]);

  return (
    <div className="relative w-full h-80 bg-[#2C2C2C] border border-[#E8E0D0] overflow-hidden">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <span className="absolute bottom-3 right-3 text-[10px] tracking-widest uppercase text-[#F5F0E8]/50 bg-[#2C2C2C]/80 px-2 py-1">
        Drag to rotate 3D view
      </span>
    </div>
  );
}
