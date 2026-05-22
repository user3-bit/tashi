/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. Navigation & Scroll Handlers
  // -------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const heroHeading = document.querySelector('header h1');
  const heroBadge = document.querySelector('header .inline-block.mb-4');
  const heroParagraph = document.querySelector('header p');

  window.addEventListener('scroll', () => {
    // Navbar visual style translation
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.replace('bg-transparent', 'bg-[#F9F8F4]/90');
        navbar.classList.add('backdrop-blur-md', 'shadow-sm', 'py-4');
        navbar.classList.remove('py-6');
      } else {
        navbar.classList.replace('bg-[#F9F8F4]/90', 'bg-transparent');
        navbar.classList.remove('backdrop-blur-md', 'shadow-sm', 'py-4');
        navbar.classList.add('py-6');
      }
    }

    // Horizontal reading progress depth
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;
    if (scrollProgressBar) {
      scrollProgressBar.style.transform = `scaleX(${scrollPercent})`;
    }
  });

  // Smooth multi-layered typography depth parallax relative to mouse position
  window.addEventListener('mousemove', (e) => {
    const xRatio = (e.clientX / window.innerWidth - 0.5);
    const yRatio = (e.clientY / window.innerHeight - 0.5);

    if (heroHeading) {
      heroHeading.style.transform = `translate3d(${xRatio * 16}px, ${yRatio * 16}px, 0px) rotateY(${xRatio * 3}deg) rotateX(${-yRatio * 3}deg)`;
    }
    if (heroBadge) {
      heroBadge.style.transform = `translate3d(${xRatio * 24}px, ${yRatio * 24}px, 0px)`;
    }
    if (heroParagraph) {
      heroParagraph.style.transform = `translate3d(${xRatio * 10}px, ${yRatio * 10}px, 0px)`;
    }
  });

  // Mobile menu toggle
  function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
    hamburgerIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
  }

  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  // Smooth scroll with header offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close mobile menu if open
      if (!mobileMenu.classList.contains('hidden')) {
        toggleMobileMenu();
      }

      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerOffset = 100;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // -------------------------------------------------------------
  // 2. Interactive Surface Code Diagram
  // -------------------------------------------------------------
  const errors = new Set();
  const adjacency = {
    0: [0, 1],       // D0 affects Z-Check(0), X-Check(1)
    1: [0, 2],       // D1 affects Z-Check(0), X-Check(2)
    4: [0, 1, 2, 3], // D4 (Center) affects all stabilizers
    2: [1, 3],       // D2 affects X-Check(1), Z-Check(3)
    3: [2, 3]        // D3 affects X-Check(2), Z-Check(3)
  };

  const dataQubits = [0, 1, 2, 3, 4];
  const stabilizers = [0, 1, 2, 3];

  function updateSurfaceCode() {
    const activeStabs = [];

    // Calculate stabilizer parities
    stabilizers.forEach(s => {
      let errorCount = 0;
      dataQubits.forEach(d => {
        if (errors.has(d) && adjacency[d].includes(s)) {
          errorCount++;
        }
      });
      
      const isActive = errorCount % 2 !== 0;
      const stabElement = document.getElementById(`stab-${s}`);
      const colorClass = (s === 0 || s === 3) ? 'bg-blue-500' : 'bg-red-500';

      if (isActive) {
        stabElement.classList.remove('bg-stone-300', 'opacity-40');
        stabElement.classList.add(colorClass, 'opacity-100', 'scale-110', 'ring-4', 'ring-offset-2', 'ring-stone-200', 'shadow-md');
        activeStabs.push(s);
      } else {
        stabElement.classList.remove(colorClass, 'opacity-100', 'scale-110', 'ring-4', 'ring-offset-2', 'ring-stone-200', 'shadow-md');
        stabElement.classList.add('bg-stone-300', 'opacity-40');
      }
    });

    // Update qubit rendering states
    dataQubits.forEach(d => {
      const qElement = document.getElementById(`data-${d}`);
      if (errors.has(d)) {
        qElement.classList.remove('bg-white', 'border-stone-300');
        qElement.classList.add('bg-stone-800', 'border-stone-900', 'text-[#C5A059]');
        qElement.innerHTML = `
          <svg class="w-[18px] h-[18px] text-nobel-gold animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        `;
      } else {
        qElement.classList.remove('bg-stone-800', 'border-stone-900', 'text-[#C5A059]');
        qElement.classList.add('bg-white', 'border-stone-300');
        qElement.innerHTML = '';
      }
    });

    // Update indicator diagnostic text banner
    const statusText = document.getElementById('surface-status');
    if (errors.size === 0) {
      statusText.innerText = "System is stable.";
    } else {
      statusText.innerText = `Detected ${activeStabs.length} parity violations.`;
    }
  }

  // Hook interactive listeners with absolute placed signal ripples
  const surfaceGridContainer = document.getElementById('surface-grid-container');

  dataQubits.forEach(d => {
    const qElement = document.getElementById(`data-${d}`);
    qElement.addEventListener('click', () => {
      if (errors.has(d)) {
        errors.delete(d);
      } else {
        errors.add(d);
      }

      // Generate signal waves on parent board grid
      if (surfaceGridContainer) {
        const rect = qElement.getBoundingClientRect();
        const parentRect = surfaceGridContainer.getBoundingClientRect();
        const rippleX = rect.left - parentRect.left + rect.width / 2;
        const rippleY = rect.top - parentRect.top + rect.height / 2;

        const rip = document.createElement('div');
        rip.className = "quantum-ripple-effect";
        rip.style.left = `${rippleX}px`;
        rip.style.top = `${rippleY}px`;
        
        surfaceGridContainer.appendChild(rip);
        setTimeout(() => rip.remove(), 700);
      }

      updateSurfaceCode();
    });
  });


  // -------------------------------------------------------------
  // 3. Transformer Decoder Architectural Animator
  // -------------------------------------------------------------
  let activeStep = 0;
  function updateTransformerDiagram() {
    const p0 = document.getElementById('step-0-panel');
    const p1 = document.getElementById('step-1-panel');
    const p2 = document.getElementById('step-2-panel');
    const arr1 = document.getElementById('arrow-1');
    const arr2 = document.getElementById('arrow-2');
    const cpu = document.getElementById('cpu-icon');
    const scan = document.getElementById('scanner-line');
    const corr = document.getElementById('correction-text');
    
    // Reset standard styles using setAttribute('class') for SVG & DOM compatibility
    p0.setAttribute('class', "flex flex-col items-center gap-2 p-2 rounded-lg border-2 border-stone-200 bg-stone-50 transition-all duration-500");
    p1.setAttribute('class', "flex flex-col items-center gap-2 p-2 rounded-xl border-2 border-stone-200 bg-stone-50 transition-all duration-500 relative overflow-hidden");
    p2.setAttribute('class', "flex flex-col items-center gap-2 p-2 rounded-lg border-2 border-stone-200 bg-stone-50 transition-all duration-500");
    
    arr1.setAttribute('class', "text-stone-400 text-xl font-bold transition-all duration-300 opacity-30 select-none");
    arr2.setAttribute('class', "text-stone-400 text-xl font-bold transition-all duration-300 opacity-30 select-none");
    cpu.setAttribute('class', "w-8 h-8 text-stone-300 transition-colors duration-500");
    scan.setAttribute('class', "absolute w-full h-[1.5px] bg-[#C5A059] left-0 scale-x-0 transition-transform duration-300");
    corr.setAttribute('class', "text-2xl font-serif font-bold text-stone-300 transition-all duration-500");
    corr.innerText = "?";
    
    if (activeStep === 0) {
      p0.setAttribute('class', "flex flex-col items-center gap-2 p-2 rounded-lg border-2 border-[#C5A059] bg-[#C5A059]/10 transition-all duration-500 shadow-sm");
    } else if (activeStep === 1) {
      p0.setAttribute('class', "flex flex-col items-center gap-2 p-2 rounded-lg border-2 border-stone-300 bg-stone-100 transition-all duration-500");
      p1.setAttribute('class', "flex flex-col items-center gap-2 p-2 rounded-xl border-2 border-stone-800 bg-stone-900 text-white transition-all duration-500 shadow-md");
      arr1.setAttribute('class', "text-[#C5A059] text-xl font-bold transition-all duration-300 opacity-100 scale-110 translate-x-0.5 select-none");
      cpu.setAttribute('class', "w-8 h-8 text-[#C5A059] animate-pulse");
      scan.setAttribute('class', "absolute w-full h-[1.5px] bg-[#C5A059] left-0 scale-x-100 transition-transform duration-700 animate-pulse");
    } else if (activeStep === 2) {
      p0.setAttribute('class', "flex flex-col items-center gap-2 p-2 rounded-lg border-2 border-stone-300 bg-stone-100 transition-all duration-500");
      p1.setAttribute('class', "flex flex-col items-center gap-2 p-2 rounded-xl border-2 border-stone-800 bg-stone-900 text-white transition-all duration-500 shadow-md");
      arr1.setAttribute('class', "text-[#C5A059] text-xl font-bold transition-all duration-300 opacity-100 select-none");
      arr2.setAttribute('class', "text-stone-400 text-xl font-bold transition-all duration-300 opacity-100 select-none");
      cpu.setAttribute('class', "w-8 h-8 text-[#C5A059]");
    } else if (activeStep === 3) {
      p0.setAttribute('class', "flex flex-col items-center gap-2 p-2 rounded-lg border-2 border-stone-200 bg-stone-100 transition-all duration-500");
      p1.setAttribute('class', "flex flex-col items-center gap-2 p-2 rounded-xl border-2 border-stone-200 bg-stone-100 transition-all duration-500 text-stone-400");
      p2.setAttribute('class', "flex flex-col items-center gap-2 p-2 rounded-lg border-2 border-green-500 bg-green-50 transition-all duration-500 shadow-sm");
      arr1.setAttribute('class', "text-stone-300 text-xl font-bold transition-all duration-300 opacity-50 select-none");
      arr2.setAttribute('class', "text-green-500 text-xl font-bold transition-all duration-300 opacity-100 scale-110 translate-x-0.5 select-none");
      corr.setAttribute('class', "text-2xl font-serif font-bold text-green-600 scale-110 duration-500");
      corr.innerText = "X";
    }

    // Update progress indicator dots
    for (let i = 0; i < 4; i++) {
      const dot = document.getElementById(`dot-${i}`);
      if (i === activeStep) {
        dot.setAttribute('class', "h-1.5 rounded-full transition-all duration-300 w-8 bg-[#C5A059]");
      } else {
        dot.setAttribute('class', "h-1.5 rounded-full transition-all duration-300 w-2 bg-stone-300");
      }
    }
  }

  // Tick the architecture states
  setInterval(() => {
    activeStep = (activeStep + 1) % 4;
    updateTransformerDiagram();
  }, 2300);


  // -------------------------------------------------------------
  // 4. Performance Comparative Chart
  // -------------------------------------------------------------
  const chartData = {
    3: { mwpm: 3.5, alpha: 2.9 },
    5: { mwpm: 3.6, alpha: 2.75 },
    11: { mwpm: 0.0041, alpha: 0.0009 }
  };

  function selectDistance(d) {
    const data = chartData[d];
    
    // Reset buttons styles
    [3, 5, 11].forEach(dist => {
      const btn = document.getElementById(`btn-dist-${dist}`);
      if (dist === d) {
        btn.className = "px-3 py-1.5 rounded text-sm font-semibold transition-all duration-200 border bg-[#C5A059] text-stone-900 border-[#C5A059] focus:outline-none";
      } else {
        btn.className = "px-3 py-1.5 rounded text-sm font-semibold transition-all duration-200 border bg-transparent text-stone-400 border-stone-700 hover:border-stone-500 hover:text-stone-200 focus:outline-none";
      }
    });

    // Compute dynamic proportions relative to scaling thresholds
    let heightStandardRatio, heightAlphaRatio;
    if (d === 11) {
      const maxVal = 0.005; 
      heightStandardRatio = (data.mwpm / maxVal) * 100;
      heightAlphaRatio = (data.alpha / maxVal) * 100;
    } else {
      const maxVal = 4.5;
      heightStandardRatio = (data.mwpm / maxVal) * 100;
      heightAlphaRatio = (data.alpha / maxVal) * 100;
    }

    // Constrain heights within reasonable bounds
    heightStandardRatio = Math.max(3, heightStandardRatio);
    heightAlphaRatio = Math.max(3, heightAlphaRatio);

    // Apply values to standard label & bar height
    const stdLbl = document.getElementById('ler-standard-lbl');
    const stdBar = document.getElementById('ler-standard-bar');
    stdLbl.innerText = d === 11 ? '0.0041%' : `${data.mwpm.toFixed(2)}%`;
    stdBar.style.height = `${heightStandardRatio}%`;

    // Apply values to AlphaQubit label & bar height
    const alphaLbl = document.getElementById('ler-alpha-lbl');
    const alphaBar = document.getElementById('ler-alpha-bar');
    alphaLbl.innerText = d === 11 ? '0.0009%' : `${data.alpha.toFixed(2)}%`;
    alphaBar.style.height = `${heightAlphaRatio}%`;
  }

  // Setup click listeners for Distance Chart Bars
  document.getElementById('btn-dist-3').addEventListener('click', () => selectDistance(3));
  document.getElementById('btn-dist-5').addEventListener('click', () => selectDistance(5));
  document.getElementById('btn-dist-11').addEventListener('click', () => selectDistance(11));


  // -------------------------------------------------------------
  // 5. Dual ThreeJS responsive Viewports (Hero + Chandelier)
  // -------------------------------------------------------------
  if (typeof THREE !== 'undefined') {
    
    // --- CANVAS SIZING HELPERS using ResizeObservers ---
    function setupCanvasResize(canvas, camera, renderer, customResizeCall) {
      const container = canvas.parentElement;
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const width = entry.contentRect.width || container.clientWidth;
          const height = entry.contentRect.height || container.clientHeight;
          
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

          if (customResizeCall) customResizeCall(width, height);
        }
      });
      resizeObserver.observe(container);
    }

    // --- HERO 3D PARTICLE FLOATING CANVAS ---
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
      const heroScene = new THREE.Scene();
      const heroCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      heroCamera.position.z = 6;

      const heroRenderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
      setupCanvasResize(heroCanvas, heroCamera, heroRenderer);

      // Light setup
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.53);
      heroScene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1.2);
      pointLight.position.set(10, 10, 10);
      heroScene.add(pointLight);

      // Floating central particle
      const mainGeo = new THREE.SphereGeometry(1, 32, 32);
      const mainMat = new THREE.MeshStandardMaterial({
        color: 0x4F46E5,
        roughness: 0.15,
        metalness: 0.45,
        flatShading: false
      });
      const mainMesh = new THREE.Mesh(mainGeo, mainMat);
      heroScene.add(mainMesh);

      // Wireframe macroscopic resonance wave
      const waveGeo = new THREE.TorusGeometry(3, 0.05, 16, 100);
      const waveMat = new THREE.MeshStandardMaterial({
        color: 0xC5A059,
        emissive: 0xC5A059,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.6,
        wireframe: true
      });
      const waveMesh = new THREE.Mesh(waveGeo, waveMat);
      waveMesh.rotation.x = Math.PI / 2;
      heroScene.add(waveMesh);

      // Secondary floating satellite particles
      const satellite1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x9333EA, roughness: 0.2, metalness: 0.5 })
      );
      satellite1.position.set(-3, 1, -2);
      heroScene.add(satellite1);

      const satellite2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xC5A059, roughness: 0.2, metalness: 0.5 })
      );
      satellite2.position.set(3, -1, -3);
      heroScene.add(satellite2);

      // Stars background point simulation
      const starsCount = 600;
      const starsGeometry = new THREE.BufferGeometry();
      const positions = [];
      for (let i = 0; i < starsCount; i++) {
        positions.push((Math.random() - 0.5) * 45); // x
        positions.push((Math.random() - 0.5) * 45); // y
        positions.push((Math.random() - 0.5) * 30 - 15); // z
      }
      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      const starsMaterial = new THREE.PointsMaterial({ color: 0x9c9c9c, size: 0.05, sizeAttenuation: true });
      const starPoints = new THREE.Points(starsGeometry, starsMaterial);
      heroScene.add(starPoints);

      // Animation ticking with mouse camera shift depth
      let clock = new THREE.Clock();
      let heroMouseX = 0;
      let heroMouseY = 0;

      window.addEventListener('mousemove', (e) => {
        heroMouseX = (e.clientX / window.innerWidth - 0.5) * 2.0;
        heroMouseY = (e.clientY / window.innerHeight - 0.5) * 2.0;
      });

      function animateHero() {
        const t = clock.getElapsedTime();
        
        mainMesh.position.y = Math.sin(t * 1.5) * 0.18;
        mainMesh.rotation.x = t * 0.4;
        mainMesh.rotation.z = t * 0.2;

        // Camera smoothly floats with a subtle delay (inertia) in response to mouse
        heroCamera.position.x += (heroMouseX * 0.6 - heroCamera.position.x) * 0.04;
        heroCamera.position.y += (-heroMouseY * 0.6 - heroCamera.position.y) * 0.04;
        heroCamera.lookAt(mainMesh.position);

        waveMesh.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.15;
        waveMesh.rotation.y = t * 0.08;

        satellite1.position.y = 1 + Math.sin(t * 2.2) * 0.15;
        satellite2.position.y = -1 + Math.sin(t * 1.8) * 0.2;

        heroRenderer.render(heroScene, heroCamera);
        requestAnimationFrame(animateHero);
      }
      animateHero();
    }


    // --- QUANTUM REFRIGERATOR CHANDELIER 3D SIMULATOR ---
    const quantumCanvas = document.getElementById('quantum-canvas');
    if (quantumCanvas) {
      const quantumScene = new THREE.Scene();
      const quantumCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      quantumCamera.position.set(0, 0.4, 4.2);

      // Dedicated clock for quantum visualization
      const quantumClock = new THREE.Clock();

      // Renderer setup
      const quantumRenderer = new THREE.WebGLRenderer({ canvas: quantumCanvas, alpha: true, antialias: true });
      setupCanvasResize(quantumCanvas, quantumCamera, quantumRenderer);

      // Lighting of the refrigerator
      const ampLight = new THREE.AmbientLight(0xffffff, 0.82);
      quantumScene.add(ampLight);

      const spotLight = new THREE.SpotLight(0xC5A059, 2.5);
      spotLight.position.set(5, 5, 5);
      spotLight.angle = 0.35;
      spotLight.penumbra = 1;
      quantumScene.add(spotLight);

      const fillLight = new THREE.PointLight(0xffffff, 0.4);
      fillLight.position.set(-5, -5, -5);
      quantumScene.add(fillLight);

      // Group to rotate interactive structure
      const chandelier = new THREE.Group();
      chandelier.position.y = 0.35;
      quantumScene.add(chandelier);

      // Shiny Gold and Silver Gold material models
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xC5A059,
        metalness: 0.95,
        roughness: 0.12
      });
      const silverMat = new THREE.MeshStandardMaterial({
        color: 0xD1D5DB,
        metalness: 0.85,
        roughness: 0.18
      });
      const copperMat = new THREE.MeshStandardMaterial({
        color: 0xB87333,
        metalness: 0.9,
        roughness: 0.22
      });

      // Plates Cylinders
      // Plate 1: top
      const p1 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.08, 64), goldMat);
      p1.position.y = 1.0;
      chandelier.add(p1);

      // Plate 2: central stage
      const p2 = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.08, 64), goldMat);
      p2.position.y = 0.2;
      chandelier.add(p2);

      // Plate 3: bottom mixing
      const p3 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.08, 64), goldMat);
      p3.position.y = -0.6;
      chandelier.add(p3);

      // Upper stage connecting columns (Silver rods)
      const r1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16), silverMat);
      r1.position.set(0.5, 0.6, 0);
      chandelier.add(r1);

      const r2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16), silverMat);
      r2.position.set(-0.5, 0.6, 0);
      chandelier.add(r2);

      const r3 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16), silverMat);
      r3.position.set(0, 0.6, 0.5);
      chandelier.add(r3);

      const r4 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16), silverMat);
      r4.position.set(0, 0.6, -0.5);
      chandelier.add(r4);

      // Lower stage rods
      const r5 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 16), silverMat);
      r5.position.set(0.2, -0.2, 0);
      chandelier.add(r5);

      const r6 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 16), silverMat);
      r6.position.set(-0.2, -0.2, 0);
      chandelier.add(r6);

      // Copper coiled loops
      const coil1 = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.015, 16, 64), copperMat);
      coil1.position.y = -0.2;
      coil1.rotation.x = Math.PI / 2;
      chandelier.add(coil1);

      const coil2 = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.015, 16, 64), copperMat);
      coil2.position.y = -1.0;
      coil2.rotation.x = Math.PI / 2;
      chandelier.add(coil2);

      // Dark processing processor chip center piece
      const chipMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.1
      });
      const chip = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.2), chipMat);
      chip.position.y = -0.7;
      chandelier.add(chip);

      // Mouse drag physics inertial spin controls
      let isDragging = false;
      let prevPointerX = 0;
      let rotVelocityY = 0.006;
      const baseSpinRate = 0.006;

      quantumCanvas.style.cursor = 'grab';

      quantumCanvas.addEventListener('pointerdown', (e) => {
        isDragging = true;
        quantumCanvas.style.cursor = 'grabbing';
        prevPointerX = e.clientX;
        quantumCanvas.setPointerCapture(e.pointerId);
      });

      quantumCanvas.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevPointerX;
        prevPointerX = e.clientX;
        
        rotVelocityY = deltaX * 0.007;
        chandelier.rotation.y += rotVelocityY;
      });

      quantumCanvas.addEventListener('pointerup', (e) => {
        if (isDragging) {
          isDragging = false;
          quantumCanvas.style.cursor = 'grab';
          quantumCanvas.releasePointerCapture(e.pointerId);
        }
      });

      // Render loops incorporating inertia deceleration momentum decay
      function animateQuantum() {
        const elapsed = quantumClock.getElapsedTime();
        
        if (!isDragging) {
          // Slow momentum decay back to constant background spinrate
          rotVelocityY += (baseSpinRate - rotVelocityY) * 0.035;
          chandelier.rotation.y += rotVelocityY;
        }

        // Ambient hovering float resonance up/down physics
        chandelier.position.y = 0.35 + Math.sin(elapsed * 1.1) * 0.032;

        quantumRenderer.render(quantumScene, quantumCamera);
        requestAnimationFrame(animateQuantum);
      }
      animateQuantum();
    }
  }

});
