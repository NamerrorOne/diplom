import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { DragControls } from 'three/addons/controls/DragControls.js';
import style from './Canvas.module.css';

const Canvas = () => {
  const canvas = useRef();
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  const [inputColor, setInputColor] = useState('');
  const [cylinderHeight, setCylinderHeight] = useState(1);
  const [threadColor, setThreadColor] = useState('');
  const handleThreadColorChange = event => {
    setThreadColor(event.target.value);
  };

  const handleHeightChange = event => {
    setCylinderHeight(parseFloat(event.target.value));
  };
  const handleColorChange = event => {
    setInputColor(event.target.value);
  };
  const renderer = new THREE.WebGLRenderer({ canvas: canvas.current });
  const material = new THREE.LineBasicMaterial({
    color: threadColor ?? 0xff0000,
    linewidth: 30,
  });
  const scene = new THREE.Scene();
  const [line, setLine] = useState(null);
  const [connectedPoints, setConnectedPoints] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false); // Состояние для отслеживания связывания объектов

  const connectPoints = (object1, object2) => {
    if (object1 !== null && object2 !== null) {
      const point1 = new THREE.Vector3().copy(object1.position);
      const point2 = new THREE.Vector3().copy(object2.position);

      const curve = new THREE.LineCurve3(point1, point2);
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const newLine = new THREE.Line(geometry, material);

      // Убедитесь, что правильно настроен текущий program перед добавлением линии в сцену
      renderer.render(scene, camera);

      scene.add(newLine);
      setLine(newLine);
      setConnectedPoints([point1, point2]);
    } else {
      console.error('Object is null');
    }
  };

  const clock = new THREE.Clock();

  const selectedObject = useRef(null);
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    camera.position.z = 5;

    renderer.setSize(window.innerWidth * 0.7, window.innerHeight * 0.7);
    renderer.render(scene, camera);

    const dragControl = new DragControls(objects, camera, canvas.current);
    dragControl.addEventListener('dragstart', event => {
      selectedObject.current = event.object;
    });
    dragControl.addEventListener('drag', event => {
      if (isConnecting && selectedObject.current) {
        const point1 = new THREE.Vector3().copy(
          selectedObject.current.position
        );
        const point2 = new THREE.Vector3().copy(event.object.position);

        const curve = new THREE.LineCurve3(point1, point2);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        if (line) {
          scene.remove(line);
        }

        const newLine = new THREE.Line(geometry, material);
        scene.add(newLine);
        setLine(newLine);
        setConnectedPoints([point1, point2]);

        renderer.render(scene, camera);
      }
    });

    const animate = () => {
      const deltaTime = clock.getDelta();
      objects.forEach(object => {
        scene.add(object);
      });
      if (line) {
        scene.add(line);
      }

      renderer.render(scene, camera);

      requestAnimationFrame(animate);
    };
    animate();

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [objects, line]);

  const handleKeyPress = event => {
    if (!selectedObject.current) return;
    const step = 0.1;
    const { keyCode } = event;
    switch (keyCode) {
      case 37: // Left arrow key
        selectedObject.current.rotation.z -= step;
        break;
      case 39: // Right arrow key
        selectedObject.current.rotation.z += step;
        break;
      case 38: // Up arrow key
        selectedObject.current.rotation.y += step;
        break;
      case 40: // Down arrow key
        selectedObject.current.rotation.y -= step;
        break;
      default:
        break;
    }
  };

  const handleAddObject = sizes => {
    if (objects.length < 2) {
      const [height, top, bottom] = sizes;
      const addedGeometry = new THREE.CylinderGeometry(
        top,
        bottom,
        height,
        30,
        30
      );
      const addedMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(inputColor),
      });
      const addedObject = new THREE.Mesh(addedGeometry, addedMaterial);

      setObjects(previous => [...previous, addedObject]);
    }
  };

  const handleConnectObjects = () => {
    if (objects.length === 2) {
      connectPoints(objects[0], objects[1]);
      console.log('Start Point:', connectedPoints[0]);
      console.log('End Point:', connectedPoints[1]);
    }
  };

  return (
    <div className={style.wrapper}>
      <canvas ref={canvas}></canvas>
      <input
        type='text'
        value={inputColor}
        onChange={handleColorChange}
        placeholder='Enter color'
      />
      <button onClick={() => handleAddObject([cylinderHeight, 0.5, 0.5])}>
        Add Cylinder
      </button>
      <button onClick={handleConnectObjects}>Connect Objects</button>
      <input
        type='number'
        value={cylinderHeight}
        onChange={handleHeightChange}
        placeholder='Enter height'
      />
      <input
        type='text'
        value={threadColor}
        onChange={handleThreadColorChange}
        placeholder='Enter thread color'
      />
      <div className={style.info}>
        Start Point:{' '}
        {connectedPoints[0] && connectedPoints[0].toArray().join(', ')}
      </div>
      <div className={style.info}>
        End Point:{' '}
        {connectedPoints[connectPoints.length - 1] &&
          connectedPoints[connectPoints.length - 1].toArray().join(', ')}
      </div>
      ;
    </div>
  );
};
export default Canvas;
