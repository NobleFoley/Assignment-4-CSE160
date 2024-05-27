// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position =u_ProjectionMatrix* u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal,1)));
    //v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform vec4 u_FragColor;
  uniform vec3 u_cameraPos;
  uniform vec3 u_lightPos;
  uniform vec3 u_lightColor;
  uniform bool u_lightOn;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;
  uniform sampler2D u_Sampler6;
  uniform sampler2D u_Sampler7;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -3 ) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
    }
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
      
    }
    if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV,1.0,1.0);
      
    }
    if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
      
    }
    if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
      
    }
    if (u_whichTexture == 2) {
      gl_FragColor = texture2D(u_Sampler2, v_UV);
      
    }
    if (u_whichTexture == 3) {
      gl_FragColor = texture2D(u_Sampler3, v_UV);
      
    }
    if (u_whichTexture == 4) {
      gl_FragColor = texture2D(u_Sampler4, v_UV);
      
    }
    if (u_whichTexture == 5) {
      gl_FragColor = texture2D(u_Sampler5, v_UV);
      
    }
    if (u_whichTexture == 6) {
      gl_FragColor = texture2D(u_Sampler6, v_UV);
      
    }
    if (u_whichTexture == 7) {
      gl_FragColor = texture2D(u_Sampler7, v_UV);
      
    }

    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);

    // if (r < 1.0) {
    //   gl_FragColor = vec4(1,0,0,1);
    // } else if (r < 2.0) {
    //   gl_FragColor = vec4(0,1,0,1);
    // }

    // gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);

    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);
    //gl_FragColor = vec4(vec3(gl_FragColor * nDotL),1);

    vec3 R = reflect(-L, N);

    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    float specular = 0.0;
    if (u_whichTexture >= 0) {
      specular = pow(max(dot(E,R), 0.0), 64.0) * 0.8;
    }
    // Multiply with light color to tint the color to the light's color
    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7 * u_lightColor;  
    vec3 ambient = vec3(gl_FragColor) * 0.3;
    if (u_lightOn) {
      // Multiply the specular light with the light color to tint
      gl_FragColor = vec4(specular * u_lightColor + diffuse + ambient, 1.0);  
    }

    vec3 u_lightPos2 = vec3(-5,0,-1);
    // vec3 lightVector2 = vec3(v_VertPos) - u_lightPos2;
    // float lightDistance = length(lightVector2);
    // vec3 L2 = lightVector2 / lightDistance; // Normalize the light vector

    // float angleCos = dot(L2, normalize(-u_lightPos2));
    // if (angleCos > cos(radians(30.0))) { // Inside the spotlight cone
    //     vec3 N = normalize(v_Normal);
    //     float nDotL2 = max(dot(N, L2), 0.0); // Diffuse term for second light
    //     vec3 diffuse2 = vec3(gl_FragColor) * nDotL2 * u_lightColor;
    //     if (u_lightOn) {
    //         gl_FragColor = gl_FragColor *0.9 + vec4(diffuse2 , 0.0);  
    //     }
    // }
    vec3 lightVector2 = vec3(v_VertPos) - u_lightPos2;
    float lightDistance = length(lightVector2);
    vec3 L2 = normalize(lightVector2);
    float angleCos = dot(L2, normalize(-u_lightPos2));
    if (angleCos > cos(radians(30.0))) { // Inside the spotlight cone
      vec3 diffuse2 = vec3(gl_FragColor) * nDotL * 0.7 * u_lightColor;
      if (u_lightOn) {
        gl_FragColor = gl_FragColor *0.95 + vec4(diffuse2, 0.0);  
      }
    }
  }`;

let canvas;
let gl;
let a_Position;
let u_GlobalRotateMatrix;
let a_UV;
let a_Normal;
let u_FragColor;
//let u_Size;
let u_ModelMatrix;
let u_Sampler0;
let u_Sampler1;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_lightPos;
let u_cameraPos;
let u_lightOn;
let u_NormalMatrix;
let u_lightColor;

function setUpWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, "a_UV");
  if (a_UV < 0) {
    console.log("Failed to get the storage location of a_UV");
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
  if (a_Normal < 0) {
    console.log("Failed to get the storage location of a_Normal");
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!u_FragColor) {
    console.log("Failed to get the storage location of u_FragColor");
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("Failed to get the storage location of u_ModelMatrix");
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(
    gl.program,
    "u_GlobalRotateMatrix"
  );
  if (!u_GlobalRotateMatrix) {
    console.log("Failed to get the storage location of u_GlobalRotateMatrix");
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");
  if (!u_GlobalRotateMatrix) {
    console.log("Failed to get the storage location of u_whichTexture");
    return;
  }

  // Get the storage location of u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
  if (!u_Sampler0) {
    console.log("Failed to get the storage location of u_Sampler0");
    return false;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix) {
    console.log("Failed to get the storage location of u_ViewMatrix");
    return false;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
  if (!u_ProjectionMatrix) {
    console.log("Failed to get the storage location of u_ProjectionMatrix");
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
  if (!u_Sampler1) {
    console.log("Failed to get the storage location of u_Sampler1");
    return false;
  }

  u_lightPos = gl.getUniformLocation(gl.program, "u_lightPos");
  if (!u_lightPos) {
    console.log("Failed to get the storage location of u_lightPos");
    return false;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, "u_cameraPos");
  if (!u_cameraPos) {
    console.log("Failed to get the storage location of u_cameraPos");
    return false;
  }

  u_lightOn = gl.getUniformLocation(gl.program, "u_lightOn");
  if (!u_lightOn) {
    console.log("Failed to get the storage location of u_lightOn");
    return false;
  }

  u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
  if (!u_NormalMatrix) {
    console.log("Failed to get the storage location of u_NormalMatrix");
    return false;
  }

  u_lightColor = gl.getUniformLocation(gl.program, "u_lightColor");
  if (!u_lightColor) {
    console.log("Failed to get the storage location of u_lightColor");
    return;
  }
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Globals for UI Elements
let g_globalAngle = [0, 0];
let g_tail_endAngle = 0;
let g_tail_middleAngle = 0;
let g_tail_baseAngle = 0;
let g_headAngle = 0;
let g_bodyAngle = 0;
let g_feetAngle = 0;
let g_tail_endAnimation = true;
let g_tail_middle_Animation = true;
let g_tail_baseAnimation = true;
let g_headAnimation = true;
let g_bodyAnimation = true;
let g_feetAnimation = true;
let g_Normals = false;
let g_lightPos = [-3, 1, 4];
let g_camera = false;
let g_lightOn = true;
let g_lightAnim = true;
let g_lightColor = [1, 1, 1];

function addActionsForHtmlUI() {
  document.getElementById("light_on").onclick = function () {
    g_lightOn = true;
  };
  document.getElementById("light_off").onclick = function () {
    g_lightOn = false;
  };

  document.getElementById("normals_on").onclick = function () {
    g_Normals = true;
  };
  document.getElementById("normals_off").onclick = function () {
    g_Normals = false;
  };

  document.getElementById("light_animation_on").onclick = function () {
    g_lightAnim = true;
  };
  document.getElementById("light_animation_off").onclick = function () {
    g_lightAnim = false;
  };

  document.getElementById("tail_end_animation_on").onclick = function () {
    g_tail_endAnimation = true;
  };
  document.getElementById("tail_end_animation_off").onclick = function () {
    g_tail_endAnimation = false;
  };

  document.getElementById("tail_middle_animation_on").onclick = function () {
    g_tail_middle_Animation = true;
  };
  document.getElementById("tail_middle_animation_off").onclick = function () {
    g_tail_middle_Animation = false;
  };

  document.getElementById("tail_base_animation_on").onclick = function () {
    g_tail_baseAnimation = true;
  };
  document.getElementById("tail_base_animation_off").onclick = function () {
    g_tail_baseAnimation = false;
  };
  document.getElementById("head_animation_on").onclick = function () {
    g_headAnimation = true;
  };
  document.getElementById("head_animation_off").onclick = function () {
    g_headAnimation = false;
  };
  document.getElementById("body_animation_on").onclick = function () {
    g_bodyAnimation = true;
  };
  document.getElementById("body_animation_off").onclick = function () {
    g_bodyAnimation = false;
  };
  document.getElementById("feet_animation_on").onclick = function () {
    g_feetAnimation = true;
  };
  document.getElementById("feet_animation_off").onclick = function () {
    g_feetAnimation = false;
  };
  document.getElementById("all_animation_on").onclick = function () {
    g_tail_endAnimation = true;
    g_tail_middle_Animation = true;
    g_tail_baseAnimation = true;
    g_headAnimation = true;
    g_bodyAnimation = true;
    g_feetAnimation = true;
  };
  document.getElementById("all_animation_off").onclick = function () {
    g_tail_endAnimation = false;
    g_tail_middle_Animation = false;
    g_tail_baseAnimation = false;
    g_headAnimation = false;
    g_bodyAnimation = false;
    g_feetAnimation = false;
  };

  document
    .getElementById("tail_end_input")
    .addEventListener("input", function () {
      g_tail_endAngle = this.value;
      renderAllShapes();
    });
  document
    .getElementById("tail_middle_input")
    .addEventListener("input", function () {
      g_tail_middleAngle = this.value;
      renderAllShapes();
    });
  document
    .getElementById("tail_base_input")
    .addEventListener("input", function () {
      g_tail_baseAngle = this.value;
      renderAllShapes();
    });
  document.getElementById("head_input").addEventListener("input", function () {
    g_headAngle = this.value;
    renderAllShapes();
  });
  document.getElementById("body_input").addEventListener("input", function () {
    g_bodyAngle = this.value;
    renderAllShapes();
  });
  document.getElementById("feet_input").addEventListener("input", function () {
    g_feetAngle = this.value;
    renderAllShapes();
  });
  document
    .getElementById("camera_input")
    .addEventListener("input", function () {
      g_globalAngle = [this.value, 0];
      renderAllShapes();
    });
  document.getElementById("light_x").addEventListener("input", function () {
    g_lightPos[0] = this.value / 100;
    renderAllShapes();
  });
  document.getElementById("light_y").addEventListener("input", function () {
    g_lightPos[1] = this.value / 100;
    renderAllShapes();
  });
  document.getElementById("light_z").addEventListener("input", function () {
    g_lightPos[2] = this.value / 100;
    renderAllShapes();
  });

  document
    .getElementById("light_color_picker")
    .addEventListener("input", function () {
      var color = this.value.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
      var r = parseInt(color[1], 16);
      var g = parseInt(color[2], 16);
      var b = parseInt(color[3], 16);
      g_lightColor = [r / 255, g / 255, b / 255];
      renderAllShapes();
    });
}

function initTextures() {
  var textures = [];
  var imageSources = [
    "../resources/Daylight Box_Front.bmp",
    "../resources/Daylight Box_Back.bmp", // Texture for side 1
    "../resources/Daylight Box_Top.bmp",
    "../resources/Daylight Box_Bottom.bmp",
    "../resources/Daylight Box_Left.bmp",
    "../resources/Daylight Box_Right.bmp",
    "../resources/stone.png", // Texture for side 2
    "../resources/stone2.jpg",
    // Add more texture sources as needed
  ];

  for (var i = 0; i < imageSources.length; i++) {
    var image = new Image();
    image.onload = (function (textureIndex) {
      return function () {
        sendTextureToGLSL(this, textureIndex);
      };
    })(i);
    image.src = imageSources[i];
    textures.push(image);
  }
}
function sendTextureToGLSL(image, unit) {
  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
    console.log("Failed to create the texture object");
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  if (unit == 1) {
    gl.pixelStorei(gl.UNPACK_FLIP_X_WEBGL, 1); // Flip the image's y axis
  }

  console.log(gl.TEXTURE0);
  // gl.TEXTURE0 + unit reference: https://stackoverflow.com/questions/43066304/webgl2-explanation-for-gl-texture0-n
  gl.activeTexture(gl.TEXTURE0 + unit);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(gl.getUniformLocation(gl.program, "u_Sampler" + unit), unit);
}

let g_jawAnimation = false;
let oldMouse_pos = 0;
let oldMouse_posy = 0;

function main() {
  setUpWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  document.onkeydown = keydown;

  canvas.onmousedown = function (ev) {
    if (ev.shiftKey) {
      g_jawAnimation = !g_jawAnimation;
    }
  };

  canvas.addEventListener("mousedown", function (ev) {
    if (ev.button === 0) {
      addBlock(ev);
    }
  });

  canvas.addEventListener("contextmenu", function (ev) {
    ev.preventDefault(); // Prevent the context menu from showing up
    deleteBlock(ev);
  });
  document.onmousemove = function (e) {
    if (g_camera) {
      // Mouse coords reference: https://www.geeksforgeeks.org/javascript-coordinates-of-mouse/
      var mouse_dist = e.clientX - oldMouse_pos;
      var mouse_dist_y = e.clientY - 600;
      world_camera.rotateCamera(mouse_dist, mouse_dist_y);

      oldMouse_pos = e.clientX;
      oldMouse_posy = e.clientY;
    }
  };
  initTextures(gl, 0);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);
}

function keydown(ev) {
  if (ev.keyCode == 87) {
    world_camera.moveForward();
  }
  if (ev.keyCode == 83) {
    world_camera.moveBackward();
  }
  if (ev.keyCode == 65) {
    world_camera.moveLeft();
  }
  if (ev.keyCode == 68) {
    world_camera.moveRight();
  }
  if (ev.keyCode == 69) {
    world_camera.rotateRight();
  }
  if (ev.keyCode == 81) {
    world_camera.rotateLeft();
  }
  if (ev.keyCode == 32) {
    world_camera.moveUp();
  }
  if (ev.keyCode == 32) {
    world_camera.moveUp();
  }
  if (ev.keyCode == 16) {
    world_camera.moveDown();
  }
  if (ev.keyCode == 70) {
    g_Normals = !g_Normals;
  }
  if (ev.keyCode == 90) {
    addBlock(ev);
  }
  if (ev.keyCode == 88) {
    g_camera = !g_camera;
    console.log(g_camera);
  }
  if (ev.keyCode == 67) {
    deleteBlock(ev);
  }
  if (ev.keyCode) renderAllShapes();
  console.log("move achieved");
}

var g_startTime = performance.now() / 1000;
var g_seconds = performance.now() / 1000 - g_startTime;

function tick() {
  g_seconds = performance.now() / 1000 - g_startTime;

  updateAnimationAngles();

  renderAllShapes();

  requestAnimationFrame(tick);
}

var g_shapesList = [];

function click(ev) {
  // Passes event to function to convert into WebGL coords
  let [x, y] = handleClicks(ev);
  g_globalAngle = [x * 75, y * 75];
}

function handleClicks(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  return [x, y];
}
g_cubby_angle = 0;
function updateAnimationAngles() {
  if (g_tail_endAnimation) {
    g_tail_endAngle = 20 * Math.sin(2.5 * g_seconds);
  }
  if (g_tail_middle_Animation) {
    g_tail_middleAngle = 20 * Math.sin(3 * g_seconds);
  }
  if (g_tail_baseAnimation) {
    g_tail_baseAngle = 20 * Math.sin(3 * g_seconds);
  }
  if (g_headAnimation) {
    g_headAngle = 5 * Math.sin(2 * g_seconds);
  }
  if (g_bodyAnimation) {
    g_bodyAngle = 5 * Math.sin(2 * g_seconds);
  }
  if (g_feetAnimation) {
    g_feetAngle = 8 * Math.sin(2 * g_seconds);
  }
  g_cubby_angle = 50 * Math.sin(2.5 * g_seconds);
  if (g_lightAnim) {
    if (8 * Math.cos(g_seconds) >= -2) {
      g_lightPos[0] = 8 * Math.cos(g_seconds);
    }
  }
}

let world_camera = new Camera();

var g_map = [
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
];
function drawMap() {
  var body = new Cube();
  for (i = 0; i < 5; i++) {
    for (x = 0; x < 16; x++) {
      for (y = 0; y < 16; y++) {
        if (g_map[i][x][y] == 1) {
          if (x > 0 && x < 15 && y > 0 && y < 15) {
            body.textureNum = 6;
          } else {
            body.textureNum = -2;
          }
          body.color = [0.5, 0.5, 0.5, 1];
          body.matrix.setTranslate(0, 0, 0);
          body.matrix.translate(x - 4, i + -0.75, y - 4);
          body.renderNormal();
        }
      }
    }
  }
}

function addBlock() {
  var direction = new Vector3().set(world_camera.g_at).sub(world_camera.g_eye);
  direction = direction.normalize();
  direction = direction.mul(2);

  var blockPosition = new Vector3().set(world_camera.g_eye).add(direction);

  var x = Math.floor(blockPosition.elements[0]) + 4;
  var y = Math.floor(blockPosition.elements[2]) + 4;

  for (i = 0; i < 5; i++) {
    if (x >= 0 && x < 16 && y >= 0 && y < 16) {
      if (g_map[i][x][y] == 0) {
        g_map[i][x][y] = 1;
        var data = JSON.stringify(g_map);
        console.log(data);
        return;
      }
      console.log("block placed at", x, y);
    }
  }
}
function deleteBlock() {
  var direction = new Vector3().set(world_camera.g_at).sub(world_camera.g_eye);
  direction = direction.normalize();
  direction = direction.mul(2);

  var blockPosition = new Vector3().set(world_camera.g_eye).add(direction);

  var x = Math.floor(blockPosition.elements[0]) + 4;
  var y = Math.floor(blockPosition.elements[2]) + 4;
  var heigh = Math.floor(blockPosition.elements[1]);

  if (x > 0 && x < 16 && y > 0 && y < 16) {
    if (g_map[heigh][x][y] == 1) {
      g_map[heigh][x][y] = 0;
      //var data = JSON.stringify(g_map);
      //console.log(data);
      return;
    }
    console.log("block deleted at", x, y);
  }
}

function renderAllShapes() {
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width / canvas.height, 0.5, 1000);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt();
  viewMat.setLookAt(
    world_camera.g_eye.elements[0],
    world_camera.g_eye.elements[1],
    world_camera.g_eye.elements[2],
    world_camera.g_at.elements[0],
    world_camera.g_at.elements[1],
    world_camera.g_at.elements[2],
    world_camera.g_up.elements[0],
    world_camera.g_up.elements[1],
    world_camera.g_up.elements[2]
  );
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4()
    .rotate(-g_globalAngle[0], 0, 1, 0)
    .rotate(g_globalAngle[1], 1, 0, 0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var ground_plane = new Cube();
  ground_plane.color = [0.4, 0.6, 0.4, 1];
  ground_plane.textureNum = -2;
  ground_plane.matrix.translate(-7.5, -0.8, -7.5);
  ground_plane.matrix.scale(150, 0, 150);

  ground_plane.renderNormal();

  var sky_box = new Cube();
  if (g_Normals) sky_box.textureNum = -3;
  else sky_box.textureNum = 0;
  sky_box.matrix.scale(120, 120, -120);
  sky_box.matrix.translate(-0.5, -0.5, -0.5);
  sky_box.renderNormal();

  var sphere = new Sphere();
  if (g_Normals) sphere.textureNum = -3;
  else sphere.textureNum = 6;
  sphere.matrix.translate(4, 0, 7);
  sphere.render();

  var light = new Cube();
  light.color = [2, 2, 0, 1];
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-0.1, -0.1, -0.1);
  light.matrix.translate(-0.5, -0.5, -0.5);
  light.render();

  var cubby = new Cube();
  if (g_Normals) cubby.textureNum = -3;
  else cubby.textureNum = -2;
  cubby.matrix.translate(3.25, -0.5, 4.25);
  cubby.matrix.rotate(g_cubby_angle, 1, 0, 0);
  cubby.matrix.scale(0.25, 0.7, 0.05);
  cubby.normalMatrix.setInverseOf(cubby.matrix).transpose();
  cubby.renderNormal();

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform3f(
    u_cameraPos,
    world_camera.g_eye.elements[0],
    world_camera.g_eye.elements[1],
    world_camera.g_eye.elements[2]
  );

  gl.uniform1i(u_lightOn, g_lightOn);

  gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);

  drawMap();

  function drawCroc() {
    function drawLeg(body_coords) {
      var leg = new Cube();
      if (g_Normals) leg.textureNum = -3;
      else leg.textureNum = -2;
      leg.color = [0.034, 0.5, 0.05, 1];
      leg.matrix = new Matrix4(body_coords);
      leg.matrix.rotate(g_feetAngle, 0, 0, 1);
      leg.matrix.translate(0.1, -0.22, -0.15);
      leg.matrix.rotate(-90, 1, 0, 0);
      var leg_coord = leg.matrix;
      leg.matrix.scale(0.08, 0.08, 0.1);

      var leg_joint = new Cylinder();
      leg_joint.color = [0.034, 0.3, 0.05, 1];
      leg_joint.matrix = new Matrix4(leg_coord);
      leg_joint.matrix.scale(0.5, 0.5, 0.8);
      leg_joint.matrix.translate(1.5, 1.2, 0);
      var legjoint_coord = leg_joint.matrix;
      leg_joint.matrix.rotate(-90, 1, 0, 0);

      var foot = new Cube();
      if (g_Normals) foot.textureNum = -3;
      else foot.textureNum = -2;
      foot.color = [0.034, 0.2, 0.05, 1];
      foot.matrix = new Matrix4(legjoint_coord);
      foot.matrix.translate(-0.5, 0.5, -0.5);
      foot.matrix.scale(1.5, 0.5, 2);

      return [leg, leg_joint, foot];
    }

    var body = new Cube();
    if (g_Normals) body.textureNum = -3;
    else body.textureNum = -2;
    body.color = [0.034, 0.5, 0.05, 1];
    body.matrix.setTranslate(3.5, -0.5, 4);
    body.matrix.rotate(g_bodyAngle, 0, 1, 0);
    //body.matrix.translate(5, 0, 0);
    var body_coords = new Matrix4(body.matrix);
    body.matrix.translate(-0.15, -0.25, -0.5);
    body.matrix.rotate(-0, 1, 0, 0);
    body.matrix.scale(0.25, 0.2, 0.5);
    body.renderNormal();

    var outer_body_shell = new Cube();
    if (g_Normals) outer_body_shell.textureNum = -3;
    else outer_body_shell.textureNum = -2;
    outer_body_shell.color = [0.1, 0.4, 0.05, 1];
    outer_body_shell.matrix = new Matrix4(body_coords);
    outer_body_shell.matrix.translate(-0.17, -0.24, -0.45);
    outer_body_shell.matrix.rotate(0, 1, 0, 0);
    outer_body_shell.matrix.scale(0.3, 0.2, 0.4);
    outer_body_shell.renderNormal();

    var head = new Cube();
    if (g_Normals) head.textureNum = -3;
    else head.textureNum = -2;
    head.color = [0.1, 0.4, 0.05, 1];
    head.matrix = new Matrix4(body_coords);
    head.matrix.rotate(g_headAngle, 0, 1, 0);
    head.matrix.translate(-0.12, -0.28, -0.7);
    head.normalMatrix.setInverseOf(head.matrix).transpose();

    var head_coords = new Matrix4(head.matrix);
    head.matrix.scale(0.2, 0.22, 0.2);
    head.renderNormal();

    var eyes = new Cylinder();
    if (g_Normals) eyes.textureNum = -3;
    else eyes.textureNum = -2;
    eyes.color = [0, 0, 0, 1];
    eyes.matrix = new Matrix4(head_coords);
    eyes.matrix.rotate(-90, 0, 0, 1);
    eyes.matrix.scale(0.04, 0.21, 0.04);
    eyes.matrix.translate(-4, 0.47, 3.5);
    eyes.render();

    var lower_jaws = new Cube();
    if (g_Normals) lower_jaws.textureNum = -3;
    else lower_jaws.textureNum = -2;
    lower_jaws.color = [0.034, 0.35, 0.05, 1];
    lower_jaws.matrix = new Matrix4(head_coords);
    lower_jaws.matrix.translate(0.01, 0.02, -0.25);
    if (g_jawAnimation) {
      g_jawAngle = 15 * Math.sin(5 * g_seconds);
      if (g_jawAngle > 0) {
        lower_jaws.matrix.rotate(-g_jawAngle, 1, 0, 0);
      }
    }
    lower_jaws.matrix.rotate(0, 1, 0, 0);
    lower_jaws.matrix.scale(0.18, 0.05, 0.25);
    lower_jaws.renderNormal();

    var upper_jaw = new Cube();
    if (g_Normals) upper_jaw.textureNum = -3;
    else upper_jaw.textureNum = -2;
    upper_jaw.color = [0.034, 0.3, 0.05, 1];
    upper_jaw.matrix = new Matrix4(head_coords);
    upper_jaw.matrix.translate(0.01, 0.07, -0.25);
    if (g_jawAnimation) {
      g_jawAngle = 15 * Math.sin(5 * g_seconds);
      if (g_jawAngle > 0) {
        upper_jaw.matrix.rotate(g_jawAngle, 1, 0, 0);
      }
    }
    upper_jaw.matrix.rotate(0, 1, 0, 0);
    upper_jaw.matrix.scale(0.18, 0.05, 0.25);
    upper_jaw.renderNormal();

    var backright_legs = drawLeg(body_coords);
    backright_legs[0].renderNormal();
    backright_legs[1].render();
    backright_legs[2].renderNormal();
    var frontright_legs = drawLeg(body_coords);
    frontright_legs[0].matrix.translate(0, 2, 0);
    frontright_legs[0].renderNormal();
    frontright_legs[1].matrix.translate(0, -0.2, 4);
    frontright_legs[1].render();
    frontright_legs[2].matrix.translate(0, -0.4, 1.8);
    frontright_legs[2].renderNormal();
    var backleft_legs = drawLeg(body_coords);
    backleft_legs[0].matrix.translate(-4, 0, 0);
    backleft_legs[0].renderNormal();
    backleft_legs[1].matrix.translate(-9, 0, 0);
    backleft_legs[1].render();
    backleft_legs[2].matrix.translate(-6.3, 0, 0);
    backleft_legs[2].renderNormal();
    var frontleft_legs = drawLeg(body_coords);
    frontleft_legs[0].matrix.translate(-4, 2, 0);
    frontleft_legs[0].renderNormal();
    frontleft_legs[1].matrix.translate(-9, -0.2, 4);
    frontleft_legs[1].render();
    frontleft_legs[2].matrix.translate(-6.3, -0.4, 1.8);
    frontleft_legs[2].renderNormal();

    var tail = new Cylinder();
    tail.color = [0.1, 0.4, 0.05, 1];
    tail.matrix = new Matrix4(body_coords);
    tail.matrix.rotate(g_tail_baseAngle, 0, 1, 0);
    var tail_coords = new Matrix4(tail.matrix);
    tail.matrix.scale(0.15, 0.15, 0.15);
    tail.matrix.translate(-0.15, -1, 0);
    tail.matrix.rotate(-90, 1, 0, 0);
    tail.render();

    var tail1 = new Cylinder();
    tail1.color = [0.034, 0.35, 0.05, 1];
    tail1.matrix = tail_coords;
    tail1.matrix.translate(-0.025, -0.15, 0.125);
    tail1.matrix.scale(0.125, 0.125, 0.125);
    tail1.matrix.rotate(g_tail_middleAngle, 0, 1, 0);
    var tail2_coords = new Matrix4(tail1.matrix);
    tail1.matrix.rotate(-90, 1, 0, 0);
    tail1.render();

    var tail2 = new Cylinder();
    tail2.color = [0.034, 0.2, 0.05, 1];
    tail2.matrix = tail2_coords;
    tail2.matrix.rotate(-90, 1, 0, 0);
    tail2.matrix.rotate(g_tail_endAngle, 0, 0, 1);
    tail2.matrix.translate(-0.025, -0.8, 0);
    tail2.matrix.scale(0.8, 0.8, 0.8);
    tail2.render();

    var spikes = new Cube();
    if (g_Normals) spikes.textureNum = -3;
    else spikes.textureNum = -2;
    spikes.color = [0.034, 0.3, 0.05, 1];
    spikes.matrix = new Matrix4(body_coords);
    spikes.matrix.rotate(0, 1, 0, 0);
    spikes.matrix.scale(0.05, 0.05, 0.08);
    spikes.matrix.translate(-0.8, -1.5, -5);
    spikes.renderNormal();

    var spikes2 = new Cube();
    if (g_Normals) spikes2.textureNum = -3;
    else spikes2.textureNum = -2;
    spikes2.color = [0.034, 0.3, 0.05, 1];
    spikes2.matrix = new Matrix4(body_coords);
    spikes2.matrix.rotate(0, 1, 0, 0);
    spikes2.matrix.scale(0.05, 0.05, 0.08);
    spikes2.matrix.translate(-0.8, -1.5, -3.2);
    spikes2.renderNormal();

    var spikes3 = new Cube();
    if (g_Normals) spikes3.textureNum = -3;
    else spikes3.textureNum = -2;
    spikes3.color = [0.034, 0.3, 0.05, 1];
    spikes3.matrix = new Matrix4(body_coords);
    spikes3.matrix.rotate(0, 1, 0, 0);
    spikes3.matrix.scale(0.05, 0.05, 0.08);
    spikes3.matrix.translate(-0.8, -1.5, -1.8);
    spikes3.renderNormal();
  }
  drawCroc();

  var duration = performance.now() - startTime;
  sendTextToHTML(
    " ms: " +
      Math.floor(duration) +
      " fps: " +
      Math.floor(10000 / duration) / 10,
    "performance_text"
  );
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
  }
  htmlElm.innerHTML = text;
}
