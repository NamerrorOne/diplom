import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { DragControls } from 'three/addons/controls/DragControls.js';
import { RightPanel } from '../../RightPanel/RightPanel';
import style from './Canvas.module.css';

export const Canvas = () => {
  const clock = new THREE.Clock();
  const canvas = useRef();

  const [objects, setObjects] = useState([]);
  const [isActive, setIsActive] = useState({
    active: false,
    index: null,
  });

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      20
    );
    camera.position.z = 3;
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.current });
    renderer.setSize(window.innerWidth * 0.7, window.innerHeight * 0.7);
    renderer.render(scene, camera);

    //DRAG N DROP

    const dragControl = new DragControls(objects, camera, canvas.current);

    dragControl.addEventListener('dragstart', function (event) {
      const currentDraggbleObj = event.object;
      objects.forEach(obj => {
        if (obj.id === currentDraggbleObj.id) {
          setIsActive({
            active: true,
            index: obj.id,
          });
        }
      });
    });

    dragControl.addEventListener('dragend', function (event) {
      const currentDraggbleObj = event.object;
      objects.forEach(obj => {
        if (obj.id === currentDraggbleObj.id) {
          setIsActive({
            active: false,
            index: obj.id,
          });
        }
      });
    });

    function animate() {
      const deltaTime = clock.getDelta(); // Получаем разницу времени между кадрами

      objects.forEach(object => {
        scene.add(object);
      });

      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }, [objects]);

  function addObject(color, sizes) {
    const [height, top, bottom] = sizes;

    const addedGeometry = new THREE.CylinderGeometry(
      height,
      top,
      bottom,
      30,
      30
    );

    const addedMaterial = new THREE.MeshBasicMaterial({ color: color });
    const addedObject = new THREE.Mesh(addedGeometry, addedMaterial);
    setObjects(previous => [...previous, addedObject]);
  }

  return (
    <div className={style.wrapper}>
      <canvas ref={canvas}></canvas>
      <RightPanel
        activeInfo={isActive}
        objectsArray={objects}
        addingObjects={addObject}
      />
    </div>
  );
};
