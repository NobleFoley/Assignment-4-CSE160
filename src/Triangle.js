class Triangle {
  // Constructor
  constructor() {
    this.type = "triangle";
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 5.0;
    this.buffer = null;
  }
  // Render the shape
  render() {
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Pass the size of the point to u_Size variable
    gl.uniform1f(u_Size, size);
    // Delta
    var d = this.size / 200.0;
    // Coord map: bottom left -> top -> bottom right
    drawTriangles([xy[0], xy[1], xy[0] + d, xy[1], xy[0], xy[1] + d]);
  }
}

function drawTriangles(vertices) {
  var n = 3; // The number of vertices

  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

function drawTriangles3D(vertices, buffer) {
  var n = 3; // The number of vertices
  //console.log(this.buffer);
  // Create a buffer object
  if (buffer === null) {
    buffer = gl.createBuffer();
    if (!buffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}

var globalBuffer = null;
function initTriangle3D() {
  globalBuffer = gl.createBuffer();
  if (!globalBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, globalBuffer);
  gl.enableVertexAttribArray(a_Position);
}

function drawTriangles3DUV(vertices, uv) {
  var n = vertices.length / 3; // The number of vertices
  if (globalBuffer == null) {
    initTriangle3D();
  }
  // Bind the global buffer object to target
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable

  var g_uvBuffer = gl.createBuffer();
  if (!g_uvBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, g_uvBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_UV);

  gl.drawArrays(gl.TRIANGLES, 0, n);
}
