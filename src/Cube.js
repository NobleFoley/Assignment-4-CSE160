class Cube {
  // Constructor
  constructor() {
    this.type = "cube";
    //this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 0.0, 0.0, 1.0];
    //this.size = 5.0;
    //this.segments = 10;
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();
    this.buffer = null;
    this.textureNum = -2;
    this.cubeVert32 = new Float32Array([
      0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0,
      1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0,
      1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0,
      1.0, 1.0, 0.0,
    ]);
    this.cubeVert = [
      0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0,
      1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0,
      1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0,
      1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0,
      1.0, 1.0, 0.0,
    ];
    this.cubeUV32 = new Float32Array([
      0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0,
      1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0,
      0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1,
    ]);
    this.cubeNormal = new Float32Array(
      // prettier-ignore
      [
        0,0,-1, 0,0,-1, 0,0,-1, 
        0,0,-1, 0,0,-1, 0,0,-1,

        0,0,1, 0,0,1, 0,0,1,
        0,0,1, 0,0,1, 0,0,1, 

        0,1,0, 0,1,0, 0,1,0,
        0,1,0, 0,1,0, 0,1,0,

        0,-1,0, 0,-1,0, 0,-1,0,
        0,-1,0, 0,-1,0, 0,-1,0,

        -1,0,0, -1,0,0, -1,0,0,
        -1,0,0, -1,0,0, -1,0,0, 

        1,0,0, 1,0,0, 1,0,0,
        1,0,0, 1,0,0, 1,0,0,
      ]
    );
  }
  // Render the shape * This is the Draw Cube function
  render() {
    //var xy = this.position;
    var rgba = this.color;

    if (this.buffer === null) {
      this.buffer = gl.createBuffer();
      if (!this.buffer) {
        console.log("Failed to create the buffer object");
        return -1;
      }
    }

    gl.uniform1i(u_whichTexture, this.textureNum);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    // Front
    drawTriangles3DUV(
      [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0],
      [0, 0, 1, 1, 1, 0]
    );
    drawTriangles3DUV(
      [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0],
      [0, 0, 0, 1, 1, 1]
    );

    // Back
    drawTriangles3DUV(
      [0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0],
      [0, 0, 1, 1, 1, 0]
    );
    drawTriangles3DUV(
      [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      [0, 0, 0, 1, 1, 1]
    );

    // Top
    drawTriangles3DUV(
      [0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0],
      [0, 1, 0, 0, 1, 1]
    );
    drawTriangles3DUV(
      [1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 1.0],
      [1, 0, 0, 0, 1, 1]
    );

    // Bottom
    drawTriangles3DUV(
      [0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0],
      [0, 1, 0, 0, 1, 1]
    );
    drawTriangles3DUV(
      [1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0],
      [1, 0, 0, 0, 1, 1]
    );

    // Left
    drawTriangles3DUV(
      [0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0],
      [1, 0, 0, 0, 1, 1]
    );
    drawTriangles3DUV(
      [0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0],
      [0, 1, 0, 0, 1, 1]
    );
    // Right
    drawTriangles3DUV(
      [1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0],
      [1, 0, 0, 0, 1, 1]
    );
    drawTriangles3DUV(
      [1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0],
      [0, 1, 0, 0, 1, 1]
    );
  }

  renderfast() {
    var rgba = this.color;

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Draw each side with a different texture
    for (let i = 0; i < 6; i++) {
      // Assign a different texture number for each side
      if (this.textureNum == 0) {
        gl.uniform1i(u_whichTexture, i);
      } else {
        gl.uniform1i(u_whichTexture, this.textureNum);
      }

      // Draw the side
      drawTriangles3DUV(
        this.cubeVert32.subarray(i * 18, (i + 1) * 18),
        this.cubeUV32.subarray(i * 12, (i + 1) * 12)
      );
    }
  }
  renderNormal() {
    var rgba = this.color;

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
    // Draw each side with a different texture
    for (let i = 0; i < 6; i++) {
      // Assign a different texture number for each side
      if (this.textureNum == 0) {
        gl.uniform1i(u_whichTexture, i);
      } else {
        gl.uniform1i(u_whichTexture, this.textureNum);
      }
      // Draw the side
      drawTriangles3DUVNormal(
        this.cubeVert32.subarray(i * 18, (i + 1) * 18),
        this.cubeUV32.subarray(i * 12, (i + 1) * 12),
        this.cubeNormal.subarray(i * 18, (i + 1) * 18)
      );
    }
  }
}
