const LEFT =   32; // binary 100000
const RIGHT =  16; // binary 010000
const BOTTOM = 8;  // binary 001000
const TOP =    4;  // binary 000100
const FAR =    2;  // binary 000010
const NEAR =   1;  // binary 000001
const FLOAT_EPSILON = 0.000001;
const BITS = [32,16,8,4,2,1];

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
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //console.log('draw()');

        // TODO: implement drawing here!
        // For each model
        //   * For each vertex
        //     * transform endpoints to canonical view volume
        
        //transformations
        let prp = this.toArray(this.scene.view.prp);
        
        // this.drawCircle({x: 300, y: 300}, 200, 13);
        // this.getCircleVerticies({x: 300, z: 300}, 200, 13);

        //Test with WASD and left/right arrow keys
        // let prp = [this.toArray(this.scene.view.prp)[0]+prp1, this.toArray(this.scene.view.prp)[1]+prp2, this.toArray(this.scene.view.prp)[2]+prp3];

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
        let clip = this.scene.view.clip;
        let left = clip[0];
        let right = clip[1];
        let bottom = clip[2];
        let top = clip[3];
        let near = clip[4];
        let far = clip[5];

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
        let z_min = -near/far;
        for(let i=0; i<this.scene.models.length; i++){
            this.drawModel(i, nPer, z_min);
        }

    }

    drawModel(model, nPer, z_min){
        let testingPoints = this.scene.models[model].vertices;
        let modifiedPoints = [];
        for(let i=0; i<testingPoints.length; i++){
            let points = this.toArray(testingPoints[i]);
            let originalPoints = new Matrix(4, 1);
            originalPoints.values = [points[0],
                                     points[1],
                                     points[2],
                                     1];

            // multiply points by nper
            let multipliedPoints = Matrix.multiply([nPer, testingPoints[i]]);
            let multipliedArr = this.toArray(multipliedPoints);
            modifiedPoints[i] = multipliedArr;

        }

        //make list of lines
        let edges = this.scene.models[model].edges;
        for(let edge=0; edge<edges.length; edge++){
            for(let vertex=0; vertex<edges[edge].length-1; vertex++){
                let v1 = edges[edge][vertex];
                let v2 = edges[edge][(vertex+1)];
                let p0 = new Vector4(modifiedPoints[v1][0], modifiedPoints[v1][1], modifiedPoints[v1][2], modifiedPoints[v1][3]);
                let p1 = new Vector4(modifiedPoints[v2][0], modifiedPoints[v2][1], modifiedPoints[v2][2], modifiedPoints[v1][3]);
                
                //clipping the points
                let clipped = this.clipLinePerspective({pt0: p0, pt1: p1}, z_min);
                if(clipped != null){
                    let mnPointPer0;
                    let mnPointPer1;
                    let clippedP0 = new Matrix(4, 1);
                    let clippedP1 = new Matrix(4, 1);
                    clippedP0.values = [clipped.pt0.x,
                                        clipped.pt0.y,
                                        clipped.pt0.z,
                                        1];
                    clippedP1.values = [clipped.pt1.x,
                                            clipped.pt1.y,
                                            clipped.pt1.z,
                                            1];
                                                
                    mnPointPer0 = Matrix.multiply([frameBufferUnits(this.canvas.width, this.canvas.height), mat4x4MPer(), clippedP0]);
                    mnPointPer1 = Matrix.multiply([frameBufferUnits(this.canvas.width, this.canvas.height), mat4x4MPer(), clippedP1]);
                    
                    let mnArr0 = this.toArray(mnPointPer0);
                    let mnArr1 = this.toArray(mnPointPer1);
                    //divide x and y by w
                    mnArr0[0] = mnArr0[0]/mnArr0[3];
                    mnArr0[1] = mnArr0[1]/mnArr0[3];

                    mnArr1[0] = mnArr1[0]/mnArr1[3];
                    mnArr1[1] = mnArr1[1]/mnArr1[3];
                    this.drawLine(mnArr0[0], mnArr0[1], mnArr1[0], mnArr1[1]);
                    
                    // console.log(mnArr0, mnArr1);
                    
                }
            }
        }
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
        let out0 = this.outcodePerspective(p0, z_min);
        let out1 = this.outcodePerspective(p1, z_min);
        
        // TODO: implement clipping here!
        let test = this.trivialTests(out0, out1);
        if(test === "accept"){
            // console.log("Accept");
            return line;
        }else if(test === "reject"){
            // console.log("Reject");
            return result;
        }else{
            let cx = p1.x-p0.x;
            let cy = p1.y-p0.y;
            let cz = p1.z-p0.z;
            let pt0 = p0;
            let pt1 = p1;
            let c = {x: cx, y: cy, z:cz};
            let newOut0 = out0;
            let newOut1 = out1;
            let newTest = test;
            while(newTest==="clip"){
                console.log("before "+newOut0+", "+newOut1);
                if(newOut0 != 0){
                    pt0 = this.clipPoint(newOut0, pt0, c, z_min);
                    newOut0 = this.outcodePerspective(pt0, z_min);
                }
                else if(newOut1 != 0){
                    pt1 = this.clipPoint(newOut1, pt1, c, z_min);
                    newOut1 = this.outcodePerspective(pt1, z_min);
                }
                newTest = this.trivialTests(newOut0, newOut1);
                console.log("now "+newOut0+", "+newOut1);
                
            }

            if(newTest === "reject"){
                return result;
            }

            result = {pt0: pt0, pt1: pt1};
            console.log(result)
            return result;
        }
    }

    clipPoint(out, p, c, z_min){
        //use the outcodes to determine which edge you are clipping against
        let t = 0;
        let firstBit = this.firstBit(out);
        if(firstBit == LEFT){
            // -x0 + z0  /  Δx + -Δz
            t = this.intersectTvalue(-p.x, p.z, c.x, -c.z);
        }
        else if(firstBit == RIGHT){
            // x0 + z0  /  -Δx + -Δz
            t = this.intersectTvalue(p.x, p.z, -c.x, -c.z);
        }
        else if(firstBit == BOTTOM){
            // -y0 + z0  /  Δy + -Δz
            t = this.intersectTvalue(-p.y, p.z, c.y, -c.z);
        }
        else if(firstBit == TOP){
            // y0 + z0  /  -Δy + -Δz
            t = this.intersectTvalue(p.y, p.z, -c.y, -c.z);
        }
        else if(firstBit == NEAR){
            // z0 + -z_min  /  -Δz
            t = this.intersectTvalue(p.z, -z_min, 0, -c.z);
        }
        else /* if(firstBit == FAR) */{
            // -z0 + -1  /  -Δz
            t = this.intersectTvalue(-p.z, -1, 0, c.z);
        }
        
        //use the corresponding parametric equations to calculate t and use t to get the intersection point (x,y,z)
        let x = p.x+t*c.x;
        let y = p.y+t*c.y;
        let z = p.z+t*c.z;

        // console.log(x, y, z);
        return Vector3(x, y, z);
    }
    

    intersectTvalue(xyz, z, cxyz, cz){
        let eq = (xyz+z)/(cxyz+cz)
        return eq;
    }

    firstBit(out){
        for(let i=0; i<BITS.length; i++){
            if(out >= BITS[i]){
                return BITS[i];
            }
        }
        return 0;
    }

    trivialTests(out0, out1){
        if((out0 | out1) == 0){
            //trivial accept
            return "accept";
        }
        else if((out0 & out1) != 0){
            //trivial reject
            return "reject";
        }else{
            //clip
            return "clip";
        }
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
            }else if(model.type === 'cube'){
                //find verticies
                //find edges
                model.vertices = [];

                let center = JSON.parse(JSON.stringify(scene.models[i].center));
                let width = JSON.parse(JSON.stringify(scene.models[i].width));
                let cubeVerticies = this.getCubeVertices(center, width);
                model.edges = [
                    [0, 1, 2, 3, 0],
                    [4, 5, 6, 7, 4],
                    [0, 4],
                    [1, 5],
                    [2, 6],
                    [3, 7]
                ];
                // console.log(cubeVerticies);
                // console.log(model.edges);
                for (let j = 0; j < cubeVerticies.length; j++) {
                    model.vertices.push(Vector4(cubeVerticies[j][0],
                                                cubeVerticies[j][1],
                                                cubeVerticies[j][2],
                                                1));
                    if (scene.models[i].hasOwnProperty('animation')) {
                        model.animation = JSON.parse(JSON.stringify(scene.models[i].animation));
                    }
                }
                
            }else if(model.type === 'cylinder'){
                model.vertices = [];

                let center = JSON.parse(JSON.stringify(scene.models[i].center));
                let radius = JSON.parse(JSON.stringify(scene.models[i].radius));
                let height = JSON.parse(JSON.stringify(scene.models[i].height));
                let sides = JSON.parse(JSON.stringify(scene.models[i].sides));
                let cylinderVerticies = this.getCylinderVerticies(center, height, radius, sides);
                // let cylinderVerticies = this.getCylinderVerticies([300, 300, -40], 300, 100, 13);
                
                for (let j = 0; j < cylinderVerticies.length; j++) {
                    model.vertices.push(Vector4(cylinderVerticies[j][0],
                                                cylinderVerticies[j][1],
                                                cylinderVerticies[j][2],
                                                1));
                    if (scene.models[i].hasOwnProperty('animation')) {
                        model.animation = JSON.parse(JSON.stringify(scene.models[i].animation));
                    }
                }
                // console.log(cylinderVerticies.length);
                let halfLength = cylinderVerticies.length*0.5;
                let topIndex;
                let edges0 = [];
                let edges1 = [];
                let edgesRest = [];
                for(let bottomIndex=0; bottomIndex<halfLength; bottomIndex++){
                    topIndex = bottomIndex+halfLength;
                    edges0[bottomIndex] = bottomIndex;
                    edges1[bottomIndex] = topIndex;
                    edgesRest[bottomIndex] = [bottomIndex, topIndex];
                }
                // let edges = edges0.concat(edges1, edgesRest);
                edges0.push(0);
                edges1.push(halfLength);
                let edges = [edges0, edges1];
                edges = edges.concat(edgesRest);
                model.edges = edges;
                console.log(halfLength);
                console.log(edges);
                
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

    getCylinderVerticies(center, height, radius, sides){
        let circleXZ = this.getCircleVerticies(center, radius, sides);
        let halfHeight = height*0.5;
        let result0 = [];
        let result1 = [];
        let result = [];
        for(let i=0; i<sides; i++){
            //bottom circle
            result0.push([circleXZ[i].x, center[1]-halfHeight, circleXZ[i].z]);
            //top circle
            result1.push([circleXZ[i].x, center[1]+halfHeight, circleXZ[i].z]);
        }
        result = result0.concat(result1);
        return result;
    }

    getCircleVerticies(center, radius, sides){

        let ratio = 1/sides;
        let seg = 2*Math.PI*ratio;
        let p = seg;
        let result = [];
        let current = {x: center[0]+radius, z: center[2]};
        for(let i=0; i<sides; i++){
            let x = Math.round(center[0] + radius * Math.cos(p));
            let z = Math.round(center[2] + radius * Math.sin(p));
            let next = {x: x, z: z};
            result.push({x:current.x, z: current.z})
            // console.log(current.x, current.z);
            current = next;
            p+=seg;
        }
        return result;
    }


    drawCircle(center, radius, sides){

        let ratio = 1/sides;
        let seg = 2*Math.PI*ratio;
        let p = seg;
        let prev = {x: center.x+radius, y: center.y};
        for(let i=0; i<sides;i++){
            let x = Math.round(center.x + radius * Math.cos(p));
            let y = Math.round(center.y + radius * Math.sin(p));
            let current = {x: x, y: y};
            this.drawLine(prev.x, prev.y, current.x, current.y);
            // console.log(prev.x, prev.y);
            prev = current;
            p+=seg;
        }
    }

    getCubeVertices(center, width){
        let hw = width*0.5;
        let result = [];
        let adj = [
            [-hw, -hw,  hw],
            [-hw,  hw,  hw],
            [ hw,  hw,  hw],
            [ hw, -hw,  hw],
            [-hw, -hw, -hw],
            [-hw,  hw, -hw],
            [ hw,  hw, -hw],
            [ hw, -hw, -hw],
        ]
        for(let i=0; i<adj.length; i++){
            result.push(this.cubeVertex(center, adj[i]));
        }
        return result;
    }

    cubeVertex(center, adjustments){
        let lr = adjustments[0];
        let bt = adjustments[1];
        let fn = adjustments[2];
        let vX = center[0]+lr;
        let vY = center[1]+bt;
        let vZ = center[2]+fn;
        return [vX, vY, vZ];
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
