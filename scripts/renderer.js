const LEFT =   32; // binary 100000
const RIGHT =  16; // binary 010000
const BOTTOM = 8;  // binary 001000
const TOP =    4;  // binary 000100
const FAR =    2;  // binary 000010
const NEAR =   1;  // binary 000001
const FLOAT_EPSILON = 0.000001;

class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // scene:               object (...see description on Canvas)
    constructor(canvas, scene) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.scene = this.processScene(scene);
        this.vrc = this.getVRC(scene);
        this.enable_animation = true;  // <-- disabled for easier debugging; enable for animation
        this.start_time = null;
        this.prev_time = null;
        this.step = 1;
        this.angle = Math.PI / 180;
    }

    //
    updateTransforms(time, delta_time) {
        // TODO: update any transformations needed for animation
        // Vector3
        let vrc = this.vrc;
        //console.log("u: "+vrc.u.values);
        //console.log("v: "+vrc.v.values);
        //console.log("n: "+vrc.n.values);
    }

    //
    rotateLeft() {
        let prp = this.toArray(this.scene.view.prp);
        let srp = this.toArray(this.scene.view.srp);
        let vrcu = this.toArray(this.vrc.u);
        let vrcn = this.toArray(this.vrc.n);
        let vrcv = this.toArray(this.vrc.v);
        let cos = Math.cos(this.angle);
        let sin = Math.sin(this.angle);
        let prpsrp = [0,0,0]
        prpsrp[0] = srp[0] - prp[0];
        prpsrp[1] = srp[1] - prp[1];
        prpsrp[2] = srp[2] - prp[2];

        let x = prpsrp[0] * cos + prpsrp[2] * sin;
        let z = -prpsrp[0] * sin + prpsrp[2] * cos;

        srp[0] = x + prp[0];
        srp[1] = prpsrp[1] + prp[1];
        srp[2] = z + prp[2];

        let vrcu_new = vrcu.map((v, i) => v * cos + vrcv[i] * sin);
        let vrcv_new = vrcv.map((v, i) => -vrcu[i] * sin + v * cos);

        this.vrc.u = Vector3(vrcu_new[0], vrcu_new[1], vrcu_new[2]);
        this.vrc.n = Vector3(vrcn[0], vrcn[1], vrcn[2]);
        this.vrc.v = Vector3(vrcv_new[0], vrcv_new[1], vrcv_new[2]);
        this.scene.view.srp = Vector3(srp[0],srp[1],srp[2]);
        
    }
    
    //
    rotateRight() {
        let prp = this.toArray(this.scene.view.prp);
        let srp = this.toArray(this.scene.view.srp);
        let vrcu = this.toArray(this.vrc.u);
        let vrcn = this.toArray(this.vrc.n);
        let vrcv = this.toArray(this.vrc.v);
        let cos = Math.cos(-this.angle);
        let sin = Math.sin(-this.angle);
        let prpsrp = [0,0,0]
        prpsrp[0] = srp[0] - prp[0];
        prpsrp[1] = srp[1] - prp[1];
        prpsrp[2] = srp[2] - prp[2];

        let x = prpsrp[0] * cos + prpsrp[2] * sin;
        let z = -prpsrp[0] * sin + prpsrp[2] * cos;

        srp[0] = x + prp[0];
        srp[1] = prpsrp[1] + prp[1];
        srp[2] = z + prp[2];

        let vrcu_new = vrcu.map((v, i) => v * cos + vrcv[i] * sin);
        let vrcv_new = vrcv.map((v, i) => -vrcu[i] * sin + v * cos);

        this.vrc.u = Vector3(vrcu_new[0], vrcu_new[1], vrcu_new[2]);
        this.vrc.n = Vector3(vrcn[0], vrcn[1], vrcn[2]);
        this.vrc.v = Vector3(vrcv_new[0], vrcv_new[1], vrcv_new[2]);
        this.scene.view.srp = Vector3(srp[0],srp[1],srp[2]);
    }
   
    moveLeft() {
        let prp = this.toArray(this.scene.view.prp);
        let srp = this.toArray(this.scene.view.srp);
        let vrcu = this.toArray(this.vrc.u);
        prp[0] = prp[0] - vrcu[0];
        srp[0] = srp[0] - vrcu[0];
        prp[1] = prp[1] - vrcu[1];
        srp[1] = srp[1] - vrcu[1];
        prp[2] = prp[2] - vrcu[2];
        srp[2] = srp[2] - vrcu[2];
        this.scene.view.prp = Vector3(prp[0],prp[1],prp[2]);
        this.scene.view.srp = Vector3(srp[0],srp[1],srp[2]);
    }
    
    moveRight() {
        let prp = this.toArray(this.scene.view.prp);
        let srp = this.toArray(this.scene.view.srp);
        let vrcu = this.toArray(this.vrc.u);
        prp[0] = prp[0] + vrcu[0];
        srp[0] = srp[0] + vrcu[0];
        prp[1] = prp[1] + vrcu[1];
        srp[1] = srp[1] + vrcu[1];
        prp[2] = prp[2] + vrcu[2];
        srp[2] = srp[2] + vrcu[2];
        this.scene.view.prp = Vector3(prp[0],prp[1],prp[2]);
        this.scene.view.srp = Vector3(srp[0],srp[1],srp[2]);
    }
    
    moveBackward() {
        let prp = this.toArray(this.scene.view.prp);
        let srp = this.toArray(this.scene.view.srp);
        let vrcn = this.toArray(this.vrc.n);
        prp[0] = prp[0] + vrcn[0];
        srp[0] = srp[0] + vrcn[0];
        prp[1] = prp[1] + vrcn[1];
        srp[1] = srp[1] + vrcn[1];
        prp[2] = prp[2] + vrcn[2];
        srp[2] = srp[2] + vrcn[2];
        this.scene.view.prp = Vector3(prp[0],prp[1],prp[2]);
        this.scene.view.srp = Vector3(srp[0],srp[1],srp[2]);
    }
    
    moveForward() {
        let prp = this.toArray(this.scene.view.prp);
        let srp = this.toArray(this.scene.view.srp);
        let vrcn = this.toArray(this.vrc.n);
        prp[0] = prp[0] - vrcn[0];
        srp[0] = srp[0] - vrcn[0];
        prp[1] = prp[1] - vrcn[1];
        srp[1] = srp[1] - vrcn[1];
        prp[2] = prp[2] - vrcn[2];
        srp[2] = srp[2] - vrcn[2];
        this.scene.view.prp = Vector3(prp[0],prp[1],prp[2]);
        this.scene.view.srp = Vector3(srp[0],srp[1],srp[2]);
    }
    //
    //meth: draw
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //console.log('draw()');

        // TODO: implement drawing here!
        // For each model
        //   * For each vertex
        //     * transform endpoints to canonical view volume
        
        //transformations
        /*/test example
        let prp = [0, 10, -5];
        /*/
        let prp = this.toArray(this.scene.view.prp);
        //*/

        //T(-PRP)
        let translatePRP = new Matrix(4, 4);
        mat4x4Translate(translatePRP, prp[0], prp[1], prp[2]);


        let vrc = this.vrc;
        let u = this.toArray(vrc.u);
        let v = this.toArray(vrc.v);
        let n = this.toArray(vrc.n);
        //R
        let rotate = new Matrix(4, 4);
        rotate.values = [[u[0], u[1], u[2], 0],
                         [v[0], v[1], v[2], 0],
                         [n[0], n[1], n[2], 0],
                         [0, 0, 0, 1]];


        //SHpar
        let shearPar = new Matrix(4, 4);
        //*/test example
        let clip = this.scene.view.clip;
        /*/
        let clip = [-12, 6, -12, 6, 10, 100];
        //*/
        let left = clip[0];
        let right = clip[1];
        let bottom = clip[2];
        let top = clip[3];
        let near = clip[4];
        let far = clip[5];

        // console.log(clip);

        let CW = new Vector(3);
        CW.values = [(left+right)/2, (bottom+top)/2, -near];
        let PRPstar = new Vector(3);
        PRPstar.values = [0,0,0];
        let DOP = this.toArray(CW.subtract(PRPstar));
        mat4x4ShearXY(shearPar, -DOP[0]/DOP[2], -DOP[1]/DOP[2]);
        
        //Sper
        let scalePer = new Matrix(4, 4);
        mat4x4Scale(scalePer, (2*near)/((right-left)*far),(2*near)/((top-bottom)*far), 1/far);

        let nPer = new Matrix(4, 4);
        nPer = Matrix.multiply([scalePer, shearPar, rotate, translatePRP]);
        
        //clip nper
        

        //mPer * nPer
        let mnPer = Matrix.multiply([mat4x4MPer(), nPer]);
        

        /*/test example
        let testingPoints = [[0, 0, -30], [20, 0, -30], [20, 12, -30], [10, 20, -30], [0, 12, -30], [0, 0, -60], [20, 0, -60], [20, 12, -60], [10, 20, -60], [0, 12, -60]];
        /*/
        let testingPoints = this.scene.models[0].vertices;
        //*/
        let modifiedPoints = []
        for(let i=0; i<testingPoints.length; i++){
            /*/test example
            let points = testingPoints[i];
            /*/
            let points = this.toArray(this.scene.models[0].vertices[i]);
            //*/
            let originalPoints = new Matrix(4, 1);
            originalPoints.values = [points[0],
                                     points[1],
                                     points[2],
                                     1];
            let multipliedPoints = Matrix.multiply([mnPer, originalPoints]);
            let multipliedArr = this.toArray(multipliedPoints);
            
            multipliedPoints = Matrix.multiply([frameBufferUnits(this.canvas.width, this.canvas.height), multipliedPoints]);
            // mat4x4Translate(multipliedPoints, multipliedArr[0]+1, multipliedArr[1]+1, multipliedArr[2]);
            multipliedArr = this.toArray(multipliedPoints);
            let modifiedX = multipliedArr[0]/multipliedArr[3];
            let modifiedY = multipliedArr[1]/multipliedArr[3];
            modifiedPoints[i] = [modifiedX, modifiedY];
            

            // console.log(modifiedPoints[i]);
            //*/
        }

        //window/framebuffer units



        // let test = new Vector(3);
        // test.values = 

        //prints
        // console.log(prp);
        // console.log("translate");
        // console.log(translatePRP.values);
        // console.log("rotate");
        // console.log(rotate.values);
        // console.log("shearpar");
        // console.log(shearPar.values);
        // console.log("sper");
        // console.log(scalePer.values);
        // console.log("mper");
        // console.log(mat4x4MPer().values);
        // console.log("nper");
        // console.log(nPer.values);
        // console.log("mnPer");
        // console.log(mnPer.values);
        //console.log("modified");
        //console.log(modifiedPoints);

        


        /*/test example
        let edges = [[0,1,2,3,4,0],
                     [5,6,7,8,9,5],
                        [0,5],
                        [1,6],
                        [2,7],
                        [3,8],
                        [4,9],
                        [5,10]
                        ];
        /*/
        let edges = this.scene.models[0].edges;
        //console.log(this.scene.models[0].edges);
        //*/
        for(let edge=0; edge<edges.length; edge++){
            for(let vertex=0; vertex<edges[edge].length-1; vertex++){
                let v1 = edges[edge][vertex];
                let v2 = edges[edge][(vertex+1)%edges[0].length];
                this.drawLine(modifiedPoints[v1][0], modifiedPoints[v1][1], modifiedPoints[v2][0], modifiedPoints[v2][1]);
            }
        }

        // console.log(this.scene.models[0].vertices);
        
        //   * For each line segment in each edge
        //     * clip in 3D
        //     * project to 2D
        //     * translate/scale to viewport (i.e. window)
        //     * draw line
    }

    // Get outcode for a vertex
    // vertex:       Vector4 (transformed vertex in homogeneous coordinates)
    // z_min:        float (near clipping plane in canonical view volume)
    outcodePerspective(vertex, z_min) {
        let outcode = 0;
        if (vertex.x < (vertex.z - FLOAT_EPSILON)) {
            outcode += LEFT;
        }
        else if (vertex.x > (-vertex.z + FLOAT_EPSILON)) {
            outcode += RIGHT;
        }
        if (vertex.y < (vertex.z - FLOAT_EPSILON)) {
            outcode += BOTTOM;
        }
        else if (vertex.y > (-vertex.z + FLOAT_EPSILON)) {
            outcode += TOP;
        }
        if (vertex.z < (-1.0 - FLOAT_EPSILON)) {
            outcode += FAR;
        }
        else if (vertex.z > (z_min + FLOAT_EPSILON)) {
            outcode += NEAR;
        }
        return outcode;
    }

    // Clip line - should either return a new line (with two endpoints inside view volume)
    //             or null (if line is completely outside view volume)
    // line:         object {pt0: Vector4, pt1: Vector4}
    // z_min:        float (near clipping plane in canonical view volume)
    clipLinePerspective(line, z_min) {
        let result = null;
        let p0 = Vector3(line.pt0.x, line.pt0.y, line.pt0.z); 
        let p1 = Vector3(line.pt1.x, line.pt1.y, line.pt1.z);
        let out0 = outcodePerspective(p0, z_min);
        let out1 = outcodePerspective(p1, z_min);
        
        // TODO: implement clipping here!
        // DO I implement this for z?
        
        return result;
    }

    //
    animate(timestamp) {
        // Get time and delta time for animation
        if (this.start_time === null) {
            this.start_time = timestamp;
            this.prev_time = timestamp;
        }
        let time = timestamp - this.start_time;
        let delta_time = timestamp - this.prev_time;

        // Update transforms for animation
        this.updateTransforms(time, delta_time);

        // Draw slide
        this.draw();

        // Invoke call for next frame in animation
        if (this.enable_animation) {
            window.requestAnimationFrame((ts) => {
                this.animate(ts);
            });
        }

        // Update previous time to current one for next calculation of delta time
        this.prev_time = timestamp;
    }

    //meth: toArray
    toArray(vector){
        let result = [];
        for(let i=0; i<vector.values.length;i++){
            result[i] = vector.values[i][0];
        }
        return result;
    }

    //meth: getVRC
    getVRC(scene){
        let prpArr = scene.view.prp;
        let srpArr = scene.view.srp;
        let vupArr = scene.view.vup;
        let prp = new Vector(3);
        let srp = new Vector(3);
        let vup = new Vector(3);
        prp.values = [prpArr[0], prpArr[1], prpArr[2]];
        srp.values = [srpArr[0], srpArr[1], srpArr[2]];
        vup.values = [vupArr[0], vupArr[1], vupArr[2]];
        /*/test example
        prp.values = [0, 10, -5];
        srp.values = [20, 15, -40];
        vup.values = [1, 1, 0];
        //*/
        // console.log(prp.values[0][0]);
        let n = prp.subtract(srp);
        n.normalize();

        let u = vup.cross(n);
        u.normalize();

        let v = n.cross(u);
        
        // console.log("u:"+u.values);
        // console.log("v:"+v.values);
        // console.log("n:"+n.values);
        return {u:u, v:v, n:n}
    }

    //
    updateScene(scene) {
        this.scene = this.processScene(scene);
        if (!this.enable_animation) {
            this.draw();
        }
    }

    //
    processScene(scene) {
        let processed = {
            view: {
                prp: Vector3(scene.view.prp[0], scene.view.prp[1], scene.view.prp[2]),
                srp: Vector3(scene.view.srp[0], scene.view.srp[1], scene.view.srp[2]),
                vup: Vector3(scene.view.vup[0], scene.view.vup[1], scene.view.vup[2]),
                clip: [...scene.view.clip]
            },
            models: []
        };

        for (let i = 0; i < scene.models.length; i++) {
            let model = { type: scene.models[i].type };
            if (model.type === 'generic') {
                model.vertices = [];
                model.edges = JSON.parse(JSON.stringify(scene.models[i].edges));
                for (let j = 0; j < scene.models[i].vertices.length; j++) {
                    model.vertices.push(Vector4(scene.models[i].vertices[j][0],
                                                scene.models[i].vertices[j][1],
                                                scene.models[i].vertices[j][2],
                                                1));
                    if (scene.models[i].hasOwnProperty('animation')) {
                        model.animation = JSON.parse(JSON.stringify(scene.models[i].animation));
                    }
                }
            }
            else {
                model.center = Vector4(scene.models[i].center[0],
                                       scene.models[i].center[1],
                                       scene.models[i].center[2],
                                       1);
                for (let key in scene.models[i]) {
                    if (scene.models[i].hasOwnProperty(key) && key !== 'type' && key != 'center') {
                        model[key] = JSON.parse(JSON.stringify(scene.models[i][key]));
                    }
                }
            }

            model.matrix = new Matrix(4, 4);
            processed.models.push(model);
        }

        return processed;
    }
    
    // x0:           float (x coordinate of p0)
    // y0:           float (y coordinate of p0)
    // x1:           float (x coordinate of p1)
    // y1:           float (y coordinate of p1)
    
    drawLine(x0, y0, x1, y1) {
        this.ctx.strokeStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.moveTo(x0, y0);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();

        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(x0 - 2, y0 - 2, 4, 4);
        this.ctx.fillRect(x1 - 2, y1 - 2, 4, 4);
    }
};
