/**
 * People First Urgent Care - Splash Screen Animation
 * Advanced background animation for the welcome modal
 */

// Initialize Three.js animation for splash screen
function initSplashAnimation() {
    const container = document.getElementById('splash-animation');
    if (!container) return;

    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true
    });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Set camera position
    camera.position.z = 30;
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    
    const posArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    
    // Fill with random positions
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }
    
    // Fill with random scales
    for (let i = 0; i < particlesCount; i++) {
        scaleArray[i] = Math.random();
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    
    // Create material with custom shader
    const particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0x048749) } // People First green
        },
        vertexShader: `
            attribute float scale;
            uniform float time;
            
            void main() {
                vec3 pos = position;
                
                // Add some movement
                pos.x += sin(pos.y * 0.2 + time) * 0.5;
                pos.y += cos(pos.x * 0.2 + time) * 0.5;
                pos.z += sin(pos.z * 0.2 + time) * 0.5;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                
                gl_PointSize = scale * 2.0 * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            
            void main() {
                // Create a circular particle
                float r = distance(gl_PointCoord, vec2(0.5, 0.5));
                if (r > 0.5) discard;
                
                // Add a glow effect
                float glow = 0.5 - r;
                
                gl_FragColor = vec4(color, glow);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false
    });
    
    // Create particle system
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Animation loop
    const clock = new THREE.Clock();
    
    function animate() {
        if (!container.isConnected) return; // Stop animation if container is removed
        
        const elapsedTime = clock.getElapsedTime();
        
        // Update uniforms
        particlesMaterial.uniforms.time.value = elapsedTime * 0.5;
        
        // Rotate particle system
        particleSystem.rotation.x = elapsedTime * 0.05;
        particleSystem.rotation.y = elapsedTime * 0.03;
        
        // Render
        renderer.render(scene, camera);
        
        // Request next frame
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Handle resize
    function handleResize() {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    }
    
    window.addEventListener('resize', handleResize);
    
    // Return cleanup function
    return function cleanup() {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        container.removeChild(renderer.domElement);
    };
}
